"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/Modal";

interface GalleryLightboxProps {
  images: string[];
  altTexts: string[];
  title?: string;
}

export function GalleryLightbox({ images, altTexts, title }: GalleryLightboxProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => {
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, go]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.slice(0, 6).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="relative aspect-video rounded-ds overflow-hidden border border-border bg-surface-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Image
              src={src}
              alt={altTexts[i] ?? `Image ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-normal"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={title ?? "Image gallery"}>
        <ModalHeader onClose={() => setOpen(false)}>
          {title ?? "Gallery"} {images.length > 1 ? `(${index + 1} / ${images.length})` : ""}
        </ModalHeader>
        <ModalBody>
          <div className="relative aspect-video bg-surface rounded-ds overflow-hidden">
            <Image
              src={images[index]}
              alt={altTexts[index] ?? `Image ${index + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {images.length > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => go(-1)}
                className="rounded-ds px-4 py-2 bg-surface-light border border-border text-text hover:bg-surface-lighter transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                Previous
              </button>
              <span className="text-sm text-text-muted">
                {index + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded-ds px-4 py-2 bg-surface-light border border-border text-text hover:bg-surface-lighter transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                Next
              </button>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}
