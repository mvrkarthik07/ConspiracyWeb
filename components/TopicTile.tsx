"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { getTheoriesByTopicSlug } from "@/lib/data";
import type { Topic } from "@/lib/types";

export function TopicTile({
  topic,
  categorySlug,
}: {
  topic: Topic;
  categorySlug: string;
}) {
  const [imgError, setImgError] = useState(false);
  const count = getTheoriesByTopicSlug(categorySlug, topic.slug).length;
  const href = `/category/${categorySlug}/topic/${topic.slug}`;
  const hasImage = topic.coverImage && !imgError;
  const onError = useCallback(() => setImgError(true), []);

  return (
    <Link
      href={href}
      className="group block relative aspect-[4/3] w-full overflow-hidden rounded-ds-lg border border-border bg-surface-lighter shadow-ds transition-shadow duration-normal hover:shadow-ds-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={`${topic.name}, ${count} theor${count !== 1 ? "ies" : "y"}`}
    >
      {hasImage ? (
        <>
          <Image
            src={topic.coverImage}
            alt=""
            fill
            className="object-cover transition-transform duration-normal group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={onError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent backdrop-blur-[1px] group-hover:from-black/85 transition-colors duration-normal" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-caption text-text-muted px-4 text-center">Image unavailable</span>
        </div>
      )}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <span className="font-semibold text-white drop-shadow-md">{topic.name}</span>
        <span className="text-caption text-white/80 mt-0.5">
          {count} theor{count !== 1 ? "ies" : "y"}
        </span>
      </div>
    </Link>
  );
}
