import { AdminCopilotPanel } from "@/components/admin/overview/AdminCopilotPanel";

export default function AdminCopilotPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Paseo Copilot</h1>
        <p className="mt-1 text-sm text-stone-600">
          Mission control AI — summaries, inactive businesses, campaign drafts.
        </p>
      </div>
      <AdminCopilotPanel />
    </div>
  );
}
