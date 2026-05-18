import type { Tables } from "./database";

export type Profile = Tables<"profiles">;
export type Business = Tables<"businesses">;
export type LiveSignal = Tables<"live_signals">;
export type CurrentStatus = Tables<"current_business_status">;
export type Perk = Tables<"perks">;
export type Redemption = Tables<"redemptions">;

export type BusinessWithStatus = Business & {
  current_business_status: CurrentStatus | null;
  perks?: Perk[];
};

export type FeedItem = {
  business: Business;
  status?: CurrentStatus | null;
  activePerk?: Perk | null;
  featured?: boolean;
};
