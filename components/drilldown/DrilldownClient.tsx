"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Badge, Button, Card, Input } from "@/components/ui";
import type { ArticleResult } from "@/lib/types";
import { surveyItems, type SurveyItem } from "@/data/surveyItems";
import { getAgreeRateForItem } from "@/utils/persistence";

type Layer = 1 | 2 | 3 | 4;

type Framing = {
  id: string;
  label: string;
  description: string;
};

const FRAMINGS: Framing[] = [
  {
    id: "belief",
    label: "Why do people believe in this?",
    description: "Psychology, identity, and social incentives that make claims persuasive.",
  },
  {
    id: "evidence",
    label: "What is the evidence?",
    description: "What sources support or refute the claim? How strong is the evidence type?",
  },
  {
    id: "spread",
    label: "How does it spread?",
    description: "Channels, narratives, and framing patterns that amplify the idea.",
  },
  {
    id: "impact",
    label: "What is the impact?",
    description: "Public harm, polarization, policy effects, or missed opportunities from misinformation.",
  },
];

function sectionLabel(sec: "A" | "B" | "C") {
  if (sec === "A") return "🇸🇬 Singapore";
  if (sec === "B") return "🌏 Asia";
  return "🌍 Worldwide";
}

function categoryBadge(category: string) {
  const icon =
    category === "Government/Political"
      ? "🏛"
      : category === "Economic/Financial"
      ? "💰"
      : category === "Media/Information"
      ? "🛰"
      : category === "Health/Pandemic"
      ? "🧬"
      : category === "Science/Technology"
      ? "🧪"
      : category === "Security/Crime"
      ? "🛡"
      : category === "Foreign Relations/Security"
      ? "🌐"
      : "🏷";
  return `${icon} ${category}`;
}

function credibilityFromSource(source: string): { label: string; variant: "accent" | "default" } {
  const s = (source ?? "").toLowerCase();
  if (
    s.includes("journal") ||
    s.includes("pubmed") ||
    s.includes("nih") ||
    s.includes("who") ||
    s.includes("nature") ||
    s.includes("science")
  ) {
    return { label: "Peer reviewed", variant: "accent" };
  }
  if (s.includes("wikipedia")) return { label: "Reference", variant: "default" };
  if (
    s.includes("reuters") ||
    s.includes("bbc") ||
    s.includes("guardian") ||
    s.includes("straits") ||
    s.includes("channel news") ||
    s.includes("today")
  ) {
    return { label: "News", variant: "default" };
  }
  return { label: "Unclassified", variant: "default" };
}

function Slide({ children, direction }: { children: React.ReactNode; direction: 1 | -1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 36 * direction, scale: 0.995 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -36 * direction, scale: 0.995 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="min-w-0"
    >
      {children}
    </motion.div>
  );
}

