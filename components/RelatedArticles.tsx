"use client";

import { useState, useEffect } from "react";
import type { ArticleResult } from "@/lib/types";
import { Card } from "@/components/ui";
import { SkeletonArticleCard } from "@/components/ui";
import { ArticleCard } from "./ArticleCard";

export function RelatedArticles({
  keywords,
  title,
}: {
  keywords: string[];
  title: string;
}) {
  const [articles, setArticles] = useState<ArticleResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = [...keywords.slice(0, 3), title].filter(Boolean).join(" ");

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/articles?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data: ArticleResult[] | { error: string }) => {
        if (cancelled) return;
        if (Array.isArray(data)) setArticles(data);
        else setError("Could not load articles.");
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load articles.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) {
    return (
      <div className="space-y-3">
        <p className="text-caption text-text-muted">Loading articles…</p>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonArticleCard key={i} />
        ))}
      </div>
    );
  }

  const retry = () => {
    setError(null);
    setLoading(true);
    fetch(`/api/articles?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data: ArticleResult[] | { error: string }) => {
        if (Array.isArray(data)) setArticles(data);
        else setError("Could not load articles.");
      })
      .catch(() => setError("Failed to load articles."))
      .finally(() => setLoading(false));
  };

  if (error) {
    return (
      <Card padding="md" className="border-border-strong">
        <p className="text-small text-text-muted mb-4">{error}</p>
        <p className="text-caption text-text-muted mb-4">You can try again or browse related theories below.</p>
        <button
          type="button"
          onClick={retry}
          className="text-accent font-medium text-small hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
        >
          Try again
        </button>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card padding="md">
        <p className="text-small text-text-muted">
          No related articles found. Try again later or check README for API setup.
        </p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3" role="list">
      {articles.map((a, i) => (
        <li key={i}>
          <ArticleCard {...a} />
        </li>
      ))}
    </ul>
  );
}
