// Data dummy untuk dashboard, sebelum terhubung ke database.

export type Category = "Kopi" | "Non-Kopi" | "Makanan";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  active: boolean;
};

export const CATEGORIES: Category[] = ["Kopi", "Non-Kopi", "Makanan"];

export const DUMMY_PRODUCTS: Product[] = [
  { id: "p1", name: "Espresso", category: "Kopi", price: 18000, active: true },
  { id: "p2", name: "Americano", category: "Kopi", price: 22000, active: true },
  { id: "p3", name: "Cafe Latte", category: "Kopi", price: 28000, active: true },
  { id: "p4", name: "Cappuccino", category: "Kopi", price: 28000, active: true },
  { id: "p5", name: "Kopi Susu Gula Aren", category: "Kopi", price: 25000, active: true },
  { id: "p6", name: "Matcha Latte", category: "Non-Kopi", price: 30000, active: true },
  { id: "p7", name: "Coklat Panas", category: "Non-Kopi", price: 26000, active: true },
  { id: "p8", name: "Croissant", category: "Makanan", price: 22000, active: true },
  { id: "p9", name: "Roti Bakar", category: "Makanan", price: 20000, active: false },
];

export type Payment = "Tunai" | "QRIS" | "Debit";

export type Transaction = {
  id: string;
  time: string;
  cashier: string;
  payment: Payment;
  items: { name: string; qty: number; price: number }[];
};

export const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: "TRX-0112", time: "15:42", cashier: "Rina", payment: "QRIS", items: [{ name: "Kopi Susu Gula Aren", qty: 2, price: 25000 }, { name: "Croissant", qty: 1, price: 22000 }] },
  { id: "TRX-0111", time: "15:20", cashier: "Rina", payment: "Tunai", items: [{ name: "Americano", qty: 1, price: 22000 }] },
  { id: "TRX-0110", time: "14:58", cashier: "Budi", payment: "QRIS", items: [{ name: "Cafe Latte", qty: 2, price: 28000 }] },
  { id: "TRX-0109", time: "14:31", cashier: "Budi", payment: "Debit", items: [{ name: "Matcha Latte", qty: 1, price: 30000 }, { name: "Coklat Panas", qty: 1, price: 26000 }] },
  { id: "TRX-0108", time: "13:47", cashier: "Rina", payment: "QRIS", items: [{ name: "Kopi Susu Gula Aren", qty: 3, price: 25000 }] },
  { id: "TRX-0107", time: "13:05", cashier: "Budi", payment: "Tunai", items: [{ name: "Espresso", qty: 1, price: 18000 }, { name: "Croissant", qty: 2, price: 22000 }] },
  { id: "TRX-0106", time: "12:22", cashier: "Rina", payment: "QRIS", items: [{ name: "Cappuccino", qty: 2, price: 28000 }] },
  { id: "TRX-0105", time: "11:40", cashier: "Budi", payment: "Tunai", items: [{ name: "Kopi Susu Gula Aren", qty: 1, price: 25000 }] },
  { id: "TRX-0104", time: "10:15", cashier: "Rina", payment: "Debit", items: [{ name: "Cafe Latte", qty: 1, price: 28000 }, { name: "Croissant", qty: 1, price: 22000 }] },
  { id: "TRX-0103", time: "09:02", cashier: "Rina", payment: "QRIS", items: [{ name: "Americano", qty: 2, price: 22000 }] },
];

// Pendapatan 7 hari terakhir (Rupiah), hari ini paling akhir.
export const DUMMY_WEEKLY_SALES = [
  { day: "Sen", revenue: 1_850_000, orders: 62 },
  { day: "Sel", revenue: 1_620_000, orders: 55 },
  { day: "Rab", revenue: 1_940_000, orders: 66 },
  { day: "Kam", revenue: 2_110_000, orders: 71 },
  { day: "Jum", revenue: 2_680_000, orders: 88 },
  { day: "Sab", revenue: 3_240_000, orders: 104 },
  { day: "Min", revenue: 2_950_000, orders: 97 },
];

export const transactionTotal = (t: Transaction) =>
  t.items.reduce((sum, i) => sum + i.qty * i.price, 0);
