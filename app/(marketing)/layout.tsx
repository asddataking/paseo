import { Playfair_Display } from "next/font/google";
import { MarketingNav } from "@/components/marketing/MarketingNav";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${playfair.variable} min-h-screen bg-[#fdfbf7] text-[#1c1917]`}>
      <MarketingNav />
      <main>{children}</main>
    </div>
  );
}
