"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb } from "./db";
import { createClient } from "@/lib/supabase/server";

export async function featureBusinessForm(formData: FormData) {
  const businessId = formData.get("businessId") as string;
  if (businessId) await featureBusiness(businessId);
}

export async function featureBusiness(businessId: string, days = 7) {
  const db = await getAdminDb();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await db.from("featured_businesses").insert({
    business_id: businessId,
    featured_until: new Date(Date.now() + days * 86400000).toISOString(),
    created_by: user?.id ?? null,
    premium_placement: true,
  });

  revalidatePath("/admin");
}

export async function updateBusinessStatus(
  businessId: string,
  status: string
) {
  const db = await getAdminDb();
  await db.from("businesses").update({ status }).eq("id", businessId);
  revalidatePath("/admin");
  revalidatePath("/admin/businesses");
}

export async function createPerk(input: {
  businessId: string;
  title: string;
  description?: string;
  tierRequired: string;
}) {
  const db = await getAdminDb();
  await db.from("perks").insert({
    business_id: input.businessId,
    title: input.title,
    description: input.description ?? null,
    tier_required: input.tierRequired,
    status: "active",
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
  });
  revalidatePath("/admin/perks");
}

export async function logTestNotification() {
  const db = await getAdminDb();
  await db.from("analytics_events").insert({
    event_type: "notification_draft",
    metadata: { title: "Test notification", body: "Low wait family activities tonight" },
  });
  revalidatePath("/admin");
}

export async function createBusiness(formData: FormData) {
  const db = await getAdminDb();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  await db.from("businesses").insert({
    name,
    category: (formData.get("category") as string) || null,
    address: (formData.get("address") as string) || null,
    status: "active",
    infra_tier: (formData.get("infra_tier") as string) || "free",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/businesses");
}

export async function updateUserRole(
  userId: string,
  role: string,
  membershipTier?: string
) {
  const db = await getAdminDb();
  const updates: { role: string; membership_tier?: string } = { role };
  if (membershipTier) updates.membership_tier = membershipTier;
  await db.from("profiles").update(updates).eq("id", userId);
  revalidatePath("/admin/users");
}
