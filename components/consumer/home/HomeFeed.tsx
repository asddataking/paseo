"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { FeedCard } from "@/lib/feed/types";
import { FilterChips, type FeedFilter } from "./FilterChips";
import { filterFeedCards } from "./filterFeed";
import { HomeFeedCard } from "./HomeFeedCard";

type Props = {
  feed: FeedCard[];
};

export function HomeFeed({ feed }: Props) {
  const [filter, setFilter] = useState<FeedFilter>("for_you");

  const filtered = useMemo(
    () => filterFeedCards(feed, filter),
    [feed, filter],
  );

  return (
    <>
      <FilterChips active={filter} onChange={setFilter} />

      <section className="px-4">
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-1.5 text-base font-semibold">
              <span>✨</span> Top Picks For You
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Curated from live signals and your tastes
            </p>
          </div>
          <Link
            href="/app/explore"
            className="shrink-0 text-sm font-medium text-[var(--accent-gold)]"
          >
            View all &gt;
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--sand)] bg-white/60 px-6 py-12 text-center">
            <p className="font-serif text-lg text-stone-700">Nothing live yet</p>
            <p className="mt-2 text-sm text-stone-500">
              {feed.length === 0
                ? "When businesses start broadcasting signals, they’ll show up here."
                : "Try another filter — or check back as partners update status."}
            </p>
            {feed.length === 0 && (
              <Link
                href="/business"
                className="mt-4 inline-block text-sm font-medium text-[var(--accent-gold)] underline"
              >
                Own a business? Go live on Paseo
              </Link>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map((card) => (
              <li key={card.businessId}>
                <HomeFeedCard card={card} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
