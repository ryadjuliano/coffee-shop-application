-- OPSIONAL: contoh transaksi hari ini supaya dashboard tidak kosong.
-- Jalankan setelah schema.sql dan setelah minimal 1 akun staf terdaftar.
do $$
declare
  kasir uuid := (select id from auth.users order by created_at limit 1);
  oid bigint;
begin
  insert into public.orders (cashier_id, total, payment_method)
  values (kasir, 50000, 'cash') returning id into oid;
  insert into public.order_items (order_id, product_id, qty, price)
  select oid, id, 2, price from public.products where name = 'Kopi Susu Gula Aren';

  insert into public.orders (cashier_id, total, payment_method)
  values (kasir, 50000, 'qris') returning id into oid;
  insert into public.order_items (order_id, product_id, qty, price)
  select oid, id, 1, price from public.products where name in ('Cafe Latte', 'Croissant');

  insert into public.orders (cashier_id, total, payment_method)
  values (kasir, 47000, 'debit') returning id into oid;
  insert into public.order_items (order_id, product_id, qty, price)
  select oid, id, 1, price from public.products where name in ('Kopi Susu Gula Aren', 'Roti Bakar') ;
end $$;
