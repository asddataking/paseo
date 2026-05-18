import { getLiveFeed } from "@/lib/admin/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export default async function AdminSignalsPage() {
  const signals = await getLiveFeed(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Signals</h1>
        <p className="mt-1 text-sm text-stone-600">
          Live network activity across all businesses.
        </p>
      </div>

      <Card>
        <ul className="divide-y divide-[var(--sand)]">
          {signals.length === 0 ? (
            <li className="py-8 text-center text-sm text-stone-500">
              No live signals yet.
            </li>
          ) : (
            signals.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">{s.businessName}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    <Badge>{s.signalType}</Badge>
                    {s.value?.label && (
                      <span className="ml-2">{s.value.label}</span>
                    )}
                    {s.value?.detail && (
                      <span className="ml-1 text-stone-500">— {s.value.detail}</span>
                    )}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-stone-500">
                  {formatRelativeTime(s.createdAt)}
                </time>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
