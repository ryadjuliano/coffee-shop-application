import type { Metadata } from "next";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Tambah Produk · Coffee Shop Application" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold">Tambah Produk</h1>
      <p className="mt-1 text-slate-500">Masukkan menu kopi baru.</p>
      <ProductForm />
    </div>
  );
}
