import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent-gold)] text-[var(--foreground)] hover:brightness-95 shadow-sm",
  secondary: "bg-[var(--sand)] text-[var(--foreground)] hover:brightness-95",
  ghost: "bg-transparent hover:bg-[var(--sand)]",
  outline:
    "border border-[var(--sand)] bg-transparent hover:bg-[var(--sand)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
  xl: "px-8 py-4 text-xl rounded-2xl",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: keyof typeof sizes;
  }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center font-medium transition disabled:opacity-50",
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
