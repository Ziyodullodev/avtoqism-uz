'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileSearch,
  CheckCircle2,
  AlertCircle,
  Car,
  ShieldCheck,
  Plus,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { VinDecodedInfo } from '@/lib/vin-decoder';
import { Part, Vehicle } from '@/lib/types';
import PartCard from '@/components/parts/PartCard';

function VinSearchContent() {
  const searchParams = useSearchParams();
  const initialVin = searchParams.get('vin') || '';
  const { addToGarage, setActiveVehicle } = useCart();

  const [vinInput, setVinInput] = useState(initialVin);
  const [loading, setLoading] = useState(false);
  const [decoded, setDecoded] = useState<VinDecodedInfo | null>(null);
  const [matchedVehicle, setMatchedVehicle] = useState<Vehicle | null>(null);
  const [compatibleParts, setCompatibleParts] = useState<Part[]>([]);
  const [error, setError] = useState('');
  const [savedToGarage, setSavedToGarage] = useState(false);

  const performVinSearch = (vinToTest: string) => {
    if (!vinToTest.trim()) return;
    setLoading(true);
    setError('');
    setSavedToGarage(false);

    fetch('/api/vin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vin: vinToTest }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDecoded(data.decoded);
          setMatchedVehicle(data.matchedVehicle);
          setCompatibleParts(data.compatibleParts || []);
        } else {
          setError(data.error || 'VIN kodni tekshirishda xatolik yuz berdi');
          setDecoded(null);
          setMatchedVehicle(null);
          setCompatibleParts([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Server bilan aloqa uzildi');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialVin) {
      performVinSearch(initialVin);
    }
  }, [initialVin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVinSearch(vinInput);
  };

  const handleSaveToGarage = () => {
    if (matchedVehicle) {
      addToGarage(matchedVehicle, undefined, undefined, decoded?.vin);
      setActiveVehicle(matchedVehicle);
      setSavedToGarage(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Title & Introduction */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <FileSearch className="w-4 h-4 text-blue-600" />
          Avtomatlashtirilgan VIN dekoder
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          VIN kod bo‘yicha ehtiyot qismlarni qidirish
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Avtomobilingizning 17 xonali VIN kodini kiriting. Tizim zavod konfiguratsiyasini dekodlaydi va 100% mos ehtiyot qismlarini tanlab beradi.
        </p>
      </div>

      {/* VIN Input Box */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            17 xonali VIN kodni kiriting:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={17}
              placeholder="Masalan: XWBJA52E0M8192034"
              value={vinInput}
              onChange={(e) => setVinInput(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-base font-mono tracking-wider uppercase font-bold outline-none focus:ring-2 focus:ring-blue-500 placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <FileSearch className="w-4 h-4" />
              {loading ? 'Dekodlanmoqda...' : 'Tekshirish'}
            </button>
          </div>
        </form>

        {/* Quick test buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Tezkor sinov uchun namuna VIN kodlar (bosing):
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setVinInput('XWBJA52E0M8192034');
                performVinSearch('XWBJA52E0M8192034');
              }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors"
            >
              Chevrolet Cobalt (Asaka)
            </button>
            <button
              type="button"
              onClick={() => {
                setVinInput('KL1JF69Y0L9481923');
                performVinSearch('KL1JF69Y0L9481923');
              }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors"
            >
              Chevrolet Gentra (Lacetti)
            </button>
            <button
              type="button"
              onClick={() => {
                setVinInput('KL79K2SE5N7381920');
                performVinSearch('KL79K2SE5N7381920');
              }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors"
            >
              Chevrolet Tracker 2
            </button>
            <button
              type="button"
              onClick={() => {
                setVinInput('LGXCE32E5N4829103');
                performVinSearch('LGXCE32E5N4829103');
              }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors"
            >
              BYD Song Plus DM-i
            </button>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Decoded Vehicle Results */}
      {decoded && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Muvaffaqiyatli aniqlandi
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {decoded.suggestedMake} {decoded.suggestedModel}
              </h2>
              <div className="text-xs font-mono text-slate-500 mt-1">
                VIN: <strong className="text-slate-800">{decoded.vin}</strong>
              </div>
            </div>

            {matchedVehicle && (
              <button
                onClick={handleSaveToGarage}
                disabled={savedToGarage}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  savedToGarage
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
              >
                {savedToGarage ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Garajga saqlandi
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Mening Garajimga saqlash
                  </>
                )}
              </button>
            )}
          </div>

          {/* Technical Specs Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Davlat:</span>
              <div className="font-bold text-slate-900">{decoded.country}</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Ishlab chiqaruvchi:</span>
              <div className="font-bold text-slate-900">{decoded.manufacturer}</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Model yili:</span>
              <div className="font-bold text-slate-900">
                {decoded.modelYear ? `${decoded.modelYear}-yil` : 'Aniqlanmadi'}
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Dvigatel / Tizim:</span>
              <div className="font-bold text-slate-900">
                {matchedVehicle ? matchedVehicle.engine : 'Standart DOHC'}
              </div>
            </div>
          </div>

          {/* Compatible Parts Grid */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ushbu VIN kodli avtomobilga 100% mos ehtiyot qismlar ({compatibleParts.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Katalogimizdagi faqat shu avtomobil modifikatsiyasiga to‘g‘ri keluvchi qismlar saralandi
                </p>
              </div>
            </div>

            {compatibleParts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {compatibleParts.map((part) => (
                  <PartCard key={part.id} part={part} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Ushbu avtomobil uchun mos qismlar tayyorlanmoqda.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Educational FAQ: What is VIN? */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          VIN kod nima va uni qayerdan topish mumkin?
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          <strong>VIN (Vehicle Identification Number)</strong> — har bir avtomobilning noyob 17 belgidan iborat xalqaro identifikatsiya raqamidir. Unda mashina qaysi mamlakatda, qaysi zavodda, qaysi yili ishlab chiqarilgani, dvigatel hajmi va tormoz tizimi kabi barcha texnik ma‘lumotlar shifrlangan bo‘ladi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
            <span className="text-cyan-400 font-bold">1. Qayd qilish guvohnomasi</span>
            <p className="text-slate-300">
              Tex-pasportdagi &ldquo;Kuzov raqami (Kuzov №)&rdquo; yoki &ldquo;VIN&rdquo; qatorida yoziladi.
            </p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
            <span className="text-cyan-400 font-bold">2. Old oyna ostida</span>
            <p className="text-slate-300">
              Haydovchi tomonida old parpres oynasining pastki chap burchagidagi maxsus oynachada ko‘rinadi.
            </p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
            <span className="text-cyan-400 font-bold">3. Eshik tirgagi yoki kapot ostida</span>
            <p className="text-slate-300">
              Haydovchi eshigi yoni (stoyka)dagi metall yorliqda yoki dvigatel bo‘lmasidagi chashkada urilgan bo‘ladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VinSearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">VIN qidiruv yuklanmoqda...</div>}>
      <VinSearchContent />
    </Suspense>
  );
}
