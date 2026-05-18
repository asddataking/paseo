import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[var(--card)] p-6 shadow-[var(--card-shadow)]",
        className
      )}
      {...props}
    />
  );
}