export function DrilldownClient() {
  const searchParams = useSearchParams();
  const initialSection = (searchParams.get("section") as "A" | "B" | "C" | null) ?? null;
  const initialCategory = searchParams.get("category");

  const [layer, setLayer] = useState<Layer>(1);
  const [section, setSection] = useState<"A" | "B" | "C" | null>(initialSection);
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [framingId, setFramingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [transitionDir, setTransitionDir] = useState<1 | -1>(1);

  const [articles, setArticles] = useState<ArticleResult[] | null>(null);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [{ label: "Explore", href: "/explore" }];
    if (section) items.push({ label: sectionLabel(section) });
    if (category) items.push({ label: category });
    if (framingId) items.push({ label: FRAMINGS.find((f) => f.id === framingId)?.label ?? "Framing" });
    return items;
  }, [section, category, framingId]);

  const visibleSections = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const all: Array<"A" | "B" | "C"> = ["A", "B", "C"];
    if (!q) return all;
    return all.filter((s) => sectionLabel(s).toLowerCase().includes(q));
  }, [filter]);

  const visibleCategories = useMemo(() => {
    if (!section) return [] as string[];
    const cats = Array.from(new Set(surveyItems.filter((i) => i.section === section).map((i) => i.category)));
    const q = filter.trim().toLowerCase();
    if (!q) return cats;
    return cats.filter((c) => c.toLowerCase().includes(q));
  }, [section, filter]);

  const visibleItems = useMemo(() => {
    if (!section || !category) return [] as SurveyItem[];
    const list = surveyItems.filter((i) => i.section === section && i.category === category);
    const q = filter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((i) => i.text.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }, [section, category, filter]);

  useEffect(() => {
    if (layer !== 4 || !section || !category) return;
    const query = [sectionLabel(section), category].filter(Boolean).join(" ");
    let cancelled = false;
    setArticles(null);
    setArticlesError(null);
    setArticlesLoading(true);
    fetch(`/api/articles?query=${encodeURIComponent(query)}&count=6`)
      .then((r) => r.json())
      .then((data: ArticleResult[] | { error: string }) => {
        if (cancelled) return;
        if (Array.isArray(data)) setArticles(data);
        else setArticlesError("Could not load related articles.");
      })
      .catch(() => {
        if (!cancelled) setArticlesError("Failed to load related articles.");
      })
      .finally(() => {
        if (!cancelled) setArticlesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [layer, section, category]);

  const goTo = (next: Layer) => {
    setTransitionDir(next > layer ? 1 : -1);
    setLayer(next);
    setFilter("");
  };

  const resetTo = (next: Layer) => {
    if (next === 1) {
      setSection(null);
      setCategory(null);
      setFramingId(null);
      goTo(1);
      return;
    }
    if (next === 2) {
      setCategory(null);
      setFramingId(null);
      goTo(2);
      return;
    }
    if (next === 3) {
      setFramingId(null);
      goTo(3);
    }
  };

  return (
    <div className="container-app py-10">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems.slice(1)} />
        <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="typography-h1">{layer === 1 ? "Explore" : section ? sectionLabel(section) : "Explore"}</h1>
            <p className="mt-1 text-small text-text-muted max-w-2xl">
              Drill down layer-by-layer: Section → Category → Framing → Evidence.
            </p>
          </div>
          <div className="flex gap-2">
            {layer > 1 && (
              <Button variant="secondary" onClick={() => resetTo((layer - 1) as Layer)}>
                Back
              </Button>
            )}
            <Button variant="secondary" onClick={() => resetTo(1)}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 max-w-xl">
        <label htmlFor="explore-filter" className="sr-only">
          Filter
        </label>
        <Input
          id="explore-filter"
          type="search"
          placeholder={layer === 1 ? "Filter sections…" : layer === 2 ? "Filter categories…" : layer === 4 ? "Filter items…" : "Filter…"}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="py-3"
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <Slide key={layer} direction={transitionDir}>
          {layer === 1 && (
            <section aria-label="Sections" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSections.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSection(s);
                    goTo(2);
                  }}
                  className="text-left"
                >
                  <Card interactive padding="lg" className="h-full">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-h3 font-semibold text-text">{sectionLabel(s)}</span>
                      <Badge variant="accent">Layer 1</Badge>
                    </div>
                    <p className="text-small text-text-muted mt-2 line-clamp-2">
                      Explore category clusters and item-level questions.
                    </p>
                    <p className="text-caption text-text-muted mt-4">Select →</p>
                  </Card>
                </button>
              ))}
              {visibleSections.length === 0 && <p className="text-text-muted">No sections match your filter.</p>}
            </section>
          )}

          {layer === 2 && (
            <section aria-label="Categories">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="typography-h3">Categories in {section ? sectionLabel(section) : "section"}</h2>
                  <p className="text-small text-text-muted mt-1">Pick a category to go deeper.</p>
                </div>
                <Link href="/game/survey" className="text-small text-accent hover:underline">
                  Take the survey →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      goTo(3);
                    }}
                    className="text-left"
                  >
                    <Card interactive padding="lg" className="h-full">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-h3 font-semibold text-text">{c}</span>
                        <Badge variant="accent">Layer 2</Badge>
                      </div>
                      <p className="text-small text-text-muted mt-2 line-clamp-2">
                        {surveyItems.filter((i) => i.section === section && i.category === c).length} items
                      </p>
                      <p className="text-caption text-text-muted mt-4">Select →</p>
                    </Card>
                  </button>
                ))}
                {visibleCategories.length === 0 && <p className="text-text-muted">No categories match your filter.</p>}
              </div>
            </section>
          )}

          {layer === 3 && (
            <section aria-label="Framing">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="typography-h3">{category ?? "Category"} — framing</h2>
                  <p className="text-small text-text-muted mt-1">Choose the question lens you want to explore.</p>
                </div>
                <Link href="/explore" className="text-small text-accent hover:underline">
                  Reset explore →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {FRAMINGS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFramingId(f.id);
                      goTo(4);
                    }}
                    className="text-left"
                  >
                    <Card interactive padding="lg" className="h-full">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-h3 font-semibold text-text">{f.label}</span>
                        <Badge variant="accent">Layer 3</Badge>
                      </div>
                      <p className="text-small text-text-muted mt-2">{f.description}</p>
                      <p className="text-caption text-text-muted mt-4">Select →</p>
                    </Card>
                  </button>
                ))}
              </div>
            </section>
          )}

          {layer === 4 && (
            <section aria-label="Evidence">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="typography-h3">Evidence nodes</h2>
                  <p className="text-small text-text-muted mt-1">
                    {section ? sectionLabel(section) : "Section"} · {category ?? "Category"} · {FRAMINGS.find((f) => f.id === framingId)?.label ?? "Framing"}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="typography-caption mb-3">Survey items</h3>
                  <div className="grid gap-3">
                    {visibleItems.map((it) => {
                      const ar = getAgreeRateForItem(it.id);
                      return (
                        <Card key={it.id} padding="md" className="border-border-strong">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-medium text-text line-clamp-2">{it.text}</p>
                              <p className="text-xs text-text-muted mt-1">
                                <span className="mr-2">{it.id}</span>· <span className="mr-2">{sectionLabel(it.section)}</span>· {categoryBadge(it.category)}
                              </p>
                            </div>
                            <Badge variant="accent">
                              {ar.pct === null ? "Be the first to answer" : `Agree rate: ${ar.pct}%`}
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <Link
                              href={`/game/survey?itemId=${encodeURIComponent(it.id)}`}
                              className="text-small text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
                            >
                              Take this question →
                            </Link>
                          </div>
                        </Card>
                      );
                    })}
                    {visibleItems.length === 0 && <p className="text-text-muted">No items match your filter.</p>}
                  </div>
                </div>

                <div>
                  <h3 className="typography-caption mb-3">External links</h3>
                  {articlesLoading ? (
                    <p className="text-text-muted">Loading articles…</p>
                  ) : articlesError ? (
                    <Card padding="md" className="border-border-strong">
                      <p className="text-small text-text-muted">{articlesError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setArticles(null);
                          setArticlesError(null);
                          setArticlesLoading(false);
                          // trigger refetch by toggling layer
                          setLayer(3);
                          setTimeout(() => setLayer(4), 0);
                        }}
                        className="mt-3 text-small text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
                      >
                        Try again
                      </button>
                    </Card>
                  ) : (
                    <div className="grid gap-3">
                      {(articles ?? []).map((a, i) => {
                        const cred = credibilityFromSource(a.source);
                        return (
                          <Card key={`${a.url}-${i}`} padding="md" className="border-border-strong">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="font-medium text-text line-clamp-2">{a.title}</p>
                                <p className="text-xs text-text-muted mt-1">
                                  Source: {a.source} · Date: —
                                </p>
                              </div>
                              <Badge variant={cred.variant}>{cred.label}</Badge>
                            </div>
                            {a.snippet && <p className="text-sm text-text-muted mt-2 line-clamp-3">{a.snippet}</p>}
                            <div className="mt-3">
                              <a
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-small text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
                              >
                                Open external →
                              </a>
                            </div>
                          </Card>
                        );
                      })}
                      {(articles ?? []).length === 0 && <p className="text-text-muted">No articles found.</p>}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </Slide>
      </AnimatePresence>
    </div>
  );
}

