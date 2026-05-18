import type { Tables } from "@/types/database";

export type ActiveSignal = {
  type: string;
  label: string;
  at?: string;
};

export type FeedCard = {
  businessId: string;
  businessName: string;
  photo: string | null;
  category: string | null;
  waitStatus: string | null;
  availabilityStatus: string | null;
  activeSignals: ActiveSignal[];
  activePerk: Tables<"perks"> | null;
  aiSummary: string | null;
  personalizedReason: string | null;
  distance: string | null;
  lastUpdated: string;
  score: number;
  featured: boolean;
};

export type FeedContext = {
  hour: number;
  dayOfWeek: number;
  membershipTier: "free" | "gold" | "black";
  /** miles — null = unknown */
  distanceMiles: number | null;
  weatherTag?: string | null;
};
