import React from 'react';
import Link from 'next/link';
import {
  Disc,
  Cog,
  Filter,
  Activity,
  Droplet,
  Zap,
  RotateCw,
  Shield,
  ArrowRight,
} from 'lucide-react';

const CATEGORY_CARDS = [
  {
    name: 'Tormoz tizimi',
    slug: 'tormoz-tizimi',
    desc: 'Kolodkalar, disklar, barabanlar, shlanglar va ABS datchiklari',
    icon: Disc,
    badge: 'Kafolatli',
    color: 'from-rose-500/10 to-orange-500/10 text-rose-600 border-rose-200',
  },
  {
    name: 'Dvigatel va mexanizmlar',
    slug: 'dvigatel-tizimi',
    desc: 'GRM tasmalar, porshenlar, klapanlar, shamlar (svecha) va qistirmalar',
    icon: Cog,
    badge: 'Original',
    color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200',
  },
  {
    name: 'Filtrlar',
    slug: 'filtrlar',
    desc: 'Moy, havo, salon (ko‘mirli) va yoqilg‘i filtrlari to‘plamlari',
    icon: Filter,
    badge: 'Xit savdo',
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200',
  },
  {
    name: 'Xodovoy va podveska',
    slug: 'xodovoy-va-podveska',
    desc: 'Amortizatorlar, richaglar, sharovoy, prujinalar, rul uchliklari',
    icon: Activity,
    badge: 'Chidamli',
    color: 'from-amber-500/10 to-yellow-500/10 text-amber-600 border-amber-200',
  },
  {
    name: 'Moylar va avtokimyo',
    slug: 'moylar-va-avtokimyo',
    desc: 'Sintetik motor moylari 5W-30, dexos2, antifriz G12+, ATF korobka moyi',
    icon: Droplet,
    badge: '100% Original',
    color: 'from-cyan-500/10 to-sky-500/10 text-cyan-600 border-cyan-200',
  },
  {
    name: 'Elektr va optika',
    slug: 'elektr-va-yoritish',
    desc: 'Akkumulyatorlar, generatorlar, starterlar, Philips H4/H7 lampalar',
    icon: Zap,
    badge: 'Kafolat',
    color: 'from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-200',
  },
  {
    name: 'Transmissiya va uzatmalar',
    slug: 'transmissiya',
    desc: 'Valeo stseplenie komplekti, granatalar (ShRUS), privodlar',
    icon: RotateCw,
    badge: 'Koreya OEM',
    color: 'from-orange-500/10 to-amber-500/10 text-orange-600 border-orange-200',
  },
  {
    name: 'Kuzov va oynalar',
    slug: 'kuzov-va-optika',
    desc: 'Old va orqa bamperlar, oynatozalagich cho‘tkalari (dvoriklar)',
    icon: Shield,
    badge: 'Zavod',
    color: 'from-slate-500/10 to-zinc-500/10 text-slate-700 border-slate-200',
  },
];

export default function FeatureCategories() {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Asosiy bo‘limlar
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Katalog toifalari bo‘yicha qidiruv
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            Barcha toifalarni ko‘rish{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/catalog?category=${cat.slug}`}
                className="group relative p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center border`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Katalogga o‘tish</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
