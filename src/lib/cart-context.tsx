'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Part, Vehicle, CartItem, UserSavedCar } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (part: Part, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  // Garage
  activeVehicle: Vehicle | null;
  setActiveVehicle: (vehicle: Vehicle | null) => void;
  savedGarageCars: UserSavedCar[];
  addToGarage: (vehicle: Vehicle, nickname?: string, plateNumber?: string, vin?: string) => void;
  removeFromGarage: (savedCarId: string) => void;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (partId: string) => void;
  isInWishlist: (partId: string) => boolean;
  // Helpers
  formatPrice: (amount?: number | null) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeVehicle, setActiveVehicleState] = useState<Vehicle | null>(null);
  const [savedGarageCars, setSavedGarageCars] = useState<UserSavedCar[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('avtoqism_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedGarage = localStorage.getItem('avtoqism_garage');
      if (storedGarage) setSavedGarageCars(JSON.parse(storedGarage));

      const storedActiveVehicle = localStorage.getItem('avtoqism_active_vehicle');
      if (storedActiveVehicle) setActiveVehicleState(JSON.parse(storedActiveVehicle));

      const storedWishlist = localStorage.getItem('avtoqism_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.error('LocalStorage yuklashda xatolik:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('avtoqism_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Cart saqlashda xatolik:', e);
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('avtoqism_garage', JSON.stringify(savedGarageCars));
    } catch (e) {
      console.error('Garage saqlashda xatolik:', e);
    }
  }, [savedGarageCars, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (activeVehicle) {
        localStorage.setItem('avtoqism_active_vehicle', JSON.stringify(activeVehicle));
      } else {
        localStorage.removeItem('avtoqism_active_vehicle');
      }
    } catch (e) {
      console.error('Active vehicle saqlashda xatolik:', e);
    }
  }, [activeVehicle, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('avtoqism_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Wishlist saqlashda xatolik:', e);
    }
  }, [wishlist, isLoaded]);

  const addToCart = (part: Part, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, part.stock) }
            : item
        );
      }
      return [...prev, { part, quantity: Math.min(quantity, part.stock) }];
    });
  };

  const removeFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.part.id === partId
          ? { ...item, quantity: Math.min(quantity, item.part.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const setActiveVehicle = (vehicle: Vehicle | null) => {
    setActiveVehicleState(vehicle);
  };

  const addToGarage = (vehicle: Vehicle, nickname?: string, plateNumber?: string, vin?: string) => {
    const newCar: UserSavedCar = {
      id: 'car_' + Date.now(),
      vehicleId: vehicle.id,
      vehicle,
      nickname: nickname || `${vehicle.make} ${vehicle.model}`,
      plateNumber,
      vin,
    };
    setSavedGarageCars((prev) => {
      const filtered = prev.filter((c) => c.vehicleId !== vehicle.id);
      return [newCar, ...filtered];
    });
    setActiveVehicleState(vehicle);
  };

  const removeFromGarage = (savedCarId: string) => {
    setSavedGarageCars((prev) => {
      const remaining = prev.filter((c) => c.id !== savedCarId);
      if (activeVehicle && !remaining.some((c) => c.vehicleId === activeVehicle.id)) {
        setActiveVehicleState(remaining.length > 0 ? remaining[0].vehicle : null);
      }
      return remaining;
    });
  };

  const toggleWishlist = (partId: string) => {
    setWishlist((prev) =>
      prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]
    );
  };

  const isInWishlist = (partId: string) => wishlist.includes(partId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.part.price * item.quantity, 0);

  const formatPrice = (amount?: number | null) => {
    if (amount === undefined || amount === null) return '0 so‘m';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so‘m';
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        activeVehicle,
        setActiveVehicle,
        savedGarageCars,
        addToGarage,
        removeFromGarage,
        wishlist,
        toggleWishlist,
        isInWishlist,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
