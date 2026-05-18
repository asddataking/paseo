import type { FeedCard } from "@/lib/feed/types";
import type { FeedFilter } from "./FilterChips";

export function filterFeedCards(cards: FeedCard[], filter: FeedFilter): FeedCard[] {
  switch (filter) {
    case "tonight": {
      const hour = new Date().getHours();
      if (hour < 17) {
        return cards.filter(
          (c) =>
            c.category?.match(/bar|bowling|theater|night/i) ||
            c.activeSignals.some((s) => /night|evening|cosmic/i.test(s.label)),
        );
      }
      return cards;
    }
    case "low_wait":
      return cards.filter((c) => {
        const w = (c.waitStatus ?? "").toLowerCase();
        return w.includes("no wait") || w.includes("low");
      });
    case "family":
      return cards.filter(
        (c) =>
          c.category?.match(/family|pizza|bowling|caf/i) ||
          c.activeSignals.some((s) => /family|kids/i.test(s.label)),
      );
    case "date_night":
      return cards.filter(
        (c) =>
          c.category?.match(/restaurant|bar|italian|wine/i) ||
          c.activeSignals.some((s) => /patio|date/i.test(s.label)),
      );
    case "nearby":
      return cards;
    case "for_you":
    default:
      return cards;
  }
}
