# AvtoQism.uz — Render.com va Docker orqali serverga joylash (Deploy) qo‘llanmasi

Ushbu qo‘llanmada **AvtoQism.uz** loyihasini Docker konteyneriga o‘rab, **[Render.com](https://render.com)** bulutli platformasiga bepul va xatosiz joylashtirish (deploy qilish) bo‘yicha bosqichma-bosqich ko‘rsatmalar keltirilgan.

---

## 📁 Yaratilgan fayllar tarkibi

1. `Dockerfile` — Ko‘p bosqichli (multi-stage) engil va xavfsiz Docker tasviri.
2. `docker-compose.yml` — Lokal kompyuterda 1 ta buyruq bilan ishga tushirish uchun.
3. `docker-entrypoint.sh` — Server ishga tushganda ma’lumotlar bazasini avtomatik tekshiruvchi va tiklovchi skript.
4. `render.yaml` — Render.com Blueprint (avtomatik sozlash) konfiguratsiyasi.
5. `.dockerignore` — Ortiqcha fayllarni konteynerga kirmasligini ta’minlovchi qoidalar.

---

## 🚀 1-BOSQICH. Loyihani GitHub-ga yuklash (Push qilish)

Render.com loyihani GitHub yoki GitLab repozitoriyasi orqali oladi. Shuning uchun loyihani GitHub hisobingizga yuklang:

```bash
# 1. Barcha o'zgarishlarni gitga kiritish
git add .
git commit -m "feat: Docker va Render.com deploy sozlamalari tayyorlandi"

# 2. GitHub-da yangi 'avtoqism-uz' repozitoriyasini oching va unga ulang:
# (O'zingizning GitHub username va repo havolangizni yozing)
git remote add origin https://github.com/USERNAME/avtoqism-uz.git
git branch -M master
git push -u origin master
```

---

## 🌐 2-BOSQICH. Render.com saytida joylashtirish

Render.com da loyihani **2 xil qulay usulda** ishga tushirish mumkin:

### 🌟 1-USUL. Docker orqali Web Service yaratish (Tavsiya etiladi)

1. [https://render.com](https://render.com) saytiga kiring va ro‘yxatdan o‘ting (yoki GitHub orqali kiring).
2. Asosiy sahifada **"New +"** tugmasini bosing va **"Web Service"** ni tanlang.
3. **"Build and deploy from a Git repository"** bandini tanlab, **"Next"** tugmasini bosing.
4. GitHub hisobingizdagi **`avtoqism-uz`** repozitoriyasini tanlang (**Connect**).
5. Sozlamalarni quyidagicha to‘ldiring:
   - **Name:** `avtoqism-uz` (yoki xohlagan nomingiz)
   - **Region:** `Frankfurt (EU Central)` — *O‘zbekistonga eng yaqin server, tezkor ishlaydi.*
   - **Branch:** `master` (yoki `main`)
   - **Language / Runtime:** **`Docker`** ni tanlang!
   - **Dockerfile Path:** `./Dockerfile` (standart holatda turadi)
   - **Instance Type:** **`Free`** (bepul tarif)
6. **Environment Variables** (Muhit o‘zgaruvchilari) bo‘limida:
   - `PORT` = `10000`
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `postgresql://...` (Neon dan olingan havola)
   - `ADMIN_USERNAME` = `admin` (yoki xohlagan loginingiz)
   - `ADMIN_PASSWORD` = `admin123` (yoki o‘zingizning maxfiy kuchli parolingiz)
   - `ADMIN_SECRET_KEY` = `ixtiyoriy_uzun_maxfiy_kalit`
7. Sahifaning pastidagi **"Create Web Service"** tugmasini bosing!

Render avtomatik ravishda Docker tasvirini yig‘adi (build qiladi), bazani to‘ldiradi va sizga `https://avtoqism-uz.onrender.com` kabi bepul SSL (HTTPS) domen taqdim etadi.

---

### ⚡ 2-USUL. Blueprint (`render.yaml`) orqali 1-bosqichda sozlash

1. Render boshqaruv panelida **"New +"** -> **"Blueprint"** ni tanlang.
2. `avtoqism-uz` repozitoriyasini ulang.
3. Render loyihangizdagi `render.yaml` faylini avtomatik o‘qiydi va barcha o‘zgaruvchilar hamda Docker sozlamalarini o‘zi to‘g‘rilab beradi.
4. **"Apply"** tugmasini bosish kifoya!

---

## 💾 3-BOSQICH. Ma’lumotlar bazasi (SQLite) xavfsizligi

Loyihada **SQLite** ma’lumotlar bazasi ishlatiladi:
- Docker build jarayonida barcha 9 ta avtomobil modeli (Cobalt, Gentra, Tracker, BYD, Kia...), 8 ta toifa, 20 ta ehtiyot qismlar, sharhlar va buyurtmalar avtomatik generatsiya qilinadi va `dev.db.template` sifatida tasvir ichiga saqlanadi.
- Render.com bepul versiyasida har safar konteyner qayta ishga tushganda `docker-entrypoint.sh` skripti bazani avtomatik tayyorlab beradi.
- Agar pullik tarifda doimiy disk ulamoqchi bo‘lsangiz:
  - Render xizmati sozlamalarida **"Disks"** bo‘limiga kiring.
  - **"Add Disk"** bosing: Name: `data`, Mount Path: `/app/prisma`, Size: `1 GB`.

---

## 💻 4-BOSQICH. Lokal kompyuterda Docker orqali sinab ko‘rish

Loyiha kompyuteringizda Docker konteynerida qanday ishlashini tekshirish uchun terminalda quyidagi buyruqni bering:

```bash
docker compose up --build
```

Konteyner ishga tushgach, brauzeringizda quyidagi manzilni oching:
- **Asosiy sahifa:** [http://localhost:3000](http://localhost:3000)
- **Katalog:** [http://localhost:3000/catalog](http://localhost:3000/catalog)
- **VIN qidiruv:** [http://localhost:3000/vin-search](http://localhost:3000/vin-search)
- **Admin paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)

Konteynerni to‘xtatish uchun:
```bash
docker compose down
```

---

## 🔧 Muammolar yuzaga kelsa (Troubleshooting)

1. **Sayt 502 Bad Gateway bersa:**
   - Render-da "Logs" bo‘limiga kiring. Agar port muammosi bo‘lsa, Environment Variables bo‘limida `PORT=10000` va `HOSTNAME=0.0.0.0` ekanligiga ishonch hosil qiling.
2. **Render Free Sleep rejimi:**
   - Render.com ning bepul tarifi 15 daqiqa murojaat bo‘lmasa konteynerni uyqu (sleep) rejimiga o‘tkazadi. Yangi so‘rov kelganda 30-40 soniyada o‘zi qayta uyg‘onadi. Bu bepul rejim uchun tabiiy holat.
