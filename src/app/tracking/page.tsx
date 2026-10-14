'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  AlertCircle,
  Car,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Order } from '@/lib/types';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);

    fetch(`/api/orders/${encodeURIComponent(code.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.data);
        } else {
          setOrder(null);
          setError('Ushbu raqam bilan buyurtma topilmadi. Raqamni tekshirib qayta kiriting.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Qidirishda xatolik yuz berdi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialCode) {
      fetchOrder(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchCode);
  };

  // Status mapping
  const steps = [
    { key: 'new', label: 'Buyurtma qabul qilindi', desc: 'Operator tomonidan tasdiqlangan', icon: Clock },
    { key: 'processing', label: 'Ombor yig‘moqda', desc: 'Ehtiyot qismlar qadoqlanmoqda', icon: Package },
    { key: 'shipped', label: 'Yetkazilmoqda', desc: 'Kuryer yoki pochtaga topshirildi', icon: Truck },
    { key: 'delivered', label: 'Yetkazib berildi', desc: 'Mijoz qabul qilib oldi', icon: Home },
  ];

  const getStepStatus = (stepKey: string, currentStatus?: string) => {
    const orderIndex = ['new', 'processing', 'shipped', 'delivered'];
    const currentIndex = orderIndex.indexOf(currentStatus || 'new');
    const thisIndex = orderIndex.indexOf(stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'current';
    return 'pending';
  };

  const formatPrice = (amount?: number | null) => {
    if (!amount) return '0 so‘m';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so‘m';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <Truck className="w-3.5 h-3.5 text-blue-600" />
          Tezkor onlayn kuzatuv
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Buyurtma holatini kuzatish
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Buyurtma raqami (masalan: AQ-2026-8812) yoki trek-kod orqali holatni bilib oling
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Buyurtma raqami: AQ-2026-..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Qidirilmoqda...' : 'Kuzatish'}
          </button>
        </form>

        {/* Sample click-to-try chips */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span>Namuna kodlar:</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode('AQ-2026-8812');
              fetchOrder('AQ-2026-8812');
            }}
            className="text-blue-600 hover:underline font-mono"
          >
            AQ-2026-8812
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode('AQ-2026-9140');
              fetchOrder('AQ-2026-9140');
            }}
            className="text-blue-600 hover:underline font-mono"
          >
            AQ-2026-9140
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Tracking Progress Card */}
      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs uppercase font-bold text-blue-600">
                Buyurtma topildi
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                № {order.orderNumber}
              </h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(order.createdAt).toLocaleDateString('uz-UZ')} da rasmiylashtirilgan
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 block">Jami summa:</span>
              <span className="text-2xl font-extrabold text-blue-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* 4-Step Progress Line */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
              Yetkazib berish bosqichlari
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const status = getStepStatus(st.key, order.status);

                return (
                  <div
                    key={st.key}
                    className={`p-4 rounded-xl border flex flex-col items-start justify-between space-y-2 transition-all ${
                      status === 'current'
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                        : status === 'completed'
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : status === 'current'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">0{idx + 1}</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900">{st.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                    </div>

                    {status === 'current' && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Hozirgi holat
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Items details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            {/* Left: Customer Info */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Yetkazish tafsilotlari
              </h4>
              <div className="space-y-1 text-slate-600">
                <div><strong>Qabul qiluvchi:</strong> {order.customerName}</div>
                <div><strong>Telefon:</strong> {order.customerPhone}</div>
                <div><strong>Manzil:</strong> {order.region}, {order.cityAddress}</div>
                <div><strong>Trek-kod:</strong> <span className="font-mono font-bold text-slate-800">{order.trackingCode}</span></div>
              </div>
            </div>

            {/* Right: Items */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-blue-600" /> Buyurtmadagi tovarlar ({order.items?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 divide-y divide-slate-200">
                {order.items?.map((it) => (
                  <div key={it.id} className="pt-2 first:pt-0 flex justify-between items-center">
                    <span className="truncate pr-2 font-medium text-slate-800">
                      {it.part.name}
                    </span>
                    <span className="font-bold text-slate-900 whitespace-nowrap">
                      {it.quantity} dona
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Kuzatuv yuklanmoqda...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
