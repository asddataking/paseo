import { formatRelativeTime } from "@/lib/utils";
import Image from "next/image";

export type FeedItem = {
  id: string;
  businessName: string;
  message: string;
  createdAt: string;
  photoUrl?: string | null;
};

export function AdminLiveFeed({ items }: { items: FeedItem[] }) {
  return (
    <div className="rounded-2xl border border-[var(--sand)]/60 bg-white p-4 shadow-[var(--card-shadow)]">
      <h2 className="text-base font-semibold">Live Network Feed</h2>
      <ul className="mt-4 max-h-[320px] space-y-4 overflow-y-auto">
        {items.length === 0 ? (
          <li className="text-sm text-stone-500">No signals yet.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--sand)]">
                {item.photoUrl ? (
                  <Image
                    src={item.photoUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-sm font-semibold text-stone-400">
                    {item.businessName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-tight">{item.businessName}</p>
                <p className="text-sm text-stone-600">{item.message}</p>
                <p className="mt-0.5 text-xs text-stone-400">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
