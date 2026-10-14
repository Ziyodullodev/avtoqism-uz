import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('AvtoQism.uz ma\'lumotlar bazasini tozalash va to\'ldirish boshlandi...');

  // Tozalash
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.partCompatibility.deleteMany({});
  await prisma.part.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.vehicle.deleteMany({});

  console.log('Eski ma\'lumotlar tozalandi.');

  // 1. AVTOMOBILLAR (VEHICLES)
  const cobalt = await prisma.vehicle.create({
    data: {
      make: 'Chevrolet',
      model: 'Cobalt',
      generation: 'II avlod',
      yearFrom: 2013,
      yearTo: 2025,
      engine: '1.5 DOHC B15D2 (106 o.k.)',
      fuelType: 'Benzin / Metan / Propan',
      transmission: 'Avtomat (AT 6T30) / Mexanika (5MT)',
      bodyType: 'Sedan',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'XWBJA52E',
    },
  });

  const gentra = await prisma.vehicle.create({
    data: {
      make: 'Chevrolet',
      model: 'Gentra (Lacetti)',
      generation: 'Restyling',
      yearFrom: 2013,
      yearTo: 2024,
      engine: '1.5 DOHC B15D2 (107 o.k.)',
      fuelType: 'Benzin / Metan / Propan',
      transmission: 'Avtomat (6T30) / Mexanika (5MT)',
      bodyType: 'Sedan',
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'KL1JF69',
    },
  });

  const nexia3 = await prisma.vehicle.create({
    data: {
      make: 'Chevrolet',
      model: 'Nexia 3 (Ravon R3)',
      generation: 'III avlod',
      yearFrom: 2016,
      yearTo: 2023,
      engine: '1.5 DOHC B15D2 (105 o.k.)',
      fuelType: 'Benzin / Metan',
      transmission: 'Avtomat (6T30) / Mexanika (5MT)',
      bodyType: 'Sedan',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'KL1SF69',
    },
  });

  const tracker2 = await prisma.vehicle.create({
    data: {
      make: 'Chevrolet',
      model: 'Tracker 2',
      generation: 'II avlod (GEM)',
      yearFrom: 2022,
      yearTo: 2025,
      engine: '1.2 Turbo CSS Prime (132 o.k.)',
      fuelType: 'Benzin (AI-95)',
      transmission: 'Avtomat (6T35)',
      bodyType: 'Krossover',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'KL79K2SE',
    },
  });

  const onix = await prisma.vehicle.create({
    data: {
      make: 'Chevrolet',
      model: 'Onix',
      generation: 'II avlod',
      yearFrom: 2023,
      yearTo: 2025,
      engine: '1.2 Turbo (132 o.k.) / 1.2 MPI (90 o.k.)',
      fuelType: 'Benzin',
      transmission: 'Avtomat / Mexanika',
      bodyType: 'Sedan',
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'KL16B5SE',
    },
  });

  const damas = await prisma.vehicle.create({
    data: {
      make: 'Chevrolet',
      model: 'Damas / Labo',
      generation: 'Damas II',
      yearFrom: 2006,
      yearTo: 2025,
      engine: '0.8 F8CB (38 o.k.)',
      fuelType: 'Benzin / Metan / Propan',
      transmission: 'Mexanika (5MT)',
      bodyType: 'Mikroven',
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'XWB0L11',
    },
  });

  const bydSong = await prisma.vehicle.create({
    data: {
      make: 'BYD',
      model: 'Song Plus DM-i',
      generation: 'Champion Edition',
      yearFrom: 2021,
      yearTo: 2025,
      engine: '1.5 Xiaoyun Plug-in Hybrid (110 o.k. + 197 o.k. EV)',
      fuelType: 'PHEV (Gibrid / Elektr)',
      transmission: 'E-CVT',
      bodyType: 'Krossover',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'LGXCE32',
    },
  });

  const kiaK5 = await prisma.vehicle.create({
    data: {
      make: 'Kia',
      model: 'K5 (DL3)',
      generation: 'III avlod',
      yearFrom: 2020,
      yearTo: 2025,
      engine: '2.0 MPI (150 o.k.) / 2.5 GDI (194 o.k.)',
      fuelType: 'Benzin',
      transmission: 'Avtomat (6AT / 8AT)',
      bodyType: 'Sedan',
      imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'KNAGM4A',
    },
  });

  const toyotaCamry = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Camry XV70',
      generation: 'VIII avlod',
      yearFrom: 2018,
      yearTo: 2024,
      engine: '2.5 Dynamic Force A25A-FKS (209 o.k.)',
      fuelType: 'Benzin',
      transmission: 'Avtomat (8AT Direct Shift)',
      bodyType: 'Sedan',
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80',
      vinPattern: 'JTNB11HK',
    },
  });

  console.log('Avtomobillar bazaga kiritildi: 9 ta model.');

  // 2. KATEGORIYALAR (CATEGORIES)
  const catTormoz = await prisma.category.create({
    data: {
      name: 'Tormoz tizimi',
      slug: 'tormoz-tizimi',
      description: 'Tormoz kolodkalari, disklari, shlanglari, ABS va suyuqliklari',
      icon: 'Disc',
    },
  });

  const catDvigatel = await prisma.category.create({
    data: {
      name: 'Dvigatel tizimi',
      slug: 'dvigatel-tizimi',
      description: 'GRM tasmalar, porshenlar, svechalar, qistirmalar va datchiklar',
      icon: 'Cog',
    },
  });

  const catFiltrlar = await prisma.category.create({
    data: {
      name: 'Filtrlar',
      slug: 'filtrlar',
      description: 'Moy, havo, salon va yoqilg\'i tozalash filtrlari',
      icon: 'Filter',
    },
  });

  const catXodovoy = await prisma.category.create({
    data: {
      name: 'Xodovoy va podveska',
      slug: 'xodovoy-va-podveska',
      description: 'Amortizatorlar, prujinalar, richaglar, sharovoy va rul boshqaruvi',
      icon: 'Activity',
    },
  });

  const catMoylar = await prisma.category.create({
    data: {
      name: 'Moylar va avtokimyo',
      slug: 'moylar-va-avtokimyo',
      description: 'Sintetik motor moylari, antifriz, transmissiya moylari va tozalagichlar',
      icon: 'Droplet',
    },
  });

  const catElektr = await prisma.category.create({
    data: {
      name: 'Elektr va yoritish',
      slug: 'elektr-va-yoritish',
      description: 'Akkumulyatorlar, generatorlar, starterlar, faralar va lampalar',
      icon: 'Zap',
    },
  });

  const catTransmissiya = await prisma.category.create({
    data: {
      name: 'Transmissiya va uzatmalar',
      slug: 'transmissiya',
      description: 'Stseplenie komplektlari, granatalar (ShRUS), reduktor va privodlar',
      icon: 'RotateCw',
    },
  });

  const catKuzov = await prisma.category.create({
    data: {
      name: 'Kuzov va optika',
      slug: 'kuzov-va-optika',
      description: 'Bamperlar, qanotlar, oynatozalagich cho\'tkalari va oynalar',
      icon: 'Shield',
    },
  });

  console.log('Kategoriyalar yaratildi: 8 ta toifa.');

  // 3. EHTIYOT QISMLARI (PARTS)
  const partsData = [
    // TORMOZ TIZIMI
    {
      name: 'Old tormoz kolodkalari to\'plami (Front Brake Pads)',
      slug: 'old-tormoz-kolodkalari-cobalt-gentra-gm',
      oemNumber: 'GM 96405129',
      brand: 'GM Genuine Parts',
      country: 'Koreya Respublikasi',
      isOriginal: true,
      price: 245000,
      oldPrice: 280000,
      stock: 35,
      unit: 'to\'plam (4 dona)',
      warranty: '12 oy yoki 20 000 km',
      description: 'Chevrolet Cobalt, Gentra va Nexia-3 avtomobillari uchun original old tormoz kolodkalari. Asbest moddasi yo\'q, keramik-metall kompozitsiyadan tayyorlangan. Tormozlanish paytida qizib ketmaydi va ovoz chiqarmaydi.',
      specifications: JSON.stringify({
        "O'rnatilish o'qi": "Old o'q (chap va o'ng)",
        "Tormoz tizimi turi": "Mando / GM Disk",
        "Qalinligi": "17.2 mm",
        "Kengligi": "142.5 mm",
        "Balandligi": "51.2 mm",
        "Datchik": "Akustik eskirish datchigi mavjud"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 42,
      badge: 'Top sotuv',
      crossCodes: 'SP1159, Sangsin Hi-Q 1159, Bosch 0986424789, Brembo P10008, TRW GDB3347',
      categoryId: catTormoz.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Cobalt 1.5 barcha yillari uchun mos' },
        { vehicleId: gentra.id, notes: 'Gentra 1.5 va Lacetti 1.6 uchun 100% mos' },
        { vehicleId: nexia3.id, notes: 'Nexia 3 (Ravon R3) uchun to\'liq mos' },
      ],
    },
    {
      name: 'Brembo Premium old tormoz diski (Ventilyatsiyali)',
      slug: 'brembo-old-tormoz-diski-lacetti-gentra',
      oemNumber: '09.B365.10',
      brand: 'Brembo',
      country: 'Italiya',
      isOriginal: false,
      price: 380000,
      oldPrice: 420000,
      stock: 18,
      unit: 'dona',
      warranty: '24 oy',
      description: 'Italiyaning mashhur Brembo kompaniyasidan yuqori uglerodli shamollatiladigan (ventilyatsiyali) tormoz diski. Yuqori haroratga chidamli, tez sovush tizimiga ega.',
      specifications: JSON.stringify({
        "Diametri": "256 mm",
        "Qalinligi": "24 mm",
        "Minimal qalinlik": "22 mm",
        "Teshiklar soni": "4",
        "Markaziy diametr": "60 mm"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 19,
      badge: 'Premium sifat',
      crossCodes: 'GM 96549630, TRW DF4433, Ferodo DDF1495, Bosch 0986479099',
      categoryId: catTormoz.id,
      vehicles: [
        { vehicleId: gentra.id, notes: 'Lacetti va Gentra barcha modellari uchun' },
        { vehicleId: cobalt.id, notes: 'Cobalt 1.5 AT va MT uchun' },
      ],
    },
    {
      name: 'Sangsin Hi-Q orqa baraban tormoz kolodkalari',
      slug: 'sangsin-hiq-orqa-kolodka-cobalt-nexia3',
      oemNumber: 'SA133',
      brand: 'Sangsin Brake (Hi-Q)',
      country: 'Koreya Respublikasi',
      isOriginal: false,
      price: 185000,
      oldPrice: 210000,
      stock: 28,
      unit: 'to\'plam (4 dona)',
      warranty: '6 oy yoki 15 000 km',
      description: 'Koreyada ishlab chiqarilgan yuqori sifatli Hi-Q orqa baraban kolodkalari. Yumshoq tormozlanish, uzoq muddat xizmat qilish va barabanni yeymaslik xususiyati.',
      specifications: JSON.stringify({
        "O'rnatilish joyi": "Orqa o'q (baraban)",
        "Diametri": "200 mm",
        "Kengligi": "35 mm",
        "Komplekt": "4 dona kolodka"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.8,
      reviewCount: 27,
      badge: 'Xit savdo',
      crossCodes: 'GM 96473228, Bosch 0986487708',
      categoryId: catTormoz.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Orqa barabanli modifikatsiyalar' },
        { vehicleId: nexia3.id, notes: 'Barcha Ravon R3 va Nexia 3 lar' },
        { vehicleId: damas.id, notes: 'Damas II va Labo uchun mos' },
      ],
    },

    // FILTRLAR
    {
      name: 'MANN-FILTER W712/75 Original moy filtri',
      slug: 'mann-filter-moy-filtri-w71275',
      oemNumber: 'W712/75',
      brand: 'Mann-Filter',
      country: 'Germaniya',
      isOriginal: true,
      price: 75000,
      oldPrice: 90000,
      stock: 80,
      unit: 'dona',
      warranty: '10 000 km gacha',
      description: 'Germaniyada ishlab chiqarilgan MANN moy filtri. Maxsus mikroskopik tolalardan iborat filtr qog\'ozi dvigatel moyini zang, kuyindi va metall zarrachalaridan 99.8% tozalaydi.',
      specifications: JSON.stringify({
        "Tashqi diametr": "76 mm",
        "Ichki rezba": "M 18 x 1.5",
        "Balandligi": "79 mm",
        "Bypass klapan ochilish bosimi": "1.0 bar"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 5.0,
      reviewCount: 68,
      badge: 'Tavsiya etiladi',
      crossCodes: 'GM 96879797, 25183779, Bosch 0451103079, Filtron OP570',
      categoryId: catFiltrlar.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: '1.5 B15D2 dvigatel uchun original' },
        { vehicleId: gentra.id, notes: '1.5 DOHC Gentra dvigateli uchun' },
        { vehicleId: nexia3.id, notes: 'Nexia 3 B15D2 uchun' },
        { vehicleId: tracker2.id, notes: '1.2 Turbo dvigateli uchun mos' },
        { vehicleId: onix.id, notes: '1.2 CSS Prime Turbo uchun' },
      ],
    },
    {
      name: 'Original Havo filtri (Air Filter) GM B15D2',
      slug: 'gm-havo-filtri-cobalt-gentra',
      oemNumber: 'GM 96950990',
      brand: 'GM Genuine Parts',
      country: 'O\'zbekiston (UzChasys)',
      isOriginal: true,
      price: 55000,
      oldPrice: 65000,
      stock: 120,
      unit: 'dona',
      warranty: '10 000 km',
      description: 'Dvigatelga kiruvchi havoni chang, qum va mayda zarrachalardan tozalovchi original zavod havo filtri. Yoqilg\'i sarfini me\'yorda ushlab turadi.',
      specifications: JSON.stringify({
        "Uzunligi": "225 mm",
        "Kengligi": "190 mm",
        "Balandligi": "42 mm",
        "Material": "Ko'p qatlamli polimer tola"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.8,
      reviewCount: 33,
      badge: 'Zavod qismi',
      crossCodes: 'Filtron AP082/5, Mann C23015',
      categoryId: catFiltrlar.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Cobalt barcha yillari' },
        { vehicleId: gentra.id, notes: 'Gentra 1.5' },
        { vehicleId: nexia3.id, notes: 'Ravon R3 / Nexia 3' },
      ],
    },
    {
      name: 'Uglerodli salon filtri (Antibakterial ko\'mir filtr)',
      slug: 'uglerodli-salon-filtri-cobalt-gentra-tracker',
      oemNumber: 'GM 95981206',
      brand: 'Bosch Filter+',
      country: 'Germaniya',
      isOriginal: false,
      price: 85000,
      oldPrice: 110000,
      stock: 45,
      unit: 'dona',
      warranty: '15 000 km',
      description: 'Faollashtirilgan uglerodli (ko\'mirli) salon filtri. Ko\'cha tutunlari, yoqimsiz hidlar, bakteriyalar va changni 99% ushlab qoladi. Konditsioner hidlanishining oldini oladi.',
      specifications: JSON.stringify({
        "Turi": "Faollashgan ko'mirli (Carbon)",
        "O'lchamlari": "240 x 190 x 20 mm",
        "Filtrlash sinfi": "PM 2.5 gacha"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 28,
      badge: 'Aksiya',
      crossCodes: 'Mann CUK2442, Filtron K1223A',
      categoryId: catFiltrlar.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Salon havosi uchun' },
        { vehicleId: gentra.id, notes: 'Lacetti / Gentra saloniga' },
        { vehicleId: tracker2.id, notes: 'Tracker 2 saloniga mos' },
        { vehicleId: onix.id, notes: 'Onix saloniga mos' },
      ],
    },

    // DVIGATEL VA MEXANIZMLAR
    {
      name: 'NGK Iridium IX Shamlar to\'plami (Svecha 4 dona)',
      slug: 'ngk-iridium-svecha-toplami-bpr6eix',
      oemNumber: 'NGK BPR6EIX (6684)',
      brand: 'NGK Spark Plugs',
      country: 'Yaponiya',
      isOriginal: true,
      price: 360000,
      oldPrice: 400000,
      stock: 22,
      unit: 'to\'plam (4 dona)',
      warranty: '60 000 km kafolat',
      description: 'Yaponiyaning NGK korporatsiyasi tomonidan ishlab chiqarilgan Iridium elektrodli shamlar. Gazda (Metan/Propan) va benzinda ishlovchi avtolar uchun benuqson uchqun beradi. Dvigatel dinamikasini oshiradi va yoqilg\'ini 5-7% tejaydi.',
      specifications: JSON.stringify({
        "Elektrod materiali": "Iridium (0.6 mm uchi)",
        "Rezba diametri": "14 mm",
        "Rezba uzunligi": "19 mm",
        "Kalit o'lchami": "16 mm",
        "Zazor": "0.8 - 0.9 mm"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 5.0,
      reviewCount: 54,
      badge: 'Premium',
      crossCodes: 'Denso IK20TT, Bosch FR7DC+, GM 96130723',
      categoryId: catDvigatel.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Metan va benzin uchun a\'lo variant' },
        { vehicleId: gentra.id, notes: '1.5 DOHC motorlar uchun tavsiya' },
        { vehicleId: nexia3.id, notes: 'Nexia 3 uchun' },
        { vehicleId: damas.id, notes: 'Damas uchun (3 dona ishlatiladi)' },
      ],
    },
    {
      name: 'Gates PowerGrip GRM remen va rolik komplekti',
      slug: 'gates-grm-komplekt-gentra-lacetti-16',
      oemNumber: 'K015419XS',
      brand: 'Gates',
      country: 'Belgiya / AQSH',
      isOriginal: false,
      price: 680000,
      oldPrice: 750000,
      stock: 14,
      unit: 'komplekt (remen + 2 ta rolik)',
      warranty: '60 000 km yoki 2 yil',
      description: 'Dunyo avtosanoati yetakchisi Gates firmasining original GRM to\'plami: mustahkamlangan xromlangan kordli remen, avtomatik tortuvchi rolik va aylanuvchi yo\'naltiruvchi rolik.',
      specifications: JSON.stringify({
        "Tishlar soni": "127",
        "Kengligi": "25.4 mm",
        "Komplekt tarkibi": "GRM remeni, natyajitel roligi, parazit rolik, o'rnatish yo'riqnomasi"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 23,
      badge: 'Kafolatlangan',
      crossCodes: 'Contitech CT887K1, INA 530033210, GM 93744703',
      categoryId: catDvigatel.id,
      vehicles: [
        { vehicleId: gentra.id, notes: 'Lacetti 1.6 va 1.8 dvigatellari uchun' },
      ],
    },
    {
      name: 'Klapan qopqog\'i prokladkasi (Valve Cover Gasket) GM',
      slug: 'gm-klapan-qopqogi-prokladkasi-b15d2',
      oemNumber: 'GM 96495117',
      brand: 'GM Genuine Parts',
      country: 'Koreya Respublikasi',
      isOriginal: true,
      price: 95000,
      oldPrice: 120000,
      stock: 40,
      unit: 'dona',
      warranty: '12 oy',
      description: 'Silindrlar kallagi (GBC) ustidagi klapan qopqog\'idan motor moyi oqishini bartaraf etuvchi elastik issiqbardosh silikon-rezinali prokladka.',
      specifications: JSON.stringify({
        "Material": "FPM / ACM yuqori haroratga chidamli ftorkauchuk",
        "Moslik": "16-klapanli DOHC dvigatellari"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.7,
      reviewCount: 16,
      badge: null,
      crossCodes: 'Victor Reinz 71-38166-00, Elring 447.100',
      categoryId: catDvigatel.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: '1.5 B15D2 dvigateliga' },
        { vehicleId: gentra.id, notes: '1.5 Gentra dvigateliga' },
        { vehicleId: nexia3.id, notes: 'Nexia 3 dvigateliga' },
      ],
    },

    // XODOVOY VA PODVESKA
    {
      name: 'Mando gaz-moyli old amortizator (Chap va O\'ng)',
      slug: 'mando-old-amortizator-cobalt',
      oemNumber: 'EX95077491',
      brand: 'Mando',
      country: 'Koreya Respublikasi',
      isOriginal: false,
      price: 490000,
      oldPrice: 560000,
      stock: 24,
      unit: 'dona',
      warranty: '12 oy yoki 30 000 km',
      description: 'Koreyaning eng yirik OEM yetkazib beruvchisi Mando firmasining gaz-moyli old amortizatori. O\'zbekiston yo\'llaridagi chuqur va notekisliklarni mukammal yutadi.',
      specifications: JSON.stringify({
        "Konstruktsiyasi": "Ikki trubkali gaz-moyli (Gas-oil)",
        "O'rnatilish joyi": "Old o'q",
        "Shtok diametri": "22 mm"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.8,
      reviewCount: 31,
      badge: 'Top tavsiya',
      crossCodes: 'GM 95077491, Kayaba KYB 3330058, Sachs 317142',
      categoryId: catXodovoy.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Cobalt 2013-2025 barcha komplektatsiyalar' },
      ],
    },
    {
      name: 'CTR Rul uchligi (Tie Rod End) tashqi chap/o\'ng',
      slug: 'ctr-rul-uchligi-gentra-lacetti-cekd1',
      oemNumber: 'CEKD-1',
      brand: 'CTR (Central Corporation)',
      country: 'Koreya Respublikasi',
      isOriginal: false,
      price: 110000,
      oldPrice: 130000,
      stock: 50,
      unit: 'dona',
      warranty: '20 000 km',
      description: 'CTR original koreys rul uchligi. Polimer vkladka va xromlangan sharovoy barmoq rul chambaragi aniqligini ta\'minlaydi va tebranishlarni bartaraf qiladi.',
      specifications: JSON.stringify({
        "Rezba o'lchami": "M14x1.5",
        "Konus o'lchami": "13.3 mm",
        "O'rnatilish joyi": "Old rul boshqaruvi"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 45,
      badge: 'Chidamli',
      crossCodes: 'GM 96407485, Lemforder 30459 01',
      categoryId: catXodovoy.id,
      vehicles: [
        { vehicleId: gentra.id, notes: 'Gentra va Lacetti barcha yillari' },
        { vehicleId: cobalt.id, notes: 'Cobalt rul reyka tyagasiga' },
        { vehicleId: nexia3.id, notes: 'Nexia 3 ga' },
      ],
    },
    {
      name: 'Old stupitsa podshipniki (Wheel Hub Bearing) ABS datchikli',
      slug: 'iljin-stupitsa-podshipnik-abs-tracker-onix',
      oemNumber: 'IJ113045',
      brand: 'ILJIN Bearings',
      country: 'Koreya Respublikasi',
      isOriginal: true,
      price: 420000,
      oldPrice: 470000,
      stock: 16,
      unit: 'dona',
      warranty: '12 oy',
      description: 'Zavod konveyerida o\'rnatiluvchi ILJIN original old stupitsa podshipniki. Magnit ABS xalqasi integratsiya qilingan.',
      specifications: JSON.stringify({
        "Ichki diametr": "42 mm",
        "Tashqi diametr": "82 mm",
        "Kengligi": "36 mm",
        "ABS": "Magnit polimer sensorli lenta mavjud"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 12,
      badge: null,
      crossCodes: 'GM 13592067, SKF VKBA 7611, SNR R153.64',
      categoryId: catXodovoy.id,
      vehicles: [
        { vehicleId: tracker2.id, notes: 'Tracker 2 old o\'q podshipniki' },
        { vehicleId: onix.id, notes: 'Onix old g\'ildirak stupitsasi' },
      ],
    },

    // MOYLAR VA AVTOKIMYO
    {
      name: 'Castrol EDGE 5W-30 LL To\'liq sintetik motor moyi (4L)',
      slug: 'castrol-edge-5w30-ll-4l',
      oemNumber: '15669E',
      brand: 'Castrol',
      country: 'Germaniya',
      isOriginal: true,
      price: 520000,
      oldPrice: 580000,
      stock: 40,
      unit: 'kanistra (4 litr)',
      warranty: '10 000 - 15 000 km',
      description: 'Fluid TITANIUM texnologiyasiga ega flagman motor moyi. Yuqori bosim va haroratlarda moy pardasini mustahkam ushlab turadi, turbinali va zamonaviy GDI/TGDI dvigatellar uchun ideal.',
      specifications: JSON.stringify({
        "Qovushqoqlik": "SAE 5W-30",
        "Hajmi": "4 litr",
        "Dopusklar": "API SP / SN Plus, ACEA C3, dexos2, VW 504 00 / 507 00, MB 229.51",
        "Baza": "100% Full Synthetic (PAO + Ester)"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 5.0,
      reviewCount: 62,
      badge: 'Xit savdo',
      crossCodes: 'Motul 8100 X-clean 5W30, Shell Helix Ultra 5W-30, Mobil 1 ESP',
      categoryId: catMoylar.id,
      vehicles: [
        { vehicleId: tracker2.id, notes: 'dexos1 Gen3 / dexos2 ruxsatnomasi bilan' },
        { vehicleId: onix.id, notes: 'Turbo motorlar uchun mos' },
        { vehicleId: cobalt.id, notes: 'Cobalt 1.5 uchun to\'liq mos' },
        { vehicleId: gentra.id, notes: 'Gentra 1.5 uchun tavsiya etiladi' },
        { vehicleId: kiaK5.id, notes: 'Kia K5 2.0 / 2.5 uchun' },
        { vehicleId: toyotaCamry.id, notes: 'Toyota Camry 2.5 uchun' },
      ],
    },
    {
      name: 'GM Genuine Dexron VI Avtomat korobka moyi (ATF 1L)',
      slug: 'gm-dexron-vi-atf-1l-avtomat-moyi',
      oemNumber: 'GM 93744589 (1940184)',
      brand: 'GM Genuine Parts',
      country: 'Germaniya / AQSH',
      isOriginal: true,
      price: 135000,
      oldPrice: 155000,
      stock: 65,
      unit: 'litr (1L)',
      warranty: '40 000 km yoki 2 yil',
      description: 'General Motors 6T30 va 6T35 avtomat uzatmalar qutisi (AKPP) uchun original zavod moyi. Silkinishlarsiz mayin uzatish va friksionlarni yeyilishdan asraydi.',
      specifications: JSON.stringify({
        "Suyuqlik standarti": "GM Dexron VI",
        "Hajmi": "1 litr",
        "Rangi": "Qizil (Red)",
        "Qo'llanilishi": "Avtomat transmissiya (AT 6-pog'onali)"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 39,
      badge: 'Original',
      crossCodes: 'Mobil ATF Dexron VI, Motul ATF VI',
      categoryId: catMoylar.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Cobalt avtomat qutisi uchun (to\'liq almashtirishga 7.5L)' },
        { vehicleId: gentra.id, notes: 'Gentra avtomat qutisiga' },
        { vehicleId: nexia3.id, notes: 'Nexia 3 AT qutisiga' },
        { vehicleId: tracker2.id, notes: 'Tracker 2 6T35 transmissiyasiga' },
      ],
    },
    {
      name: 'Felix Carbox G12+ Qizil Antifriz Sovitish suyuqligi (5 kg)',
      slug: 'felix-carbox-g12-plus-antifriz-5kg',
      oemNumber: '430206024',
      brand: 'Felix Carbox',
      country: 'Rossiya',
      isOriginal: false,
      price: 130000,
      oldPrice: 150000,
      stock: 55,
      unit: 'kanistra (5 kg)',
      warranty: '5 yil yoki 250 000 km',
      description: 'Karboksilat texnologiyasiga asoslangan zamonaviy G12+ antifrizi. Muzlash harorati -40°C gacha. Alyuminiy radiator va blokni korroziyadan 100% himoya qiladi.',
      specifications: JSON.stringify({
        "Klass": "G12+ (OAT texnologiyasi)",
        "Rangi": "Qizil / Qirmizi",
        "Muzlash harorati": "-40 °C",
        "Qaynash harorati": "+110 °C",
        "Hajmi": "5 kg"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.8,
      reviewCount: 22,
      badge: 'Ommabop',
      crossCodes: 'Hepu P999-G12, Sintec Lux G12',
      categoryId: catMoylar.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Barcha modellar' },
        { vehicleId: gentra.id, notes: 'Barcha modellar' },
        { vehicleId: tracker2.id, notes: 'Tracker 2 radiatoriga' },
        { vehicleId: bydSong.id, notes: 'Gibrid sovitish tizimiga' },
        { vehicleId: kiaK5.id, notes: 'Kia dvigateli uchun' },
      ],
    },

    // ELEKTR VA YORITISH
    {
      name: 'Delkor AGM 70Ah Start-Stop Akkumulyator batareyasi',
      slug: 'delkor-agm-70ah-start-stop-akkumulyator',
      oemNumber: 'AGM LN3 70Ah',
      brand: 'Delkor (Johnson Controls)',
      country: 'Koreya Respublikasi',
      isOriginal: true,
      price: 1550000,
      oldPrice: 1750000,
      stock: 12,
      unit: 'dona',
      warranty: '24 oy to\'liq kafolat',
      description: 'Eng ilg\'or AGM texnologiyasi asosida ishlab chiqarilgan akkumulyator. Kuchli start toki (760A). Start-stop tizimli va kuchli audiotizimga ega zamonaviy avtomobillar uchun uzoq yillar xizmat qiladi.',
      specifications: JSON.stringify({
        "Sig'imi": "70 Amper/soat (Ah)",
        "Boshlang'ich tok (CCA)": "760 A (EN)",
        "Qutblanish": "Teskari (o'ng musbat [+])",
        "O'lchamlari": "278 x 175 x 190 mm",
        "Texnologiya": "AGM (Absorbent Glass Mat)"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 5.0,
      reviewCount: 18,
      badge: '2 yil kafolat',
      crossCodes: 'Varta Silver Dynamic AGM, Bosch S5 A08',
      categoryId: catElektr.id,
      vehicles: [
        { vehicleId: tracker2.id, notes: 'Tracker 2 Start-Stop tizimi uchun ideal' },
        { vehicleId: onix.id, notes: 'Onix Redline / Premier uchun' },
        { vehicleId: kiaK5.id, notes: 'Kia K5 elektr tizimiga mos' },
        { vehicleId: bydSong.id, notes: 'BYD 12V yordamchi akkumulyatori sifatida' },
        { vehicleId: cobalt.id, notes: 'Cobalt uchun (o\'rindiq o\'lchamiga mos)' },
      ],
    },
    {
      name: 'Philips X-tremeVision Pro150 H4 Lampalar juftligi (2 dona)',
      slug: 'philips-xtremevision-pro150-h4',
      oemNumber: '12342XVPro2',
      brand: 'Philips Automotive',
      country: 'Germaniya / Polsha',
      isOriginal: true,
      price: 260000,
      oldPrice: 310000,
      stock: 30,
      unit: 'komplekt (2 dona)',
      warranty: '12 oy',
      description: 'Standart lampalarga qaraganda 150% ko\'proq yorug\'lik beruvchi kuchaytirilgan H4 galogen lampalari. Tungi yo\'llarda ko\'rish masofasini 70 metrgacha uzaytiradi.',
      specifications: JSON.stringify({
        "Tsokol turi": "H4 (P43t-38)",
        "Kuchlanish / Quvvat": "12V 60/55W",
        "Rang harorati": "3400 K (Iliq oq / Yorqin)",
        "Yorug'lik oqimi": "1650 lm"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.8,
      reviewCount: 29,
      badge: '+150% yorug\'lik',
      crossCodes: 'Osram Night Breaker Laser H4, Narva Range Power',
      categoryId: catElektr.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Old asosiy fara lampasi' },
        { vehicleId: nexia3.id, notes: 'Old fara H4' },
        { vehicleId: damas.id, notes: 'Damas old faralari' },
      ],
    },

    // TRANSMISSIYA
    {
      name: 'Valeo Stseplenie komplekti (Disk + Korzina + Vjimnoy)',
      slug: 'valeo-stseplenie-komplekt-cobalt-nexia3-gentra',
      oemNumber: 'Valeo 826723',
      brand: 'Valeo PHC',
      country: 'Koreya Respublikasi',
      isOriginal: false,
      price: 880000,
      oldPrice: 980000,
      stock: 15,
      unit: 'to\'plam (3 ta qism)',
      warranty: '12 oy yoki 30 000 km',
      description: 'Koreys Valeo PHC konsernining to\'liq mufta to\'plami: yetaklovchi disk, prujinali korzina va gidravlik vjimnoy podshipnik. Mexanik uzatmalar qutisi uchun ravon va yumshoq ulanish.',
      specifications: JSON.stringify({
        "Diametri": "215 mm",
        "Shlitslar soni": "24 tish",
        "Tarkibi": "Feredo disk, bosim korzinasi, podshipnik"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 37,
      badge: 'Komplekt',
      crossCodes: 'GM 96408517, LuK 622 3135 09, Sachs 3000 951 098',
      categoryId: catTransmissiya.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Cobalt 1.5 Mexanika uzatmalar qutisi uchun' },
        { vehicleId: gentra.id, notes: 'Gentra 1.5 5MT mexanika uchun' },
        { vehicleId: nexia3.id, notes: 'Nexia 3 Mexanika uchun' },
      ],
    },

    // KUZOV VA OPTIKA
    {
      name: 'Old bamper (Grunted qora) Chevrolet Cobalt',
      slug: 'old-bamper-chevrolet-cobalt-original',
      oemNumber: 'GM 95076722',
      brand: 'UzAuto Motors (OEM)',
      country: 'O\'zbekiston',
      isOriginal: true,
      price: 650000,
      oldPrice: 720000,
      stock: 8,
      unit: 'dona',
      warranty: 'Zavod kafolati',
      description: 'Chevrolet Cobalt uchun original zavod old bamperi. Bo\'yashga tayyorlangan maxsus grunt qoplamali elastik polipropilen plastmassa.',
      specifications: JSON.stringify({
        "O'rnatilish": "Zavod qotiruvchi kronshteynlari bo'yicha",
        "Rangi": "Qora gruntlangan (Bo'yash talab etiladi)",
        "Tuman farasi joylari": "Ochiq teshikli"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.8,
      reviewCount: 14,
      badge: 'Zavod standarti',
      crossCodes: 'GM 95489812',
      categoryId: catKuzov.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Cobalt barcha yillari uchun 100% mos' },
      ],
    },
    {
      name: 'Bosch Aerotwin gibrid oynatozalagich cho\'tkalari (Dvorik 2 dona)',
      slug: 'bosch-aerotwin-dvorik-juftligi-ar604s',
      oemNumber: 'AR604S (3 397 118 908)',
      brand: 'Bosch Automotive',
      country: 'Germaniya / Belgiya',
      isOriginal: true,
      price: 210000,
      oldPrice: 245000,
      stock: 40,
      unit: 'komplekt (2 dona: 600mm / 475mm)',
      warranty: '12 oy',
      description: 'Aerodinamik spoylerli karkassiz oynatozalagichlar. Qishda muzlamaydi, yomg\'ir va qorda old oynani shovqinsiz va mukammal tozalaydi.',
      specifications: JSON.stringify({
        "Haydovchi tomoni": "600 mm (24 dyuym)",
        "Yo'lovchi tomoni": "475 mm (19 dyuym)",
        "Qotirish turi": "Kryuchok (Hook 9x3, 9x4)"
      }),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
      ]),
      rating: 4.9,
      reviewCount: 52,
      badge: 'Kafolatli',
      crossCodes: 'Denso DU-060L, SWF 119761',
      categoryId: catKuzov.id,
      vehicles: [
        { vehicleId: cobalt.id, notes: 'Cobalt old oynasiga mos' },
        { vehicleId: gentra.id, notes: 'Lacetti / Gentra uchun mos' },
        { vehicleId: tracker2.id, notes: 'Tracker 2 uchun mos' },
        { vehicleId: onix.id, notes: 'Onix old oynasiga' },
        { vehicleId: kiaK5.id, notes: 'Kia K5 old oynasiga' },
      ],
    },
  ];

  for (const part of partsData) {
    const { vehicles, ...partInfo } = part;
    const createdPart = await prisma.part.create({
      data: partInfo,
    });

    if (vehicles && vehicles.length > 0) {
      for (const v of vehicles) {
        await prisma.partCompatibility.create({
          data: {
            partId: createdPart.id,
            vehicleId: v.vehicleId,
            notes: v.notes,
          },
        });
      }
    }

    // Har bir tovar uchun namuna sharhlar
    await prisma.review.create({
      data: {
        partId: createdPart.id,
        authorName: 'Otabek Mirzayev',
        carModel: 'Cobalt 2022',
        rating: 5,
        comment: 'Juda sifatli tovar, buyurtma bergan kunimning o\'zidayoq yetkazib berishdi. O\'rnatdim, hech qanday ovoz yo\'q, minnatdorman!',
      },
    });

    await prisma.review.create({
      data: {
        partId: createdPart.id,
        authorName: 'Sardor Rustamov',
        carModel: 'Gentra 2020',
        rating: 5,
        comment: 'Original ekanligi bilinib turibdi. Katalogdagi VIN qidiruv orqali tekshirib oldim, 100% tushdi.',
      },
    });
  }

  console.log(`Ehtiyot qismlari yaratildi: ${partsData.length} ta mahsulot va sharhlar.`);

  // 4. NAMUNA BUYURTMALAR (ORDERS)
  const allParts = await prisma.part.findMany();

  const sampleOrder1 = await prisma.order.create({
    data: {
      orderNumber: 'AQ-2026-8812',
      customerName: 'Jahongir Qodirov',
      customerPhone: '+998 90 123 45 67',
      customerEmail: 'jahongir@example.com',
      region: 'Toshkent shahri',
      cityAddress: 'Yunusobod tumani, 12-mavze, 45-uy',
      deliveryMethod: 'courier_fast',
      deliveryCost: 25000,
      paymentMethod: 'click',
      paymentStatus: 'paid',
      status: 'shipped',
      totalAmount: 320000,
      notes: 'Iltimos, soat 18:00 dan keyin yetkazib bering',
      trackingCode: 'UZ-AQ-8812-EXP',
      items: {
        create: [
          {
            partId: allParts[0].id,
            quantity: 1,
            price: allParts[0].price,
          },
          {
            partId: allParts[3].id,
            quantity: 1,
            price: allParts[3].price,
          },
        ],
      },
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      orderNumber: 'AQ-2026-9140',
      customerName: 'Bobur Alimov',
      customerPhone: '+998 99 987 65 43',
      customerEmail: 'bobur.alimov@gmail.com',
      region: 'Samarqand viloyati',
      cityAddress: 'Samarqand shahri, Registon ko\'chasi, 18-uy',
      deliveryMethod: 'standard_bts',
      deliveryCost: 40000,
      paymentMethod: 'payme',
      paymentStatus: 'paid',
      status: 'processing',
      totalAmount: 1140000,
      notes: 'BTS pochtasi orqali yuboring',
      trackingCode: 'BTS-SAM-9140',
      items: {
        create: [
          {
            partId: allParts[10].id, // Castrol moy
            quantity: 2,
            price: allParts[10].price,
          },
          {
            partId: allParts[4].id, // MANN havo filtri
            quantity: 2,
            price: allParts[4].price,
          },
        ],
      },
    },
  });

  const sampleOrder3 = await prisma.order.create({
    data: {
      orderNumber: 'AQ-2026-9550',
      customerName: 'Sherzod Karimov',
      customerPhone: '+998 93 456 78 90',
      customerEmail: 'sherzod.k@mail.ru',
      region: 'Farg\'ona viloyati',
      cityAddress: 'Qo\'qon shahri, Navoiy ko\'chasi, 8-uy',
      deliveryMethod: 'courier_fast',
      deliveryCost: 35000,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      status: 'new',
      totalAmount: 1585000,
      notes: 'Kuryer yetkazganda kartadan yechib oladi',
      trackingCode: 'AQ-TRK-9550',
      items: {
        create: [
          {
            partId: allParts[12].id, // Delkor akkumulyator
            quantity: 1,
            price: allParts[12].price,
          },
        ],
      },
    },
  });

  console.log('Namuna buyurtmalar yaratildi: 3 ta buyurtma.');
  console.log('✅ Barcha ma\'lumotlar bazaga muvaffaqiyatli yuklandi!');
}

main()
  .catch((e) => {
    console.error('Seed xatoligi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
