import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <span className="text-5xl">☕</span>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
        Kopi<span className="text-amber-700">POS</span>
      </h1>
      <p className="mt-4 max-w-md text-slate-600">
        Aplikasi kasir sederhana untuk coffee shop. Catat transaksi dan pantau
        penjualan harian di satu tempat.
      </p>
      <Link
        href="/login"
        className="mt-8 rounded-lg bg-amber-700 px-6 py-3 font-medium text-white hover:bg-amber-800"
      >
        Masuk ke Kasir
      </Link>
    </main>
  );
}
