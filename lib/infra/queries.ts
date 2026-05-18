import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";
import type { BusinessWithStatus, Perk } from "@/types/domain";

type BusinessQueryRow = Tables<"businesses"> & {
  perks?: Perk[] | null;
  current_business_status?:
    | Tables<"current_business_status">
    | Tables<"current_business_status">[]
    | null;
};

export async function getInfraBusiness(): Promise<BusinessWithStatus | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: claimed } = await supabase
      .from("businesses")
      .select("*, perks(*), current_business_status(*)")
      .eq("claimed_by", user.id)
      .order("name")
      .limit(1)
      .maybeSingle();

    if (claimed) return normalizeBusiness(claimed);
  }

  const { data: first } = await supabase
    .from("businesses")
    .select("*, perks(*), current_business_status(*)")
    .eq("status", "active")
    .order("name")
    .limit(1)
    .maybeSingle();

  return first ? normalizeBusiness(first) : null;
}

function normalizeBusiness(row: BusinessQueryRow): BusinessWithStatus {
  const status = Array.isArray(row.current_business_status)
    ? (row.current_business_status[0] ?? null)
    : (row.current_business_status ?? null);

  const { perks, current_business_status: _status, ...business } = row;

  return {
    ...business,
    perks: perks ?? [],
    current_business_status: status,
  };
}
