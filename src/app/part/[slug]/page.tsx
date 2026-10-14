'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Star,
  Copy,
  Check,
  ShoppingBag,
  Heart,
  Car,
  Layers,
  ChevronRight,
  MessageSquare,
  Send,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Part, Vehicle, Review } from '@/lib/types';
import PartCard from '@/components/parts/PartCard';

export default function PartDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  const { addToCart, isInWishlist, toggleWishlist, formatPrice, activeVehicle } = useCart();

  const [part, setPart] = useState<Part | null>(null);
  const [crossAlternatives, setCrossAlternatives] = useState<Part[]>([]);
  const [relatedParts, setRelatedParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedOem, setCopiedOem] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Vehicle selector for fitment checking
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [checkVehicleId, setCheckVehicleId] = useState<string>('');

  // Review form
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'vehicles' | 'cross' | 'reviews'>('desc');
  const [reviewName, setReviewName] = useState('');
  const [reviewCar, setReviewCar] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/parts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPart(data.data);
          setCrossAlternatives(data.crossAlternatives || []);
          setRelatedParts(data.relatedParts || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVehicles(data.data);
      });
  }, [slug]);

  useEffect(() => {
    if (activeVehicle) {
      setCheckVehicleId(activeVehicle.id);
    }
  }, [activeVehicle]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Ehtiyot qism ma‘lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Ehtiyot qism topilmadi</h2>
        <p className="text-slate-500 text-sm">Qidirilayotgan mahsulot mavjud emas yoki o‘chirilgan bo‘lishi mumkin.</p>
        <Link
          href="/catalog"
          className="inline-block px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow"
        >
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  let images: string[] = [];
  try {
    images = typeof part.images === 'string' ? JSON.parse(part.images) : part.images;
  } catch {
    images = [];
  }
  if (!images.length) {
    images = ['https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=800&q=80'];
  }

  let specs: Record<string, string> = {};
  try {
    specs = typeof part.specifications === 'string' ? JSON.parse(part.specifications) : part.specifications;
  } catch {
    specs = {};
  }

  const handleCopyOem = () => {
    navigator.clipboard.writeText(part.oemNumber);
    setCopiedOem(true);
    setTimeout(() => setCopiedOem(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart(part, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(part, quantity);
    router.push('/checkout');
  };

  // Check compatibility
  const selectedVehicleForCheck = vehicles.find((v) => v.id === checkVehicleId);
  const isCompatible =
    selectedVehicleForCheck &&
    part.compatibility?.some((c) => c.vehicleId === selectedVehicleForCheck.id);

  const matchedCompatibilityNote = part.compatibility?.find(
    (c) => c.vehicleId === selectedVehicleForCheck?.id
  )?.notes;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partId: part.id,
          authorName: reviewName,
          carModel: reviewCar || 'Avtomobil egasi',
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setPart((prev) =>
          prev
            ? {
                ...prev,
                reviews: [data.data, ...(prev.reviews || [])],
                reviewCount: prev.reviewCount + 1,
              }
            : null
        );
        setReviewName('');
        setReviewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Bosh sahifa</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/catalog" className="hover:text-blue-600">Katalog</Link>
        {part.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href={`/catalog?category=${part.category.slug}`} className="hover:text-blue-600">
              {part.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{part.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-80 sm:h-96 w-full rounded-2xl bg-white border border-slate-200 overflow-hidden relative shadow-sm flex items-center justify-center p-4">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={part.name}
              className="max-h-full max-w-full object-contain"
            />
            {part.isOriginal && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Original GM / OEM
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden bg-white shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            {/* Brand, Country, Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {part.brand}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Ishlab chiqaruvchi: <strong>{part.country}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-extrabold text-slate-900">{part.rating}</span>
                <span>({part.reviewCount || 10} ta baho)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {part.name}
            </h1>

            {/* OEM Artikul box */}
            <div className="mt-3 flex items-center gap-3">
              <div className="text-xs text-slate-500">
                OEM Artikul raqami:
              </div>
              <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-800 transition-colors">
                <span>{part.oemNumber}</span>
                <button
                  onClick={handleCopyOem}
                  className="p-1 hover:text-blue-600"
                  title="Nusxa olish"
                >
                  {copiedOem ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {copiedOem && (
                <span className="text-[11px] font-semibold text-emerald-600 animate-fadeIn">
                  Nusxalandi!
                </span>
              )}
            </div>
          </div>

          {/* Fitment Checker Interactive Widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-blue-600" />
                Moslikni tekshirish
              </div>
              <span className="text-[11px] text-slate-500">Avtomobilingizni tanlang</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8">
                <select
                  value={checkVehicleId}
                  onChange={(e) => setCheckVehicleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Avtomobilingizni tanlang...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.yearFrom}{v.yearTo ? `-${v.yearTo}` : '+'}) — {v.engine}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                {selectedVehicleForCheck ? (
                  isCompatible ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-3 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% MOS KELADI</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100/70 border border-red-300 px-3 py-2 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>MOS KELMAYDI</span>
                    </div>
                  )
                ) : (
                  <span className="text-xs text-slate-400 italic">Tekshirish uchun avtoni tanlang</span>
                )}
              </div>
            </div>

            {matchedCompatibilityNote && (
              <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <strong>Eslatma:</strong> {matchedCompatibilityNote}
              </p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                {part.oldPrice && (
                  <span className="text-sm text-slate-400 line-through mr-3">
                    {formatPrice(part.oldPrice)}
                  </span>
                )}
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(part.price)}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">/ {part.unit}</span>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Omborda {part.stock} {part.unit} mavjud
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Quantity Counter */}
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold text-base transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(part.stock, prev + 1))}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold text-base transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <ShoppingBag className="w-4 h-4" />
                {addedSuccess ? 'Savatga qo‘shildi!' : 'Savatga qo‘shish'}
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow transition-colors whitespace-nowrap"
              >
                Hozir xarid qilish
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(part.id)}
                className={`p-3 rounded-xl border transition-colors shrink-0 flex items-center justify-center ${
                  isInWishlist(part.id)
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-slate-300 hover:border-red-300 text-slate-500 hover:text-red-500'
                }`}
                title="Sevimlilar"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(part.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {addedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-fadeIn">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Mahsulot muvaffaqiyatli savatingizga joylandi!
                </span>
                <Link href="/cart" className="text-blue-600 font-bold hover:underline">
                  Savatga o‘tish →
                </Link>
              </div>
            )}
          </div>

          {/* 4 Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-700 font-medium">Tezkor yetkazish</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">{part.warranty || '12 oy kafolat'}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-slate-700 font-medium">14 kun qaytarish</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5">
              <Car className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-slate-700 font-medium">100% Aniq moslik</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Applicable Vehicles, Cross-codes, Reviews */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-3.5 px-6 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'desc'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Mahsulot tavsifi
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-6 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Texnik xarakteristikalari
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-3.5 px-6 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'vehicles'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Mos keluvchi avtomobillar ({part.compatibility?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('cross')}
            className={`py-3.5 px-6 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'cross'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Kross-kodlar va analoglar
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-6 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Sharhlar ({part.reviews?.length || 0})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {/* 1. Tavsif */}
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-3xl text-sm text-slate-700 leading-relaxed">
              <p>{part.description}</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mt-4 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Nega aynan ushbu ehtiyot qismni tanlashadi?</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Xalqaro ISO/TS 16949 sifat standartlariga to‘liq javob beradi.</li>
                  <li>Avtomobil zavod qotiruvchi teshiklari va o‘lchamlariga 100% mos tushadi.</li>
                  <li>Uzoq muddatli foydalanish uchun bardoshli materiallardan ishlangan.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 2. Texnik xarakteristikalar */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 text-slate-500 font-medium">OEM Artikul raqami</td>
                    <td className="py-2.5 font-bold font-mono text-slate-900">{part.oemNumber}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 text-slate-500 font-medium">Brend</td>
                    <td className="py-2.5 font-bold text-blue-600">{part.brand}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 text-slate-500 font-medium">Ishlab chiqarilgan davlat</td>
                    <td className="py-2.5 font-semibold text-slate-900">{part.country}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 text-slate-500 font-medium">Turi</td>
                    <td className="py-2.5 font-semibold text-slate-900">
                      {part.isOriginal ? 'Original zavod mahsuloti' : 'Sifatli sertifikatlangan analog'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 text-slate-500 font-medium">Kafolat muddati</td>
                    <td className="py-2.5 font-semibold text-slate-900">{part.warranty || '12 oy'}</td>
                  </tr>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key} className="border-b border-slate-100">
                      <td className="py-2.5 text-slate-500 font-medium">{key}</td>
                      <td className="py-2.5 font-semibold text-slate-900">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. Mos keluvchi avtomobillar */}
          {activeTab === 'vehicles' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Ushbu ehtiyot qism quyidagi avtomobil modellari va modifikatsiyalari uchun 100% mos keladi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {part.compatibility?.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {comp.vehicle.make} {comp.vehicle.model}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Yillar: {comp.vehicle.yearFrom}{comp.vehicle.yearTo ? `-${comp.vehicle.yearTo}` : '+'}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                        {comp.vehicle.engine}
                      </div>
                      {comp.notes && (
                        <div className="text-[10px] text-emerald-700 mt-1 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {comp.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Kross-kodlar va analoglar */}
          {activeTab === 'cross' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Boshqa ishlab chiqaruvchilarning analog kodlari (Cross-reference)
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  {part.crossCodes || 'Kross-kodlar kiritilmagan'}
                </div>
              </div>

              {crossAlternatives.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">
                    Tavsiya etiladigan boshqa muqobil brendlar:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {crossAlternatives.map((alt) => (
                      <PartCard key={alt.id} part={alt} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Sharhlar */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Existing Reviews */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">
                  Xaridorlar fikrlari ({part.reviews?.length || 0})
                </h4>

                {part.reviews && part.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {part.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900">
                              {rev.authorName}
                            </span>
                            {rev.carModel && (
                              <span className="text-[11px] text-blue-600 font-semibold ml-2">
                                ({rev.carModel})
                              </span>
                            )}
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Ushbu mahsulotga hali sharh qoldirilmagan. Birinchi bo‘lib o‘z fikringizni bildiring!
                  </p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" /> Sharh qoldirish
                </h4>

                {reviewSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p>Fikringiz uchun tashakkur! Sharhingiz chop etildi.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Ismingiz:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Otabek"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Avtomobilingiz (ixtiyoriy):
                      </label>
                      <input
                        type="text"
                        placeholder="Masalan: Cobalt 2022"
                        value={reviewCar}
                        onChange={(e) => setReviewCar(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Bahongiz:
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= reviewRating
                                  ? 'text-amber-400 fill-current'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Fikr-mulohazangiz:
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Qism sifati, yetkazib berish tezligi haqida yozing..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {submittingReview ? 'Yuborilmoqda...' : 'Sharhni yuborish'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedParts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Ushbu toifadagi boshqa ehtiyot qismlar
            </h3>
            <Link
              href={`/catalog?category=${part.category?.slug}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Ko‘proq ko‘rish →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedParts.map((item) => (
              <PartCard key={item.id} part={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
