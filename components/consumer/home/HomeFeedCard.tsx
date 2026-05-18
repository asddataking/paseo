"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import type { FeedCard } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

function waitBadgeClass(wait: string | null) {
  if (!wait) return "bg-stone-800/80 text-white";
  const w = wait.toLowerCase();
  if (w.includes("no wait")) return "bg-emerald-600 text-white";
  if (w.includes("low")) return "bg-emerald-600 text-white";
  return "bg-amber-500 text-white";
}

function featureBullets(card: FeedCard): string[] {
  const bullets: string[] = [];
  if (card.availabilityStatus) bullets.push(card.availabilityStatus);
  for (const s of card.activeSignals.slice(0, 3)) {
    if (s.label && !bullets.includes(s.label)) bullets.push(s.label);
  }
  if (bullets.length === 0 && card.aiSummary) {
    bullets.push(card.aiSummary.split(" · ")[0] ?? card.aiSummary);
  }
  return bullets.slice(0, 3);
}

type Props = {
  card: FeedCard;
};

export function HomeFeedCard({ card }: Props) {
  const bullets = featureBullets(card);
  const statusLabel = card.waitStatus ?? card.availabilityStatus ?? "Live now";

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--sand)] bg-white shadow-[var(--card-shadow)]">
      <div className="flex gap-0 sm:gap-0">
        <div className="relative w-[38%] min-w-[120px] shrink-0 bg-[var(--sand)]">
          {card.photo ? (
            <img
              src={card.photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[140px] items-center justify-center bg-gradient-to-br from-[#e8d5a8] to-[#c9a227]/40 font-serif text-3xl text-white/90">
              {card.businessName.charAt(0)}
            </div>
          )}
          <span
            className={cn(
              "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow",
              waitBadgeClass(card.waitStatus),
            )}
          >
            {statusLabel}
          </span>
          <button
            type="button"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow"
            aria-label="Save"
          >
            <Heart className="h-3.5 w-3.5 text-stone-600" />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-stone-500">
            {card.category && (
              <span className="capitalize">{card.category}</span>
            )}
            {card.featured && (
              <>
                <span>·</span>
                <span className="text-[var(--accent-gold)]">Featured</span>
              </>
            )}
          </div>

          <h2 className="mt-1 font-serif text-lg font-semibold leading-snug">
            {card.businessName}
          </h2>

          <ul className="mt-2 space-y-0.5 text-xs text-stone-600">
            {bullets.map((b) => (
              <li key={b} className="flex gap-1.5">
                <span className="text-stone-400">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {card.activePerk && (
            <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-[#faf3e0] px-2 py-1.5">
              <span className="text-xs text-[#c9a227]">◆</span>
              <p className="text-[11px] font-medium leading-snug text-[#7a5c12]">
                Gold perk: {card.activePerk.title}
              </p>
            </div>
          )}

          {card.personalizedReason && (
            <p className="mt-1.5 text-[10px] font-medium text-[var(--accent-amber)]">
              {card.personalizedReason}
            </p>
          )}

          <Link
            href="/app/map"
            className="mt-3 block w-full rounded-xl bg-[#c9a227] py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            Worth Going →
          </Link>
        </div>
      </div>
    </article>
  );
}
