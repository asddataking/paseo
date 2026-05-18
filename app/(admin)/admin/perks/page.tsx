import { getPerks } from "@/lib/admin/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminPerksPage() {
  const perks = await getPerks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Perks</h1>
        <p className="mt-1 text-sm text-stone-600">
          Active and scheduled member offers by business.
        </p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sand)] bg-[var(--sand)]/30">
              <th className="px-4 py-3 font-medium text-stone-600">Title</th>
              <th className="px-4 py-3 font-medium text-stone-600">Business</th>
              <th className="px-4 py-3 font-medium text-stone-600">Tier</th>
              <th className="px-4 py-3 font-medium text-stone-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {perks.map((p) => (
              <tr key={p.id} className="border-b border-[var(--sand)]/50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-stone-600">
                  {(p.businesses as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge color="gold">{p.tier_required}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge color={p.status === "active" ? "green" : "orange"}>
                    {p.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {perks.length === 0 && (
          <p className="p-6 text-sm text-stone-500">No perks found.</p>
        )}
      </Card>
    </div>
  );
}
