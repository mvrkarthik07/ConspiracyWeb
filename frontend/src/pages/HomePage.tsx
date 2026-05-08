import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { useNavigate, useSearchParams } from "react-router-dom";
import { surveyItems, THEMES, type ThemeId } from "@/shared/surveyItems";
import { THEME_COLORS } from "@/shared/themeColors";
import { toQuestion } from "@/shared/phrasing";

// Arc layout: slight wave so it doesn't look like a flat list
const THEME_ANCHORS: Record<ThemeId, { x: number; y: number }> = {
  political:    { x: -140, y: 10 },
  secrets:      { x: -70,  y: -22 },
  science:      { x: 0,    y: 16 },
  elites:       { x: 70,   y: -22 },
  geopolitical: { x: 140,  y: 10 },
};

// ── Node / Link types ──────────────────────────────────────────────────────

type NodeType = "theme" | "category" | "leaf";

type Node = {
  id: string;
  label: string;
  type: NodeType;
  theme?: ThemeId;
  category?: string;
  itemId?: string;
  orbitParentId?: string;
  orbitR?: number;
  orbitA?: number;
};

type Link = { source: string; target: string; theme?: ThemeId };

// ── Graph builder ──────────────────────────────────────────────────────────

function buildGraph() {
  const nodes: Node[] = [];
  const links: Link[] = [];

  // Layer 1 — 5 themed hub nodes (pinned)
  for (const t of THEMES) {
    const anchor = THEME_ANCHORS[t.id];
    const n: Node & { fx?: number; fy?: number } = {
      id: `theme:${t.id}`,
      label: t.short,
      type: "theme",
      theme: t.id,
    };
    (n as any).x = anchor.x;
    (n as any).y = anchor.y;
    (n as any).fx = anchor.x;
    (n as any).fy = anchor.y;
    nodes.push(n);
  }

  // Layer 2 — subcategory nodes orbiting their theme hub
  const catsByTheme = new Map<ThemeId, string[]>();
  for (const it of surveyItems) {
    const list = catsByTheme.get(it.theme) ?? [];
    if (!list.includes(it.category)) list.push(it.category);
    catsByTheme.set(it.theme, list);
  }

  catsByTheme.forEach((cats, themeId) => {
    cats.forEach((cat, idx) => {
      const id = `cat:${themeId}:${cat}`;
      const angle = (idx / Math.max(1, cats.length)) * Math.PI * 2;
      nodes.push({
        id,
        label: cat,
        type: "category",
        theme: themeId,
        category: cat,
        orbitParentId: `theme:${themeId}`,
        orbitR: 55,
        orbitA: angle,
      });
      links.push({ source: `theme:${themeId}`, target: id, theme: themeId });
    });
  });

  // Layer 3 — 1 representative leaf node per subcategory (kept sparse to avoid clutter)
  const catItems = new Map<string, typeof surveyItems>();
  for (const it of surveyItems) {
    const key = `${it.theme}::${it.category}`;
    const arr = catItems.get(key) ?? [];
    arr.push(it);
    catItems.set(key, arr);
  }

  catItems.forEach((items, key) => {
    const [themeId, ...catParts] = key.split("::");
    const cat = catParts.join("::");
    const parentId = `cat:${themeId}:${cat}`;
    const representative = items[0]; // just one per category — clean overview
    if (!representative) return;
    nodes.push({
      id: `item:${representative.id}`,
      label: representative.id,
      type: "leaf",
      theme: themeId as ThemeId,
      category: cat,
      itemId: representative.id,
      orbitParentId: parentId,
      orbitR: 24,
      orbitA: Math.PI * 0.5,
    });
    links.push({ source: parentId, target: `item:${representative.id}`, theme: themeId as ThemeId });
  });

  return { nodes, links };
}

// ── Viewport clamp helper ──────────────────────────────────────────────────

