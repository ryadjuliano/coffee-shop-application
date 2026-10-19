# KopiPOS

Aplikasi kasir (POS) sederhana untuk coffee shop, dibuat dengan **Next.js 16** dan **Supabase**.

Fitur saat ini:
- Daftar & login staf dengan email/password (Supabase Auth)
- Dashboard penjualan hari ini: total penjualan, jumlah transaksi, item terjual,
  menu terlaris, dan transaksi terbaru
- Halaman `/dashboard` diproteksi lewat `src/proxy.ts`

## Setup

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan `supabase/auth.sql` lalu `supabase/schema.sql`
   (urutannya penting). Buat akun admin pertama sesuai langkah di akhir `auth.sql`.
3. Isi `.env.local` dengan nilai dari **Project Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```
4. Jalankan:
   ```bash
   npm install
   npm run dev
   ```
   Lalu buka http://localhost:3000 dan daftar akun staf.
5. (Opsional) Jalankan `supabase/seed-demo.sql` di SQL Editor supaya dashboard
   langsung terisi contoh transaksi hari ini.

> Untuk development, kamu bisa mematikan konfirmasi email di
> **Authentication → Sign In / Providers → Email → Confirm email**.
> Kalau tetap aktif, ubah template "Confirm signup" agar link-nya ke
> `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.

## Struktur

```
src/
  proxy.ts                 # refresh session + proteksi route
  lib/supabase/            # client browser, server, dan proxy
  lib/format.ts            # format Rupiah, jam, awal hari (WIB)
  app/
    page.tsx               # landing page
    login/                 # form login/daftar + server actions
    auth/confirm/route.ts  # verifikasi link email
    dashboard/             # dashboard penjualan
supabase/
  auth.sql                 # profil staf, role admin/kasir, RLS login
  schema.sql               # menu, transaksi, RLS, menu awal
  seed-demo.sql            # contoh transaksi (opsional)
```

## Database

| Tabel         | Isi                                         |
|---------------|---------------------------------------------|
| `profiles`    | Nama & role staf (`kasir` / `admin`)        |
| `products`    | Menu: nama, kategori, harga (Rupiah), emoji |
| `orders`      | Transaksi: kasir, total, metode bayar       |
| `order_items` | Item per transaksi: produk, qty, harga      |
