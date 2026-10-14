'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, ArrowRight, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Vehicle } from '@/lib/types';

export default function PopularVehicles() {
  const router = useRouter();
  const { activeVehicle, setActiveVehicle, addToGarage } = useCart();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVehicles(data.data.slice(0, 8));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelectCar = (veh: Vehicle) => {
    addToGarage(veh);
    setActiveVehicle(veh);
    router.push(`/catalog?vehicleId=${veh.id}`);
  };

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Ommabop avtopark
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Avtomobillar bo‘yicha ehtiyot qismlar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              O‘z avtomobilingizni tanlang va faqat unga mos keladigan qismlarni ko‘ring
            </p>
          </div>

          <Link
            href="/garage"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            Mening garajimni ko‘rish{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {vehicles.map((car) => {
            const isActive = activeVehicle?.id === car.id;
            return (
              <div
                key={car.id}
                onClick={() => handleSelectCar(car)}
                className={`group cursor-pointer p-4 rounded-2xl border transition-all bg-white relative flex flex-col justify-between ${
                  isActive
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3" /> Faol
                  </span>
                )}

                <div>
                  <div className="h-28 w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative flex items-center justify-center">
                    {car.imageUrl ? (
                      <img
                        src={car.imageUrl}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Car className="w-10 h-10 text-slate-400" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                    {car.make}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {car.model}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    {car.yearFrom}
                    {car.yearTo ? `-${car.yearTo}` : '+'} • {car.bodyType}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                    {car.engine}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>Qismlarni tanlash</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
