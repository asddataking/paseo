import { createBusiness } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CreateBusinessForm() {
  return (
    <Card>
      <h2 className="text-base font-semibold">Add business</h2>
      <p className="mt-1 text-sm text-stone-600">
        Create a listing manually. Partners can claim it later via Infra onboarding.
      </p>
      <form action={createBusiness} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Business name"
          className="rounded-xl border border-[var(--sand)] px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          name="category"
          placeholder="Category (restaurant, bar, bowling…)"
          className="rounded-xl border border-[var(--sand)] px-3 py-2 text-sm"
        />
        <select
          name="infra_tier"
          defaultValue="free"
          className="rounded-xl border border-[var(--sand)] px-3 py-2 text-sm"
        >
          <option value="free">Infra Free</option>
          <option value="gold">Infra Gold</option>
          <option value="black">Infra Black</option>
        </select>
        <input
          name="address"
          placeholder="Address"
          className="rounded-xl border border-[var(--sand)] px-3 py-2 text-sm sm:col-span-2"
        />
        <Button type="submit" className="sm:col-span-2">
          Create business
        </Button>
      </form>
    </Card>
  );
}
