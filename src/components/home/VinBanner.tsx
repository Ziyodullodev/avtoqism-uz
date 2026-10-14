'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileSearch, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function VinBanner() {
  const router = useRouter();
  const [vin, setVin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin.trim()) return;
    router.push(`/vin-search?vin=${encodeURIComponent(vin.trim())}`);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              100% Aniq moslik kafolati
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Ehtiyot qism xato kelishidan charchadingizmi?
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              17 ta belgili VIN kod orqali avtomobilingizning ishlab chiqarilgan zavodi, komplektatsiyasi, motor hajmi va tormoz tizimi avtomatik aniqlanadi. Faqat sizning mashinangizga tushadigan original qismlar chiqadi.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> O‘zbekiston (Asaka) UzAuto VINlari
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> GM Korea, BYD, Kia, Hyundai
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bepul tekshirish
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>VIN kodni kiriting (17 ta belgi):</span>
                <Link href="/vin-search" className="text-cyan-300 hover:underline flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> VIN qayerda bo‘ladi?
                </Link>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={17}
                  placeholder="XWBJA52E0M8192034..."
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-mono tracking-wider text-sm font-semibold uppercase placeholder:font-sans placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <FileSearch className="w-4 h-4" /> VIN bo‘yicha tekshirish <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
