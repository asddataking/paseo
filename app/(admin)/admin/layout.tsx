import { AdminShell } from "@/components/admin/AdminShell";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={playfair.variable}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
