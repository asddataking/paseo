import { getAdminDb } from "@/lib/admin/db";
import { startOfDay } from "date-fns";

export async function getDashboardSummary() {
  const db = await getAdminDb();
  const today = startOfDay(new Date()).toISOString();

  const [{ count: members }, { count: businesses }, { count: signals }, { count: redemptions }] =
    await Promise.all([
      db.from("profiles").select("*", { count: "exact", head: true }).eq("role", "consumer"),
      db.from("businesses").select("*", { count: "exact", head: true }).eq("status", "active"),
      db.from("live_signals").select("*", { count: "exact", head: true }).gte("created_at", today),
      db.from("redemptions").select("*", { count: "exact", head: true }).gte("created_at", today),
    ]);

  return {
    members: members ?? 0,
    activeBusinesses: businesses ?? 0,
    signalsToday: signals ?? 0,
    redemptionsToday: redemptions ?? 0,
  };
}

export async function getBusinessesList(limit = 10) {
  const db = await getAdminDb();
  const { data } = await db
    .from("businesses")
    .select("id, name, status, category, infra_tier")
    .order("name")
    .limit(limit);
  return data ?? [];
}

export async function getInactiveBusinesses(hours = 24) {
  const db = await getAdminDb();
  const since = new Date(Date.now() - hours * 3600000).toISOString();
  const { data: businesses } = await db
    .from("businesses")
    .select("id, name, current_business_status(last_updated_at)")
    .eq("status", "active");

  return (businesses ?? []).filter((b) => {
    const st = Array.isArray(b.current_business_status)
      ? b.current_business_status[0]
      : b.current_business_status;
    const updated = st?.last_updated_at;
    return !updated || updated < since;
  }).map((b) => ({ id: b.id, name: b.name }));
}

export async function summarizeToday() {
  return getDashboardSummary();
}

export async function suggestBusinessesToContact() {
  return getInactiveBusinesses(24);
}

export const copilotTools = {
  getDashboardSummary: {
    description: "Get KPI summary: members, active businesses, signals and redemptions today",
    execute: getDashboardSummary,
  },
  getBusinesses: {
    description: "List businesses (max 10)",
    execute: () => getBusinessesList(10),
  },
  getInactiveBusinesses: {
    description: "Businesses with no status update in N hours (default 24)",
    execute: () => getInactiveBusinesses(24),
  },
  summarizeToday: {
    description: "Summarize today's operational performance",
    execute: summarizeToday,
  },
  suggestBusinessesToContact: {
    description: "Businesses that should be nudged to update live status",
    execute: suggestBusinessesToContact,
  },
} as const;

export type CopilotToolName = keyof typeof copilotTools;
