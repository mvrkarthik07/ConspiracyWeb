import Link from "next/link";
import { type HTMLAttributes } from "react";

type ChipVariant = "default" | "selected";

const baseStyles =
  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variantStyles: Record<ChipVariant, string> = {
  default:
    "border-border bg-surface-light text-[var(--text-muted)] hover:bg-surface-lighter hover:text-[var(--text)]",
  selected:
    "border-accent/50 bg-accent-subtle text-accent",
};

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  as?: "span" | "button";
  type?: "button" | "submit";
}

export function Chip({
  className = "",
  variant = "default",
  as: Component = "span",
  ...props
}: ChipProps) {
  return (
    <Component
      className={[baseStyles, variantStyles[variant], className].join(" ")}
      {...props}
    />
  );
}

export interface ChipLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: ChipVariant;
  className?: string;
}

export function ChipLink({
  href,
  children,
  variant = "default",
  className = "",
}: ChipLinkProps) {
  return (
    <Link
      href={href}
      className={[baseStyles, variantStyles[variant], className].join(" ")}
    >
      {children}
    </Link>
  );
}
