import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { getProfileRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function AdminShortcut() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const role = await getProfileRole(user.id, supabase);
  if (role !== "admin") return null;

  return (
    <Link
      href="/admin"
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-2 ring-white"
    >
      <LayoutGrid className="h-4 w-4" />
      Admin
    </Link>
  );
}
