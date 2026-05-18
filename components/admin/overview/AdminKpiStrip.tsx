import {
  Activity,
  Briefcase,
  DollarSign,
  Ticket,
  Users,
} from "lucide-react";

type Kpis = {
  members: number;
  activeBusinesses: number;
  liveUpdatesToday: number;
  redemptionsToday: number;
  monthlyRevenue: number;
};

const items = (k: Kpis) => [
  {
    label: "Total Members",
    value: k.members.toLocaleString(),
    icon: Users,
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    label: "Active Businesses",
    value: k.activeBusinesses.toLocaleString(),
    icon: Briefcase,
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    label: "Live Updates Today",
    value: k.liveUpdatesToday.toLocaleString(),
    icon: Activity,
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Redemptions Today",
    value: k.redemptionsToday.toLocaleString(),
    icon: Ticket,
    iconBg: "bg-orange-100 text-orange-700",
  },
  {
    label: "Revenue (MTD)",
    value: k.monthlyRevenue > 0 ? `$${k.monthlyRevenue.toLocaleString()}` : "—",
    icon: DollarSign,
    iconBg: "bg-sky-100 text-sky-700",
  },
];

export function AdminKpiStrip({ kpis }: { kpis: Kpis }) {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
      {items(kpis).map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="min-w-[152px] shrink-0 rounded-2xl border border-[var(--sand)]/60 bg-white p-4 shadow-[var(--card-shadow)] lg:min-w-0"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{item.value}</p>
            <p className="mt-1 text-xs font-medium text-stone-600">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
