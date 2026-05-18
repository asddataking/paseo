"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { redeemPerk } from "@/lib/consumer/actions";

export function RedeemButton({
  perkId,
  canRedeem,
  tierRequired,
}: {
  perkId: string;
  canRedeem: boolean;
  tierRequired: string;
}) {
  const [pending, startTransition] = useTransition();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleRedeem() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await redeemPerk(perkId);
        setCode(result.code);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not redeem");
      }
    });
  }

  if (code) {
    return (
      <div className="text-right">
        <p className="text-xs text-stone-500">Your code</p>
        <p className="font-mono text-lg font-bold tracking-widest text-[var(--accent-gold)]">
          {code}
        </p>
      </div>
    );
  }

  return (
    <div className="text-right">
      {error && <p className="mb-1 text-xs text-red-600">{error}</p>}
      <Button
        type="button"
        size="sm"
        disabled={!canRedeem || pending}
        onClick={handleRedeem}
      >
        {canRedeem ? (pending ? "..." : "Redeem") : `Needs ${tierRequired}`}
      </Button>
    </div>
  );
}
