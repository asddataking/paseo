import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--sand)] bg-white/60 px-6 py-10 text-center">
      <p className="font-medium text-stone-800">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600">{description}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="mt-4 inline-block">
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
