import Link from "next/link";
import { Bell, ChevronDown, MapPin } from "lucide-react";

type Props = {
  displayName: string;
};

export function HomeHeader({ displayName }: Props) {
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="border-b border-[var(--sand)]/80 bg-[#fdfbf7]/95 px-4 pb-3 pt-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/app"
          className="font-serif text-lg tracking-[0.2em] text-[#b8860b]"
        >
          PASEO
        </Link>

        <button
          type="button"
          className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-stone-700 shadow-sm"
        >
          <MapPin className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
          Scottsdale, AZ
          <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-stone-600" />
          </button>
          <Link
            href="/app/account"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[var(--sand)] ring-2 ring-white"
          >
            <span className="text-xs font-semibold text-stone-700">{initials}</span>
          </Link>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-stone-500">72° · Clear skies</p>
    </header>
  );
}
