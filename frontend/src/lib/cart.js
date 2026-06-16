// Simple cart store (in-memory) — minimal hook pattern, no external lib
import { useState, useEffect } from "react";

let listeners = new Set();
let cart = [];

const emit = () => listeners.forEach((l) => l());

export const cartStore = {
  get items() { return cart; },
  add(product) {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.qty += 1;
    else cart = [...cart, { ...product, qty: 1 }];
    emit();
  },
  remove(id) {
    cart = cart.filter((i) => i.id !== id);
    emit();
  },
  setQty(id, qty) {
    if (qty <= 0) { cart = cart.filter((i) => i.id !== id); }
    else cart = cart.map((i) => (i.id === id ? { ...i, qty } : i));
    emit();
  },
  clear() { cart = []; emit(); },
  subscribe(l) { listeners.add(l); return () => listeners.delete(l); },
};

export function useCart() {
  const [, force] = useState(0);
  useEffect(() => cartStore.subscribe(() => force((n) => n + 1)), []);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return { items: cart, subtotal, count, ...cartStore };
}

export const formatEUR = (price) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price);
