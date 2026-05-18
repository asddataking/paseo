import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";
import type { FeedCard as FeedCardData } from "@/lib/feed/types";

export function FeedCard({ card }: { card: FeedCardData }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full bg-[var(--sand)]">
        {card.photo ? (
          <img
            src={card.photo}
            alt={card.businessName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[120px] items-center justify-center text-4xl font-semibold text-stone-400">
            {card.businessName.charAt(0)}
          </div>
        )}
        {card.featured && (
          <Badge color="gold" className="absolute left-3 top-3">
            Featured
          </Badge>
        )}
        {card.distance != null && (
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
            {card.distance} mi
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h2 className="text-lg font-semibold leading-tight">{card.businessName}</h2>
          {card.category && (
            <p className="text-sm capitalize text-stone-500">{card.category}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {card.waitStatus && <Badge color="green">{card.waitStatus}</Badge>}
          {card.availabilityStatus && (
            <Badge color="orange">{card.availabilityStatus}</Badge>
          )}
          {card.activeSignals.slice(0, 2).map((s) => (
            <Badge key={`${s.type}-${s.label}`} color="default">
              {s.label}
            </Badge>
          ))}
        </div>

        {card.activePerk && (
          <div className="rounded-xl bg-amber-50 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-800">
              Active perk
            </p>
            <p className="text-sm font-medium text-amber-900">{card.activePerk.title}</p>
          </div>
        )}

        {card.aiSummary && (
          <p className="text-sm leading-relaxed text-stone-700">{card.aiSummary}</p>
        )}

        {card.personalizedReason && (
          <p className="text-sm font-medium text-[var(--accent-amber)]">
            {card.personalizedReason}
          </p>
        )}

        <p className="text-xs text-stone-500">
          Updated {formatRelativeTime(card.lastUpdated)}
        </p>
      </div>
    </Card>
  );
}
