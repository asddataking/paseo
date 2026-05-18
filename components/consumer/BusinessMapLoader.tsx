"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/lib/map/types";

const BusinessMap = dynamic(
  () => import("./BusinessMap").then((m) => m.BusinessMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(52vh,420px)] w-full animate-pulse rounded-2xl bg-[var(--sand)]" />
    ),
  },
);

export function BusinessMapLoader({ markers }: { markers: MapMarker[] }) {
  return <BusinessMap markers={markers} />;
}
