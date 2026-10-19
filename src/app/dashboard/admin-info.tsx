import { createClient } from "@/lib/supabase/server";

export async function AdminInfo() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", data.claims.sub)
    .maybeSingle();

  return (
    <>
      <p className="truncate text-sm font-medium">{profile?.full_name || "Admin"}</p>
      <p className="truncate text-xs text-slate-500">{profile?.email ?? data.claims.email}</p>
    </>
  );
}
