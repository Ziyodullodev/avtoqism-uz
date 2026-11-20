#!/bin/sh
set -e

# Render dinamik PORT taqdim etadi (Render default: 10000, lokal: 3000)
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

echo "==> [AvtoQism.uz] Boshlanmoqda..."

# 1. DATABASE turi aniqlanadi (Neon PostgreSQL yoki SQLite)
case "$DATABASE_URL" in
  postgres* | postgresql*)
    echo "==> [AvtoQism.uz] Neon (PostgreSQL) ma'lumotlar bazasi aniqlandi."
    if grep -q 'provider = "sqlite"' /app/prisma/schema.prisma 2>/dev/null; then
      sed -i 's/provider = "sqlite"/provider = "postgresql"/g' /app/prisma/schema.prisma
      npx prisma generate || true
    fi
    echo "==> [AvtoQism.uz] Neon bazasi tekshirilmoqda (db push)..."
    npx prisma db push --skip-generate || true
    ;;
  *)
    echo "==> [AvtoQism.uz] SQLite ma'lumotlar bazasi ishlatilmoqda."
    if [ ! -f /app/prisma/dev.db ] || [ ! -s /app/prisma/dev.db ]; then
      echo "==> [AvtoQism.uz] Ma'lumotlar bazasi topilmadi. Shablon ma'lumotlar tiklanmoqda..."
      mkdir -p /app/prisma
      if [ -f /app/prisma/dev.db.template ]; then
        cp /app/prisma/dev.db.template /app/prisma/dev.db
      else
        touch /app/prisma/dev.db
      fi
      chmod 666 /app/prisma/dev.db 2>/dev/null || true
      echo "==> [AvtoQism.uz] SQLite bazasi tayyorlandi."
    fi
    ;;
esac

echo "==> [AvtoQism.uz] Server ishga tushmoqda: http://${HOSTNAME}:${PORT}"
exec "$@"
