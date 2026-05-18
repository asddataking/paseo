"use client";

import {
  Clock,
  Heart,
  MapPin,
  Moon,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedFilter =
  | "for_you"
  | "tonight"
  | "low_wait"
  | "nearby"
  | "family"
  | "date_night";

const FILTERS: {
  id: FeedFilter;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "for_you", label: "For You", icon: Sparkles },
  { id: "tonight", label: "Tonight", icon: Moon },
  { id: "low_wait", label: "Low Wait", icon: Clock },
  { id: "nearby", label: "Nearby", icon: MapPin },
  { id: "family", label: "Family", icon: Users },
  { id: "date_night", label: "Date Night", icon: Heart },
];

type Props = {
  active: FeedFilter;
  onChange: (filter: FeedFilter) => void;
};

export function FilterChips({ active, onChange }: Props) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-4">
      {FILTERS.map(({ id, label, icon: Icon }) => {
        const selected = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
              selected
                ? "bg-stone-900 text-white shadow-md"
                : "bg-white text-stone-700 shadow-sm ring-1 ring-[var(--sand)]",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
