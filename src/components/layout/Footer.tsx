import React from 'react';
import Link from 'next/link';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-16 border-t border-slate-800">
      {/* 4 Feature Badges */}
      <div className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">100% Original Sifat</h4>
                <p className="text-xs text-slate-400 mt-0.5">Sertifikatlangan ehtiyot qismlar va zavod kafolati</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Tezkor Yetkazib Berish</h4>
                <p className="text-xs text-slate-400 mt-0.5">Toshkentda 2-4 soatda, viloyatlarga BTS orqali 24 soatda</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">VIN Aniq Moslik</h4>
                <p className="text-xs text-slate-400 mt-0.5">Avtomobil VIN kodi orqali xatosiz tanlash imkoniyati</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">14 Kun Qaytarish</h4>
                <p className="text-xs text-slate-400 mt-0.5">Mos kelmagan taqdirda to‘liq qaytarish yoki almashtirish</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white">Avto<span className="text-blue-500">Qism</span>.uz</span>
                <span className="ml-2 text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase">BMI</span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Avtomobil ehtiyot qismlarini katalog, OEM artikul va VIN kod bo‘yicha tezkor qidirish hamda sotib olishning zamonaviy elektron platformasi. O‘zbekistondagi barcha ommabop avtomobillar uchun original va sifatli analoglar.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+998 (71) 200-49-49 / +998 (90) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>info@avtoqism.uz</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Toshkent shahri, Chilonzor tumani, Bunyodkor shoh ko‘chasi, 42-uy</span>
              </div>
            </div>
          </div>

          {/* Col 2: Katalog */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3.5">Katalog toifalari</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog?category=tormoz-tizimi" className="hover:text-white transition-colors">
                  Tormoz kolodkalari va disklari
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=dvigatel-tizimi" className="hover:text-white transition-colors">
                  Dvigatel va GRM mexanizmi
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=filtrlar" className="hover:text-white transition-colors">
                  Moy, havo va salon filtrlari
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=xodovoy-va-podveska" className="hover:text-white transition-colors">
                  Amortizatorlar va richaglar
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=moylar-va-avtokimyo" className="hover:text-white transition-colors">
                  Motor moylari va antifriz
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=elektr-va-yoritish" className="hover:text-white transition-colors">
                  Akkumulyatorlar va faralar
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=transmissiya" className="hover:text-white transition-colors">
                  Stseplenie va uzatmalar qutisi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ommabop avtomobillar */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3.5">Avtomobillar bo‘yicha</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog?q=Cobalt" className="hover:text-white transition-colors">
                  Chevrolet Cobalt
                </Link>
              </li>
              <li>
                <Link href="/catalog?q=Gentra" className="hover:text-white transition-colors">
                  Chevrolet Gentra / Lacetti
                </Link>
              </li>
              <li>
                <Link href="/catalog?q=Tracker" className="hover:text-white transition-colors">
                  Chevrolet Tracker 2
                </Link>
              </li>
              <li>
                <Link href="/catalog?q=Onix" className="hover:text-white transition-colors">
                  Chevrolet Onix
                </Link>
              </li>
              <li>
                <Link href="/catalog?q=Nexia" className="hover:text-white transition-colors">
                  Chevrolet Nexia 3
                </Link>
              </li>
              <li>
                <Link href="/catalog?q=Damas" className="hover:text-white transition-colors">
                  Chevrolet Damas / Labo
                </Link>
              </li>
              <li>
                <Link href="/catalog?q=BYD" className="hover:text-white transition-colors">
                  BYD Song Plus DM-i
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Foydali xizmatlar */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3.5">Foydali xizmatlar</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/vin-search" className="hover:text-white transition-colors flex items-center gap-1.5 text-blue-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> VIN Kod Dekoderi
                </Link>
              </li>
              <li>
                <Link href="/garage" className="hover:text-white transition-colors">
                  Mening garajim
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white transition-colors">
                  Buyurtmani kuzatish
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Xarid savati
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-amber-400">
                  Administrator paneli
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-300 mb-2">Qabul qilinadigan to‘lovlar:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 text-[10px] font-bold border border-slate-700">
                  Click
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px] font-bold border border-slate-700">
                  Payme
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 text-[10px] font-bold border border-slate-700">
                  Uzum Bank
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                  Naqd pul / Kuryer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic BMI Note & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>
              Bitiruv Malakaviy Ishi (BMI): &ldquo;Avtomobil ehtiyot qismlarini katalog bo‘yicha qidirish va sotib olish internet do‘konini ishlab chiqish&rdquo;
            </span>
          </div>
          <div className="text-slate-500">
            © {new Date().getFullYear()} AvtoQism.uz — Barcha huquqlar himoyalangan.
          </div>
        </div>
      </div>
    </footer>
  );
}
