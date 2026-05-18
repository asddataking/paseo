import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const points = [
  "No hardware required",
  "No POS integration required",
  "Update from any phone in under 5 seconds",
  "Reach customers when it matters",
];

const tiers = [
  {
    name: "Infra Free",
    price: "$0",
    items: ["Claim business", "Live updates", "Basic visibility"],
  },
  {
    name: "Infra Gold",
    price: "$99/mo",
    items: ["Add perks", "Redemption tracking", "Featured visibility", "Better analytics"],
  },
  {
    name: "Infra Black",
    price: "$299/mo",
    items: ["Push campaigns", "Premium placement", "AI insights", "Advanced reporting"],
  },
];

export default function BusinessLandingPage() {
  return (
    <div>
      <section className="border-b border-[var(--sand)] bg-gradient-to-b from-[var(--sand)]/50 to-[var(--background)]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent-gold)]">
            Paseo Infra
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Put your business live in Paseo.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Paseo Infra lets your team update wait times, availability, specials, and perks in
            seconds.
          </p>
          <Link href="/infra/onboarding" className="mt-10 inline-block">
            <Button size="lg">Claim Your Infra</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <ul className="grid gap-4 sm:grid-cols-2">
          {points.map((p) => (
            <li
              key={p}
              className="rounded-2xl border border-[var(--sand)] bg-white px-5 py-4 text-sm font-medium text-stone-700"
            >
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--sand)] bg-[var(--sand)]/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold">Infra plans</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <Card key={t.name}>
                <p className="text-sm font-medium text-[var(--accent-gold)]">
                  {t.name} · {t.price}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-600">
                  {t.items.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <Link href="/infra/onboarding" className="inline-block">
          <Button size="xl">Claim Your Infra</Button>
        </Link>
        <p className="mt-6">
          <Link href="/" className="text-sm text-stone-500 underline">
            ← Consumer home
          </Link>
        </p>
      </section>
    </div>
  );
}
