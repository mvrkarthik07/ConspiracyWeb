"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input, Button } from "@/components/ui";
import { Starfield } from "@/components/home/Starfield";
import { KnowledgeGraph } from "@/components/home/KnowledgeGraph";

export function HomeGraphPageClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState<{ title: string; desc?: string } | null>(null);

  const hint = useMemo(() => {
    if (!hover) return "Hover a node to preview. Click to zoom, click again to open.";
    return hover.desc ? hover.desc : "Click to zoom, click again to open.";
  }, [hover]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <Starfield className="absolute inset-0 -z-10 opacity-95" />
      {/* subtle monochrome nebula + grid */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_35%_18%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.04),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_45%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="absolute inset-0">
        <KnowledgeGraph
          query={query}
          onHoverNode={(n) => setHover(n ? { title: n.label, desc: n.description } : null)}
          onNavigate={(href) => router.push(href)}
        />
      </div>

      {/* Minimal HUD (spacey / blank layout) */}
      <div className="pointer-events-none absolute left-0 right-0 top-0">
        <div className="container-app pt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="pointer-events-auto max-w-xl"
          >
            <label htmlFor="graph-search" className="sr-only">
              Search nodes
            </label>
            <div className="flex items-center gap-3">
              <Input
                id="graph-search"
                type="search"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="py-3 bg-black/35 backdrop-blur border-white/15 text-text placeholder:text-text-muted"
              />
              <Button variant="secondary" onClick={() => router.push("/game/survey")}>
                Survey
              </Button>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              {hover ? (
                <>
                  <span className="text-text">{hover.title}</span>
                  <span className="mx-2 text-white/20">·</span>
                  {hint}
                </>
              ) : (
                hint
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

