'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'solar-diy-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setItems(parsed);
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    // Record for admin tracking (fire-and-forget)
    fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'add_to_cart',
        at: new Date().toISOString(),
        productId: product.id,
        productName: product.name,
        quantity,
      }),
    }).catch(() => {});
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  // Abandoned cart — fire a beacon when the user leaves with items in cart
  // A sessionStorage flag is set on purchase to avoid false positives
  useEffect(() => {
    if (!loaded) return;
    const handleUnload = () => {
      if (items.length === 0) return;
      if (sessionStorage.getItem('solar-diy-purchased') === '1') return;
      const payload = JSON.stringify({
        type: 'abandoned_cart',
        at: new Date().toISOString(),
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          priceCents: i.product.price,
        })),
        subtotalCents: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      });
      navigator.sendBeacon('/api/activity', new Blob([payload], { type: 'application/json' }));
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [items, loaded]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
