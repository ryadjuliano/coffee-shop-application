"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; email?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email")).trim().toLowerCase();
  const password = String(formData.get("password"));
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { email, error: "Email atau password salah." };
    }
    if (error.code === "email_not_confirmed") {
      return { email, error: "Email belum dikonfirmasi." };
    }
    return { email, error: "Gagal masuk. Coba lagi beberapa saat." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.role !== "admin" || !profile.is_active) {
    await supabase.auth.signOut();
    return { email, error: "Akun ini tidak punya akses admin." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
