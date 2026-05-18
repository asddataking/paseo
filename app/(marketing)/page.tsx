import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Sparkles, Tag, Star } from "lucide-react";
import { PhonePreview } from "@/components/marketing/PhonePreview";

const valueProps = [
  { icon: Clock, title: "Live Wait Times", desc: "Know before you go." },
  { icon: Tag, title: "Member Perks", desc: "Save on what you love." },
  { icon: Sparkles, title: "Personalized", desc: "Built around your vibe." },
  { icon: Heart, title: "Trusted & Local", desc: "Real businesses, real people." },
];

const features = [
  {
    icon: Clock,
    title: "Know Before You Go",
    desc: "See live wait times and availability so you never waste a trip.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  },
  {
    icon: Tag,
    title: "Member Perks",
    desc: "Unlock exclusive offers from local spots you already love.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  },
  {
    icon: Sparkles,
    title: "Personalized For You",
    desc: "Recommendations that match your taste, time, and mood.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
  {
    icon: Heart,
    title: "Trusted & Local",
    desc: "Real businesses broadcasting real signals — not stale listings.",
    image:
      "https://images.unsplash.com/photo-1556745750-677ef1f7bfa1?w=600&q=80",
  },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    features: [
      "Live wait times",
      "Basic perks",
      "Save favorites",
      "Community updates",
    ],
    cta: "Join Free",
    href: "/login?redirect=/app",
    variant: "outline" as const,
  },
  {
    name: "Gold",
    price: "$13",
    period: "month",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "More member perks",
      "Live availability",
      "Better recommendations",
      "Priority alerts (coming soon)",
    ],
    cta: "Get Gold",
    href: "/login?redirect=/app",
    variant: "gold" as const,
  },
  {
    name: "Black",
    price: "$39",
    period: "month",
    highlight: false,
    features: [
      "Everything in Gold",
      "Premium & VIP perks",
      "Priority access",
      "Concierge picks",
      "Exclusive experiences",
    ],
    cta: "Go Black",
    href: "/login?redirect=/app",
    variant: "dark" as const,
  },
];

export default function ConsumerLandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--sand)]">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 lg:block">
          <Image
            src="/hero-desert.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-90"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-block rounded-full border border-[#e8d5a8] bg-[#faf3e0] px-4 py-1 text-xs font-semibold tracking-widest text-[#9a7b2e]">
              LIVE. LOCAL. EFFORTLESS.
            </span>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Life, without the friction.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-stone-600">
              Real-time updates, smooth experiences, and member perks — all in one
              app.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-stone-600">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>4.9 from 2,300+ members</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login?redirect=/app"
                className="rounded-full bg-[#c9a227] px-8 py-3 text-sm font-semibold text-white shadow-md hover:brightness-105"
              >
                Join Free
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-full border-2 border-[#c9a227] px-8 py-3 text-sm font-semibold text-[#9a7b2e] hover:bg-[#faf3e0]"
              >
                See How It Works
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <PhonePreview />
          </div>
        </div>
      </section>

      {/* Value props strip */}
      <section className="border-b border-[var(--sand)] bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf3e0] text-[#c9a227]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-stone-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-[#c9a227]">
            Made for Real Life
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-xl font-serif text-3xl font-semibold md:text-4xl">
              Everything you need for smoother days and nights.
            </h2>
            <Link
              href="/app"
              className="shrink-0 rounded-full border-2 border-[#c9a227] px-6 py-2.5 text-sm font-semibold text-[#9a7b2e]"
            >
              Explore the App
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article
                key={f.title}
                className="overflow-hidden rounded-2xl border border-[var(--sand)] bg-white shadow-sm"
              >
                <div className="p-5">
                  <f.icon className="h-6 w-6 text-[#c9a227]" />
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {f.desc}
                  </p>
                </div>
                <div className="relative h-36 w-full">
                  <Image
                    src={f.image}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Membership */}
      <section id="membership" className="border-y border-[var(--sand)] bg-[#faf6ee] py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">
            More access. More perks.
            <br />
            More of what matters.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative rounded-2xl bg-white p-8 text-left shadow-sm ${
                  t.highlight
                    ? "border-2 border-[#c9a227] ring-4 ring-[#c9a227]/10"
                    : "border border-[var(--sand)]"
                }`}
              >
                {t.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#c9a227] px-3 py-0.5 text-xs font-semibold text-white">
                    {t.badge}
                  </span>
                )}
                <p className="text-lg font-semibold">{t.name}</p>
                <p className="mt-2">
                  <span className="text-3xl font-bold">{t.price}</span>
                  <span className="text-stone-500"> / {t.period}</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-stone-600">
                  {t.features.map((feat) => (
                    <li key={feat}>✓ {feat}</li>
                  ))}
                </ul>
                <Link
                  href={t.href}
                  className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold ${
                    t.variant === "gold"
                      ? "bg-[#c9a227] text-white"
                      : t.variant === "dark"
                        ? "bg-stone-900 text-white"
                        : "border-2 border-stone-300 text-stone-800"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#faf6ee] px-6 py-16 text-center lg:px-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c9a227] font-serif text-3xl font-bold text-white">
            P
          </div>
          <h2 className="mt-6 font-serif text-3xl font-semibold">
            Your life. Upgraded.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-600">
            Download Paseo and see what&apos;s worth your time, right now.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white">
              Download on the App Store
            </span>
            <span className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white">
              Get it on Google Play
            </span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-stone-600">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span>4.9 · 2,300+ reviews</span>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-[var(--sand)] bg-white py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-6 text-center text-sm text-stone-600 md:grid-cols-4">
          {[
            "Real-time Updates",
            "Member-Only Perks",
            "Smarter Decisions",
            "Cancel Anytime",
          ].map((label) => (
            <p key={label} className="font-medium">
              {label}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
