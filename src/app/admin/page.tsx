'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Car,
  Layers,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Part, Order, Category, Vehicle } from '@/lib/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'parts' | 'vehicles'>('orders');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter/search
  const [searchPart, setSearchPart] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('');

  // Add Part Modal
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  const [newPartOem, setNewPartOem] = useState('');
  const [newPartBrand, setNewPartBrand] = useState('GM Genuine Parts');
  const [newPartCountry, setNewPartCountry] = useState('Koreya');
  const [newPartPrice, setNewPartPrice] = useState('');
  const [newPartOldPrice, setNewPartOldPrice] = useState('');
  const [newPartStock, setNewPartStock] = useState('15');
  const [newPartCategory, setNewPartCategory] = useState('');
  const [newPartDesc, setNewPartDesc] = useState('');
  const [newPartCross, setNewPartCross] = useState('');
  const [newPartIsOriginal, setNewPartIsOriginal] = useState(true);
  const [newPartVehicleIds, setNewPartVehicleIds] = useState<string[]>([]);
  const [savingPart, setSavingPart] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resOrders, resParts, resCats, resVehs] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/parts').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/vehicles').then((r) => r.json()),
      ]);

      if (resOrders.success) setOrders(resOrders.data);
      if (resParts.success) setParts(resParts.data);
      if (resCats.success) {
        setCategories(resCats.data);
        if (resCats.data.length > 0 && !newPartCategory) {
          setNewPartCategory(resCats.data[0].id);
        }
      }
      if (resVehs.success) setVehicles(resVehs.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete part
  const handleDeletePart = async (partId: string) => {
    if (!confirm('Haqiqatan ham ushbu ehtiyot qismni o‘chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`/api/parts/${partId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setParts((prev) => prev.filter((p) => p.id !== partId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit new part
  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName || !newPartOem || !newPartPrice || !newPartCategory) {
      alert('Iltimos, nom, OEM kod, narx va toifani to‘ldiring');
      return;
    }
    setSavingPart(true);

    try {
      const payload = {
        name: newPartName,
        oemNumber: newPartOem,
        brand: newPartBrand,
        country: newPartCountry,
        price: parseInt(newPartPrice),
        oldPrice: newPartOldPrice ? parseInt(newPartOldPrice) : null,
        stock: parseInt(newPartStock) || 10,
        unit: 'dona',
        warranty: '12 oy',
        categoryId: newPartCategory,
        description: newPartDesc || 'Yuqori sifatli avtomobil ehtiyot qismi.',
        crossCodes: newPartCross || null,
        isOriginal: newPartIsOriginal,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=700&q=80',
        ]),
        vehicleIds: newPartVehicleIds,
      };

      const res = await fetch('/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddPartModal(false);
        setNewPartName('');
        setNewPartOem('');
        setNewPartPrice('');
        setNewPartOldPrice('');
        setNewPartVehicleIds([]);
        loadData();
      } else {
        alert(data.error || 'Qism qo‘shishda xatolik');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPart(false);
    }
  };

  const formatPrice = (amount?: number | null) => {
    if (!amount) return '0 so‘m';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so‘m';
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockParts = parts.filter((p) => p.stock <= 15);

  const filteredOrders = orderFilterStatus
    ? orders.filter((o) => o.status === orderFilterStatus)
    : orders;

  const filteredParts = searchPart
    ? parts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchPart.toLowerCase()) ||
          p.oemNumber.toLowerCase().includes(searchPart.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchPart.toLowerCase())
      )
    : parts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Boshqaruv markazi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator paneli
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Yangilash"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddPartModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Yangi ehtiyot qism qo‘shish
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami daromad:</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {formatPrice(totalRevenue)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Barcha buyurtmalar bo‘yicha
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami buyurtmalar:</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {orders.length} ta
            </div>
            <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">
              {orders.filter((o) => o.status === 'new').length} ta yangi kutilmoqda
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Katalogdagi qismlar:</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {parts.length} ta
            </div>
            <span className="text-[11px] text-purple-600 font-semibold mt-0.5 block">
              {categories.length} ta toifada
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Kam qolgan qismlar:</span>
            <div className="text-xl font-extrabold text-amber-600 mt-1">
              {lowStockParts.length} ta
            </div>
            <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
              Omborda &le; 15 dona qolgan
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-6 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Buyurtmalar nazorati ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`py-3.5 px-6 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'parts'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Ehtiyot qismlari ombori ({parts.length})
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-3.5 px-6 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'vehicles'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-4 h-4" />
            Avtomobillar ma‘lumotlar bazasi ({vehicles.length})
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Status bo‘yicha filtr:</span>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs outline-none"
                >
                  <option value="">Barcha statuslar</option>
                  <option value="new">Yangi (new)</option>
                  <option value="processing">Omborda yig‘ilmoqda (processing)</option>
                  <option value="shipped">Yetkazilmoqda (shipped)</option>
                  <option value="delivered">Bajarildi (delivered)</option>
                  <option value="cancelled">Bekor qilindi (cancelled)</option>
                </select>
              </div>

              <span className="text-xs text-slate-500">
                Jami: <strong>{filteredOrders.length}</strong> ta buyurtma
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Buyurtma №</th>
                    <th className="py-3 px-3">Mijoz</th>
                    <th className="py-3 px-3">Manzil</th>
                    <th className="py-3 px-3">Summa</th>
                    <th className="py-3 px-3">To‘lov</th>
                    <th className="py-3 px-3">Holat</th>
                    <th className="py-3 px-3">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{ord.region}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {ord.cityAddress}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : ord.status === 'shipped'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : ord.status === 'processing'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : ord.status === 'cancelled'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="new">Yangi</option>
                          <option value="processing">Jarayonda</option>
                          <option value="shipped">Yetkazilmoqda</option>
                          <option value="delivered">Yetkazildi</option>
                          <option value="cancelled">Bekor</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleDateString('uz-UZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Parts */}
        {activeTab === 'parts' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Nom, OEM kod yoki brend bo‘yicha qidirish..."
                  value={searchPart}
                  onChange={(e) => setSearchPart(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <span className="text-xs text-slate-500">
                Topildi: <strong>{filteredParts.length}</strong> ta tovar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Ehtiyot qism</th>
                    <th className="py-3 px-3">OEM kod</th>
                    <th className="py-3 px-3">Brend</th>
                    <th className="py-3 px-3">Toifa</th>
                    <th className="py-3 px-3">Narx</th>
                    <th className="py-3 px-3">Qoldiq</th>
                    <th className="py-3 px-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <Link
                          href={`/part/${p.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5"
                        >
                          <span className="truncate max-w-xs">{p.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </Link>
                        {p.isOriginal && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold border border-blue-200 inline-block mt-0.5">
                            Original
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {p.oemNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{p.brand}</td>
                      <td className="py-3 px-3 text-slate-600">{p.category?.name || 'Toifa'}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock <= 15
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} {p.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeletePart(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Vehicles Database */}
        {activeTab === 'vehicles' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-slate-500">
              Katalogdagi ehtiyot qismlar mosligi tekshiriladigan avtomobillar modeli:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v) => (
                <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {v.make} {v.model}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                      {v.vinPattern || 'VIN'}
                    </span>
                  </div>
                  <div className="text-slate-600">Yillar: {v.yearFrom}{v.yearTo ? `-${v.yearTo}` : '+'} • {v.bodyType}</div>
                  <div className="text-slate-500 font-mono">Dvigatel: {v.engine}</div>
                  <div className="text-slate-500">Yoqilg‘i: {v.fuelType} | {v.transmission}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add New Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Yangi ehtiyot qism qo‘shish
              </h3>
              <button
                onClick={() => setShowAddPartModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePart} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ehtiyot qism nomi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Old tormoz kolodkalari to‘plami"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    OEM Artikul raqami *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: GM 96405129"
                    value={newPartOem}
                    onChange={(e) => setNewPartOem(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono outline-none focus:ring-2 focus:ring-blue-500 uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ishlab chiqaruvchi brend *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="GM, Bosch, Brembo, Mann..."
                    value={newPartBrand}
                    onChange={(e) => setNewPartBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Toifa (Kategoriya) *
                  </label>
                  <select
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Davlat (Ishlab chiqaruvchi)
                  </label>
                  <input
                    type="text"
                    placeholder="Koreya, Germaniya, O‘zbekiston..."
                    value={newPartCountry}
                    onChange={(e) => setNewPartCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Narxi (so‘mda) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="250000"
                    value={newPartPrice}
                    onChange={(e) => setNewPartPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ombordagi qoldiq (dona)
                  </label>
                  <input
                    type="number"
                    value={newPartStock}
                    onChange={(e) => setNewPartStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kross-kodlar va analoglari
                  </label>
                  <input
                    type="text"
                    placeholder="SP1159, 0986424789, D11158M"
                    value={newPartCross}
                    onChange={(e) => setNewPartCross(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mos keladigan avtomobillar
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                    {vehicles.map((v) => {
                      const isChecked = newPartVehicleIds.includes(v.id);
                      return (
                        <label key={v.id} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewPartVehicleIds([...newPartVehicleIds, v.id]);
                              } else {
                                setNewPartVehicleIds(newPartVehicleIds.filter((id) => id !== v.id));
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span className="truncate">{v.make} {v.model}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mahsulot tavsifi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mahsulot haqida batafsil ma‘lumot..."
                    value={newPartDesc}
                    onChange={(e) => setNewPartDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingPart}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                >
                  {savingPart ? 'Saqlanmoqda...' : 'Katalogga qo‘shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
