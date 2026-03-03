import { type HTMLAttributes } from "react";

type Variant = "default" | "verdict-true" | "verdict-false" | "verdict-unverified" | "accent";

const variantStyles: Record<Variant, string> = {
  default:
    "bg-surface-lighter text-[var(--text-muted)] border-border",
  "verdict-true":
    "bg-verdict-true-muted text-verdict-true border-verdict-true/30",
  "verdict-false":
    "bg-verdict-false-muted text-verdict-false border-verdict-false/30",
  "verdict-unverified":
    "bg-verdict-unverified-muted text-verdict-unverified border-verdict-unverified/30",
  accent:
    "bg-accent-subtle text-accent border-accent/30",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-ds border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
