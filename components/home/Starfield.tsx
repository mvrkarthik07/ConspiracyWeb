"use client";

import { useEffect, useRef } from "react";

type Props = {
  density?: number; // stars per 10k px²
  className?: string;
};

export function Starfield({ density = 1.2, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let stars: { x: number; y: number; r: number; a: number; tw: number }[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = Math.max(1, width * height);
      const count = Math.max(40, Math.floor((area / 10000) * density));
      stars = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.25 + 0.25,
        a: Math.random() * 0.65 + 0.15,
        tw: Math.random() * 0.015 + 0.003,
      }));
    };

    const draw = () => {
      if (!running) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Subtle nebula haze
      const g = ctx.createRadialGradient(width * 0.65, height * 0.25, 0, width * 0.65, height * 0.25, Math.max(width, height));
      g.addColorStop(0, "rgba(88,166,255,0.08)");
      g.addColorStop(0.45, "rgba(168,85,247,0.04)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      for (const s of stars) {
        s.a += s.tw * (Math.random() > 0.5 ? 1 : -1);
        if (s.a < 0.08) s.a = 0.08;
        if (s.a > 0.85) s.a = 0.85;
        ctx.beginPath();
        ctx.fillStyle = `rgba(230,237,243,${s.a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
    };

    resize();
    raf = window.requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}

