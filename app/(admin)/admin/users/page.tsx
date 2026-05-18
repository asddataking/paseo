import { getUsers } from "@/lib/admin/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-stone-600">
          Member profiles, roles, and membership tiers.
        </p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sand)] bg-[var(--sand)]/30">
              <th className="px-4 py-3 font-medium text-stone-600">Name</th>
              <th className="px-4 py-3 font-medium text-stone-600">Email</th>
              <th className="px-4 py-3 font-medium text-stone-600">Role</th>
              <th className="px-4 py-3 font-medium text-stone-600">Tier</th>
              <th className="px-4 py-3 font-medium text-stone-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--sand)]/50">
                <td className="px-4 py-3 font-medium">
                  {u.full_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-stone-600">{u.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge color={u.role === "admin" ? "gold" : "default"}>
                    {u.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge color="green">{u.membership_tier}</Badge>
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-6 text-sm text-stone-500">No users found.</p>
        )}
      </Card>
    </div>
  );
}
