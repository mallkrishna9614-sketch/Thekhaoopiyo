"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { MenuItem } from "@/lib/menuData";

export interface CartItem extends MenuItem {
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kp_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("kp_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id));
    } else {
      setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty } : c));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
