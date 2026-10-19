-- =============================================================
-- POS: MENU & TRANSAKSI
-- Jalankan di Supabase Dashboard → SQL Editor SETELAH auth.sql
-- (memakai fungsi is_staff() dan is_admin() dari file itu).
-- =============================================================

-- 1. Menu / produk
create table public.products (
  id serial primary key,
  name text not null,
  category text not null check (category in ('Kopi', 'Non-Kopi', 'Makanan')),
  price int not null check (price >= 0), -- dalam Rupiah
  emoji text not null default '☕',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Transaksi
create table public.orders (
  id bigserial primary key,
  cashier_id uuid references auth.users (id) on delete set null default auth.uid(),
  total int not null default 0,
  payment_method text not null default 'cash' check (payment_method in ('cash', 'qris', 'debit')),
  created_at timestamptz not null default now()
);

-- 3. Item per transaksi
create table public.order_items (
  id bigserial primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_id int not null references public.products (id),
  qty int not null check (qty > 0),
  price int not null -- harga saat transaksi
);

-- Row Level Security
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Menu: semua staf aktif boleh lihat, hanya admin yang boleh ubah
create policy "Staf lihat menu" on public.products
  for select to authenticated using ((select public.is_staff()));
create policy "Admin tambah menu" on public.products
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admin ubah menu" on public.products
  for update to authenticated using ((select public.is_admin()));
create policy "Admin hapus menu" on public.products
  for delete to authenticated using ((select public.is_admin()));

-- Transaksi: staf aktif boleh lihat, kasir hanya membuat atas namanya sendiri
create policy "Staf lihat transaksi" on public.orders
  for select to authenticated using ((select public.is_staff()));
create policy "Kasir buat transaksi" on public.orders
  for insert to authenticated
  with check ((select public.is_staff()) and (select auth.uid()) = cashier_id);

create policy "Staf lihat item" on public.order_items
  for select to authenticated using ((select public.is_staff()));
create policy "Kasir tambah item" on public.order_items
  for insert to authenticated with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.cashier_id = (select auth.uid())
    )
  );

-- Data awal menu
insert into public.products (name, category, price, emoji) values
  ('Espresso', 'Kopi', 18000, '☕'),
  ('Americano', 'Kopi', 22000, '☕'),
  ('Cafe Latte', 'Kopi', 28000, '🥛'),
  ('Kopi Susu Gula Aren', 'Kopi', 25000, '🧋'),
  ('Matcha Latte', 'Non-Kopi', 30000, '🍵'),
  ('Coklat Panas', 'Non-Kopi', 26000, '🍫'),
  ('Croissant', 'Makanan', 22000, '🥐'),
  ('Roti Bakar', 'Makanan', 20000, '🍞');
