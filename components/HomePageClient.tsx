"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TheoryCard } from "@/components/TheoryCard";
import { TopicTile } from "@/components/TopicTile";
import { Input, Card, Chip, Button } from "@/components/ui";
import {
  getTopTheories,
  getAllTopics,
  searchTheories,
  getFeaturedTopic,
  getLatestTheories,
} from "@/lib/data";
import type { Theory, Verdict } from "@/lib/types";

const VERDICT_FILTERS: { value: Verdict | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "false", label: "False" },
  { value: "unverified", label: "Unverified" },
  { value: "true", label: "True" },
];

function filterByVerdict(theories: Theory[], verdict: Verdict | "all"): Theory[] {
  if (verdict === "all") return theories;
  return theories.filter((t) => t.verdict === verdict);
}

export function HomePageClient() {
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<Verdict | "all">("all");

  useEffect(() => {
    setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  const topTheories = getTopTheories(6);
  const allTopics = getAllTopics();
  const featuredTopic = getFeaturedTopic();
  const latestTheories = getLatestTheories(6);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchTheories(searchQuery);
  }, [searchQuery]);

  const showSearchResults = searchQuery.trim().length > 0;
  const theoriesBase = showSearchResults ? searchResults ?? [] : topTheories;
  const theoriesFiltered = filterByVerdict(theoriesBase, verdictFilter);

  const featuredTheory = theoriesFiltered[0];
  const gridTheories = theoriesFiltered.slice(1, 6);

  return (
    <div className="min-h-screen">
      {/* 1) Hero + featured topic banner */}
      <section className="relative">
        <div className="container-app py-12 sm:py-16">
          <h1 className="typography-display">
            ConspiracyWeb SG
          </h1>
          <p className="mt-3 max-w-xl text-small text-text-muted">
            Explore claims, verification status, and evidence. Educational prototype for media literacy.
          </p>
          <div className="mt-8 max-w-md">
            <label htmlFor="hero-search" className="sr-only">
              Search theories
            </label>
            <Input
              id="hero-search"
              type="search"
              placeholder="Search theories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-3"
              aria-label="Search theories"
            />
          </div>
        </div>

        {/* Featured topic banner — 21:9 */}
        {featuredTopic && !showSearchResults && (
          <Link
            href={`/category/${featuredTopic.categorySlug}/topic/${featuredTopic.slug}`}
            className="block relative aspect-[21/9] w-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent group"
          >
            <Image
              src={featuredTopic.coverImage}
              alt=""
              fill
              className="object-cover transition-transform duration-normal group-hover:scale-[1.02]"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 backdrop-blur-[1px]" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 container-app">
              <span className="typography-caption text-white/90">
                Featured topic
              </span>
              <h2 className="mt-1 typography-h1 text-white">
                {featuredTopic.name}
              </h2>
              <span className="mt-3 inline-flex w-fit rounded-ds bg-white/20 px-3 py-1.5 text-small font-medium text-white backdrop-blur-sm">
                Explore →
              </span>
            </div>
          </Link>
        )}
      </section>

      {/* Verdict filter */}
      <section className="container-app py-6">
        <p className="text-caption text-text-muted mb-2">Filter by verdict</p>
        <div className="flex flex-wrap gap-2">
          {VERDICT_FILTERS.map(({ value, label }) => (
            <Chip
              key={value}
              as="button"
              type="button"
              variant={verdictFilter === value ? "selected" : "default"}
              onClick={() => setVerdictFilter(value)}
              aria-pressed={verdictFilter === value}
            >
              {label}
            </Chip>
          ))}
        </div>
      </section>

      {/* 2) Browse Topics wall */}
      {!showSearchResults && (
        <section id="browse-topics" className="container-app section-spacing">
          <h2 className="typography-caption mb-4">Browse topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allTopics.map((topic) => (
              <TopicTile key={`${topic.categorySlug}-${topic.slug}`} topic={topic} categorySlug={topic.categorySlug} />
            ))}
          </div>
        </section>
      )}

      {/* 3) Top Theories: featured + grid */}
      <section className="container-app section-spacing">
        <h2 className="typography-caption mb-4">
          {showSearchResults ? "Results" : "Top theories"}
        </h2>
        {theoriesFiltered.length === 0 ? (
          <div className="rounded-ds-lg border border-border bg-surface-light p-8 text-center">
            <p className="text-small text-text-muted mb-4">No theories match your filters.</p>
            <button
              type="button"
              onClick={() => { setVerdictFilter("all"); setSearchQuery(""); }}
              className="text-accent font-medium text-small hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-4">
            {featuredTheory && (
              <div className="lg:col-span-2">
                <TheoryCard theory={featuredTheory} featured showImage />
              </div>
            )}
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
              {gridTheories.map((t) => (
                <TheoryCard key={t.id} theory={t} showImage />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4) Game CTA */}
      {!showSearchResults && (
        <section className="container-app section-spacing">
          <Card padding="lg" variant="featured" className="overflow-hidden border-accent/30 bg-accent-subtle/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <h2 className="typography-h3">
                  Play the Conspirational Thinking Game
                </h2>
                <p className="mt-2 text-small text-text-muted">
                  Test your critical thinking with scenario-based questions on source evaluation, bias detection, and evidence weighting.
                </p>
                <Link href="/game" className="mt-4 inline-block">
                  <Button size="lg">Start game</Button>
                </Link>
              </div>
              <div className="w-32 h-32 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
                <span className="text-4xl" aria-hidden>🎯</span>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* 5) Recently added */}
      {!showSearchResults && latestTheories.length > 0 && (
        <section className="container-app section-spacing">
          <h2 className="typography-caption mb-4">Recently added</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 scrollbar-thin">
            {latestTheories.map((t) => (
              <div key={t.id} className="w-72 shrink-0">
                <TheoryCard theory={t} showImage />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6) Footer disclaimer (handled in AppShell; optional inline copy) */}
    </div>
  );
}
