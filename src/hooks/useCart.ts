'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types';
import { calcShipping, calcSubtotal, calcTotal } from '@/lib/utils';

const STORAGE_KEY = 'mose-cart';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity, size, color }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(() => calcSubtotal(items), [items]);
  const shipping = useMemo(() => calcShipping(subtotal), [subtotal]);
  const total = useMemo(() => calcTotal(items), [items]);
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return {
    items,
    count,
    subtotal,
    shipping,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
