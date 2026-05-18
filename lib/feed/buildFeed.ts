import { getAdminDb } from "@/lib/admin/db";
import { createClient } from "@/lib/supabase/server";
import { scoreExperienceForUser } from "./scoreExperience";
import type { ActiveSignal, FeedCard, FeedContext } from "./types";
import type { MembershipTier } from "@/lib/tiers";
import type { Tables } from "@/types/database";

function parseActiveSignals(raw: unknown): ActiveSignal[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is Record<string, unknown> => s != null && typeof s === "object")
    .map((s) => ({
      type: String(s.type ?? "note"),
      label: String(s.label ?? ""),
      at: s.at ? String(s.at) : undefined,
    }))
    .filter((s) => s.label);
}

function ruleBasedSummary(
  name: string,
  wait: string | null,
  signals: ActiveSignal[],
  hasPerk: boolean
): string {
  const parts: string[] = [];
  if (wait?.toLowerCase().includes("no wait")) parts.push("No wait right now");
  else if (wait) parts.push(`${wait} wait`);
  const detail = signals.find((s) => s.label)?.label;
  if (detail) parts.push(detail);
  if (hasPerk) parts.push("Member perk active");
  if (parts.length === 0) return `Check ${name} for live availability.`;
  return parts.join(" · ");
}

export async function buildIntelligentFeed(): Promise<FeedCard[]> {
  const db = await getAdminDb();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let membershipTier: MembershipTier = "free";
  let affinityByBusiness: Record<string, number> = {};
  const ignored = new Set<string>();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_tier")
      .eq("id", user.id)
      .single();
    membershipTier = (profile?.membership_tier as MembershipTier) ?? "free";

    const { data: behaviors } = await supabase
      .from("user_behavior_events")
      .select("business_id, event_type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200);

    for (const e of behaviors ?? []) {
      if (!e.business_id) continue;
      if (e.event_type === "ignored_card") ignored.add(e.business_id);
      if (
        e.event_type === "saved_business" ||
        e.event_type === "added_to_collection" ||
        e.event_type === "redeemed_perk"
      ) {
        affinityByBusiness[e.business_id] =
          (affinityByBusiness[e.business_id] ?? 0) + 0.35;
      }
      if (e.event_type === "viewed_card" || e.event_type === "expanded_card") {
        affinityByBusiness[e.business_id] =
          (affinityByBusiness[e.business_id] ?? 0) + 0.1;
      }
    }
  }

  const { data: businesses } = await db
    .from("businesses")
    .select("*, current_business_status(*), perks(*)")
    .eq("status", "active")
    .order("name");

  const { data: featured } = await db.from("featured_businesses").select("business_id");

  const featuredSet = new Set((featured ?? []).map((f) => f.business_id));

  const businessIds = (businesses ?? []).map((b) => b.id);
  const { data: summaries } = businessIds.length
    ? await db
        .from("feed_card_summaries")
        .select("*")
        .in("business_id", businessIds)
        .gte("expires_at", new Date().toISOString())
    : { data: [] };

  const summaryByBiz = new Map(
    (summaries ?? []).map((s) => [s.business_id, s.ai_summary])
  );

  const now = new Date();
  const ctx: FeedContext = {
    hour: now.getHours(),
    dayOfWeek: now.getDay(),
    membershipTier,
    distanceMiles: null,
  };

  const cards: FeedCard[] = (businesses ?? []).map((b) => {
    const status = (
      Array.isArray(b.current_business_status)
        ? b.current_business_status[0]
        : b.current_business_status
    ) as Tables<"current_business_status"> | null;

    const perks = (b.perks as Tables<"perks">[]) ?? [];
    const activePerk =
      perks.find((p) => p.id === status?.active_perk_id && p.status === "active") ??
      perks.find((p) => p.status === "active") ??
      null;

    const activeSignals = parseActiveSignals(status?.active_signals);
    if (status?.active_note && !activeSignals.some((s) => s.label === status.active_note)) {
      activeSignals.push({ type: "note", label: status.active_note });
    }

    const { score, personalizedReason } = scoreExperienceForUser(ctx, {
      status,
      featured: featuredSet.has(b.id),
      infraTier: b.infra_tier,
      hasActivePerk: Boolean(activePerk),
      affinity: Math.min(affinityByBusiness[b.id] ?? 0, 1),
      ignoredRecently: ignored.has(b.id),
    });

    const aiSummary =
      summaryByBiz.get(b.id) ??
      ruleBasedSummary(b.name, status?.wait_status ?? null, activeSignals, Boolean(activePerk));

    return {
      businessId: b.id,
      businessName: b.name,
      photo: b.photo_url,
      category: b.category,
      waitStatus: status?.wait_status ?? null,
      availabilityStatus: status?.availability_status ?? null,
      activeSignals,
      activePerk,
      aiSummary,
      personalizedReason,
      distance: null,
      lastUpdated: status?.last_updated_at ?? b.created_at,
      score,
      featured: featuredSet.has(b.id),
    };
  });

  return cards.sort((a, b) => b.score - a.score);
}
