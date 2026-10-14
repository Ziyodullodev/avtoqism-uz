'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileSearch,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Vehicle } from '@/lib/types';

export default function GaragePage() {
  const router = useRouter();
  const {
    savedGarageCars,
    activeVehicle,
    setActiveVehicle,
    addToGarage,
    removeFromGarage,
  } = useCart();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState('Chevrolet');
  const [selectedModel, setSelectedModel] = useState('Cobalt');
  const [plateNumber, setPlateNumber] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVehicles(data.data);
          setMakes(data.makes);
        }
      });
  }, []);

  const filteredModels = vehicles.filter((v) => v.make === selectedMake);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = vehicles.find((v) => v.make === selectedMake && v.model === selectedModel);
    if (matched) {
      addToGarage(matched, undefined, plateNumber.trim() || undefined, vinNumber.trim() || undefined);
      setShowAddModal(false);
      setPlateNumber('');
      setVinNumber('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Shaxsiy avtopark
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mening garajim
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Garajingizga avtomobillaringizni saqlang va qismlar qidirganda har safar model tanlashdan qutuling
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Yangi avto qo‘shish
        </button>
      </div>

      {/* Garage Cars Grid */}
      {savedGarageCars.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Garajingizda hali hech qanday avtomobil yo‘q
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Birinchi avtomobilingizni qo‘shing. Tizim butun internet do‘konni aynan sizning mashinangizga mos qismlar bo‘yicha filtrlaydi.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Avtomobil qo‘shish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedGarageCars.map((car) => {
            const isActive = activeVehicle?.id === car.vehicleId;

            return (
              <div
                key={car.id}
                className={`bg-white rounded-2xl border p-5 space-y-4 shadow-sm relative transition-all ${
                  isActive
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {isActive && (
                  <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Hozir faol
                  </span>
                )}

                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {car.vehicle.make} {car.vehicle.model}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {car.vehicle.yearFrom}
                      {car.vehicle.yearTo ? `-${car.vehicle.yearTo}` : '+'} • {car.vehicle.engine}
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {car.plateNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Davlat raqami:</span>
                      <span className="font-mono font-bold text-slate-900">{car.plateNumber}</span>
                    </div>
                  )}
                  {car.vin && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">VIN kod:</span>
                      <span className="font-mono text-slate-900">{car.vin}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Yoqilg‘i turi:</span>
                    <span className="text-slate-900 font-medium">{car.vehicle.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transmissiya:</span>
                    <span className="text-slate-900 font-medium">{car.vehicle.transmission}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {!isActive ? (
                    <button
                      onClick={() => setActiveVehicle(car.vehicle)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-center"
                    >
                      Faol avto sifatida tanlash
                    </button>
                  ) : (
                    <Link
                      href={`/catalog?vehicleId=${car.vehicleId}`}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors text-center flex items-center justify-center gap-1 shadow-sm"
                    >
                      Qismlarni ko‘rish <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  <button
                    onClick={() => removeFromGarage(car.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Garajdan o‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" /> Yangi avtomobil qo‘shish
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCar} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. Ishlab chiqaruvchi (Marka)
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    const first = vehicles.find((v) => v.make === e.target.value);
                    if (first) setSelectedModel(first.model);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {makes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. Avtomobil modeli
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filteredModels.map((v) => (
                    <option key={v.id} value={v.model}>
                      {v.model} ({v.yearFrom}{v.yearTo ? `-${v.yearTo}` : '+'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Davlat raqami (ixtiyoriy)
                </label>
                <input
                  type="text"
                  placeholder="01 A 777 AA"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  VIN raqami (ixtiyoriy)
                </label>
                <input
                  type="text"
                  maxLength={17}
                  placeholder="XWBJA52E..."
                  value={vinNumber}
                  onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
