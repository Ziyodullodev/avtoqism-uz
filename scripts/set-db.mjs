#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

const target = (process.argv[2] || '').toLowerCase();

if (!['neon', 'postgres', 'postgresql', 'sqlite'].includes(target)) {
  console.log('Foydalanish:');
  console.log('  node scripts/set-db.mjs neon     # Neon PostgreSQL rejimiga o\'tkazish');
  console.log('  node scripts/set-db.mjs sqlite   # Lokal SQLite rejimiga o\'tkazish');
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, 'utf8');

if (target === 'neon' || target === 'postgres' || target === 'postgresql') {
  console.log('==> Prisma sozlamasi Neon (PostgreSQL) rejimiga o\'tkazilmoqda...');
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('==> prisma/schema.prisma yangilandi (provider = "postgresql").');
  console.log('==> Prisma Client generatsiya qilinmoqda...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Neon (PostgreSQL) rejimi muvaffaqiyatli yoqildi!');
  console.log('💡 Endi .env faylidagi DATABASE_URL ga Neon connection string ni qo\'ying:');
  console.log('   DATABASE_URL="postgresql://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"');
  console.log('   Keyin: pnpm prisma db push && node prisma/seed.mjs');
} else {
  console.log('==> Prisma sozlamasi SQLite rejimiga o\'tkazilmoqda...');
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('==> prisma/schema.prisma yangilandi (provider = "sqlite").');
  console.log('==> Prisma Client generatsiya qilinmoqda...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ SQLite rejimi muvaffaqiyatli yoqildi!');
}
