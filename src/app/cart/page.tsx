'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, formatPrice } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'AVTO2026') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else {
      setPromoError('Bunday promokod mavjud emas. Sinab ko‘ring: AVTO2026');
    }
  };

  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const deliveryCost = cartTotal > 500000 || cartTotal === 0 ? 0 : 25000;
  const grandTotal = cartTotal - discountAmount + deliveryCost;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Savatingiz hozircha bo‘sh</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Avtomobilingiz uchun zarur ehtiyot qismlarni katalogimizdan qidirib toping va savatga qo‘shing.
        </p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all"
        >
          Katalogga o‘tish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        Xarid savati ({cart.length} ta mahsulot)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mahsulot ma‘lumotlari
            </span>
            <button
              onClick={clearCart}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Savatni tozalash
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {cart.map((item) => {
              let images = [];
              try {
                images = JSON.parse(item.part.images);
              } catch {
                images = [];
              }
              const img = images[0] || 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=300&q=80';

              return (
                <div key={item.part.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={img}
                      alt={item.part.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                    />
                    <div>
                      <div className="text-xs font-bold text-blue-600 flex items-center gap-2">
                        <span>{item.part.brand}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-600">OEM: {item.part.oemNumber}</span>
                      </div>
                      <Link
                        href={`/part/${item.part.slug}`}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {item.part.name}
                      </Link>
                      <div className="text-xs text-slate-500 mt-1">
                        Birlik narxi: {formatPrice(item.part.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.part.id, item.quantity - 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.part.id, item.quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        {formatPrice(item.part.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.part.id)}
                        className="text-[11px] text-red-500 hover:underline mt-0.5"
                      >
                        O‘chirish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/catalog"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              ← Xaridlarni davom ettirish
            </Link>
          </div>
        </div>

        {/* Right: Summary Box (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Buyurtma hisob-kitobi
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Chegirma promokodi:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="AVTO2026"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 uppercase outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Qo‘llash
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 10% chegirma muvaffaqiyatli qo‘llandi!
                </div>
              )}
              {promoError && (
                <div className="text-[11px] text-red-500">{promoError}</div>
              )}
            </form>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Mahsulotlar summasi:</span>
                <span className="font-semibold text-slate-900">{formatPrice(cartTotal)}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Chegirma (10%):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Yetkazib berish:</span>
                <span className="font-semibold text-slate-900">
                  {deliveryCost === 0 ? (
                    <span className="text-emerald-600 font-bold">Bepul (500k+ dan oshdi)</span>
                  ) : (
                    formatPrice(deliveryCost)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base font-extrabold text-slate-900">
                <span>Jami to‘lov:</span>
                <span className="text-2xl text-blue-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              Rasmiylashtirishga o‘tish <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-[11px] text-slate-500 space-y-1.5 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Xavfsiz to‘lov tizimlari (Click, Payme, Uzum)</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Tezkor eshikkacha yetkazib berish xizmati</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
