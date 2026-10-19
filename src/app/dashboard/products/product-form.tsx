"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, type Category, type Product } from "@/lib/dummy-data";
import { updateProducts } from "./product-store";

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100";

export function ProductForm() {
  const [saved, setSaved] = useState<string | null>(null);

  function addProduct(formData: FormData) {
    const product: Product = {
      id: crypto.randomUUID(),
      name: String(formData.get("name")).trim(),
      category: formData.get("category") as Category,
      price: Number(formData.get("price")),
      active: true,
    };
    updateProducts((prev) => [product, ...prev]);
    setSaved(product.name);
  }

  return (
    <form
      action={addProduct}
      className="mt-6 max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          &ldquo;{saved}&rdquo; berhasil ditambahkan.{" "}
          <Link href="/dashboard/products" className="font-medium underline">
            Lihat list produk
          </Link>
        </p>
      )}
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Nama produk</span>
        <input name="name" required placeholder="mis. Vanilla Latte" className={input} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Kategori</span>
        <select name="category" className={input} defaultValue="Kopi">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Harga (Rp)</span>
        <input
          name="price"
          type="number"
          required
          min={0}
          step={500}
          placeholder="25000"
          className={input}
        />
      </label>
      <button className="w-full rounded-lg bg-amber-700 py-2 text-sm font-medium text-white hover:bg-amber-800">
        Simpan produk
      </button>
    </form>
  );
}
