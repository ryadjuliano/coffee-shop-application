-- Jalankan di Supabase Dashboard → SQL Editor

-- 1. Profil staf (1:1 dengan auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'kasir' check (role in ('kasir', 'admin')),
  created_at timestamptz not null default now()
);

-- 2. Menu / produk
create table public.products (
  id serial primary key,
  name text not null,
  category text not null,
  price int not null check (price >= 0), -- dalam Rupiah
  emoji text not null default '☕',
  is_active boolean not null default true
);

-- 3. Transaksi
create table public.orders (
  id bigserial primary key,
  cashier_id uuid references auth.users (id) on delete set null default auth.uid(),
  total int not null default 0,
  payment_method text not null default 'cash' check (payment_method in ('cash', 'qris', 'debit')),
  created_at timestamptz not null default now()
);

-- 4. Item per transaksi
create table public.order_items (
  id bigserial primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_id int not null references public.products (id),
  qty int not null check (qty > 0),
  price int not null -- harga saat transaksi
);

-- Row Level Security: semua staf yang login boleh baca menu & transaksi
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Lihat profil sendiri" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "Ubah profil sendiri" on public.profiles
  for update using ((select auth.uid()) = id);

create policy "Staf lihat menu" on public.products
  for select to authenticated using (true);

create policy "Staf lihat transaksi" on public.orders
  for select to authenticated using (true);
create policy "Kasir buat transaksi" on public.orders
  for insert to authenticated with check ((select auth.uid()) = cashier_id);

create policy "Staf lihat item" on public.order_items
  for select to authenticated using (true);
create policy "Kasir tambah item" on public.order_items
  for insert to authenticated with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.cashier_id = (select auth.uid())
    )
  );

-- Buat profil otomatis saat staf daftar
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
