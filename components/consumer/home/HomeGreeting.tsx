import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MembershipTier } from "@/lib/tiers";

type Props = {
  greeting: string;
  displayName: string;
  membershipTier: MembershipTier;
  memberSince: string | null;
};

export function HomeGreeting({
  greeting,
  displayName,
  membershipTier,
  memberSince,
}: Props) {
  const tierLabel =
    membershipTier === "black"
      ? "PASEO BLACK"
      : membershipTier === "gold"
        ? "PASEO GOLD"
        : "PASEO FREE";

  return (
    <div className="flex items-start justify-between gap-3 px-4 pt-5">
      <div className="min-w-0 flex-1">
        <h1 className="font-serif text-2xl font-semibold leading-tight tracking-tight">
          {greeting}, {displayName} 👋
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Here&apos;s what&apos;s worth doing right now.
        </p>
      </div>

      <Link
        href="/app/account"
        className="shrink-0 rounded-2xl border border-[#e8d5a8] bg-gradient-to-br from-[#faf3e0] to-white px-3 py-2.5 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c9a227] font-serif text-sm font-bold text-white">
            P
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-[#9a7b2e]">
              {tierLabel}
            </p>
            {memberSince && (
              <p className="text-[9px] text-stone-500">Member since {memberSince}</p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-stone-400" />
        </div>
      </Link>
    </div>
  );
}
