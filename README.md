# AvtoQism.uz — Avtomobil ehtiyot qismlarini katalog bo‘yicha qidirish va sotib olish internet do‘koni

**AvtoQism.uz** — O‘zbekistondagi ommabop avtomobillar (Chevrolet Cobalt, Gentra, Tracker, Onix, Nexia 3, Damas, BYD Song Plus, Kia K5, Toyota Camry va boshqalar) uchun ehtiyot qismlarini katalog, OEM artikul raqami va 17 xonali VIN kod bo‘yicha tezkor qidirish, avtomobil mosligini kafolatlash hamda onlayn xarid qilishga mo‘ljallangan to‘liq funksional elektron tijorat (E-commerce) veb-platformasi.

Loyiha Oliy ta’lim muassasalarining Axborot texnologiyalari va Dasturiy injiniring yo‘nalishi talabalarining **Bitiruv Malakaviy Ishi (BMI)** doirasida ishlab chiqilgan.

---

## 🌟 Asosiy imkoniyatlar va funksiyalar

### 1. 🔍 VIN kod bo‘yicha avtomatik dekodlash va qidiruv (VIN Decoder)
- 17 ta belgidan iborat standart xalqaro VIN kodni tahlil qilish (WMI, VDS, VIS).
- O‘zbekiston (UzAuto Motors Asaka: `XWB...`), GM Korea (`KL1...`, `KL7...`), BYD (`LGX...`), Kia (`KNA...`), Hyundai, Toyota kabi avtokonsernlar shifrlarini aniqlash.
- Ishlab chiqaruvchi davlat, zavod, model yili (10-belgi asosida) va dvigatel hajmini avtomatik chiqarish.
- Foydalanuvchi kiritgan VIN kodga **100% mos keluvchi** qismlar ro‘yxatini chiqarish va 1 tugma bilan avtoni shaxsiy garajga saqlash.

### 2. 🚗 "Mening Garajim" va Avtomobil bo‘yicha moslik filtri (Car Compatibility Checker)
- Har bir xaridor o‘z mashinasini (masalan, *Chevrolet Cobalt 2022, 1.5 DOHC*) bir marta tanlab "Mening garajim"ga kiritadi.
- Butun internet do‘koni avtomatik ravishda faqat shu avtomobilga to‘g‘ri keladigan ehtiyot qismlarini ko‘rsatish rejimiga o‘tadi.
- Har bir tovar kartochkasida va batafsil sahifasida yashil nishon: *"Sizning Cobalt (2022) avtomobilingizga 100% mos keladi"* yoki moslik ogohlantirishi aks etadi.

### 3. 📂 Ko‘p pog‘onali interaktiv katalog (Hierarchical Category Catalog)
8 ta asosiy avtomobil agregat va tizim toifalari:
- **Tormoz tizimi:** Kolodkalar, ventilyatsiyali disklar, barabanlar, shlanglar va ABS datchiklari.
- **Dvigatel tizimi:** GRM tasmalar, porshenlar, klapanlar, shamlar (svecha), prokladkalar va moy nasoslari.
- **Filtrlar:** Moy filtri, havo filtri, faollashgan ko‘mirli (antibakterial) salon filtri, yonilg‘i filtri.
- **Xodovoy va podveska:** Amortizatorlar, podveska richaglari, sharovoy, prujinalar, rul uchliklari va stupitsa podshipniklari.
- **Moylar va avtokimyo:** To‘liq sintetik motor moylari (Castrol, GM Dexos2, 5W-30), ATF avtomat korobka moyi, G12+ antifriz.
- **Elektr va yoritish:** Start-Stop AGM akkumulyatorlar, generatorlar, starterlar, faralar va lampalar.
- **Transmissiya:** Valeo stseplenie to‘plamlari (disk, korzina, vjimnoy), granatalar (ShRUS), privodlar.
- **Kuzov va oynalar:** Bamperlar, karkassiz gibrid oynatozalagichlar (dvoriklar).

### 4. 🏷️ OEM raqamlari va Kross-kodlar (Cross-references)
- Zavod original OEM artikuli bo‘yicha qidiruv (masalan: `GM 96405129`, `W712/75`, `CEKD-1`).
- Xalqaro analoglar bazasi (GM Genuine, Bosch, Brembo, Mann-Filter, CTR, Sangsin Hi-Q, Valeo, Gates, Denso).

### 5. 🛒 Savat va Buyurtmani rasmiylashtirish (Checkout)
- Miqdorni o‘zgartirish, promokod tizimi (`AVTO2026` orqali 10% maxsus chegirma).
- O‘zbekistonning barcha 14 ta hududi (Toshkent shahri va viloyatlar) bo‘yicha yetkazib berish.
- To‘lov usullari: **Click**, **Payme**, **Uzum Bank**, yetkazilganda Naqd/Terminal orqali.
- Buyurtma muvaffaqiyatli topshirilgach — bosma chek/kvitansiya hamda noyob trek-kod (`AQ-TRK-XXXXXX`).

