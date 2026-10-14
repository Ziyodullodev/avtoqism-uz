'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Printer,
  ArrowRight,
  Truck,
  Phone,
  Clock,
  MapPin,
  CreditCard,
  Car,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '@/lib/types';

export default function OrderSuccessPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const { orderNumber } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (amount?: number | null) => {
    if (!amount) return '0 so‘m';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so‘m';
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-xs">Buyurtma ma‘lumotlari tayyorlanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Top Success Badge */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Buyurtmangiz muvaffaqiyatli qabul qilindi!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Tez orada operatorimiz siz bilan bog‘lanadi va buyurtmani ombordan yetkazib berishga topshiradi.
        </p>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-blue-600 tracking-wider">
              Elektron kvitansiya / Chek
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              № {order?.orderNumber || orderNumber}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Sana: {order?.createdAt ? new Date(order.createdAt).toLocaleString('uz-UZ') : new Date().toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs text-slate-500">Trek-raqam (Kuzatuv):</span>
            <span className="font-mono font-bold text-sm bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800 mt-0.5">
              {order?.trackingCode || 'AQ-TRK-78192'}
            </span>
          </div>
        </div>

        {/* Customer & Delivery details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="text-slate-400 font-semibold mb-1">Mijoz:</div>
            <div className="font-bold text-slate-900">{order?.customerName}</div>
            <div className="text-slate-600">{order?.customerPhone}</div>
            {order?.customerEmail && <div className="text-slate-500">{order.customerEmail}</div>}
          </div>

          <div>
            <div className="text-slate-400 font-semibold mb-1">Yetkazib berish manzili:</div>
            <div className="font-bold text-slate-900">{order?.region}</div>
            <div className="text-slate-600">{order?.cityAddress}</div>
            <div className="text-blue-600 font-medium mt-1">
              To‘lov: {order?.paymentMethod?.toUpperCase()} ({order?.paymentStatus === 'paid' ? 'To‘langan' : 'Yetkazilganda to‘lanadi'})
            </div>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Buyurtma qilingan tovarlar
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {order?.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{item.part.name}</div>
                    <div className="text-[11px] text-slate-500">
                      OEM: {item.part.oemNumber} • {item.part.brand}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.quantity} dona × {formatPrice(item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Yetkazib berish to‘lovi:</span>
            <span className="font-semibold text-slate-900">
              {order?.deliveryCost === 0 ? 'Bepul' : formatPrice(order?.deliveryCost)}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-base font-extrabold text-slate-900">
            <span>Umumiy qiymat:</span>
            <span className="text-2xl text-blue-600">{formatPrice(order?.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold print:hidden">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" /> Chekni chop etish
        </button>

        <Link
          href={`/tracking?code=${order?.orderNumber || orderNumber}`}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-colors"
        >
          <Package className="w-4 h-4" /> Buyurtmani kuzatish
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-colors"
        >
          Bosh sahifaga qaytish <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
