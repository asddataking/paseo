import { createServiceClient, hasServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getAdminDb() {
  if (hasServiceClient()) return createServiceClient();
  return await createClient();
}