### 6. 📦 Buyurtmani real vaqtda kuzatish (Order Tracking Timeline)
- Buyurtma raqami yoki trek-kod orqali 4 bosqichli status kuzatuvi:
  1. *Qabul qilindi* → 2. *Ombor yig‘moqda* → 3. *Kuryerga/Pochtaga berildi* → 4. *Yetkazib berildi*.

### 7. ⭐ Mijozlar fikrlari va baholash (Reviews & Ratings)
- Xaridorlar tomonidan qoldirilgan 5 yulduzli baholar, sharhlar va yangi sharh qoldirish imkoniyati.

### 8. 🛠️ Administrator boshqaruv paneli (`/admin`)
- **Moliyaviy va ombor statistikasi:** Jami tushum (so‘mda), buyurtmalar soni, katalogdagi tovarlar soni, omborda qoldig‘i kam qolgan tovarlar bo‘yicha ogohlantirish.
- **Buyurtmalar nazorati:** Buyurtmalar holatini real vaqtda o‘zgartirish (`new` → `processing` → `shipped` → `delivered` → `cancelled`).
- **Katalog boshqaruvi:** Yangi ehtiyot qism qo‘shish (nom, OEM, brend, narx, qoldiq, mos keluvchi avtolar ro‘yxati), tahrirlash va o‘chirish.
- **Avtopark bazasi:** Qo‘llab-quvvatlanuvchi rusum va modellar nazorati.

---

## 💻 Texnologiyalar steki (Technology Stack)

| Yo‘nalish | Texnologiya | Tavsifi |
|---|---|---|
| **Frontend & SSR** | **Next.js 14 (App Router)** | React 18, Server & Client Components, Responsive UI |
| **Dasturlash tili** | **TypeScript 5** | Qat’iy tiplash va xavfsiz arxitektura |
| **Styling** | **Tailwind CSS 3** | Zamonaviy avtomobil e-commerce dizayn tizimi |
| **Ikonkalar** | **Lucide React** | Vektorli avto va tizim piktogrammalari |
| **Ma’lumotlar bazasi** | **SQLite (dev.db)** | Lokal, yengil, hech qanday qo‘shimcha server talab qilmaydi |
| **ORM** | **Prisma 6** | Ma’lumotlar sxemasi, migratsiyalar va qulay so‘rovlar |
| **Effektlar** | **Canvas-Confetti** | Muvaffaqiyatli buyurtma animatsiyasi |

---

## 🚀 Loyihani ishga tushirish (O‘rnatish yo‘riqnomasi)

### Talablar:
- **Node.js:** v18.0 yoki undan yuqori (tavsiya etiladi: v20+)
- **pnpm** yoki **npm**

### 1-qadam. Paketlarni o‘rnatish:
```bash
pnpm install
# yoki: npm install
```

### 2-qadam. Ma’lumotlar bazasini yaratish va Prisma generatsiyasi:
```bash
pnpm prisma db push
```

### 3-qadam. Boshlang‘ich avtomobillar, ehtiyot qismlar va toifalarni yuklash (Seed):
```bash
node prisma/seed.mjs
# yoki: pnpm seed
```

### 4-qadam. Dasturni ishlab chiqish rejimida ishga tushirish:
```bash
pnpm dev
```

Brauzerda oching: **[http://localhost:3000](http://localhost:3000)**

Administrator paneli: **[http://localhost:3000/admin](http://localhost:3000/admin)**

---

## 🗄️ Ma’lumotlar bazasi modeli (Database ER Model)

- `Vehicle`: Avtomobil rusumi (make), modeli (model), yillari (yearFrom, yearTo), motor (engine), yoqilg‘i turi, VIN shabloni.
- `Category`: Katalog toifalari va ierarxiyasi (name, slug, icon).
- `Part`: Ehtiyot qism (name, slug, oemNumber, brand, country, isOriginal, price, oldPrice, stock, warranty, description, specifications, images).
- `PartCompatibility`: Avtomobil va qism o‘rtasidagi ko‘pga-ko‘p (M:N) moslik munosabati.
- `Order`: Buyurtma (orderNumber, customerName, phone, region, address, deliveryMethod, paymentMethod, status, totalAmount, trackingCode).
- `OrderItem`: Buyurtma tarkibidagi tovarlar va miqdorlar.
- `Review`: Mahsulot sharhlari va reytingi.

---

## 🎓 Bitiruv Malakaviy Ishi (BMI) hujjati
To‘liq akademik tushuntirish xati va BMI talablariga mos hisobot loyihaning `docs/BMI_TUSHUNTIRISH_XATI.md` faylida keltirilgan.
Unda:
1. Mavzuning dolzarbligi va maqsadlari.
2. Mavjud tizimlar tahlili (AutoDoc, Exist, UzAuto ehtiyot qismlari).
3. Tizim arxitekturasi va UML diagrammalari.
4. Dasturiy amalga oshirish va testlash.
5. Xulosa va kelgusidagi istiqbollar.