function clampToViewport(fg: any, data: { nodes: any[] }, padPx: number) {
  if (!fg || typeof fg.centerAt !== "function" || typeof fg.zoom !== "function") return;
  const canvas: HTMLCanvasElement | undefined =
    typeof fg.canvas === "function" ? fg.canvas() : undefined;
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
  if (!isFinite(minX)) return;

  const pad = Math.max(0, padPx);
  const bboxW = Math.max(1e-6, maxX - minX);
  const bboxH = Math.max(1e-6, maxY - minY);
  const fitK = Math.max(0.05, Math.min((w - pad * 2) / bboxW, (h - pad * 2) / bboxH));

  const k = fg.zoom();
  if (typeof k === "number" && isFinite(k) && k > fitK * 1.001) fg.zoom(fitK, 120);

  const kk = typeof k === "number" && isFinite(k) ? Math.min(k, fitK) : fitK;
  const cur = fg.centerAt();
  const halfW = w / 2;
  const halfH = h / 2;

  const cxMin = maxX - (halfW - pad) / kk;
  const cxMax = minX + (halfW - pad) / kk;
  const cyMin = maxY - (halfH - pad) / kk;
  const cyMax = minY + (halfH - pad) / kk;

  const cx = cxMin > cxMax ? (minX + maxX) / 2 : Math.min(cxMax, Math.max(cxMin, cur.x));
  const cy = cyMin > cyMax ? (minY + maxY) / 2 : Math.min(cyMax, Math.max(cyMin, cur.y));

  if (Math.abs(cx - cur.x) > 0.2 || Math.abs(cy - cur.y) > 0.2) fg.centerAt(cx, cy, 0);
}

