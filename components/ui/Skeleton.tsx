import { type HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-pulse rounded-ds bg-surface-lighter ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 && lines > 1 ? "75%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-ds-lg border border-border bg-surface-light p-5">
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-[80%] mb-4" />
      <Skeleton className="h-6 w-20" />
    </div>
  );
}

export function SkeletonArticleCard() {
  return (
    <div className="rounded-ds-lg border border-border bg-surface-light p-4">
      <Skeleton className="h-5 w-[75%] mb-2" />
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full mt-1" />
    </div>
  );
}

export function SkeletonTopicTile() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-ds-lg border border-border bg-surface-lighter animate-pulse" />
  );
}

/** Theory card with 16:9 image block + content */
export function SkeletonTheoryCard() {
  return (
    <div className="rounded-ds-lg border border-border bg-surface-light overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-5 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-[90%]" />
      </div>
    </div>
  );
}
