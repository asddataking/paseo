"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canRedeemPerk, type MembershipTier } from "@/lib/tiers";
import { generateRedemptionCode } from "@/lib/utils";

export async function redeemPerk(perkId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sign in to redeem perks");

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  const userTier = (profile?.membership_tier ?? "free") as MembershipTier;

  const { data: perk, error: perkError } = await supabase
    .from("perks")
    .select("*")
    .eq("id", perkId)
    .eq("status", "active")
    .single();

  if (perkError || !perk) throw new Error("Perk not available");

  if (!canRedeemPerk(userTier, perk.tier_required as MembershipTier)) {
    throw new Error(`Upgrade to ${perk.tier_required} to redeem this perk`);
  }

  const code = generateRedemptionCode();

  const { data: redemption, error } = await supabase
    .from("redemptions")
    .insert({
      perk_id: perk.id,
      business_id: perk.business_id,
      user_id: user.id,
      redemption_code: code,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/app/perks");

  return { code, redemptionId: redemption.id };
}
