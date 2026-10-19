"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import {
  CATEGORIES,
  type Category,
  type Product,
} from "@/lib/dummy-data";
import { updateProducts, useProducts } from "./product-store";

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100";

export function ProductManager() {
  const products = useProducts();
  const [filter, setFilter] = useState<Category | "Semua">("Semua");

  function addProduct(formData: FormData) {
    const product: Product = {
      id: crypto.randomUUID(),
      name: String(formData.get("name")).trim(),
      category: formData.get("category") as Category,
      price: Number(formData.get("price")),
      active: true,
    };
    updateProducts((prev) => [product, ...prev]);
  }

  const toggleActive = (id: string) =>
    updateProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );

  const remove = (id: string) => {
    if (confirm("Hapus produk ini?")) {
      updateProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const shown =
    filter === "Semua" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
      <form
        action={addProduct}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="font-semibold">Tambah produk</h2>
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

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <h2 className="font-semibold">Daftar produk ({shown.length})</h2>
          <div className="flex flex-wrap gap-1">
            {(["Semua", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  filter === c
                    ? "bg-amber-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 text-right font-medium">Harga</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((p) => (
                <tr key={p.id} className={p.active ? "" : "text-slate-400"}>
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3">{p.category}</td>
                  <td className="px-5 py-3 text-right">{formatRupiah(p.price)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(p.id)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.active
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => remove(p.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    Belum ada produk di kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
