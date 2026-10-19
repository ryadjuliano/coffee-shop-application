"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type MenuItem = { href: string; label: string };
type MenuGroup = { label: string; icon: string; href?: string; children?: MenuItem[] };

const MENU: MenuGroup[] = [
  { label: "Dashboard", icon: "📊", href: "/dashboard" },
  {
    label: "Produk",
    icon: "☕",
    children: [
      { href: "/dashboard/products/new", label: "Tambah Produk" },
      { href: "/dashboard/products", label: "List Produk" },
    ],
  },
  {
    label: "Category",
    icon: "🔖",
    children: [
      { href: "/dashboard/category/new", label: "Tambah Kategori" },
      { href: "/dashboard/category", label: "List Category" },
    ],
  },
];

const itemClass = (active: boolean) =>
  `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
    active ? "bg-amber-100 text-amber-900" : "text-slate-600 hover:bg-slate-100"
  }`;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {MENU.map((group) =>
        group.children ? (
          <NavGroup key={group.label} group={group} pathname={pathname} />
        ) : (
          <Link key={group.label} href={group.href!} className={itemClass(pathname === group.href)}>
            <span>{group.icon}</span>
            {group.label}
          </Link>
        ),
      )}
    </nav>
  );
}

function NavGroup({ group, pathname }: { group: MenuGroup; pathname: string }) {
  const children = group.children!;
  const hasActiveChild = children.some((c) => c.href === pathname);
  const [open, setOpen] = useState(hasActiveChild);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Buka otomatis saat pindah ke salah satu sub-menu.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (hasActiveChild) setOpen(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`${itemClass(false)} ${hasActiveChild ? "text-slate-900" : ""}`}
      >
        <span>{group.icon}</span>
        <span className="flex-1 text-left">{group.label}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="mt-1 ml-5 flex flex-col gap-1 border-l border-slate-200 pl-3">
          {children.map((c) => (
            <Link key={c.href} href={c.href} className={itemClass(pathname === c.href)}>
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
