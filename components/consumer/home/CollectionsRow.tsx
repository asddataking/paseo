import Link from "next/link";
import type { HomeCollection } from "@/lib/consumer/getHomeData";

const STARTER_COLLECTIONS = [
  { name: "Date Night", gradient: "from-rose-900/80 to-rose-700/60" },
  { name: "Family Fun", gradient: "from-amber-900/70 to-orange-800/50" },
  { name: "Cozy Cafés", gradient: "from-stone-800/70 to-amber-900/50" },
  { name: "Hidden Gems", gradient: "from-emerald-900/70 to-teal-800/50" },
];

type Props = {
  collections: HomeCollection[];
};

export function CollectionsRow({ collections }: Props) {
  const items =
    collections.length > 0
      ? collections.map((c) => ({
          key: c.id,
          name: c.name,
          subtitle: `${c.placeCount} place${c.placeCount === 1 ? "" : "s"}`,
          gradient: "from-stone-800/75 to-stone-600/50",
        }))
      : STARTER_COLLECTIONS.map((c) => ({
          key: c.name,
          name: c.name,
          subtitle: "Start saving places",
          gradient: c.gradient,
        }));

  return (
    <section className="mt-8 pb-2">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-semibold">🤎 Your Collections</h2>
        <Link href="/app/account" className="text-sm font-medium text-[var(--accent-gold)]">
          Manage
        </Link>
      </div>
      <div className="scrollbar-none flex gap-3 overflow-x-auto px-4">
        {items.map((item) => (
          <div
            key={item.key}
            className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} shadow-md`}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <p className="text-sm font-semibold leading-tight text-white">
                {item.name}
              </p>
              <p className="text-[10px] text-white/80">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
