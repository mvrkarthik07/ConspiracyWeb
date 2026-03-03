"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

export type ImageRatio = "4/3" | "16/9" | "21/9";

const ratioClasses: Record<ImageRatio, string> = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
};

export interface ImageWithFallbackProps {
  src: string | undefined;
  alt: string;
  ratio: ImageRatio;
  fill?: boolean;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Content (e.g. badge) placed at bottom-left with overlay */
  overlayContent?: React.ReactNode;
  /** Enable hover scale + overlay darken (use inside a group) */
  hover?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  ratio,
  fill = true,
  className = "",
  imgClassName = "",
  sizes,
  priority,
  overlayContent,
  hover = true,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const handleError = useCallback(() => setError(true), []);

  const wrapperClass = [
    "relative w-full overflow-hidden rounded-t-ds-lg bg-surface-lighter",
    ratioClasses[ratio],
    hover && "transition-transform duration-normal group-hover:scale-[1.02]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!src || error) {
    return (
      <div className={wrapperClass + " flex items-center justify-center"} aria-hidden>
        <div className="image-overlay rounded-t-ds-lg" />
        <span className="relative z-10 text-caption text-text-muted px-4 text-center">
          Image unavailable
        </span>
        {overlayContent && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
            {overlayContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${imgClassName} ${hover ? "transition-transform duration-normal group-hover:scale-[1.02]" : ""}`}
        sizes={sizes}
        priority={priority}
        onError={handleError}
      />
      <div
        className={`image-overlay rounded-t-ds-lg ${hover ? "group-hover:from-black/90" : ""}`}
        aria-hidden
      />
      {overlayContent && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
          {overlayContent}
        </div>
      )}
    </div>
  );
}
