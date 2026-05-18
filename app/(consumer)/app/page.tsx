import { FeedCard } from "@/components/consumer/FeedCard";
import { buildIntelligentFeed } from "@/lib/feed/buildFeed";

export default async function HomePage() {
  const feed = await buildIntelligentFeed();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-[var(--accent-gold)]">Paseo</p>
        <h1 className="text-2xl font-semibold">Worth going now</h1>
        <p className="mt-1 text-sm text-stone-600">
          Curated for you — live wait, signals, and perks
        </p>
      </header>

      {feed.length === 0 ? (
        <p className="text-center text-stone-500">No live businesses yet.</p>
      ) : (
        <div className="space-y-4">
          {feed.map((card) => (
            <FeedCard key={card.businessId} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
