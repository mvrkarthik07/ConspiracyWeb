"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { surveyItems, type SurveyItem } from "@/data/surveyItems";
import { getAgreeRateForItem } from "@/utils/persistence";

type GraphNode = {
  id: string;
  label: string;
  description?: string;
  level: "section" | "category" | "item";
  section?: "A" | "B" | "C";
  category?: string;
  itemId?: string;
  color: string;
  val: number;
  fx?: number;
  fy?: number;
  fz?: number;
};

type GraphLink = {
  source: string;
  target: string;
  curvature: number;
  color: string;
};

type GraphData = { nodes: GraphNode[]; links: GraphLink[] };

const ForceGraph2D = dynamic(() => import("react-force-graph-2d").then((m) => m.default), {
  ssr: false,
});

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useIsSmallScreen(breakpointPx = 768) {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.(`(max-width: ${breakpointPx - 1}px)`);
    if (!mq) return;
    const onChange = () => setSmall(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpointPx]);
  return small;
}

function categoryColor(category: string) {
  // Monochrome (space map): keep category distinction subtle via grayscale steps
  const map: Record<string, string> = {
    "Government/Political": "#f8fafc",
    "Economic/Financial": "#e2e8f0",
    "Media/Information": "#cbd5e1",
    "Health/Pandemic": "#f1f5f9",
    "Science/Technology": "#d1d5db",
    "Security/Crime": "#e5e7eb",
    "Foreign Relations/Security": "#c7d2fe",
  };
  return map[category] ?? "#e2e8f0";
}

function sectionLabel(section: "A" | "B" | "C") {
  if (section === "A") return "🇸🇬 Singapore";
  if (section === "B") return "🌏 Asia";
  return "🌍 Worldwide";
}

function buildGraph(): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const sections: Array<"A" | "B" | "C"> = ["A", "B", "C"];
  // More "constellation" than flat ring
  const sectionRadius = 170;
  sections.forEach((sec, i) => {
    const angle = (i / sections.length) * Math.PI * 2;
    nodes.push({
      id: `sec:${sec}`,
      label: sectionLabel(sec),
      description: "Click to explore categories and items.",
      level: "section",
      section: sec,
      color: "#ffffff",
      val: 16,
      fx: Math.cos(angle) * sectionRadius,
      fy: (i - sections.length / 2) * 18,
      fz: Math.sin(angle) * sectionRadius,
    });
  });

  const catsBySection = new Map<string, string[]>();
  for (const it of surveyItems) {
    const key = it.section;
    const list = catsBySection.get(key) ?? [];
    if (!list.includes(it.category)) list.push(it.category);
    catsBySection.set(key, list);
  }

  catsBySection.forEach((catList, sec) => {
    const parentId = `sec:${sec}`;
    const parent = nodes.find((n) => n.id === parentId);
    const baseX = parent?.fx ?? 0;
    const baseY = parent?.fy ?? 0;
    const baseZ = parent?.fz ?? 0;
    catList.forEach((cat, j) => {
      const a = (j / Math.max(1, catList.length)) * Math.PI * 2;
      const r = 90 + (j % 3) * 12;
      const x = baseX + Math.cos(a) * r;
      const z = baseZ + Math.sin(a) * r;
      const y = baseY + (j - catList.length / 2) * 14;
      const color = categoryColor(cat);

      const catId = `cat:${sec}:${cat}`;
      nodes.push({
        id: catId,
        label: cat,
        description: "Category cluster of survey items.",
        level: "category",
        section: sec as any,
        category: cat,
        color,
        val: 9,
        fx: x,
        fy: y,
        fz: z,
      });

      links.push({
        source: parentId,
        target: catId,
        curvature: 0.25 + (j % 5) * 0.05,
        color: "rgba(255,255,255,0.25)",
      });
    });
  });

  const itemsByCat = new Map<string, SurveyItem[]>();
  for (const it of surveyItems) {
    const key = `${it.section}:${it.category}`;
    const list = itemsByCat.get(key) ?? [];
    list.push(it);
    itemsByCat.set(key, list);
  }

  itemsByCat.forEach((list, key) => {
    const [sec, cat] = key.split(":");
    const parentId = `cat:${sec}:${cat}`;
    const parent = nodes.find((n) => n.id === parentId);
    const baseX = parent?.fx ?? 0;
    const baseY = parent?.fy ?? 0;
    const baseZ = parent?.fz ?? 0;
    const color = categoryColor(cat);
    list.forEach((it, k) => {
      const a = (k / Math.max(1, list.length)) * Math.PI * 2;
      const r = 46 + (k % 7) * 4;
      const x = baseX + Math.cos(a) * r;
      const z = baseZ + Math.sin(a) * r;
      const y = baseY + (k - list.length / 2) * 5.2;

      nodes.push({
        id: `item:${it.id}`,
        label: it.id,
        description: it.text,
        level: "item",
        section: it.section,
        category: it.category,
        itemId: it.id,
        color: "#ffffff",
        val: 3.8,
        fx: x,
        fy: y,
        fz: z,
      });

      links.push({
        source: parentId,
        target: `item:${it.id}`,
        curvature: 0.18 + (k % 7) * 0.03,
        color: "rgba(255,255,255,0.16)",
      });
    });
  });

  return { nodes, links };
}

