import {
  getDashboardKpis,
  getLiveFeed,
  getBusinessHealth,
} from "@/lib/admin/queries";
import { createClient } from "@/lib/supabase/server";
import { AdminHero } from "@/components/admin/overview/AdminHero";
import { AdminKpiStrip } from "@/components/admin/overview/AdminKpiStrip";
import { AdminLiveFeed } from "@/components/admin/overview/AdminLiveFeed";
import { AdminCopilotPanel } from "@/components/admin/overview/AdminCopilotPanel";
import { AdminBusinessGlance } from "@/components/admin/overview/AdminBusinessGlance";
import { AdminEmptyState } from "@/components/admin/overview/AdminEmptyState";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();
    displayName = profile?.full_name ?? profile?.email ?? null;
  }

  const [kpis, feed, health] = await Promise.all([
    getDashboardKpis(),
    getLiveFeed(8),
    getBusinessHealth(),
  ]);

  const allBusinesses = health.length;
  const businessRows = health
    .filter((b) => b.status === "active")
    .map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      infra_tier: b.infra_tier,
      photo_url: b.photo_url,
      wait_status: b.statusRow?.wait_status ?? null,
      active_note: b.statusRow?.active_note ?? null,
      last_updated_at: b.statusRow?.last_updated_at ?? null,
    }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminHero name={displayName} />
      <AdminKpiStrip kpis={kpis} />

      {allBusinesses === 0 && (
        <AdminEmptyState
          title="No businesses on the network yet"
          description="Add your first business from Businesses, or have a partner complete Infra onboarding."
          actionHref="/admin/businesses"
          actionLabel="Add a business"
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminLiveFeed
          items={feed.map((f) => ({
            id: f.id,
            businessName: f.businessName,
            message: f.message,
            createdAt: f.createdAt,
            photoUrl: f.photoUrl,
          }))}
        />
        <AdminCopilotPanel />
      </div>

      <AdminBusinessGlance businesses={businessRows} />
    </div>
  );
}
