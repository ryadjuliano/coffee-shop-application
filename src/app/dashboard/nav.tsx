"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/products", label: "Produk", icon: "☕" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 md:flex-col">
      {MENU.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
              active
                ? "bg-amber-100 text-amber-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
