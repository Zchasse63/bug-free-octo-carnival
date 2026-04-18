/**
 * Supabase renamed the anon key to "publishable key" (sb_publishable_*).
 * Accept either name so existing and new `.env` files work without churn.
 */
export function publicSupabaseKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in env",
    );
  }
  return key;
}