// ── Rounded-rect helper (for node pointer area) ────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  if ((ctx as any).roundRect) { (ctx as any).roundRect(x, y, w, h, rr); return; }
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// ── Main component ─────────────────────────────────────────────────────────

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

  // Welcome intro modal — show once per browser session, OR whenever
  // ?about=1 is in the URL (so the navbar "ABOUT" link can re-open it).
  const [sp, setSp] = useSearchParams();
  const aboutParam = sp.get("about") === "1";
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    if (aboutParam) return true;
    return sessionStorage.getItem("conspiracyweb-intro-dismissed") !== "1";
  });
  // Re-open whenever ?about=1 appears
  useEffect(() => {
    if (aboutParam) setShowIntro(true);
  }, [aboutParam]);
  const dismissIntro = () => {
    sessionStorage.setItem("conspiracyweb-intro-dismissed", "1");
    setShowIntro(false);
    if (aboutParam) {
      const next = new URLSearchParams(sp);
      next.delete("about");
      setSp(next, { replace: true });
    }
  };
  const thetaRef = useRef(0);

  const MIN_ZOOM = 1.2;
  const MAX_ZOOM = 9;
  const VIEWPORT_PAD = 90;

  // Continuous orbit animation
  useEffect(() => {
    const tick = (t: number) => {
      const fg = fgRef.current as any;
      if (!fg) { rafRef.current = requestAnimationFrame(tick); return; }

      if (!didFitRef.current && typeof fg.zoomToFit === "function") {
        didFitRef.current = true;
        setTimeout(() => {
          try {
            fg.centerAt?.(0, 0, 0);
            fg.zoomToFit(800, VIEWPORT_PAD);
            clampToViewport(fg, data, VIEWPORT_PAD);
          } catch { /* ignore */ }
        }, 80);
      }

      const dt = lastTRef.current ? Math.min(50, t - lastTRef.current) : 16;
      lastTRef.current = t;

      const omega = 0.00008; // slow, calm rotation
      thetaRef.current += omega * dt;
      const theta = thetaRef.current;

      const byId = new Map<string, any>();
      for (const n of (data as any).nodes as any[]) byId.set(n.id, n);

      for (const n of (data as any).nodes as any[]) {
        if (!n.orbitParentId || !n.orbitR || n.orbitA === undefined) continue;
        const parent = byId.get(n.orbitParentId);
        if (!parent) continue;
        const speed = n.type === "leaf" ? 1.4 : 1;
        const a = n.orbitA + theta * speed;
        n.x = (parent.x ?? 0) + Math.cos(a) * n.orbitR;
        n.y = (parent.y ?? 0) + Math.sin(a) * n.orbitR;
      }

      clampToViewport(fg, data, VIEWPORT_PAD);
      if (typeof fg.refresh === "function") fg.refresh();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data]);

  // Mouse tracking for tooltip
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
    <div style={{ width: "100%" }}>
    <div
      ref={rootRef}
      className="relative"
      style={{ width: "100%", overflow: "hidden", height: "calc(100vh - 72px)" }}
    >
      {/* Welcome intro modal */}
      {showIntro && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            style={{
              maxWidth: 640,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#0a0a0a",
              border: "1px solid #2a2a2a",
              borderLeft: "3px solid #60a5fa",
              borderRadius: 4,
              padding: "32px 36px",
              color: "#fff",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {(["political", "secrets", "science", "elites", "geopolitical"] as ThemeId[]).map((id) => (
                <div
                  key={id}
                  style={{
                    height: 2,
                    flex: 1,
                    background: THEME_COLORS[id].border,
                    boxShadow: `0 0 8px ${THEME_COLORS[id].glow}`,
                  }}
                />
              ))}
            </div>

            <div style={{ fontSize: 12, color: "#60a5fa", letterSpacing: "0.18em", marginBottom: 12 }}>
              EVERYTHING BEGINS FROM A QUESTION
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 18px", lineHeight: 1.25 }}>
              Welcome to a new world of questions you may never have thought of.
            </h2>

            <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.7, margin: "0 0 14px" }}>
              Built by <strong style={{ color: "#60a5fa" }}>CATOS</strong> and{" "}
              <strong style={{ color: "#60a5fa" }}>IN-Cube</strong>, this project examines
              the fascinating and often complex world of conspiracy theories in South-East
              Asia and beyond. We invite you to explore these narratives with us as we
              strip back the layers and dissect their underlying mechanics — to see how
              they take root in the public imagination and impact our communities.
            </p>
            <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.7, margin: "0 0 14px" }}>
              Our goal is to provide you with clarity to navigate an increasingly
              complicated information environment. By measuring speculative claims
              against scientific consensus and historical records, we provide a
              foundation for separating myth from reality.
            </p>
            <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.7, margin: "0 0 6px", fontStyle: "italic" }}>
              Your entry into this database confirms your engagement with a research
              project that values safety, transparency, and the absolute integrity of facts.
            </p>

            <div
              style={{
                marginTop: 22,
                paddingTop: 20,
                borderTop: "1px solid #1f1f1f",
              }}
            >
              <div style={{ fontSize: 12, color: "#bbb", letterSpacing: "0.14em", marginBottom: 10 }}>
                WHAT IS A CONSPIRACY THEORY?
              </div>
              <p style={{ fontSize: 14, color: "#ddd", lineHeight: 1.7, margin: "0 0 10px" }}>
                Conspiracy theories are explanations that attribute events, decisions, or
                outcomes to secret coordination by individuals or groups, rather than to
                widely accepted public accounts. The Oxford English Dictionary defines a
                conspiracy as a secret plot or agreement between two or more parties for
                an illegal or dishonest purpose. These theories can emerge across many
                contexts — politics, public health, science, and major world events —
                often taking shape when people search for patterns, face limited
                information, or begin to question official narratives.
              </p>
              <p style={{ fontSize: 14, color: "#ddd", lineHeight: 1.7, margin: "0 0 10px" }}>
                While conspiracy theories have existed for centuries, they spread more
                rapidly in today's media environment, where claims can circulate widely
                before being verified. Their appeal often lies in how they simplify
                complex issues and tap into broader concerns such as trust, uncertainty,
                and power.
              </p>
              <p style={{ fontSize: 14, color: "#ddd", lineHeight: 1.7, margin: 0 }}>
                Explore this site to uncover the stories behind popular urban legends,
                myths, and conspiracy theories — and decide for yourself what holds up,
                what falls apart, and why these narratives continue to capture attention
                today.
              </p>
              <div style={{ marginTop: 12, fontSize: 10, color: "#666", lineHeight: 1.6 }}>
                Sources:{" "}
                <a href="https://www.oed.com/dictionary/conspiracy_n" target="_blank" rel="noreferrer" style={{ color: "#888", textDecoration: "underline" }}>OED</a>
                {" · "}
                <a href="https://commission.europa.eu/strategy-and-policy/coronavirus-response/fighting-disinformation/identifying-conspiracy-theories_en" target="_blank" rel="noreferrer" style={{ color: "#888", textDecoration: "underline" }}>European Commission</a>
                {" · "}
                <a href="https://now.tufts.edu/2019/09/05/truth-about-conspiracy-theories" target="_blank" rel="noreferrer" style={{ color: "#888", textDecoration: "underline" }}>Tufts University</a>
              </div>
            </div>

            <button
              onClick={dismissIntro}
              style={{
                marginTop: 26,
                width: "100%",
                background: "#60a5fa",
                color: "#000",
                border: "1px solid #60a5fa",
                borderRadius: 3,
                padding: "12px 18px",
                fontSize: 12,
                letterSpacing: "0.16em",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              START  →
            </button>
          </div>
        </div>
      )}

      {/* Hero overlay */}
      <div className="absolute left-5 top-6 z-20 max-w-xl pointer-events-none">
        {/* Animated accent bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {(["political","secrets","science","elites","geopolitical"] as ThemeId[]).map((id) => (
            <div
              key={id}
              style={{
                height: 2,
                flex: 1,
                background: THEME_COLORS[id].border,
                boxShadow: `0 0 8px ${THEME_COLORS[id].glow}`,
                borderRadius: 1,
              }}
            />
          ))}
        </div>

        <p className="section-label">BELIEF NETWORK</p>
        <h1
          style={{
            marginTop: 10,
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 48,
            lineHeight: 1.08,
            background: "linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.45) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Map the architecture
          <br />
          of collective doubt.
        </h1>
        <p style={{ marginTop: 10, fontSize: 14, color: "#fff", letterSpacing: "0.04em" }}>
          A database of beliefs across South-East Asia and beyond.
        </p>
        <div className="mt-5 flex gap-3 pointer-events-auto">
          <button
            className="terminal-btn-primary"
            onClick={() => (fgRef.current as any)?.zoomToFit?.(700, 80)}
          >
            Explore the Graph
          </button>
          <button className="terminal-btn-secondary" onClick={() => nav("/game/survey")}>
            Take the Survey
          </button>
        </div>
      </div>

      {/* Bottom-right cluster strip */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          bottom: 48,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-end",
          fontFamily: "var(--font-sans)",
        }}
      >
        {THEMES.map((t) => {
          const cfg = THEME_COLORS[t.id];
          return (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,0,0,0.6)",
                border: `1px solid ${cfg.border}22`,
                borderRight: `2px solid ${cfg.border}`,
                padding: "4px 10px 4px 12px",
                borderRadius: "2px 0 0 2px",
              }}
            >
              <span style={{ fontSize: 11, color: "#fff", letterSpacing: "0.12em" }}>
                {t.short}
              </span>
            </div>
          );
        })}
      </div>

      {/* Force graph canvas */}
      <div className="absolute inset-0" style={{ background: "#000" }}>
        <ForceGraph2D
          ref={fgRef as any}
          graphData={data}
          backgroundColor="#000000"
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          cooldownTicks={160}
          d3VelocityDecay={0.2}
          linkColor={(link) => {
            const themeId = (link as any).theme as ThemeId | undefined;
            if (themeId) return THEME_COLORS[themeId].dim;
            return "rgba(255,255,255,0.06)";
          }}
          linkWidth={0.7}
          linkDirectionalParticles={2}
          linkDirectionalParticleColor={(link) => {
            const themeId = (link as any).theme as ThemeId | undefined;
            if (themeId) return THEME_COLORS[themeId].border;
            return "rgba(255,255,255,0.5)";
          }}
          linkDirectionalParticleWidth={1.4}
          linkDirectionalParticleSpeed={0.005}
          nodeLabel={() => ""}
          onZoomEnd={() => {
            const fg = fgRef.current as any;
            if (!fg || typeof fg.zoom !== "function") return;
            try {
              const k = fg.zoom();
              if (typeof k === "number" && k < MIN_ZOOM) fg.zoom(MIN_ZOOM, 120);
              clampToViewport(fg, data, VIEWPORT_PAD);
            } catch { /* ignore */ }
          }}
          onNodeHover={(node) => setHovered((node as any) ?? null)}
          onNodeClick={(node) => {
            const n = node as any as Node;
            if (!n) return;
            if (n.type === "theme" && n.theme) {
              nav(`/explore?theme=${encodeURIComponent(n.theme)}`);
            } else if (n.type === "category" && n.theme && n.category) {
              nav(`/explore?theme=${encodeURIComponent(n.theme)}&category=${encodeURIComponent(n.category)}`);
            } else if (n.type === "leaf" && n.itemId) {
              nav(`/game/survey?itemId=${encodeURIComponent(n.itemId)}`);
            }
          }}
          onEngineStop={() => {
            const fg = fgRef.current as any;
            if (!fg) return;
            try {
              fg.centerAt?.(0, 0, 0);
              fg.zoomToFit?.(800, VIEWPORT_PAD);
              clampToViewport(fg, data, VIEWPORT_PAD);
            } catch { /* ignore */ }
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const n = node as any as Node;
            const x = (node as any).x as number;
            const y = (node as any).y as number;
            const themeId = n.theme;
            const cfg = themeId ? THEME_COLORS[themeId] : null;
            const isHover = hovered?.id === n.id;

            if (n.type === "theme") {
              // Large circle hub with glow
              const r = (isHover ? 14 : 12) / Math.max(1, globalScale);

              // Glow ring
              if (cfg) {
                ctx.beginPath();
                ctx.arc(x, y, r + 5 / Math.max(1, globalScale), 0, Math.PI * 2);
                ctx.fillStyle = cfg.glow;
                ctx.fill();
              }

              // Fill
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fillStyle = cfg ? cfg.fill : "rgba(255,255,255,0.08)";
              ctx.fill();

              // Border
              ctx.strokeStyle = isHover ? "#ffffff" : (cfg ? cfg.border : "rgba(255,255,255,0.6)");
              ctx.lineWidth = (isHover ? 2 : 1.5) / Math.max(1, globalScale);
              ctx.stroke();

              // Label below node
              const fs = Math.max(7, 11 / Math.max(1, globalScale));
              ctx.font = `700 ${fs}px var(--font-sans)`;
              ctx.textAlign = "center";
              ctx.fillStyle = cfg ? cfg.border : "rgba(255,255,255,0.9)";
              ctx.fillText(n.label, x, y + r + fs * 1.3);

            } else if (n.type === "category") {
              // Medium square (rounded) node
              const s = (isHover ? 7.5 : 6) / Math.max(1, globalScale);
              const rr = s * 0.4;

              ctx.beginPath();
              roundRect(ctx, x - s, y - s, s * 2, s * 2, rr);
              ctx.fillStyle = cfg ? cfg.fill : "rgba(255,255,255,0.05)";
              ctx.fill();
              ctx.strokeStyle = isHover ? "#ffffff" : (cfg ? cfg.dim : "rgba(255,255,255,0.35)");
              ctx.lineWidth = (isHover ? 1.5 : 1) / Math.max(1, globalScale);
              ctx.stroke();

              // Outer glow ring on hover
              if (isHover && cfg) {
                ctx.beginPath();
                roundRect(ctx, x - s - 3, y - s - 3, (s + 3) * 2, (s + 3) * 2, rr + 3);
                ctx.strokeStyle = cfg.glow;
                ctx.lineWidth = 2 / Math.max(1, globalScale);
                ctx.stroke();
              }

              // Label on hover
              if (isHover) {
                const fs = Math.max(6, 9 / Math.max(1, globalScale));
                ctx.font = `${fs}px var(--font-sans)`;
                ctx.textAlign = "left";
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.fillText(n.label, x + s + 4 / Math.max(1, globalScale), y + fs * 0.35);
              }

            } else {
              // Small leaf dot
              const r = (isHover ? 4 : 3) / Math.max(1, globalScale);

              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fillStyle = cfg ? (isHover ? cfg.border : cfg.dim) : "rgba(255,255,255,0.3)";
              ctx.fill();

              if (isHover && cfg) {
                ctx.beginPath();
                ctx.arc(x, y, r + 3 / Math.max(1, globalScale), 0, Math.PI * 2);
                ctx.strokeStyle = cfg.glow;
                ctx.lineWidth = 1.5 / Math.max(1, globalScale);
                ctx.stroke();
              }
            }
          }}
          nodePointerAreaPaint={(node, color, ctx, globalScale) => {
            const n = node as any as Node;
            const x = (node as any).x as number;
            const y = (node as any).y as number;
            const base = n.type === "theme" ? 16 : n.type === "category" ? 10 : 8;
            const s = base / Math.max(1, globalScale);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();
          }}
        />

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.012) 2px, rgba(0,0,0,0.012) 4px)",
          }}
        />
      </div>

      {/* Hover tooltip */}
      {hovered && mouse && (() => {
        const themeId = hovered.theme;
        const themeMeta = THEMES.find((t) => t.id === themeId);
        const itemText = hovered.type === "leaf"
          ? toQuestion(surveyItems.find((i) => i.id === hovered.itemId)?.text ?? "—")
          : hovered.type === "category"
          ? hovered.category ?? "—"
          : themeMeta?.description ?? "—";
        const cfg = themeId ? THEME_COLORS[themeId] : null;

        return (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: Math.min(mouse.x + 14, window.innerWidth - 340),
              top: Math.min(mouse.y + 14, window.innerHeight - 180),
              width: 310,
              background: "#080808",
              border: `1px solid ${cfg ? cfg.dim : "#222"}`,
              borderRadius: 3,
              padding: "10px 12px",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              color: "#fff",
            }}
          >
            {cfg && (
              <div style={{ width: "100%", height: 2, background: cfg.border, marginBottom: 8, borderRadius: 1 }} />
            )}
            <DiagRow k="TYPE" v={hovered.type.toUpperCase()} />
            <DiagRow k="THEME" v={themeMeta?.short ?? "—"} />
            {hovered.type === "category" && <DiagRow k="CLUSTER" v={hovered.category ?? "—"} />}
            {hovered.type === "leaf" && <DiagRow k="ID" v={hovered.itemId ?? "—"} />}
            <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #1a1a1a" }}>
              <p style={{ color: "#aaa", lineHeight: 1.45, fontSize: 10 }}>{itemText}</p>
            </div>
            {hovered.type !== "leaf" && (
              <p style={{ marginTop: 6, color: cfg ? cfg.dim : "#555", fontSize: 9, letterSpacing: "0.08em" }}>
                CLICK TO EXPLORE →
              </p>
            )}
            {hovered.type === "leaf" && (
              <p style={{ marginTop: 6, color: cfg ? cfg.dim : "#555", fontSize: 9, letterSpacing: "0.08em" }}>
                CLICK TO TAKE SURVEY →
              </p>
            )}
          </div>
        );
      })()}
    </div>

    {/* ── About section: always visible on scroll ───────────────────────── */}
    <section
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 100%)",
        borderTop: "1px solid #1a1a1a",
        padding: "72px 24px 96px",
        fontFamily: "var(--font-sans)",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Accent bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {(["political", "secrets", "science", "elites", "geopolitical"] as ThemeId[]).map((id) => (
            <div
              key={id}
              style={{
                height: 2,
                width: 36,
                background: THEME_COLORS[id].border,
                boxShadow: `0 0 8px ${THEME_COLORS[id].glow}`,
              }}
            />
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#60a5fa", letterSpacing: "0.2em", margin: "0 0 14px" }}>
          ABOUT THIS PROJECT
        </p>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 0 18px", lineHeight: 1.2 }}>
          Documenting belief, not endorsing it.
        </h2>
        <p style={{ fontSize: 17, color: "#fff", lineHeight: 1.7, margin: "0 0 18px" }}>
          This website was developed through a collaboration between{" "}
          <strong style={{ color: "#60a5fa" }}>CATOS</strong> and{" "}
          <strong style={{ color: "#60a5fa" }}>In Cube</strong> to document and examine
          conspiracy theories circulating in South-East Asia and worldwide.
        </p>
        <p style={{ fontSize: 17, color: "#fff", lineHeight: 1.7, margin: 0 }}>
          Our goal is to help <strong>counter the spread of misinformation</strong> and
          better understand public perception of complex social issues — not to promote
          or validate any of the claims catalogued here.
        </p>

        <hr style={{ border: 0, borderTop: "1px solid #1f1f1f", margin: "48px 0 36px" }} />

        <p style={{ fontSize: 12, color: "#bbb", letterSpacing: "0.2em", margin: "0 0 14px" }}>
          WHAT IS A CONSPIRACY THEORY?
        </p>
        <h3 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 18px", lineHeight: 1.3 }}>
          A belief that significant events are the result of secret plots by powerful actors.
        </h3>
        <p style={{ fontSize: 16, color: "#ddd", lineHeight: 1.7, margin: "0 0 16px" }}>
          Conspiracy theories often emerge where official information feels incomplete,
          untrustworthy, or contradicts lived experience. They are not always wrong —
          some have been later confirmed (Watergate, MK-Ultra) — but most rely on
          assumptions of hidden coordination by powerful groups that resist scrutiny.
        </p>
        <p style={{ fontSize: 16, color: "#ddd", lineHeight: 1.7, margin: "0 0 16px" }}>
          Studying them helps us see how <strong>trust, power, and uncertainty</strong>{" "}
          shape what people believe — particularly in tightly-managed information
          environments where speculation fills the gaps.
        </p>
        <p style={{ fontSize: 16, color: "#ddd", lineHeight: 1.7, margin: 0 }}>
          The questions on this site are framed as{" "}
          <em style={{ color: "#fff" }}>questions, not assertions</em>. Each belief
          is paired with context on{" "}
          <span style={{ color: "#60a5fa" }}>why people believe it</span>, the{" "}
          <span style={{ color: "#f87171" }}>circumstances that make it plausible</span>,
          and the <span style={{ color: "#4ade80" }}>local context</span> that shapes it.
        </p>

        <hr style={{ border: 0, borderTop: "1px solid #1f1f1f", margin: "48px 0 36px" }} />

        <p style={{ fontSize: 12, color: "#bbb", letterSpacing: "0.2em", margin: "0 0 14px" }}>
          HOW TO USE THIS SITE
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          {[
            { label: "EXPLORE", desc: "Browse five clusters of belief and the questions inside them." },
            { label: "SURVEY", desc: "Tell us where you stand — your responses build the picture." },
            { label: "RESULTS", desc: "See your own beliefs mapped against the wider community." },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: "#0d0d0d",
                border: "1px solid #1f1f1f",
                borderLeft: "2px solid #60a5fa",
                padding: "16px 18px",
                borderRadius: 4,
              }}
            >
              <div style={{ fontSize: 11, color: "#60a5fa", letterSpacing: "0.18em", marginBottom: 8 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.55 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}

function DiagRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 8, marginBottom: 3 }}>
      <span style={{ color: "#555", letterSpacing: "0.1em", fontSize: 10 }}>{k}</span>
      <span style={{ color: "#eee", textAlign: "right" }}>{v}</span>
    </div>
  );
}
