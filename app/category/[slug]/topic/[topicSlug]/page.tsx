"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TheoryCard } from "@/components/TheoryCard";
import { Chip } from "@/components/ui";
import {
  getCategoryBySlug,
  getTopicBySlug,
  getTheoriesByTopicSlug,
} from "@/lib/data";
import type { Theory, Verdict } from "@/lib/types";

const VERDICT_FILTERS: { value: Verdict | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "false", label: "False" },
  { value: "unverified", label: "Unverified" },
  { value: "true", label: "True" },
];

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const topicSlug = params.topicSlug as string;

  const category = getCategoryBySlug(slug);
  const topic = getTopicBySlug(slug, topicSlug);
  const allTheories = getTheoriesByTopicSlug(slug, topicSlug);

  const [verdictFilter, setVerdictFilter] = useState<Verdict | "all">("all");
  const [topOnly, setTopOnly] = useState(false);

  const theories = useMemo(() => {
    let list = allTheories;
    if (verdictFilter !== "all") list = list.filter((t) => t.verdict === verdictFilter);
    if (topOnly) list = list.filter((t) => t.isTop);
    return list;
  }, [allTheories, verdictFilter, topOnly]);

  if (!category || !topic) notFound();

  return (
    <div className="min-h-screen">
      {/* Cover banner */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden">
        <Image
          src={topic.coverImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <Breadcrumbs
            items={[
              { label: category.name, href: `/category/${slug}` },
              { label: topic.name },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">{topic.name}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {theories.length} theor{theories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
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
          <Chip
            as="button"
            type="button"
            variant={topOnly ? "selected" : "default"}
            onClick={() => setTopOnly((o) => !o)}
            aria-pressed={topOnly}
          >
            Top only
          </Chip>
        </div>

        {/* Theory cards grid */}
        {theories.length === 0 ? (
          <p className="text-text-muted">No theories match the filter.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theories.map((t) => (
              <TheoryCard key={t.id} theory={t} showTopic={false} showImage />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
