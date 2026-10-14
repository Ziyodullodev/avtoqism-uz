'use client';

import React, { useState, useEffect } from 'react';
import { X, Car, Check, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Vehicle } from '@/lib/types';

interface VehicleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleSelectorModal({ isOpen, onClose }: VehicleSelectorModalProps) {
  const { activeVehicle, setActiveVehicle, savedGarageCars, addToGarage, removeFromGarage } = useCart();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVehicles(data.data);
          setMakes(data.makes);
          if (data.makes.length > 0 && !selectedMake) {
            setSelectedMake(data.makes[0]);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredModels = vehicles.filter((v) => v.make === selectedMake);
  const selectedVehicleObj = vehicles.find(
    (v) => v.make === selectedMake && v.model === selectedModel
  );

  const handleSelectCar = (veh: Vehicle) => {
    addToGarage(veh);
    setActiveVehicle(veh);
    onClose();
  };

  const handleClearFilter = () => {
    setActiveVehicle(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Avtomobilingizni tanlang</h3>
              <p className="text-xs text-slate-300">
                100% mos keluvchi ehtiyot qismlarini ko‘rish uchun avtomobilni belgilang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Mening saqlangan mashinalarim */}
          {savedGarageCars.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Mening Garajimdagi avtolar
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {savedGarageCars.map((car) => {
                  const isActive = activeVehicle?.id === car.vehicleId;
                  return (
                    <div
                      key={car.id}
                      onClick={() => {
                        setActiveVehicle(car.vehicle);
                        onClose();
                      }}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isActive
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {car.vehicle.make} {car.vehicle.model}
                          </div>
                          <div className="text-xs text-slate-500">
                            {car.vehicle.yearFrom}
                            {car.vehicle.yearTo ? `-${car.vehicle.yearTo}` : '+'} • {car.vehicle.engine}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isActive && (
                          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Tanlangan
                          </span>
                        )}
                        <button
                          title="O‘chirish"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromGarage(car.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Yangi avto tanlash */}
          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Yangi avtomobil tanlash (Katalogdan)
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-500">Avtomobillar yuklanmoqda...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Marka */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    1. Ishlab chiqaruvchi (Marka)
                  </label>
                  <select
                    value={selectedMake}
                    onChange={(e) => {
                      setSelectedMake(e.target.value);
                      setSelectedModel('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Markani tanlang</option>
                    {makes.map((mk) => (
                      <option key={mk} value={mk}>
                        {mk}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Model */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    2. Avtomobil modeli
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedMake}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Modelni tanlang</option>
                    {filteredModels.map((veh) => (
                      <option key={veh.id} value={veh.model}>
                        {veh.model} ({veh.yearFrom}
                        {veh.yearTo ? `-${veh.yearTo}` : '+'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Selected car details preview */}
            {selectedVehicleObj && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900">
                    {selectedVehicleObj.make} {selectedVehicleObj.model} ({selectedVehicleObj.generation || 'Standart'})
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap gap-2">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      Yillar: {selectedVehicleObj.yearFrom} - {selectedVehicleObj.yearTo || 'hozirgi'}
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      Dvigatel: {selectedVehicleObj.engine}
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      Yoqilg‘i: {selectedVehicleObj.fuelType}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectCar(selectedVehicleObj)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Belgilash va Garajga qo‘shish
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {activeVehicle ? (
            <button
              onClick={handleClearFilter}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
            >
              Tanlangan avtomobilni bekor qilish (Barcha qismlarni ko‘rish)
            </button>
          ) : (
            <span className="text-xs text-slate-500">Hozirda barcha avtomobillar uchun qismlar ko‘rsatilmoqda</span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
