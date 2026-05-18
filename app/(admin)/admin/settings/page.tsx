import { hasServiceClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminSettingsPage() {
  const serviceRoleConfigured = hasServiceClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-stone-600">
          Environment and integration status for admin operations.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--sand)] pb-4">
          <div>
            <p className="font-medium">Supabase URL</p>
            <p className="text-sm text-stone-600">
              Public project URL for client and server clients.
            </p>
          </div>
          <Badge color={supabaseUrl ? "green" : "red"}>
            {supabaseUrl ? "Set" : "Missing"}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Service role key</p>
            <p className="mt-1 max-w-lg text-sm text-stone-600">
              Admin queries require{" "}
              <code className="rounded bg-[var(--sand)] px-1 py-0.5 text-xs">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{" "}
              in <code className="rounded bg-[var(--sand)] px-1 py-0.5 text-xs">.env.local</code>
              . Copy it from Supabase Dashboard → Settings → API. Never expose
              this key to the browser.
            </p>
          </div>
          <Badge color={serviceRoleConfigured ? "green" : "orange"}>
            {serviceRoleConfigured ? "Configured" : "Not set"}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
