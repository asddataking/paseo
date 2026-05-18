import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  default: "bg-[var(--sand)] text-[var(--foreground)]",
  gold: "bg-amber-100 text-amber-900",
  green: "bg-emerald-100 text-emerald-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
};

export function Badge({
  children,
  color = "default",
  className,
}: {
  children: React.ReactNode;
  color?: keyof typeof colors;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
