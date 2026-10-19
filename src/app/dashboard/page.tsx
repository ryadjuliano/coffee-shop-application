import type { Metadata } from "next";
import { formatRupiah } from "@/lib/format";
import {
  DUMMY_TRANSACTIONS,
  DUMMY_WEEKLY_SALES,
  transactionTotal,
  type Payment,
} from "@/lib/dummy-data";

export const metadata: Metadata = { title: "Dashboard · Coffee Shop Application" };

const PAYMENTS: Payment[] = ["QRIS", "Tunai", "Debit"];

export default function DashboardPage() {
  const transactions = DUMMY_TRANSACTIONS;
  const revenue = transactions.reduce((sum, t) => sum + transactionTotal(t), 0);
  const itemsSold = transactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0),
    0,
  );
  const average = Math.round(revenue / transactions.length);

  const soldByProduct = new Map<string, number>();
  for (const t of transactions) {
    for (const i of t.items) {
      soldByProduct.set(i.name, (soldByProduct.get(i.name) ?? 0) + i.qty);
    }
  }
  const bestSellers = [...soldByProduct.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const byPayment = PAYMENTS.map((p) => {
    const list = transactions.filter((t) => t.payment === p);
    return {
      payment: p,
      count: list.length,
      total: list.reduce((sum, t) => sum + transactionTotal(t), 0),
    };
  });

  const weekTotal = DUMMY_WEEKLY_SALES.reduce((sum, d) => sum + d.revenue, 0);
  const weekMax = Math.max(...DUMMY_WEEKLY_SALES.map((d) => d.revenue));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
          Data dummy
        </span>
      </div>
      <p className="mt-1 text-slate-500">Ringkasan penjualan hari ini.</p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Penjualan hari ini" value={formatRupiah(revenue)} />
        <Stat label="Transaksi" value={transactions.length} />
        <Stat label="Item terjual" value={itemsSold} />
        <Stat label="Rata-rata / transaksi" value={formatRupiah(average)} />
      </section>

      <h2 className="mt-10 text-lg font-semibold">Report</h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold">Penjualan 7 hari terakhir</h3>
            <span className="text-sm text-slate-500">
              Total {formatRupiah(weekTotal)}
            </span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2 border-b border-slate-200 sm:gap-4">
            {DUMMY_WEEKLY_SALES.map((d, i) => {
              const isToday = i === DUMMY_WEEKLY_SALES.length - 1;
              return (
                <div
                  key={d.day}
                  className="group relative flex h-full flex-1 items-end justify-center"
                >
                  <div
                    className={`w-full max-w-10 rounded-t ${
                      isToday ? "bg-amber-700" : "bg-amber-300 group-hover:bg-amber-400"
                    }`}
                    style={{ height: `${(d.revenue / weekMax) * 100}%` }}
                  />
                  <div className="pointer-events-none absolute -top-2 z-10 hidden -translate-y-full rounded-lg bg-slate-900 px-3 py-2 text-xs whitespace-nowrap text-white shadow group-hover:block">
                    <p className="font-medium">{d.day}</p>
                    <p>{formatRupiah(d.revenue)}</p>
                    <p className="text-slate-300">{d.orders} transaksi</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2 sm:gap-4">
            {DUMMY_WEEKLY_SALES.map((d) => (
              <span key={d.day} className="flex-1 text-center text-xs text-slate-500">
                {d.day}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Metode pembayaran</h3>
          <ul className="mt-4 space-y-4">
            {byPayment.map((p) => (
              <li key={p.payment} className="text-sm">
                <div className="flex justify-between">
                  <span>{p.payment}</span>
                  <span className="text-slate-500">
                    {p.count} trx · {formatRupiah(p.total)}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-600"
                    style={{ width: `${(p.total / revenue) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-semibold">Produk terlaris</h3>
          <ol className="mt-3 space-y-2 text-sm">
            {bestSellers.map(([name, qty], i) => (
              <li key={name} className="flex gap-3">
                <span className="w-4 text-slate-400">{i + 1}</span>
                <span className="flex-1">{name}</span>
                <span className="font-medium">{qty}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Transaksi hari ini</h2>
      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-slate-200 text-left text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">No. Transaksi</th>
              <th className="px-5 py-3 font-medium">Jam</th>
              <th className="px-5 py-3 font-medium">Item</th>
              <th className="px-5 py-3 font-medium">Kasir</th>
              <th className="px-5 py-3 font-medium">Bayar</th>
              <th className="px-5 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3 font-mono text-xs">{t.id}</td>
                <td className="px-5 py-3 text-slate-500">{t.time}</td>
                <td className="px-5 py-3">
                  {t.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                </td>
                <td className="px-5 py-3">{t.cashier}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {t.payment}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-medium">
                  {formatRupiah(transactionTotal(t))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </Card>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
