import { getRedemptions } from "@/lib/admin/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export default async function AdminRedemptionsPage() {
  const redemptions = await getRedemptions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Redemptions</h1>
        <p className="mt-1 text-sm text-stone-600">
          Recent perk redemptions across the network.
        </p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sand)] bg-[var(--sand)]/30">
              <th className="px-4 py-3 font-medium text-stone-600">Code</th>
              <th className="px-4 py-3 font-medium text-stone-600">Perk</th>
              <th className="px-4 py-3 font-medium text-stone-600">Business</th>
              <th className="px-4 py-3 font-medium text-stone-600">Status</th>
              <th className="px-4 py-3 font-medium text-stone-600">When</th>
            </tr>
          </thead>
          <tbody>
            {redemptions.map((r) => (
              <tr key={r.id} className="border-b border-[var(--sand)]/50">
                <td className="px-4 py-3 font-mono text-xs">
                  {r.redemption_code}
                </td>
                <td className="px-4 py-3">
                  {(r.perks as { title: string } | null)?.title ?? "—"}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {(r.businesses as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge color={r.status === "redeemed" ? "green" : "default"}>
                    {r.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {formatRelativeTime(r.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {redemptions.length === 0 && (
          <p className="p-6 text-sm text-stone-500">No redemptions yet.</p>
        )}
      </Card>
    </div>
  );
}
