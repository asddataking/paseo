import Link from "next/link";
import { PerkToggle } from "@/components/infra/PerkToggle";
import { SignalPad } from "@/components/infra/SignalPad";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { parseBusinessConfig } from "@/lib/infra/config";
import { getInfraBusiness } from "@/lib/infra/queries";
import { canManagePerks, type InfraTier } from "@/lib/tiers";
import type { Perk } from "@/types/domain";

export default async function InfraPage() {
  const business = await getInfraBusiness();

  if (!business) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Your Business Is Live</h1>
        <p className="text-stone-600">No businesses in the network yet.</p>
        <Link
          href="/infra/onboarding"
          className="inline-flex rounded-xl bg-[var(--accent-gold)] px-6 py-3 font-medium shadow-sm"
        >
          Start onboarding
        </Link>
      </div>
    );
  }

  const labels = parseBusinessConfig(business.business_config);
  const infraTier = (business.infra_tier ?? "free") as InfraTier;
  const showPerks = canManagePerks(infraTier);
  const perks = (business.perks as Perk[]) ?? [];
  const status = business.current_business_status as {
    active_perk_id?: string | null;
  } | null;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-[var(--accent-gold)]">Live console</p>
        <h1 className="text-2xl font-semibold">Your Business Is Live</h1>
        <p className="mt-1 text-lg">{business.name as string}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge className="capitalize">{business.status as string}</Badge>
          <Badge color="gold" className="capitalize">
            {infraTier} infra
          </Badge>
        </div>
      </header>

      <SignalPad
        businessId={business.id as string}
        waitLabels={labels.waitLabels}
        availabilityLabels={labels.availabilityLabels}
        signalOptions={labels.signalOptions}
      />

      {showPerks ? (
        <PerkToggle
          businessId={business.id as string}
          perks={perks}
          activePerkId={status?.active_perk_id}
        />
      ) : (
        <Card className="border border-dashed border-[var(--sand)] bg-transparent text-sm text-stone-600">
          Upgrade to Gold or Black infra to toggle active perks.
        </Card>
      )}
    </div>
  );
}
