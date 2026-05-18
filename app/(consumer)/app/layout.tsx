import { BottomNav } from "@/components/consumer/BottomNav";

export default function ConsumerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
