import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "./auth-form";

export const metadata: Metadata = { title: "Masuk · Kopinobori" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold">
          Kopinobori<span className="text-amber-700">POS</span>
        </Link>
        <AuthForm />
      </div>
    </main>
  );
}
