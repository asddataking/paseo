import { OnboardingWizard } from "@/components/infra/OnboardingWizard";
import { getBusinesses } from "@/lib/admin/queries";

export default async function InfraOnboardingPage() {
  const businesses = await getBusinesses();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Business onboarding</h1>
        <p className="mt-1 text-sm text-stone-600">
          Claim a business, configure signals, and go live.
        </p>
      </header>
      <OnboardingWizard businesses={businesses} />
    </div>
  );
}
