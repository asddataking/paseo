"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Briefcase,
  LayoutGrid,
  Menu,
  Radio,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNav = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/admin/businesses", label: "Businesses", icon: Briefcase },
  { href: "/admin/signals", label: "Live Feed", icon: Radio },
  { href: "/admin/perks", label: "Perks", icon: Ticket },
  { href: "/admin/users", label: "Members", icon: Users },
  { href: "/admin/copilot", label: "Copilot", icon: Sparkles },
];

const drawerNav = [
  ...bottomNav,
  { href: "/admin/redemptions", label: "Redemptions", icon: Ticket },
  { href: "/admin/onboarding", label: "Onboarding", icon: Briefcase },
  { href: "/admin/settings", label: "Settings", icon: LayoutGrid },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfbf7] lg:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-[var(--sand)] bg-[var(--sand)]/30 lg:flex lg:flex-col">
        <div className="border-b border-[var(--sand)] px-5 py-5">
          <Link href="/admin" className="font-serif text-xl tracking-wide">
            <span className="text-[var(--accent-gold)]">PASEO</span>
          </Link>
          <p className="mt-0.5 text-xs text-stone-500">Admin Panel</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {drawerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive(item.href, "exact" in item ? item.exact : false)
                  ? "bg-white text-[var(--foreground)] shadow-sm"
                  : "text-stone-600 hover:bg-white/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--sand)]/80 bg-[#fdfbf7]/95 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 text-stone-600 hover:bg-[var(--sand)]"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/admin" className="text-center">
              <span className="font-serif text-xl tracking-[0.2em] text-[var(--accent-gold)]">
                PASEO
              </span>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">
                Admin Panel
              </p>
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-stone-600 hover:bg-[var(--sand)]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[#fdfbf7] p-4 shadow-xl lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-serif text-lg text-[var(--accent-gold)]">PASEO</span>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {drawerNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive(item.href, "exact" in item ? item.exact : false)
                        ? "bg-[var(--accent-gold)]/15 text-[var(--foreground)]"
                        : "text-stone-600"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </>
        )}

        <main className="flex-1 overflow-x-hidden px-4 pb-24 pt-4 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--sand)] bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex justify-around px-1 py-2">
            {bottomNav.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium",
                    active ? "text-[var(--accent-gold)]" : "text-stone-500"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} />
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <span className="mt-0.5 h-0.5 w-6 rounded-full bg-[var(--accent-gold)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
