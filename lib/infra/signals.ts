"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export async function emitSignal(input: {
  businessId: string;
  signalType: "wait_status" | "availability" | "event" | "perk" | "note";
  value: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const signalValue = input.value as Json;
  const { error } = await supabase.from("live_signals").insert({
    business_id: input.businessId,
    signal_type: input.signalType,
    signal_value: signalValue,
    value: signalValue,
    metadata: {} as Json,
    created_by: user?.id ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/infra");
  revalidatePath("/admin");
  revalidatePath("/app");
}

export async function toggleActivePerk(
  businessId: string,
  perkId: string | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const perkPayload = perkId
    ? ({ perk_id: perkId, label: "Perk active" } as Json)
    : ({ perk_id: null, label: "Perk off" } as Json);

  await supabase.from("live_signals").insert({
    business_id: businessId,
    signal_type: "perk",
    signal_value: perkPayload,
    value: perkPayload,
    metadata: {} as Json,
    created_by: user?.id ?? null,
  });

  revalidatePath("/infra");
  revalidatePath("/admin");
  revalidatePath("/app");
}
