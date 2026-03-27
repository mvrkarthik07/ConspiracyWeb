import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { surveyItems, THEMES, type SurveyItem, type ThemeId } from "@/shared/surveyItems";
import { THEME_COLORS } from "@/shared/themeColors";
import { getAgreeRateForItem } from "@/shared/persistence";
import type { ArticleResult } from "@/shared/types";

const FRAMINGS = [
  { id: "belief",   label: "Why do people believe in this?" },
  { id: "evidence", label: "What evidence exists for and against?" },
  { id: "spread",   label: "How widespread is this belief?" },
] as const;

// ── Shared atoms ────────────────────────────────────────────────────────────

const page: React.CSSProperties = {
  minHeight: "calc(100vh - 72px)",
  padding: "36px 20px 60px",
  fontFamily: "var(--font-sans)",
};

const MAX_W = 900;

function Breadcrumb({ parts }: { parts: { label: string; href?: string }[] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 28,
        fontSize: 10,
        letterSpacing: "0.12em",
        color: "#444",
      }}
    >
      {parts.map((p, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "#2a2a2a" }}>›</span>}
          {p.href ? (
            <Link
              to={p.href}
              style={{ color: "#555", textDecoration: "none" }}
            >
              {p.label}
            </Link>
          ) : (
            <span style={{ color: "#aaa" }}>{p.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function ExplorePage() {
  const [sp, setSp] = useSearchParams();
  const themeParam = sp.get("theme") as ThemeId | null;
  const category = sp.get("category");
  const framing = sp.get("framing");

  const [articles, setArticles] = useState<ArticleResult[] | null>(null);

  const themeMeta = useMemo(
    () => THEMES.find((t) => t.id === themeParam) ?? null,
    [themeParam]
  );
  const cfg = themeParam ? THEME_COLORS[themeParam] : null;

  const categories = useMemo(() => {
    if (!themeParam) return [];
    return Array.from(
      new Set(surveyItems.filter((i) => i.theme === themeParam).map((i) => i.category))
    );
  }, [themeParam]);

  const items = useMemo<SurveyItem[]>(() => {
    if (!themeParam || !category) return [];
    return surveyItems.filter((i) => i.theme === themeParam && i.category === category);
  }, [themeParam, category]);

  useEffect(() => {
    if (!themeParam || !category || !framing) return;
    const q = `${themeMeta?.label ?? themeParam} ${category} ${framing} Singapore`;
    setArticles(null);
    fetch(`/api/articles?query=${encodeURIComponent(q)}&count=6`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? setArticles(d) : setArticles([])))
      .catch(() => setArticles([]));
  }, [themeParam, category, framing, themeMeta]);

  // ── Layer 1: theme grid ──────────────────────────────────────────────────

  if (!themeParam) {
    return (
      <div style={page}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <Breadcrumb parts={[{ label: "EXPLORE" }]} />
          <h2 style={{ fontSize: 11, color: "#444", letterSpacing: "0.14em", margin: "0 0 24px" }}>
            SELECT A BELIEF CLUSTER
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {THEMES.map((t) => {
              const c = THEME_COLORS[t.id];
              const count = surveyItems.filter((i) => i.theme === t.id).length;
              return (
                <ExploreThemeCard
                  key={t.id}
                  themeId={t.id}
                  short={t.short}
                  description={t.description}
                  count={count}
                  color={c.text}
                  borderColor={c.border}
                  fillColor={c.fill}
                  onClick={() => setSp({ theme: t.id })}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Layer 2: sub-cluster grid ────────────────────────────────────────────

  if (themeParam && !category) {
    return (
      <div style={page}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <Breadcrumb
            parts={[
              { label: "EXPLORE", href: "/explore" },
              { label: themeMeta?.short ?? themeParam },
            ]}
          />

          {/* Theme header */}
          <div
            style={{
              borderLeft: `3px solid ${cfg?.border}`,
              paddingLeft: 16,
              marginBottom: 32,
            }}
          >
            <div style={{ fontSize: 10, color: cfg?.text, letterSpacing: "0.14em", marginBottom: 6 }}>
              {themeMeta?.short}
            </div>
            <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.6, maxWidth: 560 }}>
              {themeMeta?.description}
            </p>
          </div>

          <h2 style={{ fontSize: 10, color: "#444", letterSpacing: "0.14em", margin: "0 0 16px" }}>
            SUB-CLUSTERS
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {categories.map((cat) => {
              const cnt = surveyItems.filter((i) => i.theme === themeParam && i.category === cat).length;
              return (
                <SubClusterCard
                  key={cat}
                  label={cat}
                  count={cnt}
                  color={cfg?.text ?? "#fff"}
                  borderColor={cfg?.border ?? "#fff"}
                  fillColor={cfg?.fill ?? "transparent"}
                  onClick={() => setSp({ theme: themeParam, category: cat })}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Layer 3: framing selection ───────────────────────────────────────────

  if (themeParam && category && !framing) {
    return (
      <div style={page}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <Breadcrumb
            parts={[
              { label: "EXPLORE", href: "/explore" },
              { label: themeMeta?.short ?? themeParam, href: `/explore?theme=${themeParam}` },
              { label: category },
            ]}
          />

          <div
            style={{
              borderLeft: `3px solid ${cfg?.border}`,
              paddingLeft: 16,
              marginBottom: 32,
            }}
          >
            <div style={{ fontSize: 10, color: cfg?.text, letterSpacing: "0.14em" }}>
              {themeMeta?.short}
            </div>
            <div style={{ fontSize: 18, color: "#ddd", marginTop: 6, fontWeight: 600 }}>
              {category}
            </div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>
              {items.length} belief items in this sub-cluster
            </div>
          </div>

          <h2 style={{ fontSize: 10, color: "#444", letterSpacing: "0.14em", margin: "0 0 14px" }}>
            CHOOSE A FRAMING LENS
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FRAMINGS.map((f) => (
              <FramingCard
                key={f.id}
                label={f.label}
                color={cfg?.text ?? "#fff"}
                borderColor={cfg?.border ?? "#fff"}
                onClick={() => setSp({ theme: themeParam, category, framing: f.id })}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Layer 4: items + articles ─────────────────────────────────────────────

  const framingMeta = FRAMINGS.find((f) => f.id === framing);

  return (
    <div style={page}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <Breadcrumb
          parts={[
            { label: "EXPLORE", href: "/explore" },
            { label: themeMeta?.short ?? themeParam!, href: `/explore?theme=${themeParam}` },
            { label: category!, href: `/explore?theme=${themeParam}&category=${encodeURIComponent(category!)}` },
            { label: framingMeta?.label ?? framing! },
          ]}
        />

        {/* Header */}
        <div
          style={{
            background: cfg?.fill,
            border: `1px solid ${cfg?.border}22`,
            borderLeft: `3px solid ${cfg?.border}`,
            borderRadius: 4,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: cfg?.text, letterSpacing: "0.12em" }}>
              {themeMeta?.short}  ›  {category}
            </div>
            <div style={{ fontSize: 14, color: "#ddd", marginTop: 4 }}>
              {framingMeta?.label}
            </div>
          </div>
          <Link
            to={`/game/survey?theme=${themeParam}`}
            style={{
              border: `1px solid ${cfg?.border}`,
              color: cfg?.text,
              padding: "8px 16px",
              borderRadius: 3,
              fontSize: 10,
              letterSpacing: "0.1em",
              textDecoration: "none",
            }}
          >
            TAKE SURVEY →
          </Link>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          {/* Items column */}
          <div>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.14em", marginBottom: 14 }}>
              BELIEF ITEMS ({items.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((it) => {
                const ar = getAgreeRateForItem(it.id);
                return (
                  <div
                    key={it.id}
                    style={{
                      background: "#080808",
                      border: "1px solid #1a1a1a",
                      borderRadius: 4,
                      padding: "14px 16px",
                    }}
                  >
                    <p style={{ fontSize: 13, color: "#ccc", margin: "0 0 12px", lineHeight: 1.6 }}>
                      {it.text}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Link
                        to={`/game/survey?itemId=${encodeURIComponent(it.id)}`}
                        style={{
                          fontSize: 10,
                          color: cfg?.text ?? "#fff",
                          letterSpacing: "0.1em",
                          textDecoration: "none",
                          border: `1px solid ${cfg?.border ?? "#fff"}44`,
                          padding: "5px 10px",
                          borderRadius: 2,
                        }}
                      >
                        RESPOND →
                      </Link>
                      <span style={{ fontSize: 10, color: "#444" }}>
                        {ar.pct === null ? "NO RESPONSES YET" : `${ar.pct}% AGREE`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Articles column */}
          <div>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.14em", marginBottom: 14 }}>
              RELATED READING
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {articles === null ? (
                <div style={{ color: "#333", fontSize: 12 }}>Loading articles…</div>
              ) : articles.length === 0 ? (
                <div style={{ color: "#333", fontSize: 12 }}>No results found.</div>
              ) : (
                articles.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      background: "#080808",
                      border: "1px solid #1a1a1a",
                      borderRadius: 4,
                      padding: "14px 16px",
                      textDecoration: "none",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        cfg?.dim ?? "#333")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a")
                    }
                  >
                    <p style={{ fontSize: 13, color: "#ccc", margin: "0 0 6px", lineHeight: 1.5 }}>
                      {a.title}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#555" }}>{a.source}</span>
                      <span style={{ fontSize: 10, color: cfg?.dim ?? "#333" }}>↗</span>
                    </div>
                    {a.snippet && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "#444",
                          margin: "8px 0 0",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {a.snippet}
                      </p>
                    )}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card sub-components ────────────────────────────────────────────────────

function ExploreThemeCard({
  short, description, count, color, borderColor, fillColor, onClick,
}: {
  themeId: ThemeId;
  short: string;
  description: string;
  count: number;
  color: string;
  borderColor: string;
  fillColor: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? fillColor : "#0a0a0a",
        border: `1px solid ${hover ? borderColor : "#1e1e1e"}`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 4,
        padding: "20px",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.15s",
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: "0.14em", color, marginBottom: 8 }}>
        {short}
      </div>
      <p style={{ fontSize: 12, color: "#666", margin: "0 0 16px", lineHeight: 1.6 }}>
        {description}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color }}>{count}</span>
        <span style={{ fontSize: 9, color: "#444", letterSpacing: "0.1em" }}>ITEMS</span>
      </div>
    </button>
  );
}

function SubClusterCard({
  label, count, color, borderColor, fillColor, onClick,
}: {
  label: string;
  count: number;
  color: string;
  borderColor: string;
  fillColor: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? fillColor : "#0a0a0a",
        border: `1px solid ${hover ? borderColor : "#1a1a1a"}`,
        borderRadius: 4,
        padding: "16px",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.15s",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 12, color: hover ? color : "#888" }}>{label}</div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          background: `${color}18`,
          border: `1px solid ${color}44`,
          borderRadius: 2,
          padding: "2px 8px",
          flexShrink: 0,
        }}
      >
        {count}
      </div>
    </button>
  );
}

function FramingCard({
  label, color, borderColor, onClick,
}: {
  label: string;
  color: string;
  borderColor: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? `${color}0e` : "#0a0a0a",
        border: `1px solid ${hover ? borderColor : "#1e1e1e"}`,
        borderRadius: 4,
        padding: "16px 20px",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: 13, color: hover ? color : "#888" }}>{label}</span>
      <span style={{ color: hover ? color : "#333", fontSize: 16 }}>→</span>
    </button>
  );
}
