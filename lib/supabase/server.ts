import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Server-only Supabase client (used by server actions).
 * Never import this file from a "use client" module: it reads server-only env vars.
 * Uses the publishable key, so every query is subject to RLS (the waitlist allows INSERT only).
 */
export function createClient(): SupabaseClient<Database> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const missing = [!url && "SUPABASE_URL", !key && "SUPABASE_PUBLISHABLE_KEY"].filter(Boolean).join(", ");
    throw new Error(
      `Supabase is not configured: missing ${missing}. Set it in .env.local (local) or the Vercel project settings.`,
    );
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
