"use client";

import type { ArticleResult } from "@/lib/types";

export function ArticleCard({ title, url, source, snippet }: ArticleResult) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-ds-lg border border-border bg-surface-light p-4 transition-colors duration-fast hover:border-accent/40 hover:bg-surface-lighter focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span className="font-medium text-text block mb-1 line-clamp-2 group-hover:text-accent">{title}</span>
      <span className="text-xs text-text-muted">{source}</span>
      {snippet && <p className="text-sm text-text-muted mt-2 line-clamp-2">{snippet}</p>}
    </a>
  );
}
