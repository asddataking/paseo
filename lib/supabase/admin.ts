import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations. Add it to .env.local from Supabase Dashboard → Settings → API."
    );
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export function hasServiceClient() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
