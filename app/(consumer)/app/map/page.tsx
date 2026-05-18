import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getConsumerFeed } from "@/lib/admin/queries";
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Map</h1>
        <p className="mt-1 text-sm text-stone-600">
          Live status — map view coming soon
        </p>
      </header>

      {feed.length === 0 ? (
        <p className="text-center text-stone-500">No businesses on the map yet.</p>
      ) : (
        <ul className="space-y-3">
          {feed.map(({ business, status }) => (
            <li key={business.id}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{business.name}</p>
                    {business.address && (
                      <p className="text-sm text-stone-500">{business.address}</p>
                    )}
                    <p className="mt-1 text-xs text-stone-400">
                      {status?.last_updated_at
                        ? formatRelativeTime(status.last_updated_at)
                        : "No updates"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {status?.wait_status && (
                    <Badge color={waitBadgeColor(status.wait_status)}>
                      {status.wait_status}
                    </Badge>
                  )}
                  {status?.availability_status && (
                    <Badge color="green">{status.availability_status}</Badge>
                  )}
                  {status?.active_note && (
                    <Badge>{status.active_note}</Badge>
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
