"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function finishOnboarding(input: {
  businessId: string;
  category: string;
  businessConfig: {
    wait_labels: string[];
    availability_labels: string[];
    signal_options: string[];
  };
  perkTitle?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sign in required");

  const { error: bizError } = await supabase
    .from("businesses")
    .update({
      category: input.category,
      business_config: input.businessConfig,
      status: "active",
      claimed_by: user.id,
    })
    .eq("id", input.businessId);

  if (bizError) throw new Error(bizError.message);

  await supabase.from("business_staff").upsert({
    business_id: input.businessId,
    user_id: user.id,
  });

  await supabase.from("current_business_status").upsert({
    business_id: input.businessId,
    wait_status: input.businessConfig.wait_labels[0] ?? "No wait",
    availability_status:
      input.businessConfig.availability_labels[0] ?? "Open",
    last_updated_at: new Date().toISOString(),
  });

  if (input.perkTitle?.trim()) {
    await supabase.from("perks").insert({
      business_id: input.businessId,
      title: input.perkTitle.trim(),
      tier_required: "free",
      status: "active",
      starts_at: new Date().toISOString(),
    });
  }

  revalidatePath("/infra");
  revalidatePath("/app");

  return { success: true };
}
