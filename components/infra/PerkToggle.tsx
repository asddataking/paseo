"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleActivePerk } from "@/lib/infra/signals";
import type { Perk } from "@/types/domain";

type PerkToggleProps = {
  businessId: string;
  perks: Perk[];
  activePerkId?: string | null;
};

export function PerkToggle({ businessId, perks, activePerkId }: PerkToggleProps) {
  const [pending, startTransition] = useTransition();
  const activePerks = perks.filter((p) => p.status === "active");

  if (activePerks.length === 0) {
    return (
      <p className="text-sm text-stone-500">No perks configured for this business.</p>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        Active perk
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={!activePerkId ? "primary" : "outline"}
          disabled={pending}
          onClick={() =>
            startTransition(() => toggleActivePerk(businessId, null))
          }
        >
          Off
        </Button>
        {activePerks.map((perk) => (
          <Button
            key={perk.id}
            type="button"
            size="sm"
            variant={activePerkId === perk.id ? "primary" : "outline"}
            disabled={pending}
            onClick={() =>
              startTransition(() => toggleActivePerk(businessId, perk.id))
            }
          >
            {perk.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
