import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient, hasServiceClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

/** Resolve role reliably (user session first, then service role fallback). */
export async function getProfileRole(
  userId: string,
  supabase: Client,
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role) return profile.role;

  if (hasServiceClient()) {
    try {
      const service = createServiceClient();
      const { data } = await service
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      return data?.role ?? "consumer";
    } catch {
      return "consumer";
    }
  }

  return "consumer";
}

export async function isUserAdmin(userId: string, supabase: Client) {
  return (await getProfileRole(userId, supabase)) === "admin";
}
