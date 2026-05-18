import { Playfair_Display } from "next/font/google";
import { BottomNav } from "@/components/consumer/BottomNav";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function ConsumerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} flex min-h-screen flex-col bg-[var(--background)]`}
    >
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
