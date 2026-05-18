import Link from "next/link";
import { getBusinesses } from "@/lib/admin/queries";
import { featureBusinessForm } from "@/lib/admin/actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateBusinessForm } from "@/components/admin/CreateBusinessForm";

export default async function AdminBusinessesPage() {
  const businesses = await getBusinesses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Businesses</h1>
        <p className="mt-1 text-sm text-stone-600">
          Manage listings, status, and featured placement.
        </p>
      </div>

      <CreateBusinessForm />

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sand)] bg-[var(--sand)]/30">
              <th className="px-4 py-3 font-medium text-stone-600">Name</th>
              <th className="px-4 py-3 font-medium text-stone-600">Category</th>
              <th className="px-4 py-3 font-medium text-stone-600">Status</th>
              <th className="px-4 py-3 font-medium text-stone-600">Tier</th>
              <th className="px-4 py-3 font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.id} className="border-b border-[var(--sand)]/50">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 text-stone-600">{b.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge color={b.status === "active" ? "green" : "default"}>
                    {b.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-stone-600">{b.infra_tier}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/infra/onboarding?business=${b.id}`}
                      className="text-sm font-medium text-[var(--accent-amber)] underline"
                    >
                      Edit
                    </Link>
                    <form action={featureBusinessForm}>
                      <input type="hidden" name="businessId" value={b.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Feature
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {businesses.length === 0 && (
          <p className="p-6 text-sm text-stone-500">No businesses found.</p>
        )}
      </Card>
    </div>
  );
}
