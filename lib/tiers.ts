export type MembershipTier = "free" | "gold" | "black";
export type InfraTier = "free" | "gold" | "black";

const tierRank: Record<MembershipTier, number> = {
  free: 0,
  gold: 1,
  black: 2,
};

export function canRedeemPerk(
  userTier: MembershipTier,
  perkTier: MembershipTier
): boolean {
  return tierRank[userTier] >= tierRank[perkTier];
}

export function canManagePerks(infraTier: InfraTier): boolean {
  return infraTier === "gold" || infraTier === "black";
}
