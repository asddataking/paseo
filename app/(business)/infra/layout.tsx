import Link from "next/link";

export default function InfraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--sand)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link href="/infra" className="text-lg font-semibold">
            Paseo Infra
          </Link>
          <Link
            href="/infra/onboarding"
            className="text-sm text-stone-600 underline"
          >
            Onboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  );
}
