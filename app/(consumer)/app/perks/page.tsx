import { RedeemButton } from "@/components/consumer/RedeemButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPerks } from "@/lib/admin/queries";
import { createClient } from "@/lib/supabase/server";
import { canRedeemPerk, type MembershipTier } from "@/lib/tiers";

const TIER_ORDER: MembershipTier[] = ["free", "gold", "black"];
const TIER_LABELS: Record<MembershipTier, string> = {
  free: "Free",
  gold: "Gold",
  black: "Black",
};

export default async function PerksPage() {
  const perks = await getPerks();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userTier: MembershipTier = "free";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_tier")
      .eq("id", user.id)
      .single();
    userTier = (profile?.membership_tier ?? "free") as MembershipTier;
  }

  const activePerks = perks.filter((p) => p.status === "active");

  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    label: TIER_LABELS[tier],
    perks: activePerks.filter(
      (p) => (p.tier_required as MembershipTier) === tier
    ),
  })).filter((g) => g.perks.length > 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Perks</h1>
        <p className="mt-1 text-sm text-stone-600">
          Member rewards by tier — you&apos;re on{" "}
          <Badge color="gold" className="align-middle capitalize">
            {userTier}
          </Badge>
        </p>
      </header>

      {grouped.length === 0 ? (
        <p className="text-center text-stone-500">No active perks right now.</p>
      ) : (
        grouped.map(({ tier, label, perks: tierPerks }) => (
          <section key={tier}>
            <h2 className="mb-3 text-lg font-semibold">{label}</h2>
            <div className="space-y-3">
              {tierPerks.map((perk) => {
                const businessName =
                  (perk.businesses as { name: string } | null)?.name ?? "Business";
                const canRedeem = canRedeemPerk(
                  userTier,
                  perk.tier_required as MembershipTier
                );
                return (
                  <Card key={perk.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-medium">{perk.title}</p>
                      <p className="text-sm text-stone-500">{businessName}</p>
                      {perk.description && (
                        <p className="mt-1 text-sm text-stone-600">{perk.description}</p>
                      )}
                    </div>
                    <RedeemButton
                      perkId={perk.id}
                      canRedeem={canRedeem}
                      tierRequired={perk.tier_required}
                    />
                  </Card>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
