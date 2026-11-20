# ==========================================
# Multi-stage Dockerfile for AvtoQism.uz
# Optimized for Render.com & Local Docker
# ==========================================

# 1. Base stage with Node.js and system dependencies
FROM node:20-bookworm-slim AS base
WORKDIR /app

# Install OpenSSL (required by Prisma) and CA certificates
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@latest

# 2. Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm config set only-built-dependencies @prisma/client,prisma,@prisma/engines || true
RUN pnpm install --no-frozen-lockfile || (pnpm approve-builds --all && pnpm install)
RUN pnpm prisma generate

# 3. Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Create and seed production database during build
RUN pnpm prisma db push && node prisma/seed.mjs

# Build Next.js standalone application
RUN pnpm build

# 4. Production Runner stage
FROM node:20-bookworm-slim AS runner
WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates sqlite3 && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=10000
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Create a non-root system user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public directory and static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and seeded database
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/dev.db ./prisma/dev.db.template

# Copy and prepare entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh && \
    mkdir -p /app/prisma && \
    chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 10000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
