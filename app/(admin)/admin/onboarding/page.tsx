import Link from "next/link";
import { getBusinesses } from "@/lib/admin/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminOnboardingPage() {
  const businesses = await getBusinesses();
  const unclaimed = businesses.filter((b) => !b.claimed_by);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Onboarding</h1>
        <p className="mt-1 text-sm text-stone-600">
          Unclaimed businesses waiting for infra claim.
        </p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sand)] bg-[var(--sand)]/30">
              <th className="px-4 py-3 font-medium text-stone-600">Name</th>
              <th className="px-4 py-3 font-medium text-stone-600">Category</th>
              <th className="px-4 py-3 font-medium text-stone-600">Status</th>
              <th className="px-4 py-3 font-medium text-stone-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {unclaimed.map((b) => (
              <tr key={b.id} className="border-b border-[var(--sand)]/50">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 text-stone-600">{b.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge color="orange">{b.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/infra/onboarding?business=${b.id}`}
                    className="text-sm font-medium text-[var(--accent-amber)] underline"
                  >
                    Open claim flow
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {unclaimed.length === 0 && (
          <p className="p-6 text-sm text-stone-500">
            All businesses are claimed. Nice work.
          </p>
        )}
      </Card>
    </div>
  );
}
