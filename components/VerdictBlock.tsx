import { Badge } from "@/components/ui";
import type { Verdict } from "@/lib/types";

const verdictConfig: Record<
  Verdict,
  { label: string; variant: "verdict-true" | "verdict-false" | "verdict-unverified" }
> = {
  true: { label: "TRUE", variant: "verdict-true" },
  false: { label: "FALSE", variant: "verdict-false" },
  unverified: { label: "UNVERIFIED", variant: "verdict-unverified" },
};

export function VerdictBlock({
  verdict,
  rationale,
  maxBullets = 3,
}: {
  verdict: Verdict;
  rationale: string[];
  maxBullets?: number;
}) {
  const { label, variant } = verdictConfig[verdict];
  const bullets = rationale.slice(0, maxBullets);

  return (
    <div className="rounded-ds-lg border border-border bg-surface-light p-5">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={variant}>{label}</Badge>
      </div>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-[var(--text-muted)]">
        {bullets.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
