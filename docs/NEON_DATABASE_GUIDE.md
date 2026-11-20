# Neon (PostgreSQL) ma’lumotlar bazasini AvtoQism.uz ga ulash qo‘llanmasi

**AvtoQism.uz** loyihasi **Neon Serverless PostgreSQL** ma’lumotlar bazasiga 100% to‘liq moslashtirilgan.

Neon — bu zamonaviy, tezkor, bulutli va bepul serverless PostgreSQL bazasi bo‘lib, Render.com ga deploy qilinganda eng ideal yechim hisoblanadi. Chunki:
- Ma’lumotlar Render konteyneridan mustaqil ravishda bulutda doimiy (persistent) saqlanadi.
- Render.com bepul tarifida konteyner qayta ishga tushsa ham, mijozlar buyurtmalari, yangi qo‘shilgan qismlar va garaj ma’lumotlari mutlaqo o‘chib ketmaydi.
- Tashqi PostgreSQL dasturlarini kompyuterga o‘rnatish shart emas.

---

## ⚡ 1-QADAM. Neon.tech dan bepul baza ochish (1 daqiqa)

1. [https://neon.tech](https://neon.tech) saytiga kiring va ro‘yxatdan o‘ting (Google yoki GitHub orqali kirish mumkin).
2. Yangi loyiha yarating (**"Create project"**):
   - **Project name:** `avtoqism` (yoki xohlagan nomingiz)
   - **Region:** `Frankfurt (eu-central-1)` — *O‘zbekiston va Render.com uchun eng tezkor region*
   - **Postgres version:** 16 (standart)
   - **"Create project"** tugmasini bosing.
3. Loyiha yaratilgach, ekranda **"Connection Details"** chiqadi.
4. **"Connection string"** (Direct yoki Pooled) havolasini nusxalab oling (Copy qiling):
   ```text
   postgresql://username:password@ep-xyz-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

---

## 🛠️ 2-QADAM. Loyihani Neon (PostgreSQL) rejimiga o‘tkazish

Loyihada Neon rejimiga o‘tish uchun maxsus buyruq tayyorlangan. Terminalda quyidagilarni bajaring:

```bash
# 1. Loyihani Neon (PostgreSQL) rejimiga o'tkazish:
pnpm db:neon
# (Bu buyruq prisma/schema.prisma ni PostgreSQL ga o'tkazadi va Prisma Client ni generatsiya qiladi)
```

---

## 🔑 3-QADAM. `.env` fayliga Neon havolasini qo‘yish

Loyiha ildizidagi `.env` faylini oching va `DATABASE_URL` o‘zgaruvchisiga Neon dan nusxa olgan havolani qo‘ying:

```env
DATABASE_URL="postgresql://username:password@ep-xyz-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📦 4-QADAM. Jadvallarni yaratish va ma’lumotlarni yuklash (Seed)

Endi Neon bulutli bazasiga jadvallarni yuklang va avtomobillar, ehtiyot qismlar bilan to‘ldiring:

```bash
# Jadvallarni Neon bazasida yaratish (1-2 soniyada bajariladi):
pnpm prisma db push

# Barcha 9 ta avtomobil, 8 ta toifa, 20 ta ehtiyot qism va buyurtmalarni Neon ga yuklash:
pnpm seed
```

Natijada konsolda:
```text
Avtomobillar bazaga kiritildi: 9 ta model.
Kategoriyalar yaratildi: 8 ta toifa.
Ehtiyot qismlari yaratildi: 20 ta mahsulot va sharhlar.
Namuna buyurtmalar yaratildi: 3 ta buyurtma.
✅ Barcha ma'lumotlar bazaga muvaffaqiyatli yuklandi!
```
yozuvi chiqadi. Endi sizning Neon PostgreSQL bazangiz to‘liq tayyor!

---

## 🌐 5-QADAM. Render.com ga deploy qilganda Neon ni ulash

Render.com da loyihani deploy qilayotganda:

1. Render boshqaruv panelida xizmatingizni oching (**Web Service**).
2. Chap menyudan **"Environment"** bo‘limiga kiring.
3. **`DATABASE_URL`** o‘zgaruvchisini qo‘shing (yoki tahrirlang) va qiymatiga aynan Neon havolangizni qo‘ying:
   ```text
   DATABASE_URL = postgresql://username:password@ep-xyz-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **"Save Changes"** tugmasini bosing!

Render avtomatik ravishda qayta deploy qiladi va to‘g‘ridan-to‘g‘ri Neon bulutli bazasiga ulanadi. Render-ga alohida disk ulashga umuman hojat qolmaydi!

---

## 🔄 Orqaga: Qaytib lokal SQLite rejimiga o‘tish kerak bo‘lsa

Agar internetsiz yoki kompyuterning o‘zidagi lokal SQLite faylida ishlamoqchi bo‘lsangiz:

```bash
# SQLite rejimiga qaytish:
pnpm db:sqlite

# .env faylida:
# DATABASE_URL="file:./dev.db"
```
Shu tariqa istalgan paytda bir tugma bilan Neon va SQLite o‘rtasida o‘tish mumkin!
