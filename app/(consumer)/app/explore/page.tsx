import Link from "next/link";
import { FeedCard } from "@/components/consumer/FeedCard";
import { buildIntelligentFeed } from "@/lib/feed/buildFeed";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { slug: "", label: "All" },
  { slug: "bowling", label: "Bowling" },
  { slug: "bar", label: "Bar" },
  { slug: "restaurant", label: "Restaurant" },
  { slug: "retail", label: "Retail" },
  { slug: "arcade", label: "Arcade" },
];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const feed = await buildIntelligentFeed();
  const filtered = category
    ? feed.filter(
        (card) => card.category?.toLowerCase() === category.toLowerCase()
      )
    : feed;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Explore</h1>
        <p className="mt-1 text-sm text-stone-600">Browse by category</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(({ slug, label }) => {
          const active = (category ?? "") === slug;
          const href = slug ? `/app/explore?category=${slug}` : "/app/explore";
          return (
            <Link
              key={slug || "all"}
              href={href}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-[var(--accent-gold)] text-[var(--foreground)]"
                  : "bg-[var(--sand)] text-stone-700 hover:brightness-95"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-stone-500">No matches in this category.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((card) => (
            <FeedCard key={card.businessId} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
