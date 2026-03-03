"use client";

import { useState } from "react";

const CRITERIA = [
  "Source credibility: primary sources and official documentation are preferred.",
  "Corroboration: multiple independent sources carry more weight than a single claim.",
  "Primary evidence: expert consensus and verifiable evidence over opinion.",
  "Recency and context: claims are framed as allegations; verification is not a legal determination.",
];

export function Method() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-ds-lg border border-border bg-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left text-small font-medium text-text hover:bg-surface-light transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-t-ds-lg"
        aria-expanded={open}
      >
        How verdicts are assigned
        <svg
          className={`w-5 h-5 text-text-muted transition-transform duration-fast shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="border-t border-border px-4 pb-4 pt-2 space-y-2 text-small text-text-muted" role="list">
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
