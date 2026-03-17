import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";
import { surveyItems } from "@/shared/surveyItems";

type Node = {
  id: string;
  label: string;
  type: "section" | "category" | "leaf";
  section?: "A" | "B" | "C";
  category?: string;
  itemId?: string;
  // orbit layout hints
  orbitParentId?: string;
  orbitR?: number;
  orbitA?: number;
};

type Link = { source: string; target: string };

function sectionLabel(section: "A" | "B" | "C") {
  if (section === "A") return "SINGAPORE";
  if (section === "B") return "ASIA";
  return "WORLDWIDE";
}

function buildGraph() {
  const nodes: Node[] = [];
  const links: Link[] = [];

  const sections: Array<"A" | "B" | "C"> = ["A", "B", "C"];
  // Mindmap anchor layout (not a circle): 3 hubs across
  const sectionAnchors: Record<"A" | "B" | "C", { x: number; y: number }> = {
    // Keep everything centralized while preserving 3 subsystems
    A: { x: -70, y: 18 },
    B: { x: 10, y: -36 },
    C: { x: 80, y: 18 },
  };

  sections.forEach((s) => {
    nodes.push({
      id: `sec:${s}`,
      label: sectionLabel(s),
      type: "section",
      section: s,
    });
  });

  const catsBySection = new Map<string, string[]>();
  for (const it of surveyItems) {
    const list = catsBySection.get(it.section) ?? [];
    if (!list.includes(it.category)) list.push(it.category);
    catsBySection.set(it.section, list);
  }

  catsBySection.forEach((cats, sec) => {
    for (const c of cats) {
      const id = `cat:${sec}:${c}`;
      // spread categories around their section hub
      const idx = Math.max(0, cats.indexOf(c));
      const a = (idx / Math.max(1, cats.length)) * Math.PI * 2;
      const r = 58 + (idx % 3) * 8;
      nodes.push({
        id,
        label: c.toUpperCase(),
        type: "category",
        section: sec as any,
        category: c,
        orbitParentId: `sec:${sec}`,
        orbitA: a,
        orbitR: r,
      });
      links.push({ source: `sec:${sec}`, target: id });
    }
  });

  for (const it of surveyItems) {
    const itemId = `item:${it.id}`;
    // leaf nodes orbit around their category
    const parentId = `cat:${it.section}:${it.category}`;
    const r = 30 + (parseInt(it.id.replace(/\D/g, ""), 10) % 7) * 3;
    const a = (Math.random() * Math.PI * 2);
    nodes.push({
      id: itemId,
      label: it.id,
      type: "leaf",
      section: it.section,
      category: it.category,
      itemId: it.id,
      orbitParentId: parentId,
      orbitA: a,
      orbitR: r,
    });
    links.push({ source: `cat:${it.section}:${it.category}`, target: itemId });
  }

  // Seed initial positions for hubs so the layout isn't circular
  for (const n of nodes) {
    if (n.type === "section" && n.section) {
      const p = sectionAnchors[n.section];
      (n as any).x = p.x;
      (n as any).y = p.y;
      // Pin hubs so the 3 systems don't drift to the corners
      (n as any).fx = p.x;
      (n as any).fy = p.y;
    }
  }

  return { nodes, links };
}

