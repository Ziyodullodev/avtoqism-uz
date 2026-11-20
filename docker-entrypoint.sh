#!/bin/sh
set -e

# Render dinamik PORT taqdim etadi (Render default: 10000, lokal: 3000)
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

# Agar dev.db mavjud bo'lmasa yoki bo'sh bo'lsa (masalan yangi Render diski ulanganda)
if [ ! -f /app/prisma/dev.db ] || [ ! -s /app/prisma/dev.db ]; then
  echo "==> [AvtoQism.uz] Ma'lumotlar bazasi topilmadi. Shablon ma'lumotlar tiklanmoqda..."
  mkdir -p /app/prisma
  if [ -f /app/prisma/dev.db.template ]; then
    cp /app/prisma/dev.db.template /app/prisma/dev.db
  else
    touch /app/prisma/dev.db
  fi
  chmod 666 /app/prisma/dev.db 2>/dev/null || true
  echo "==> [AvtoQism.uz] Baza muvaffaqiyatli tiklandi."
fi

echo "==> [AvtoQism.uz] Server ishga tushmoqda: http://${HOSTNAME}:${PORT}"
exec "$@"
