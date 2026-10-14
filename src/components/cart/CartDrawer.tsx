'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, formatPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold">Savatingiz ({cart.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">Savat bo‘sh</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Katalogdan o‘zingizga kerakli ehtiyot qismlarni tanlang va xaridlarni davom ettiring
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow"
                >
                  Katalogga o‘tish
                </button>
              </div>
            ) : (
              cart.map((item) => {
                let images = [];
                try {
                  images = JSON.parse(item.part.images);
                } catch {
                  images = [];
                }
                const firstImg = images[0] || 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=300&q=80';

                return (
                  <div key={item.part.id} className="py-4 flex gap-3.5 items-start">
                    <img
                      src={firstImg}
                      alt={item.part.name}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-blue-600">
                        {item.part.brand} • {item.part.oemNumber}
                      </div>
                      <h4 className="text-sm font-medium text-slate-900 truncate">
                        {item.part.name}
                      </h4>
                      <div className="text-sm font-bold text-slate-900 mt-1">
                        {formatPrice(item.part.price)}
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.part.id, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-200 font-medium text-sm transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-0.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.part.id, item.quantity + 1)}
                            className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-200 font-medium text-sm transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.part.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Jami tovarlar:</span>
                <span className="font-bold text-slate-900">{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% kafolatlangan va original sifat</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="py-3 px-4 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-xl text-center transition-colors"
                >
                  Savatni ko‘rish
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl text-center shadow-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  Buyurtma berish <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
