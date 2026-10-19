-- =============================================================
-- AUTH & PROFIL STAF
-- Jalankan PERTAMA di Supabase Dashboard → SQL Editor,
-- sebelum schema.sql.
--
-- Login memakai Supabase Auth (tabel auth.users, password di-hash
-- oleh Supabase). Tabel ini hanya menyimpan data tambahan: nama,
-- role, dan status aktif. Jangan simpan password di tabel sendiri.
-- =============================================================

-- 1. Profil staf (1:1 dengan auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'kasir' check (role in ('admin', 'kasir')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Helper untuk policy RLS.
-- security definer supaya bisa membaca profiles tanpa terkena RLS
-- (menghindari policy yang memanggil dirinya sendiri).
create function public.is_staff()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active
  );
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active and role = 'admin'
  );
$$;

-- 3. Buat profil otomatis saat user dibuat di Supabase Auth.
-- Default role = kasir. Admin dinaikkan manual (lihat bagian 6).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Jaga kolom sensitif: hanya admin yang boleh mengubah role,
-- status aktif, dan email. Query dari SQL Editor / service role
-- (auth.uid() kosong) tetap diizinkan.
create function public.protect_profile_columns()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not public.is_admin() then
    if new.role is distinct from old.role
      or new.is_active is distinct from old.is_active
      or new.email is distinct from old.email then
      raise exception 'Hanya admin yang boleh mengubah role, status, atau email';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_protect_columns
  before update on public.profiles
  for each row execute procedure public.protect_profile_columns();

-- 5. Row Level Security
alter table public.profiles enable row level security;

create policy "Staf lihat profil sendiri, admin lihat semua"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

create policy "Staf ubah profil sendiri, admin ubah semua"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()))
  with check ((select auth.uid()) = id or (select public.is_admin()));

-- Tidak ada policy insert/delete: profil hanya dibuat oleh trigger
-- dan ikut terhapus saat user dihapus dari Authentication.

-- 6. Membuat akun admin pertama
--   a. Supabase Dashboard → Authentication → Users → Add user
--      Email: admin@kopinobori.com, isi password, centang "Auto Confirm User".
--   b. Lalu jalankan:
--
-- update public.profiles
-- set role = 'admin', full_name = 'Admin Kopinobori'
-- where email = 'admin@kopinobori.com';
