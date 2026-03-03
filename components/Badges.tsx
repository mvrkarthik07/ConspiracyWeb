"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Verdict } from "@/lib/types";

const verdictConfig: Record<
  Verdict,
  { label: string; variant: "verdict-true" | "verdict-false" | "verdict-unverified" }
> = {
  true: { label: "TRUE", variant: "verdict-true" },
  false: { label: "FALSE", variant: "verdict-false" },
  unverified: { label: "UNVERIFIED", variant: "verdict-unverified" },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { label, variant } = verdictConfig[verdict];
  return <Badge variant={variant}>{label}</Badge>;
}

const linkClass =
  "inline-flex items-center rounded-ds border px-2 py-0.5 text-xs font-medium bg-surface-lighter text-[var(--text-muted)] border-border hover:bg-surface-muted hover:text-[var(--text)] transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function CategoryBadge({
  name,
  slug,
  asLink = true,
}: {
  name: string;
  slug: string;
  asLink?: boolean;
}) {
  if (asLink) {
    return (
      <Link href={`/category/${slug}`} className={linkClass}>
        {name}
      </Link>
    );
  }
  return <span className={linkClass}>{name}</span>;
}

export function TopicBadge({
  name,
  slug,
  categorySlug,
}: {
  name: string;
  slug: string;
  categorySlug: string;
}) {
  return (
    <Link
      href={`/category/${categorySlug}/topic/${slug}`}
      className={linkClass}
    >
      {name}
    </Link>
  );
}
