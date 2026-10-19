import { useSyncExternalStore } from "react";
import { DUMMY_PRODUCTS, type Product } from "@/lib/dummy-data";

// Sementara disimpan di localStorage browser, nanti diganti tabel Supabase.
const STORAGE_KEY = "kopinobori-products";

let cache: Product[] | null = null;
const listeners = new Set<() => void>();

function read(): Product[] {
  if (cache) return cache;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    cache = saved ? JSON.parse(saved) : DUMMY_PRODUCTS;
  } catch {
    cache = DUMMY_PRODUCTS;
  }
  return cache!;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateProducts(fn: (prev: Product[]) => Product[]) {
  cache = fn(read());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((l) => l());
}

export function useProducts() {
  return useSyncExternalStore(subscribe, read, () => DUMMY_PRODUCTS);
}
