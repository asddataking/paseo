import { buildIntelligentFeed } from "@/lib/feed/buildFeed";
import { createClient } from "@/lib/supabase/server";
import type { MembershipTier } from "@/lib/tiers";
import { format } from "date-fns";

export type HomeCollection = {
  id: string;
  name: string;
  placeCount: number;
};

export async function getHomeData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const feed = await buildIntelligentFeed();

  let displayName = "there";
  let membershipTier: MembershipTier = "free";
  let memberSince: string | null = null;

  let collections: HomeCollection[] = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, membership_tier, created_at")
      .eq("id", user.id)
      .single();

    const rawName = profile?.full_name ?? user.email?.split("@")[0] ?? "there";
    displayName = rawName.split(" ")[0] ?? rawName;
    membershipTier = (profile?.membership_tier as MembershipTier) ?? "free";
    if (profile?.created_at) {
      memberSince = format(new Date(profile.created_at), "MMMM yyyy");
    }

    const { data: cols } = await supabase
      .from("user_collections")
      .select("id, name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8);

    if (cols?.length) {
      const ids = cols.map((c) => c.id);
      const { data: items } = await supabase
        .from("collection_items")
        .select("collection_id")
        .in("collection_id", ids);

      const counts: Record<string, number> = {};
      for (const item of items ?? []) {
        counts[item.collection_id] = (counts[item.collection_id] ?? 0) + 1;
      }

      collections = cols.map((c) => ({
        id: c.id,
        name: c.name,
        placeCount: counts[c.id] ?? 0,
      }));
    }
  }

  return {
    feed,
    displayName,
    membershipTier,
    memberSince,
    collections,
  };
}

export function getTimeGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
