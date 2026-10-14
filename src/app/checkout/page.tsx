'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand viloyati',
  'Farg‘ona viloyati',
  'Andijon viloyati',
  'Namangan viloyati',
  'Buxoro viloyati',
  'Xorazm viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Navoiy viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Qoraqalpog‘iston Respublikasi',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, formatPrice } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [region, setRegion] = useState('Toshkent shahri');
  const [cityAddress, setCityAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier_fast' | 'standard_bts' | 'pickup'>('courier_fast');
  const [paymentMethod, setPaymentMethod] = useState<'click' | 'payme' | 'uzumbank' | 'cash_on_delivery'>('click');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Delivery calculation
  let deliveryCost = 25000;
  if (deliveryMethod === 'pickup') {
    deliveryCost = 0;
  } else if (deliveryMethod === 'standard_bts') {
    deliveryCost = 35000;
  } else if (deliveryMethod === 'courier_fast') {
    deliveryCost = cartTotal > 500000 ? 0 : 25000;
  }

  const grandTotal = cartTotal + deliveryCost;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Savatingizda tovar yo‘q</h2>
        <p className="text-slate-500 text-sm">Buyurtma berish uchun avval savatga ehtiyot qismlarni qo‘shing.</p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
        >
          Katalogga o‘tish
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !customerPhone.trim() || !cityAddress.trim()) {
      setError('Iltimos, ism, telefon raqam va manzilni to‘liq kiriting.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail: customerEmail.trim() || undefined,
        region,
        cityAddress,
        deliveryMethod,
        deliveryCost,
        paymentMethod,
        notes: notes.trim() || undefined,
        items: cart.map((item) => ({
          partId: item.part.id,
          quantity: item.quantity,
          price: item.part.price,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Buyurtmani rasmiylashtirishda xatolik');
      }

      // Order created successfully
      const createdOrderNumber = data.data.orderNumber;
      clearCart();
      router.push(`/order-success/${createdOrderNumber}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        Buyurtmani rasmiylashtirish
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Xaridor ma'lumotlari */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-3 border-b border-slate-100">
                <User className="w-4 h-4 text-blue-600" />
                1. Qabul qiluvchi ma‘lumotlari
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ism va Familiya <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Sardor Rustamov"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telefon raqam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Elektron pochta (ixtiyoriy)
                  </label>
                  <input
                    type="email"
                    placeholder="sardor@example.com (Chek va xabarnomalar uchun)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Yetkazib berish manzili */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600" />
                2. Yetkazib berish manzili va usuli
              </h3>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Viloyat / Shahar <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {REGIONS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Aniq manzil (Tuman, ko‘cha, uy, xonadon) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Chilonzor 9-mavze, 14-uy, 23-xonadon"
                      value={cityAddress}
                      onChange={(e) => setCityAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Delivery options radio */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Yetkazib berish xizmati turi:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        deliveryMethod === 'courier_fast'
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'courier_fast'}
                        onChange={() => setDeliveryMethod('courier_fast')}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900">Tezkor kuryer</span>
                      </div>
                      <span className="text-[11px] text-slate-500">2-4 soat ichida eshikkacha</span>
                      <span className="text-xs font-bold text-blue-700 mt-2">
                        {cartTotal > 500000 ? 'BEPUL' : '25 000 so‘m'}
                      </span>
                    </label>

                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        deliveryMethod === 'standard_bts'
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'standard_bts'}
                        onChange={() => setDeliveryMethod('standard_bts')}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-slate-900">BTS / Fargo pochta</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Viloyatlarga 24-48 soat</span>
                      <span className="text-xs font-bold text-purple-700 mt-2">35 000 so‘m</span>
                    </label>

                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900">Olib ketish</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Toshkent omboridan bepul</span>
                      <span className="text-xs font-bold text-emerald-700 mt-2">0 so‘m</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kuryer uchun qo‘shimcha izoh (ixtiyoriy)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Masalan: Domofon kodi 45, yetib kelganda qo‘ng‘iroq qiling..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. To'lov turi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-blue-600" />
                3. To‘lov usulini tanlang
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <label
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center text-center justify-between transition-all ${
                    paymentMethod === 'click'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'click'}
                    onChange={() => setPaymentMethod('click')}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black mb-1.5 text-xs">
                    C
                  </div>
                  <span>Click</span>
                </label>

                <label
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center text-center justify-between transition-all ${
                    paymentMethod === 'payme'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold ring-1 ring-cyan-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'payme'}
                    onChange={() => setPaymentMethod('payme')}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center font-black mb-1.5 text-xs">
                    P
                  </div>
                  <span>Payme</span>
                </label>

                <label
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center text-center justify-between transition-all ${
                    paymentMethod === 'uzumbank'
                      ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-1 ring-purple-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'uzumbank'}
                    onChange={() => setPaymentMethod('uzumbank')}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black mb-1.5 text-xs">
                    U
                  </div>
                  <span>Uzum Bank</span>
                </label>

                <label
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center text-center justify-between transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black mb-1.5 text-xs">
                    💵
                  </div>
                  <span>Naqd / Terminal</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-24">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Sizning buyurtmangiz
              </h3>

              {/* Items summary */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
                {cart.map((item) => (
                  <div key={item.part.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                    <div className="pr-2 min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {item.part.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.quantity} dona × {formatPrice(item.part.price)}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 whitespace-nowrap">
                      {formatPrice(item.part.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Mahsulotlar summasi:</span>
                  <span className="font-semibold text-slate-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yetkazib berish xizmati:</span>
                  <span className="font-semibold text-slate-900">
                    {deliveryCost === 0 ? (
                      <span className="text-emerald-600 font-bold">Bepul</span>
                    ) : (
                      formatPrice(deliveryCost)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base font-extrabold text-slate-900">
                  <span>Jami to‘lanadi:</span>
                  <span className="text-2xl text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {loading ? 'Buyurtma rasmiylashtirilmoqda...' : 'Buyurtmani tasdiqlash'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  &ldquo;Buyurtmani tasdiqlash&rdquo; tugmasini bosish orqali siz shaxsiy ma‘lumotlarni qayta ishlash va xarid shartlariga rozilik bildirasiz.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
