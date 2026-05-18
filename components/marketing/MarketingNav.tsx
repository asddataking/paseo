import Link from "next/link";

const links = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#membership", label: "Membership" },
  { href: "/business", label: "For Businesses" },
  { href: "#about", label: "About" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--sand)]/80 bg-[#fdfbf7]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.25em] text-[#b8860b]"
        >
          PASEO
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-stone-900">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login?redirect=/app"
          className="rounded-full bg-[#c9a227] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
        >
          Join Free
        </Link>
      </div>
    </header>
  );
}
