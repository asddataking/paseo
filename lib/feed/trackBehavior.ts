"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export type BehaviorEventType =
  | "viewed_card"
  | "saved_business"
  | "redeemed_perk"
  | "ignored_card"
  | "opened_map"
  | "tapped_directions"
  | "added_to_collection"
  | "expanded_card";

export async function trackBehavior(input: {
  eventType: BehaviorEventType;
  businessId?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_behavior_events").insert({
    user_id: user.id,
    business_id: input.businessId ?? null,
    event_type: input.eventType,
    metadata: (input.metadata ?? {}) as Json,
  });
}
