import type { FeedContext } from "./types";
import type { Tables } from "@/types/database";

type Status = Tables<"current_business_status">;

const WAIT_SCORES: Record<string, number> = {
  "no wait": 1,
  "no_wait": 1,
  low: 0.85,
  "low wait": 0.85,
  moderate: 0.6,
  busy: 0.35,
  packed: 0.15,
};

const TIER_BOOST: Record<string, number> = {
  free: 0,
  gold: 0.08,
  black: 0.12,
};

export type ScoreInput = {
  status: Status | null;
  featured: boolean;
  infraTier: string;
  hasActivePerk: boolean;
  affinity: number;
  ignoredRecently: boolean;
};

/** Weighted ranking — precompute-friendly, no LLM per card. */
export function scoreExperienceForUser(
  ctx: FeedContext,
  input: ScoreInput
): { score: number; personalizedReason: string | null } {
  let score = 0;
  const reasons: string[] = [];

  const updatedAt = input.status?.last_updated_at
    ? new Date(input.status.last_updated_at).getTime()
    : 0;
  const ageMins = (Date.now() - updatedAt) / 60000;
  const freshness = Math.max(0, 1 - ageMins / 120);
  score += freshness * 0.25;
  if (freshness > 0.7) reasons.push("Updated recently");

  const waitKey = (input.status?.wait_status ?? "").toLowerCase();
  const waitScore =
    Object.entries(WAIT_SCORES).find(([k]) => waitKey.includes(k))?.[1] ?? 0.5;
  score += waitScore * 0.2;
  if (waitScore >= 0.85) reasons.push("Low wait right now");

  if (input.hasActivePerk) {
    score += 0.12;
    reasons.push("Perk available");
  }

  score += Math.min(input.affinity, 1) * 0.2;
  if (input.affinity > 0.5) reasons.push("Matches your taste");

  const hour = ctx.hour;
  if (hour >= 17 && hour <= 22) {
    score += 0.08;
    reasons.push("Good for tonight");
  }

  if (ctx.distanceMiles != null && ctx.distanceMiles < 5) {
    score += 0.1;
    reasons.push("Nearby");
  }

  score += TIER_BOOST[ctx.membershipTier] ?? 0;

  if (input.featured) score += 0.1;
  if (input.infraTier === "black") score += 0.05;

  score += (ctx.weatherTag === "rain" ? 0.05 : 0);

  if (input.ignoredRecently) score *= 0.5;

  const personalizedReason =
    reasons.length > 0 ? reasons.slice(0, 2).join(" · ") : null;

  return { score: Math.round(score * 1000) / 1000, personalizedReason };
}
