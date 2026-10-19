import type { Metadata } from "next";
import { ProductManager } from "./product-manager";

export const metadata: Metadata = { title: "Produk · Coffee Shop Application" };

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold">Produk</h1>
      <p className="mt-1 text-slate-500">Tambah dan kelola menu kopi.</p>
      <ProductManager />
    </div>
  );
}
