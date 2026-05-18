import { BusinessMapLoader } from "@/components/consumer/BusinessMapLoader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getConsumerFeed } from "@/lib/admin/queries";
import { toMapMarkers } from "@/lib/map/toMapMarkers";
import { formatRelativeTime } from "@/lib/utils";

function waitBadgeColor(wait: string | null | undefined) {
  if (!wait) return "default" as const;
  const w = wait.toLowerCase();
  if (w.includes("no wait")) return "green" as const;
  if (w.includes("low")) return "green" as const;
  if (w.includes("moderate")) return "orange" as const;
  if (w.includes("busy") || w.includes("packed")) return "red" as const;
  return "default" as const;
}

export default async function MapPage() {
  const feed = await getConsumerFeed();
  const markers = toMapMarkers(feed);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Map</h1>
        <p className="mt-1 text-sm text-stone-600">
          Live status near you — tap a pin for details
        </p>
      </header>

      <BusinessMapLoader markers={markers} />

      {markers.length === 0 ? (
        <p className="text-center text-sm text-stone-500">
          No businesses on the map yet. Check back when partners go live.
        </p>
      ) : (
        <ul className="space-y-2">
          {feed.map(({ business, status }) => (
            <li key={business.id}>
              <Card className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{business.name}</p>
                    {business.address && (
                      <p className="text-xs text-stone-500">{business.address}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {status?.last_updated_at
                      ? formatRelativeTime(status.last_updated_at)
                      : "—"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {status?.wait_status && (
                    <Badge color={waitBadgeColor(status.wait_status)}>
                      {status.wait_status}
                    </Badge>
                  )}
                  {status?.availability_status && (
                    <Badge color="green">{status.availability_status}</Badge>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
