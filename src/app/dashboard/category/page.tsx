import type { Metadata } from "next";
import Link from "next/link";
import { CategoryList } from "./category-list";

export const metadata: Metadata = { title: "List Produk · Coffee Shop Application" };

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">List Produk</h1>
          <p className="mt-1 text-slate-500">Kelola menu kopi yang dijual.</p>
        </div>
        <Link
          href="/dashboard/category/new"
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          + Tambah Produk
        </Link>
      </div>
      <CategoryList />
    </div>
  );
}
