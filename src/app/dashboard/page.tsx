import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatTime, startOfTodayWIB } from "@/lib/format";
import { logout } from "../login/actions";

export const metadata: Metadata = { title: "Dashboard · KopiPOS" };

type Order = {
  id: number;
  total: number;
  payment_method: string;
  created_at: string;
  order_items: { qty: number; products: { name: string; emoji: string } | null }[];
};

const PAYMENT_LABEL: Record<string, string> = {
  cash: "Tunai",
  qris: "QRIS",
  debit: "Debit",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth) redirect("/login");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", auth.claims.sub)
      .single(),
    supabase
      .from("orders")
      .select("id, total, payment_method, created_at, order_items(qty, products(name, emoji))")
      .gte("created_at", startOfTodayWIB())
      .order("created_at", { ascending: false })
      .returns<Order[]>(),
  ]);

  const todayOrders = orders ?? [];
  const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const average = todayOrders.length ? Math.round(revenue / todayOrders.length) : 0;

  const soldByProduct = new Map<string, { emoji: string; qty: number }>();
  for (const order of todayOrders) {
    for (const item of order.order_items) {
      if (!item.products) continue;
      const entry = soldByProduct.get(item.products.name) ?? {
        emoji: item.products.emoji,
        qty: 0,
      };
      entry.qty += item.qty;
      soldByProduct.set(item.products.name, entry);
    }
  }
  const itemsSold = [...soldByProduct.values()].reduce((sum, p) => sum + p.qty, 0);
  const bestSellers = [...soldByProduct.entries()]
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5);

  const firstName = profile?.full_name?.split(" ")[0] || "Kasir";

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold">
            Kopi<span className="text-amber-700">POS</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {auth.claims.email}
            </span>
            <form action={logout}>
              <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold">Halo, {firstName} 👋</h1>
        <p className="mt-1 text-slate-500">
          <span className="capitalize">{profile?.role ?? "kasir"}</span> · Ringkasan
          penjualan hari ini.
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Penjualan" value={formatRupiah(revenue)} />
          <Stat label="Transaksi" value={todayOrders.length} />
          <Stat label="Item terjual" value={itemsSold} />
          <Stat label="Rata-rata / transaksi" value={formatRupiah(average)} />
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="font-semibold">Menu terlaris</h2>
            {bestSellers.length === 0 ? (
              <Empty />
            ) : (
              <ol className="mt-4 space-y-3">
                {bestSellers.map(([name, { emoji, qty }], i) => (
                  <li key={name} className="flex items-center gap-3 text-sm">
                    <span className="w-4 text-slate-400">{i + 1}</span>
                    <span className="text-xl">{emoji}</span>
                    <span className="flex-1">{name}</span>
                    <span className="font-medium">{qty} terjual</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="font-semibold">Transaksi terbaru</h2>
            {todayOrders.length === 0 ? (
              <Empty />
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {todayOrders.slice(0, 8).map((o) => (
                  <li key={o.id} className="flex items-center gap-4 py-3 text-sm">
                    <span className="w-12 text-slate-400">{formatTime(o.created_at)}</span>
                    <span className="flex-1 truncate">
                      {o.order_items
                        .map((it) => `${it.qty}× ${it.products?.name ?? "?"}`)
                        .join(", ")}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                      {PAYMENT_LABEL[o.payment_method] ?? o.payment_method}
                    </span>
                    <span className="w-24 text-right font-medium">
                      {formatRupiah(o.total)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Empty() {
  return <p className="mt-4 text-sm text-slate-500">Belum ada transaksi hari ini.</p>;
}
