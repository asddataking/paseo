import { getAdminDb } from "./db";
import { startOfDay } from "date-fns";

export async function getDashboardKpis() {
  const db = await getAdminDb();
  const today = startOfDay(new Date()).toISOString();

  const [
    { count: members },
    { count: activeBusinesses },
    { count: liveUpdatesToday },
    { count: redemptionsToday },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }).eq("role", "consumer"),
    db.from("businesses").select("*", { count: "exact", head: true }).eq("status", "active"),
    db.from("live_signals").select("*", { count: "exact", head: true }).gte("created_at", today),
    db.from("redemptions").select("*", { count: "exact", head: true }).gte("created_at", today),
  ]);

  return {
    members: members ?? 0,
    activeBusinesses: activeBusinesses ?? 0,
    liveUpdatesToday: liveUpdatesToday ?? 0,
    redemptionsToday: redemptionsToday ?? 0,
    monthlyRevenue: 0,
  };
}

export async function getNetworkStatus() {
  const db = await getAdminDb();
  const { data } = await db.from("current_business_status").select("wait_status");

  const buckets: Record<string, number> = {
    "No wait": 0,
    "Low wait": 0,
    Moderate: 0,
    Busy: 0,
    Packed: 0,
  };

  for (const row of data ?? []) {
    const w = row.wait_status ?? "No wait";
    if (w in buckets) buckets[w]++;
    else if (w.toLowerCase().includes("low")) buckets["Low wait"]++;
    else buckets.Moderate++;
  }

  return buckets;
}

export async function getLiveFeed(limit = 15) {
  const db = await getAdminDb();
  const { data } = await db
    .from("live_signals")
    .select("*, businesses(name, photo_url)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((s) => {
    const biz = s.businesses as { name: string; photo_url: string | null } | null;
    const value = (s.signal_value ?? s.value) as { label?: string; detail?: string };
    const label = value?.label ?? s.signal_type.replace(/_/g, " ");
    const detail = value?.detail ? ` · ${value.detail}` : "";
    return {
      id: s.id,
      businessName: biz?.name ?? "Unknown",
      signalType: s.signal_type,
      value,
      message: `${label}${detail}`,
      photoUrl: biz?.photo_url ?? null,
      createdAt: s.created_at,
    };
  });
}

export async function getBusinessHealth() {
  const db = await getAdminDb();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const { data: businesses } = await db
    .from("businesses")
    .select("*, current_business_status(*)")
    .order("name");

  const { data: signalCounts } = await db
    .from("live_signals")
    .select("business_id")
    .gte("created_at", weekAgo);

  const { data: redemptionCounts } = await db
    .from("redemptions")
    .select("business_id")
    .gte("created_at", weekAgo);

  const signalsByBiz: Record<string, number> = {};
  const redemptionsByBiz: Record<string, number> = {};

  for (const s of signalCounts ?? []) {
    signalsByBiz[s.business_id] = (signalsByBiz[s.business_id] ?? 0) + 1;
  }
  for (const r of redemptionCounts ?? []) {
    redemptionsByBiz[r.business_id] = (redemptionsByBiz[r.business_id] ?? 0) + 1;
  }

  return (businesses ?? []).map((b) => ({
    ...b,
    statusRow: Array.isArray(b.current_business_status)
      ? b.current_business_status[0]
      : b.current_business_status,
    signals7d: signalsByBiz[b.id] ?? 0,
    redemptions7d: redemptionsByBiz[b.id] ?? 0,
  }));
}

export async function getBusinesses() {
  const db = await getAdminDb();
  const { data } = await db.from("businesses").select("*").order("name");
  return data ?? [];
}

export async function getUsers() {
  const db = await getAdminDb();
  const { data } = await db.from("profiles").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPerks() {
  const db = await getAdminDb();
  const { data } = await db
    .from("perks")
    .select("*, businesses(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getRedemptions() {
  const db = await getAdminDb();
  const { data } = await db
    .from("redemptions")
    .select("*, perks(title), businesses(name)")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function getConsumerFeed() {
  const db = await getAdminDb();
  const { data } = await db
    .from("businesses")
    .select("*, current_business_status(*), perks(*)")
    .eq("status", "active")
    .order("name");

  const { data: featured } = await db
    .from("featured_businesses")
    .select("business_id")
    .gte("featured_until", new Date().toISOString());

  const featuredSet = new Set((featured ?? []).map((f) => f.business_id));

  return (data ?? [])
    .map((b) => {
      const status = Array.isArray(b.current_business_status)
        ? b.current_business_status[0]
        : b.current_business_status;
      const perks = (b.perks as { id: string; status: string; title: string }[]) ?? [];
      const activePerk = perks.find((p) => p.id === status?.active_perk_id && p.status === "active");
      return {
        business: b,
        status,
        activePerk,
        featured: featuredSet.has(b.id),
      };
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const ta = new Date(a.status?.last_updated_at ?? 0).getTime();
      const tb = new Date(b.status?.last_updated_at ?? 0).getTime();
      return tb - ta;
    });
}