export type KnowledgeGraphProps = {
  query: string;
  onNavigate: (href: string) => void;
  onHoverNode?: (node: GraphNode | null) => void;
};

export function KnowledgeGraph({ query, onNavigate, onHoverNode }: KnowledgeGraphProps) {
  const fgRef = useRef<any>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const idleTimer = useRef<number | null>(null);

  const data = useMemo(() => buildGraph(), []);
  const [didFit, setDidFit] = useState(false);

  const q = query.trim().toLowerCase();
  const matched = useMemo(() => {
    if (!q) return { list: [] as string[], lookup: {} as Record<string, true> };
    const list: string[] = [];
    const lookup: Record<string, true> = {};
    for (const n of data.nodes) {
      if (n.label.toLowerCase().includes(q) || (n.description ?? "").toLowerCase().includes(q)) {
        list.push(n.id);
        lookup[n.id] = true;
      }
    }
    return { list, lookup };
  }, [q, data.nodes]);

  const setAutoRotate = useCallback(
    (enabled: boolean) => {
      const fg = fgRef.current;
      const controls = fg?.controls?.();
      if (!controls) return;
      controls.autoRotate = enabled && !reducedMotion;
      controls.autoRotateSpeed = 0.5;
    },
    [reducedMotion]
  );

  const bumpIdle = useCallback(() => {
    setAutoRotate(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setAutoRotate(true), 2200);
  }, [setAutoRotate]);

  useEffect(() => {
    setAutoRotate(true);
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [setAutoRotate]);

  // Center + fit graph once (prevents the cluster sitting low in view)
  useEffect(() => {
    if (didFit) return;
    const fg = fgRef.current;
    if (!fg?.zoomToFit) return;
    // give the canvas a moment to measure
    const t = window.setTimeout(() => {
      try {
        fg.zoomToFit(700, 90);
        setDidFit(true);
      } catch {
        // ignore
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [didFit]);

  const handleNodeHover = useCallback(
    (node: GraphNode | null) => {
      bumpIdle();
      setHoveredId(node?.id ?? null);
      onHoverNode?.(node);
    },
    [bumpIdle, onHoverNode]
  );

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      bumpIdle();
      setSelectedId(node.id);

      const fg = fgRef.current;
      if (fg?.cameraPosition && node && typeof node === "object") {
      const dist = node.level === "section" ? 260 : node.level === "category" ? 200 : 140;
        const nx = (node as any).x ?? node.fx ?? 0;
        const ny = (node as any).y ?? node.fy ?? 0;
        const nz = (node as any).z ?? node.fz ?? 0;
        fg.cameraPosition(
          { x: nx + dist, y: ny + dist * 0.2, z: nz + dist },
          { x: nx, y: ny, z: nz },
          900
        );
      }

      // Navigate on second click, or immediately for leaf nodes
      const href =
        node.level === "section"
          ? `/explore?section=${encodeURIComponent(node.section ?? "")}`
          : node.level === "category"
          ? `/explore?section=${encodeURIComponent(node.section ?? "")}&category=${encodeURIComponent(node.category ?? "")}`
          : node.level === "item"
          ? `/game/survey?itemId=${encodeURIComponent(node.itemId ?? "")}`
          : "/";

      if (node.level === "item" || selectedId === node.id) onNavigate(href);
    },
    [bumpIdle, onNavigate, selectedId]
  );

  const nodeOpacity = useCallback(
    (n: GraphNode) => {
      if (!q) return 1;
      if (matched.lookup[n.id]) return 1;
      // Keep parents visible if a child matches
      if (n.level === "section" && matched.list.some((id) => id.includes(`:${n.section}`))) return 0.9;
      if (n.level === "category" && matched.list.some((id) => (data.nodes.find((x) => x.id === id)?.category === n.category))) return 0.9;
      return 0.18;
    },
    [q, matched.list, matched.lookup, data.nodes]
  );

  const commonProps: any = {
    ref: fgRef,
    graphData: data,
    backgroundColor: "rgba(0,0,0,0)",
    linkCurvature: (l: GraphLink) => l.curvature,
    linkColor: () => `rgba(255,255,255,${q ? 0.12 : 0.22})`,
    linkOpacity: 1,
    linkDirectionalParticles: q ? 2 : 1,
    linkDirectionalParticleWidth: 1.5,
    linkDirectionalParticleSpeed: 0.006,
    linkDirectionalParticleColor: () => "rgba(255,255,255,0.65)",
    nodeLabel: (n: GraphNode) => {
      let extra = "";
      if (n.level === "item" && n.itemId) {
        const ar = getAgreeRateForItem(n.itemId);
        extra =
          ar.pct === null
            ? `<div style="opacity:.85;margin-top:6px">Belief rate: <b>Be the first to answer</b></div>`
            : `<div style="opacity:.85;margin-top:6px">Belief rate: <b>${ar.pct}%</b> (n=${ar.n})</div>`;
      }
      const desc = n.description ? `<div style="opacity:.85;margin-top:6px;max-width:260px">${n.description}</div>` : "";
      return `<div style="padding:8px 10px;border-radius:12px;background:rgba(0,0,0,.55);backdrop-filter: blur(10px);border:1px solid rgba(255,255,255,.14)">
        <div style="font-weight:700">${n.label}</div>${desc}${extra}
      </div>`;
    },
    onNodeHover: handleNodeHover,
    onNodeClick: handleNodeClick,
  };

  return (
    <ForceGraph2D
      {...commonProps}
      cooldownTicks={120}
      enableNodeDrag
      nodeCanvasObject={(node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const opacity = nodeOpacity(node);
        const base =
          node.level === "section" ? 14 : node.level === "category" ? 9 : 3.2;
        const r = base / Math.max(0.9, globalScale);

        const x = (node as any).x as number;
        const y = (node as any).y as number;

        // glow (hacker map vibe)
        ctx.beginPath();
        ctx.fillStyle = node.id === hoveredId ? `rgba(255,255,255,0.22)` : `rgba(255,255,255,0.12)`;
        ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // node core
        ctx.beginPath();
        ctx.fillStyle = hexToRgba("#ffffff", opacity);
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // labels only when zoomed in
        if (globalScale > 2.0 && node.level !== "item") {
          ctx.font = `${11 / globalScale}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          ctx.fillStyle = `rgba(255,255,255,${Math.min(0.9, opacity)})`;
          ctx.fillText(node.label, x + r + 2, y + r + 2);
        }
      }}
      onBackgroundClick={() => {
        bumpIdle();
        setSelectedId(null);
      }}
    />
  );
}

function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

