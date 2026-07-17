import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-wide " +
  "rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-black hover:bg-accent/90",
  secondary:
    "border border-edge-bright text-ink hover:border-accent hover:text-accent bg-transparent",
  ghost: "text-ink-muted hover:text-ink bg-transparent",
};

const sizes: Record<Size, string> = {
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

/** Link-style button (renders <a> via next/link). */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
