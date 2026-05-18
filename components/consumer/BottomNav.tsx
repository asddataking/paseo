"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gift, Map, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/app", label: "Home", icon: Home, exact: true },
  { href: "/app/map", label: "Map", icon: Map },
  { href: "/app/perks", label: "Perks", icon: Gift },
  { href: "/app/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--sand)] bg-[var(--card)] pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map((tab) => {
          const { href, label, icon: Icon } = tab;
          const exact = "exact" in tab && tab.exact;
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 px-2 py-2.5 text-xs transition",
                active ? "text-[var(--accent-gold)]" : "text-stone-500",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-10 items-center justify-center rounded-xl transition",
                  active && "bg-[#faf3e0]",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              </span>
              <span className={cn("font-medium", active && "font-semibold")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