export function HomePage() {
  const nav = useNavigate();
  const fgRef = useRef<ForceGraphMethods<Node, Link> | null>(null);
  const [hovered, setHovered] = useState<Node | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const data = useMemo(() => buildGraph(), []);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(0);
  const didFitRef = useRef(false);
  const thetaRef = useRef(0);
  // Allow enough zoom-out so the whole network can always fit the viewport
  const MIN_ZOOM = 3;
  const MAX_ZOOM = 8;
  const VIEWPORT_PAD = 110; // larger pad so nodes/labels don't overflow viewport

  // Continuous subtle orbit + keep within viewport
  useEffect(() => {
    const tick = (t: number) => {
      const fg = fgRef.current as any;
      if (!fg) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Fit once after engine settles so it doesn't look tiny
      if (!didFitRef.current && typeof fg.zoomToFit === "function") {
        didFitRef.current = true;
        setTimeout(() => {
          try {
            fg.centerAt?.(0, 0, 0);
            // Smaller padding => larger graph, but still fully visible
            fg.zoomToFit(750, VIEWPORT_PAD);
            clampToViewport(fg, data, VIEWPORT_PAD);
          } catch {
            // ignore
          }
        }, 60);
      }

      const dt = lastTRef.current ? Math.min(50, t - lastTRef.current) : 16;
      lastTRef.current = t;

      // 1) Slow revolve (per-cluster orbit, not whole graph circle)
      const omega = 0.00012; // slower than before
      thetaRef.current += omega * dt;
      const theta = thetaRef.current;

      const nodes = (data as any).nodes as any[];
      const byId = new Map<string, any>();
      for (const n of nodes) byId.set(n.id, n);
      for (const n of nodes) {
        if (!n.orbitParentId || !n.orbitR || n.orbitA === undefined) continue;
        const parent = byId.get(n.orbitParentId);
        if (!parent) continue;
        const a = n.orbitA + theta * (n.type === "leaf" ? 1.25 : 1);
        n.x = (parent.x ?? 0) + Math.cos(a) * n.orbitR;
        n.y = (parent.y ?? 0) + Math.sin(a) * n.orbitR;
      }

      // keep view constrained while revolving
      clampToViewport(fg, data, VIEWPORT_PAD);

      // Refresh to reflect manual node movement
      if (typeof fg.refresh === "function") fg.refresh();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [data]);

  // Track mouse for tooltip without blocking scroll
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    const onLeave = () => setMouse(null);
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="relative"
      ref={rootRef}
      style={{
        width: "100%",
        overflow: "hidden",
        height: "calc(100vh - 72px)",
      }}
    >
      {/* HERO overlay (top-left) */}
      <div className="absolute left-5 top-6 z-20 max-w-xl pointer-events-none">
        <p className="section-label">BELIEF NETWORK</p>
        <h1
          style={{
            marginTop: 10,
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 54,
            lineHeight: 1.05,
            color: "var(--text-primary)",
          }}
        >
          Map the architecture
          <br />
          of collective doubt.
        </h1>
        <div className="mt-5 flex gap-3 pointer-events-auto">
          <button className="terminal-btn-primary" onClick={() => fgRef.current?.zoomToFit?.(700, 80)}>
            Explore the Graph
          </button>
          <button className="terminal-btn-secondary" onClick={() => nav("/game/survey")}>
            Take the Survey
          </button>
        </div>
      </div>

      {/* Graph canvas (full viewport) */}
      <div className="absolute inset-0 graph-canvas" style={{ background: "#000000" }}>
        <ForceGraph2D
          ref={fgRef as any}
          graphData={data}
          backgroundColor="#000000"
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          cooldownTicks={140}
          d3VelocityDecay={0.18}
          linkColor={() => "rgba(255,255,255,0.08)"}
          linkWidth={0.8}
          linkDirectionalParticles={2}
          linkDirectionalParticleColor={() => "rgba(255,255,255,0.55)"}
          linkDirectionalParticleWidth={1.2}
          linkDirectionalParticleSpeed={0.006}
          nodeLabel={() => ""} /* we render our own hover tooltip */
          onZoomEnd={() => {
            const fg = fgRef.current as any;
            if (!fg || typeof fg.zoom !== "function") return;
            try {
              const k = fg.zoom();
              if (typeof k === "number" && k < MIN_ZOOM) fg.zoom(MIN_ZOOM, 120);
              clampToViewport(fg, data, VIEWPORT_PAD);
            } catch {
              // ignore
            }
          }}
          onNodeHover={(node) => {
            setHovered((node as any) ?? null);
          }}
          onNodeClick={(node) => {
            const n = node as any as Node;
            if (!n) return;
            if (n.type === "section" && n.section) {
              nav(`/explore?section=${encodeURIComponent(n.section)}`);
              return;
            }
            if (n.type === "category" && n.section && n.category) {
              nav(
                `/explore?section=${encodeURIComponent(n.section)}&category=${encodeURIComponent(
                  n.category
                )}`
              );
              return;
            }
            if (n.type === "leaf" && n.itemId) {
              nav(`/game/survey?itemId=${encodeURIComponent(n.itemId)}`);
            }
          }}
          onEngineStop={() => {
            const fg = fgRef.current as any;
            if (!fg) return;
            try {
              fg.centerAt?.(0, 0, 0);
              fg.zoomToFit?.(750, VIEWPORT_PAD);
              clampToViewport(fg, data, VIEWPORT_PAD);
            } catch {
              // ignore
            }
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const x = (node as any).x as number;
            const y = (node as any).y as number;
            const t = node.type;
            const base = t === "section" ? 16 : t === "category" ? 10 : 6;
            const isHover = hovered?.id === node.id;
            const pulse = isHover ? (t === "leaf" ? 1.22 : 1.08) : 1;
            const s = (base * pulse) / Math.max(1, globalScale);

            // Rounded square (mindmap node)
            const r = Math.min(6, Math.max(2, s * 0.35));
            ctx.beginPath();
            roundRect(ctx, x - s, y - s, s * 2, s * 2, r);
            // subtle invert on hover for tiny nodes
            ctx.fillStyle = isHover && t === "leaf" ? "rgba(255,255,255,0.10)" : "#000000";
            ctx.fill();
            ctx.strokeStyle = isHover ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.60)";
            ctx.lineWidth = isHover ? 2 : 1;
            ctx.stroke();

            // extra outer ring for leaf hover to make it feel "alive"
            if (isHover && t === "leaf") {
              ctx.beginPath();
              roundRect(ctx, x - s - 2, y - s - 2, s * 2 + 4, s * 2 + 4, r + 2);
              ctx.strokeStyle = "rgba(255,255,255,0.28)";
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            // Labels only for sections (always) and categories on hover
            const showLabel = t === "section" || (t === "category" && isHover);
            if (showLabel) {
              ctx.font = `${12 / Math.max(1, globalScale)}px var(--font-sans)`;
              ctx.fillStyle = "rgba(255,255,255,0.95)";
              ctx.fillText(node.label, x + s + 6, y + 4);
            }
          }}
          // Make the *entire* rounded-square area easy to hover/click
          nodePointerAreaPaint={(node, color, ctx, globalScale) => {
            const x = (node as any).x as number;
            const y = (node as any).y as number;
            const t = node.type;
            const base = t === "section" ? 18 : t === "category" ? 13 : 10; // larger hitbox than visuals
            const s = base / Math.max(1, globalScale);
            const rr = Math.min(8, Math.max(3, s * 0.45));
            ctx.fillStyle = color;
            ctx.beginPath();
            roundRect(ctx, x - s, y - s, s * 2, s * 2, rr);
            ctx.fill();
          }}
        />
        {/* scanline overlay (2% opacity) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)",
            opacity: 0.02,
          }}
        />
      </div>

      {/* Hover tooltip (diagnostic style) */}
      {hovered && mouse && (
        <div
          className="absolute z-30"
          style={{
            left: Math.min(mouse.x + 12, window.innerWidth - 360),
            top: Math.min(mouse.y + 12, window.innerHeight - 160),
            width: 320,
            background: "#0a0a0a",
            border: "1px solid #222",
            borderRadius: 2,
            padding: 10,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          <DiagRow k="NODE" v={hovered.type === "leaf" ? (hovered.itemId ?? hovered.label) : hovered.label} />
          <DiagRow k="SECTION" v={hovered.section ?? "—"} />
          <DiagRow
            k="ABOUT"
            v={
              hovered.type === "leaf"
                ? (surveyItems.find((i) => i.id === hovered.itemId)?.text ?? "—")
                : hovered.type === "category"
                ? "Category cluster of related belief items"
                : "Top-level region cluster"
            }
          />
          <DiagRow
            k="ITEMS"
            v={hovered.type === "category" ? String(surveyItems.filter((i) => i.section === hovered.section && i.category === hovered.category).length) : "—"}
          />
          <DiagRow k="AVG AGREE" v="—" />
          <DiagRow k="STATUS" v="ACTIVE" />
        </div>
      )}

    </div>
  );
}

function DiagRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
      <span style={{ color: "#999" }}>{k}</span>
      <span style={{ textAlign: "right", color: "#fff" }}>{v}</span>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  if ((ctx as any).roundRect) {
    (ctx as any).roundRect(x, y, w, h, rr);
    return;
  }
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function clampToViewport(fg: any, data: { nodes: any[]; links: any[] }, padPx: number) {
  if (!fg || typeof fg.centerAt !== "function" || typeof fg.zoom !== "function") return;
  const canvas: HTMLCanvasElement | undefined = typeof fg.canvas === "function" ? fg.canvas() : undefined;
  const w = canvas?.clientWidth ?? canvas?.width ?? 0;
  const h = canvas?.clientHeight ?? canvas?.height ?? 0;
  if (!w || !h) return;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const n of data.nodes as any[]) {
    const x = n.x ?? 0;
    const y = n.y ?? 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) return;

  const pad = Math.max(0, padPx);
  const bboxW = Math.max(1e-6, maxX - minX);
  const bboxH = Math.max(1e-6, maxY - minY);
  const fitKx = (w - pad * 2) / bboxW;
  const fitKy = (h - pad * 2) / bboxH;
  const fitK = Math.max(0.05, Math.min(fitKx, fitKy));

  const k = fg.zoom();
  if (typeof k === "number" && isFinite(k) && k > fitK * 1.001) {
    fg.zoom(fitK, 120);
  }

  const kk = typeof k === "number" && isFinite(k) ? Math.min(k, fitK) : fitK;
  const cur = fg.centerAt();
  const halfW = w / 2;
  const halfH = h / 2;

  const cxMin = maxX - (halfW - pad) / kk;
  const cxMax = minX + (halfW - pad) / kk;
  const cyMin = maxY - (halfH - pad) / kk;
  const cyMax = minY + (halfH - pad) / kk;

  const desiredCx = cxMin > cxMax ? (minX + maxX) / 2 : Math.min(cxMax, Math.max(cxMin, cur.x));
  const desiredCy = cyMin > cyMax ? (minY + maxY) / 2 : Math.min(cyMax, Math.max(cyMin, cur.y));

  if (Math.abs(desiredCx - cur.x) > 0.2 || Math.abs(desiredCy - cur.y) > 0.2) {
    fg.centerAt(desiredCx, desiredCy, 0);
  }
}


