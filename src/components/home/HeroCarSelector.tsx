'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Car, FileSearch, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Vehicle } from '@/lib/types';

export default function HeroCarSelector() {
  const router = useRouter();
  const { addToGarage, setActiveVehicle } = useCart();

  const [activeTab, setActiveTab] = useState<'car' | 'vin'>('car');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('Chevrolet');
  const [selectedModel, setSelectedModel] = useState<string>('Cobalt');
  const [selectedYear, setSelectedYear] = useState<string>('2022');
  const [vinInput, setVinInput] = useState<string>('');

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVehicles(data.data);
          setMakes(data.makes);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredModels = vehicles.filter((v) => v.make === selectedMake);

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = vehicles.find((v) => v.make === selectedMake && v.model === selectedModel);
    if (matched) {
      addToGarage(matched);
      setActiveVehicle(matched);
      router.push(`/catalog?vehicleId=${matched.id}`);
    } else {
      router.push(`/catalog?q=${encodeURIComponent(selectedMake + ' ' + selectedModel)}`);
    }
  };

  const handleVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vinInput.trim()) return;
    router.push(`/vin-search?vin=${encodeURIComponent(vinInput.trim())}`);
  };

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden py-12 lg:py-16">
      {/* Background radial gradient and subtle grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/40 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Title and Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              O‘zbekistondagi eng yirik avto ehtiyot qismlar katalogi
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Avtomobilingiz uchun <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">100% mos</span> original ehtiyot qismlar
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Model, OEM artikul yoki VIN kod orqali avtomobilingizga aniq to‘g‘ri keladigan tormoz, dvigatel, podveska va texnik moylarni bir zumda toping va buyurtma bering.
            </p>

            {/* Feature Bullets */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 10 000+ Sertifikatlangan tovarlar
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> VIN bo‘yicha kafolatlangan moslik
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Butun O‘zbekiston bo‘ylab yetkazish
              </span>
            </div>
          </div>

          {/* Right Selector Box */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-2xl text-slate-900 border border-slate-100">
              {/* Selector Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => setActiveTab('car')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'car'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Car className="w-4 h-4" /> Avtomobil bo‘yicha
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('vin')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'vin'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileSearch className="w-4 h-4" /> VIN kod bo‘yicha
                </button>
              </div>

              {/* Tab 1: Car Selection Form */}
              {activeTab === 'car' && (
                <form onSubmit={handleCarSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      1. Ishlab chiqaruvchi (Marka)
                    </label>
                    <select
                      value={selectedMake}
                      onChange={(e) => {
                        setSelectedMake(e.target.value);
                        const first = vehicles.find((v) => v.make === e.target.value);
                        if (first) setSelectedModel(first.model);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    >
                      {makes.map((mk) => (
                        <option key={mk} value={mk}>
                          {mk}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2. Avtomobil modeli
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    >
                      {filteredModels.map((veh) => (
                        <option key={veh.id} value={veh.model}>
                          {veh.model} ({veh.yearFrom}
                          {veh.yearTo ? `-${veh.yearTo}` : '+'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. Ishlab chiqarilgan yili
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    >
                      {Array.from({ length: 15 }, (_, i) => 2025 - i).map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}-yil
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Search className="w-4 h-4" /> Mos ehtiyot qismlarni topish
                  </button>
                </form>
              )}

              {/* Tab 2: VIN Input Form */}
              {activeTab === 'vin' && (
                <form onSubmit={handleVinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      17 ta belgili VIN kodni kiriting
                    </label>
                    <input
                      type="text"
                      maxLength={17}
                      placeholder="Masalan: XWBJA52E0M..."
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono tracking-wider text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none uppercase placeholder:font-sans"
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      VIN kod tex-pasport (qayd qilish guvohnomasi)da yozilgan bo‘ladi.
                    </p>
                  </div>

                  {/* Sample VIN buttons for fast testing */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Sinab ko‘rish uchun namunaviy VIN kodlar:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setVinInput('XWBJA52E0M8192034')}
                        className="text-[10px] font-mono bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 transition-colors"
                      >
                        Cobalt (Asaka)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVinInput('KL1JF69Y0L9481923')}
                        className="text-[10px] font-mono bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 transition-colors"
                      >
                        Gentra (Lacetti)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVinInput('KL79K2SE5N7381920')}
                        className="text-[10px] font-mono bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 transition-colors"
                      >
                        Tracker 2
                      </button>
                      <button
                        type="button"
                        onClick={() => setVinInput('LGXCE32E5N4829103')}
                        className="text-[10px] font-mono bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 transition-colors"
                      >
                        BYD Song Plus
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <FileSearch className="w-4 h-4" /> VIN bo‘yicha dekodlash va qidirish
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
