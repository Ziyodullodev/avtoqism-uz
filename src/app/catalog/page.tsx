'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  Search,
  X,
  SlidersHorizontal,
  Car,
  Check,
  RotateCcw,
  LayoutGrid,
  List,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import PartCard from '@/components/parts/PartCard';
import { Part, Category, Vehicle } from '@/lib/types';

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeVehicle, setActiveVehicle } = useCart();

  // URL parameters
  const initialQ = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialVehicleId = searchParams.get('vehicleId') || '';
  const initialWishlist = searchParams.get('wishlist') === 'true';

  // Filters state
  const [q, setQ] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isOriginal, setIsOriginal] = useState<string>('');
  const [inStock, setInStock] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Data
  const [parts, setParts] = useState<Part[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync activeVehicle with selectedVehicleId if vehicleId is not explicitly set in URL
  useEffect(() => {
    if (!initialVehicleId && activeVehicle) {
      setSelectedVehicleId(activeVehicle.id);
    }
  }, [activeVehicle, initialVehicleId]);

  // Load Categories & Vehicles
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });

    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVehicles(data.data);
      });
  }, []);

  // Fetch Parts when filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedVehicleId) params.set('vehicleId', selectedVehicleId);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (isOriginal) params.set('isOriginal', isOriginal);
    if (inStock) params.set('inStock', 'true');
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);

    fetch(`/api/parts?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setParts(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [
    q,
    selectedCategory,
    selectedVehicleId,
    selectedBrand,
    isOriginal,
    inStock,
    minPrice,
    maxPrice,
    sort,
  ]);

  const brands = [
    'GM Genuine Parts',
    'Bosch',
    'Brembo',
    'Mann-Filter',
    'NGK Spark Plugs',
    'Gates',
    'Castrol',
    'Mando',
    'CTR (Central Corporation)',
    'Sangsin Brake (Hi-Q)',
    'Valeo PHC',
    'UzAuto Motors (OEM)',
    'Delkor (Johnson Controls)',
    'Philips Automotive',
    'Felix Carbox',
  ];

  const handleResetFilters = () => {
    setQ('');
    setSelectedCategory('');
    setSelectedVehicleId('');
    setSelectedBrand('');
    setIsOriginal('');
    setInStock(false);
    setMinPrice('');
    setMaxPrice('');
    setSort('popular');
  };

  const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Bosh sahifa</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Katalog</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-slate-800 capitalize font-medium">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Avtomobil ehtiyot qismlari katalogi
          </h1>
        </div>

        {/* Active vehicle notification badge */}
        {selectedVehicleObj && (
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-xl text-xs font-semibold">
            <Car className="w-4 h-4 text-blue-600" />
            <span>
              Filtr: <strong>{selectedVehicleObj.make} {selectedVehicleObj.model}</strong> ({selectedVehicleObj.yearFrom}{selectedVehicleObj.yearTo ? `-${selectedVehicleObj.yearTo}` : '+'})
            </span>
            <button
              onClick={() => setSelectedVehicleId('')}
              className="ml-1 p-0.5 hover:bg-blue-200 rounded text-blue-700 transition-colors"
              title="Avto filtrini bekor qilish"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filters Sidebar */}
        <aside
          className={`lg:block ${
            showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'
          } lg:relative lg:p-0 lg:z-auto bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-sm`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filtrlar</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Tozalash
            </button>
            {showMobileFilters && (
              <button
                onClick={() => setShowMobileFilters(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 1. Avtomobil filtri */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Avtomobil bo‘yicha moslik
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Barcha avtomobillar</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.yearFrom}{v.yearTo ? `-${v.yearTo}` : '+'})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Kategoriyalar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Toifalar (Bo‘limlar)
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Barcha toifalar</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {cat._count?.parts !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat.slug
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat._count.parts}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Brendlar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Ishlab chiqaruvchi brend
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Barcha brendlar</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Original / Analog */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Asllik darajasi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsOriginal(isOriginal === 'true' ? '' : 'true')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                  isOriginal === 'true'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                Faqat Original
              </button>
              <button
                type="button"
                onClick={() => setIsOriginal(isOriginal === 'false' ? '' : 'false')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                  isOriginal === 'false'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                Analog (Dublikat)
              </button>
            </div>
          </div>

          {/* 5. Faqat borlari */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Faqat omborda mavjudlari</span>
            </label>
          </div>

          {/* 6. Narx oralig‘i */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Narx oralig‘i (so‘m)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Dan"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Gacha"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {showMobileFilters && (
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm"
            >
              Natijalarni ko‘rish ({parts.length})
            </button>
          )}
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar: Search query, Count, Sort, Grid/List view */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 text-slate-700"
              >
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Filtrlar
              </button>
              <div className="text-xs text-slate-600">
                Topildi: <strong className="text-slate-900">{parts.length}</strong> ta ehtiyot qism
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 hidden sm:inline">Saralash:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Ommabopligi bo‘yicha</option>
                  <option value="price_asc">Narx: arzondan qimmatga</option>
                  <option value="price_desc">Narx: qimmatdan arzonga</option>
                  <option value="rating">Reytingi bo‘yicha</option>
                  <option value="newest">Yangi qo‘shilganlar</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Katak ko‘rinishi"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Ro‘yxat ko‘rinishi"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(q || selectedCategory || selectedVehicleId || selectedBrand || isOriginal) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Faol filtrlar:</span>
              {q && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                  Qidiruv: &ldquo;{q}&rdquo;
                  <button onClick={() => setQ('')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                  Toifa: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                  Brend: {selectedBrand}
                  <button onClick={() => setSelectedBrand('')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {isOriginal && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                  {isOriginal === 'true' ? 'Faqat Original' : 'Analog / Dublikat'}
                  <button onClick={() => setIsOriginal('')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:underline font-semibold ml-2"
              >
                Barchasini bekor qilish
              </button>
            </div>
          )}

          {/* Parts Loading or Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-80 bg-slate-100 rounded-2xl animate-pulse p-4 space-y-4"
                >
                  <div className="h-44 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : parts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Ushbu filtrlar bo‘yicha ehtiyot qism topilmadi
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Qidiruv so‘zini to‘g‘ri kiritganingizni tekshiring yoki filtrlarni tozalab qayta urinib ko‘ring.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition-colors"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {parts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Katalog yuklanmoqda...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
