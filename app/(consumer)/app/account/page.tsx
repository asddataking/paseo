import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { MembershipTier } from "@/lib/tiers";
import Link from "next/link";

const PLANS = [
  {
    tier: "free" as const,
    name: "Free",
    price: "$0",
    description: "Browse live status and free-tier perks.",
    features: ["Live feed", "Free perks", "Map list view"],
  },
  {
    tier: "gold" as const,
    name: "Gold",
    price: "$9/mo",
    description: "Gold perks and priority experiences.",
    features: ["All Free benefits", "Gold-tier perks", "Early signals"],
    highlighted: true,
  },
  {
    tier: "black" as const,
    name: "Black",
    price: "$19/mo",
    description: "Premium access and exclusive offers.",
    features: ["All Gold benefits", "Black-tier perks", "Premium placement"],
  },
];

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName = "Member";
  let tier: MembershipTier = "free";
  let email: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, membership_tier, email")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "Member";
    tier = (profile?.membership_tier ?? "free") as MembershipTier;
    email = profile?.email ?? user.email ?? null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Account</h1>
      </header>

      <Card>
        <p className="text-sm text-stone-500">Signed in as</p>
        <p className="text-lg font-semibold">{fullName}</p>
        {email && <p className="text-sm text-stone-600">{email}</p>}
        <div className="mt-3">
          <span className="text-sm text-stone-500">Membership </span>
          <Badge color="gold" className="capitalize">
            {tier}
          </Badge>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Plans</h2>
        <div className="space-y-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.tier}
              className={
                plan.highlighted
                  ? "ring-2 ring-[var(--accent-gold)]"
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold text-[var(--accent-gold)]">
                    {plan.price}
                  </p>
                </div>
                {tier === plan.tier && (
                  <Badge color="green">Current</Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-stone-600">{plan.description}</p>
              <ul className="mt-3 space-y-1 text-sm text-stone-600">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              {tier !== plan.tier && (
                <Button type="button" variant="outline" className="mt-4 w-full" disabled>
                  Upgrade coming soon
                </Button>
              )}
            </Card>
          ))}
        </div>
      </section>

      <Link href="/login" className="block text-center text-sm text-stone-500 underline">
        Sign out / switch account
      </Link>
    </div>
  );
}
