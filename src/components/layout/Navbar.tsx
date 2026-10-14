'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  Search,
  ShoppingBag,
  Heart,
  FileSearch,
  Phone,
  Clock,
  Shield,
  Layers,
  ChevronDown,
  User,
  Settings,
  Sparkles,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import VehicleSelectorModal from './VehicleSelectorModal';
import CartDrawer from '../cart/CartDrawer';
import { Part } from '@/lib/types';

export default function Navbar() {
  const router = useRouter();
  const { activeVehicle, cartCount, wishlist, formatPrice } = useCart();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/parts?q=${encodeURIComponent(searchQuery)}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSearchResults(data.data);
            setShowSearchDropdown(true);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchDropdown(false);
    router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                100% Sertifikatlangan va Kafolatli avto ehtiyot qismlar
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Har kuni: 08:30 — 21:00 dam olishsiz
              </span>
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/tracking"
                className="hover:text-white transition-colors flex items-center gap-1 text-blue-400 font-medium"
              >
                <Package className="w-3.5 h-3.5" /> Buyurtmani kuzatish
              </Link>
              <span className="text-slate-600">|</span>
              <a
                href="tel:+998712004949"
                className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                +998 (71) 200-49-49
              </a>
              <span className="text-slate-600">|</span>
              <Link
                href="/admin"
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3 h-3" /> Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Avto<span className="text-blue-600">Qism</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  UZ
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Katalog va Internet do‘koni
              </p>
            </div>
          </Link>

          {/* Vehicle Selector Pill (Garage) */}
          <button
            onClick={() => setIsVehicleModalOpen(true)}
            className={`hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left border transition-all shrink-0 ${
              activeVehicle
                ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white text-slate-700'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeVehicle ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Car className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-600">
                {activeVehicle ? 'Mening avtomobilim:' : 'Avtomobilni tanlang:'}
              </div>
              <div className="font-semibold text-slate-900 flex items-center gap-1">
                {activeVehicle ? (
                  <>
                    <span className="truncate max-w-[140px]">
                      {activeVehicle.make} {activeVehicle.model}
                    </span>
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-1 rounded">
                      {activeVehicle.yearFrom}
                    </span>
                  </>
                ) : (
                  'Mos qismlarni topish'
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </button>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-xl mx-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Qism nomi, OEM artikul (masalan: 96405129) yoki brend..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Qidirish
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
                  <span>Topilgan ehtiyot qismlar:</span>
                  <Link
                    href={`/catalog?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Barchasini ko‘rish
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {searchResults.map((part) => {
                    let images = [];
                    try {
                      images = JSON.parse(part.images);
                    } catch {
                      images = [];
                    }
                    const img = images[0] || 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=150&q=80';

                    return (
                      <Link
                        key={part.id}
                        href={`/part/${part.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="p-3 flex items-center gap-3 hover:bg-blue-50/50 transition-colors"
                      >
                        <img
                          src={img}
                          alt={part.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {part.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span className="font-semibold text-blue-600">{part.brand}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-600">OEM: {part.oemNumber}</span>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-900 shrink-0">
                          {formatPrice(part.price)}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* VIN Search Button */}
            <Link
              href="/vin-search"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white text-slate-700 text-xs font-semibold transition-colors"
              title="VIN kod bo‘yicha avtomatik qidirish"
            >
              <FileSearch className="w-4 h-4 text-blue-600" />
              <span>VIN qidiruv</span>
            </Link>

            {/* Garage icon on mobile */}
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Avtomobilni tanlash"
            >
              <Car className="w-4 h-4 text-blue-600" />
            </button>

            {/* Wishlist */}
            <Link
              href="/catalog?wishlist=true"
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              title="Sevimlilar ro‘yxati"
            >
              <Heart className="w-4 h-4 text-slate-600" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Savat</span>
              {cartCount > 0 && (
                <span className="bg-white text-blue-700 text-xs font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Category Navigation Bar */}
        <nav className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-slate-700 overflow-x-auto py-2.5 scrollbar-none gap-6">
            <div className="flex items-center gap-5 shrink-0">
              <Link
                href="/catalog"
                className="flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-800"
              >
                <Layers className="w-3.5 h-3.5" /> Barcha katalog
              </Link>
              <Link href="/catalog?category=tormoz-tizimi" className="hover:text-blue-600 whitespace-nowrap">
                Tormoz tizimi
              </Link>
              <Link href="/catalog?category=dvigatel-tizimi" className="hover:text-blue-600 whitespace-nowrap">
                Dvigatel va GRM
              </Link>
              <Link href="/catalog?category=filtrlar" className="hover:text-blue-600 whitespace-nowrap">
                Filtrlar
              </Link>
              <Link href="/catalog?category=xodovoy-va-podveska" className="hover:text-blue-600 whitespace-nowrap">
                Xodovoy va podveska
              </Link>
              <Link href="/catalog?category=moylar-va-avtokimyo" className="hover:text-blue-600 whitespace-nowrap">
                Moylar va suyuqliklar
              </Link>
              <Link href="/catalog?category=elektr-va-yoritish" className="hover:text-blue-600 whitespace-nowrap">
                Elektr va optika
              </Link>
              <Link href="/catalog?category=transmissiya" className="hover:text-blue-600 whitespace-nowrap">
                Transmissiya
              </Link>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-slate-500">
              <Link href="/garage" className="flex items-center gap-1 hover:text-blue-600 font-semibold text-slate-700">
                <Car className="w-3.5 h-3.5 text-blue-600" /> Mening garajim
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Vehicle Selector Modal */}
      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </>
  );
}
