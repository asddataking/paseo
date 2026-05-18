"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { emitSignal } from "@/lib/infra/signals";

const DEFAULT_WAIT = ["No wait", "Low wait", "Moderate", "Busy", "Packed"];
const DEFAULT_AVAILABILITY = ["Open", "Limited", "At capacity", "Closed"];
const DEFAULT_SIGNALS = [
  "Live music tonight",
  "Happy hour",
  "Family night",
  "Special event",
];

type SignalPadProps = {
  businessId: string;
  waitLabels?: string[];
  availabilityLabels?: string[];
  signalOptions?: string[];
};

export function SignalPad({
  businessId,
  waitLabels = DEFAULT_WAIT,
  availabilityLabels = DEFAULT_AVAILABILITY,
  signalOptions = DEFAULT_SIGNALS,
}: SignalPadProps) {
  const [pending, startTransition] = useTransition();

  function send(
    signalType: "wait_status" | "availability" | "event",
    label: string
  ) {
    startTransition(async () => {
      await emitSignal({
        businessId,
        signalType,
        value: { label },
      });
    });
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Wait
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {waitLabels.map((label) => (
            <Button
              key={label}
              type="button"
              size="xl"
              variant="secondary"
              disabled={pending}
              className="min-h-[72px] text-base"
              onClick={() => send("wait_status", label)}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Availability
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {availabilityLabels.map((label) => (
            <Button
              key={label}
              type="button"
              size="xl"
              variant="outline"
              disabled={pending}
              className="min-h-[72px] text-base"
              onClick={() => send("availability", label)}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Tonight
        </h2>
        <div className="flex flex-wrap gap-2">
          {signalOptions.map((label) => (
            <button
              key={label}
              type="button"
              disabled={pending}
              onClick={() => send("event", label)}
              className="rounded-full border border-[var(--sand)] bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--sand)] disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
