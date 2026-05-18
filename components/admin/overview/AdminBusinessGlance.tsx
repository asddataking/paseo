"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type BusinessRow = {
  id: string;
  name: string;
  category: string | null;
  infra_tier: string;
  photo_url: string | null;
  wait_status: string | null;
  active_note: string | null;
  last_updated_at: string | null;
};

const FILTERS = ["All", "No wait", "Moderate", "Busy", "Packed"] as const;

function waitBadgeClass(wait: string | null) {
  const w = (wait ?? "").toLowerCase();
  if (w.includes("no wait")) return "bg-emerald-100 text-emerald-800";
  if (w.includes("moderate")) return "bg-orange-100 text-orange-800";
  if (w.includes("busy")) return "bg-red-100 text-red-800";
  if (w.includes("packed")) return "bg-violet-100 text-violet-800";
  return "bg-stone-100 text-stone-700";
}

function matchesFilter(wait: string | null, filter: string) {
  if (filter === "All") return true;
  return (wait ?? "").toLowerCase().includes(filter.toLowerCase().replace(" wait", ""));
}

export function AdminBusinessGlance({ businesses }: { businesses: BusinessRow[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo(
    () => businesses.filter((b) => matchesFilter(b.wait_status, filter)),
    [businesses, filter]
  );

  return (
    <div className="rounded-2xl border border-[var(--sand)]/60 bg-white shadow-[var(--card-shadow)]">
      <div className="border-b border-[var(--sand)]/60 p-4">
        <h2 className="text-base font-semibold">Businesses at a glance</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition",
                filter === f
                  ? "bg-[var(--foreground)] text-white"
                  : "bg-[var(--sand)]/50 text-stone-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-[var(--sand)]/60">
        {filtered.length === 0 && (
          <li className="p-8 text-center text-sm text-stone-500">
            No businesses match this filter. Add businesses from the Businesses tab.
          </li>
        )}
        {filtered.map((b) => (
          <li key={b.id} className="flex items-center gap-3 p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--sand)]">
              {b.photo_url ? (
                <Image src={b.photo_url} alt="" fill className="object-cover" unoptimized />
              ) : (
                <span className="flex h-full items-center justify-center font-semibold text-stone-400">
                  {b.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{b.name}</p>
              <p className="text-xs text-stone-500">
                {b.category ?? "Business"} · {b.infra_tier} Infra
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {b.wait_status && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      waitBadgeClass(b.wait_status)
                    )}
                  >
                    {b.wait_status}
                  </span>
                )}
                {b.active_note && (
                  <span className="text-xs text-stone-500">{b.active_note}</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-stone-400">
                {b.last_updated_at
                  ? formatRelativeTime(b.last_updated_at)
                  : "—"}
              </span>
              <button type="button" className="p-1 text-stone-400" aria-label="More">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
