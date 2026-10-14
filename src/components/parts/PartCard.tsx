'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Part } from '@/lib/types';

interface PartCardProps {
  part: Part;
}

export default function PartCard({ part }: PartCardProps) {
  const { addToCart, isInWishlist, toggleWishlist, formatPrice, activeVehicle } = useCart();

  let images = [];
  try {
    images = typeof part.images === 'string' ? JSON.parse(part.images) : part.images;
  } catch {
    images = [];
  }
  const mainImage =
    images[0] ||
    'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=500&q=80';

  const inWishlist = isInWishlist(part.id);

  // Check compatibility with active vehicle
  const isCompatibleWithActive =
    activeVehicle &&
    part.compatibility?.some((c) => c.vehicleId === activeVehicle.id);

  const discountPercent =
    part.oldPrice && part.oldPrice > part.price
      ? Math.round(((part.oldPrice - part.price) / part.oldPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {part.badge && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              {part.badge}
            </span>
          )}
          {discountPercent && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {part.isOriginal && (
            <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Original
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(part.id);
          }}
          className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-colors shadow-sm ${
            inWishlist
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-red-500'
          }`}
          title="Sevimlilarga qo‘shish"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link href={`/part/${part.slug}`} className="block relative pt-4 px-4 overflow-hidden">
        <div className="h-44 w-full rounded-xl bg-slate-50 overflow-hidden relative flex items-center justify-center">
          <img
            src={mainImage}
            alt={part.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & OEM */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-blue-600">{part.brand}</span>
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-600">
              {part.oemNumber}
            </span>
          </div>

          {/* Title */}
          <Link href={`/part/${part.slug}`}>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {part.name}
            </h3>
          </Link>

          {/* Active Car Fitment Badge */}
          {activeVehicle && (
            <div className="mt-2">
              {isCompatibleWithActive ? (
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{activeVehicle.model} uchun mos</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span>Moslik tekshirilmagan</span>
                </div>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-slate-800">{part.rating}</span>
            <span>({part.reviewCount || 12} ta sharh)</span>
          </div>
        </div>

        {/* Pricing and Cart Button */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            {part.oldPrice && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatPrice(part.oldPrice)}
              </div>
            )}
            <div className="text-base font-extrabold text-slate-900">
              {formatPrice(part.price)}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Omborda {part.stock} {part.unit} bor
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToCart(part, 1)}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105 shrink-0 flex items-center justify-center"
            title="Savatga qo‘shish"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
