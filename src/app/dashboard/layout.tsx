import { Suspense } from "react";
import { logout } from "../login/actions";
import { AdminInfo } from "./admin-info";
import { Nav } from "./nav";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 md:w-60 md:border-r md:border-b-0">
        <span className="px-3 text-lg font-bold">
          Kopinobori<span className="text-amber-700">POS</span>
        </span>
        <Nav />
        <div className="mt-auto hidden border-t border-slate-200 px-3 pt-4 md:block">
          <Suspense fallback={<div className="h-9 animate-pulse rounded bg-slate-100" />}>
            <AdminInfo />
          </Suspense>
          <form action={logout} className="mt-3">
            <button className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
