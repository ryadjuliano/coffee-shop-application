import type { Metadata } from "next";
import { CategoryForm } from "../category-form";

export const metadata: Metadata = { title: "Tambah Produk · Coffee Shop Application" };

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold">Tambah Category</h1>
      <p className="mt-1 text-slate-500">Masukkan Kategori Baru.</p>
      <CategoryForm />
    </div>
  );
}
