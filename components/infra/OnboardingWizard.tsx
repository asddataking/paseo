"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeedCard } from "@/components/consumer/FeedCard";
import { finishOnboarding } from "@/lib/infra/onboarding";
import type { Business } from "@/types/domain";
import type { FeedItem } from "@/types/domain";

const CATEGORIES = [
  "restaurant",
  "bar",
  "cafe",
  "retail",
  "entertainment",
  "wellness",
];

const DEFAULT_WAIT = ["No wait", "Low wait", "Moderate", "Busy", "Packed"];
const DEFAULT_AVAILABILITY = ["Open", "Limited", "At capacity", "Closed"];
const DEFAULT_SIGNALS = [
  "Live music tonight",
  "Happy hour",
  "Family night",
  "Special event",
];

type OnboardingWizardProps = {
  businesses: Business[];
};

export function OnboardingWizard({ businesses }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [category, setCategory] = useState("restaurant");
  const [waitLabels, setWaitLabels] = useState(DEFAULT_WAIT);
  const [availabilityLabels, setAvailabilityLabels] = useState(DEFAULT_AVAILABILITY);
  const [signalOptions, setSignalOptions] = useState(DEFAULT_SIGNALS);
  const [perkTitle, setPerkTitle] = useState("");

  const selected = businesses.find((b) => b.id === selectedId);

  const previewItem: FeedItem | null = selected
    ? {
        business: { ...selected, category },
        status: {
          business_id: selected.id,
          wait_status: waitLabels[0] ?? "No wait",
          availability_status: availabilityLabels[0] ?? "Open",
          active_perk_id: null,
          active_note: null,
          active_signals: [],
          last_updated_at: new Date().toISOString(),
        },
        activePerk: perkTitle
          ? {
              id: "preview",
              business_id: selected.id,
              title: perkTitle,
              description: null,
              tier_required: "free",
              status: "active",
              starts_at: null,
              ends_at: null,
              created_at: new Date().toISOString(),
            }
          : null,
      }
    : null;

  function finish() {
    if (!selectedId) return;
    startTransition(async () => {
      await finishOnboarding({
        businessId: selectedId,
        category,
        businessConfig: {
          wait_labels: waitLabels,
          availability_labels: availabilityLabels,
          signal_options: signalOptions,
        },
        perkTitle: perkTitle || undefined,
      });
      router.push("/infra");
    });
  }

  return (
    <Card>
      <p className="text-sm text-stone-500">
        Step {step + 1} of 5
      </p>

      {step === 0 && (
        <div className="mt-4 space-y-3">
          <h2 className="text-xl font-semibold">Pick your business</h2>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {businesses.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedId(b.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedId === b.id
                    ? "border-[var(--accent-gold)] bg-amber-50"
                    : "border-[var(--sand)] hover:bg-[var(--sand)]"
                }`}
              >
                <p className="font-medium">{b.name}</p>
                {b.address && (
                  <p className="text-sm text-stone-500">{b.address}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-4 space-y-3">
          <h2 className="text-xl font-semibold">Choose category</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                  category === c
                    ? "bg-[var(--accent-gold)] text-[var(--foreground)]"
                    : "bg-[var(--sand)] hover:brightness-95"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 space-y-4">
          <h2 className="text-xl font-semibold">Configure signal chips</h2>
          <ChipEditor label="Wait labels" values={waitLabels} onChange={setWaitLabels} />
          <ChipEditor
            label="Availability"
            values={availabilityLabels}
            onChange={setAvailabilityLabels}
          />
          <ChipEditor
            label="Tonight signals"
            values={signalOptions}
            onChange={setSignalOptions}
          />
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 space-y-3">
          <h2 className="text-xl font-semibold">Optional perk</h2>
          <input
            type="text"
            placeholder="e.g. Free appetizer with entrée"
            value={perkTitle}
            onChange={(e) => setPerkTitle(e.target.value)}
            className="w-full rounded-xl border border-[var(--sand)] bg-white px-4 py-3"
          />
          <p className="text-sm text-stone-500">Leave blank to skip.</p>
        </div>
      )}

      {step === 4 && previewItem && (
        <div className="mt-4 space-y-3">
          <h2 className="text-xl font-semibold">Preview your feed card</h2>
          <FeedCard
            card={{
              businessId: previewItem.business.id,
              businessName: previewItem.business.name,
              photo: previewItem.business.photo_url,
              category: previewItem.business.category,
              waitStatus: previewItem.status?.wait_status ?? null,
              availabilityStatus: previewItem.status?.availability_status ?? null,
              activeSignals: [],
              activePerk: previewItem.activePerk ?? null,
              aiSummary: null,
              personalizedReason: null,
              distance: null,
              lastUpdated:
                previewItem.status?.last_updated_at ?? new Date().toISOString(),
              score: 0,
              featured: false,
            }}
          />
        </div>
      )}

      <div className="mt-8 flex justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={step === 0 || pending}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button
            type="button"
            disabled={(step === 0 && !selectedId) || pending}
            onClick={() => setStep((s) => s + 1)}
          >
            Next
          </Button>
        ) : (
          <Button type="button" disabled={pending} onClick={finish}>
            {pending ? "Launching..." : "Go live"}
          </Button>
        )}
      </div>
    </Card>
  );
}

function ChipEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-stone-600">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--sand)] px-3 py-1 text-sm"
          >
            {v}
            <button
              type="button"
              className="text-stone-400 hover:text-stone-700"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              aria-label={`Remove ${v}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--sand)] px-3 py-2 text-sm"
          placeholder="Add label"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            if (draft.trim()) {
              onChange([...values, draft.trim()]);
              setDraft("");
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
