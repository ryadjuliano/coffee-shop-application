"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "./actions";

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [state, action, pending] = useActionState<AuthState, FormData>(
    mode === "login" ? login : signup,
    {},
  );
  const isLogin = mode === "login";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">
        {isLogin ? "Masuk ke kasir" : "Daftar akun staf"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {isLogin
          ? "Siap melayani pelanggan hari ini."
          : "Akun baru otomatis berperan sebagai kasir."}
      </p>

      <form action={action} className="mt-6 space-y-4" key={mode}>
        {!isLogin && (
          <>
            <Field label="Nama lengkap">
              <input name="full_name" required className={input} />
            </Field>
          </>
        )}
        <Field label="Email">
          <input name="email" type="email" required className={input} />
        </Field>
        <Field label="Password">
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className={input}
          />
        </Field>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-amber-700 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {pending ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "signup" : "login")}
          className="font-medium text-amber-700 hover:underline"
        >
          {isLogin ? "Daftar" : "Masuk"}
        </button>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
