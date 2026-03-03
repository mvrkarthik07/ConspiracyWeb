"use client";

import { useState } from "react";

const CRITERIA = [
  "Primary sources and official documentation are sought where possible.",
  "Multiple independent sources are preferred over a single claim.",
  "Expert consensus and peer-reviewed research carry more weight than opinion.",
  "Logical consistency and absence of contradictions are considered.",
  "Claims are framed as allegations; verification status is not a legal determination.",
];

export function HowWeJudge() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-ds-lg border border-border bg-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-text hover:bg-surface-light transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        aria-expanded={open}
      >
        How we judge
        <svg
          className={`w-5 h-5 text-text-muted transition-transform duration-fast ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="border-t border-border px-4 pb-4 pt-2 space-y-2 text-sm text-text-muted">
          {CRITERIA.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent shrink-0">•</span>
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
