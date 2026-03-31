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

  // ── Auto-redirect: skip framing selection, default to "belief" ──────────
  useEffect(() => {
    if (themeParam && category && !framing) {
      setSp({ theme: themeParam, category, framing: "belief" }, { replace: true });
    }
  }, [themeParam, category, framing, setSp]);

  // ── Layer 1: theme grid ──────────────────────────────────────────────────

  if (themeParam && category && !framing) return null;

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

          {/* Theme header + Direct Survey CTA */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{ borderLeft: `3px solid ${cfg?.border}`, paddingLeft: 16, flex: 1 }}>
              <div style={{ fontSize: 10, color: cfg?.text, letterSpacing: "0.14em", marginBottom: 6 }}>
                {themeMeta?.short}
              </div>
              <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.6, maxWidth: 500 }}>
                {themeMeta?.description}
              </p>
            </div>

            {/* ── Direct survey button ── */}
            <Link
              to={`/game/survey?theme=${themeParam}&direct=true`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: cfg?.fill,
                border: `1px solid ${cfg?.border}`,
                color: cfg?.text,
                padding: "12px 20px",
                borderRadius: 4,
                fontSize: 11,
                letterSpacing: "0.1em",
                textDecoration: "none",
                fontFamily: "var(--font-sans)",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              TAKE THIS SURVEY →
            </Link>
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
            to={`/game/survey?direct=true&theme=${themeParam}`}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((it) => {
                const ar = getAgreeRateForItem(it.id);
                return (
                  <TheoryCard
                    key={it.id}
                    item={it}
                    accentColor={cfg?.text ?? "#fff"}
                    accentBorder={cfg?.border ?? "#fff"}
                    agreePct={ar.pct}
                  />
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

// ── Theory card with expandable write-up ──────────────────────────────────

function TheoryCard({
  item, accentColor, accentBorder, agreePct,
}: {
  item: import("@/shared/surveyItems").SurveyItem;
  accentColor: string;
  accentBorder: string;
  agreePct: number | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!item.detail;

  return (
    <div
      style={{
        background: "#080808",
        border: `1px solid ${expanded ? accentBorder + "44" : "#1a1a1a"}`,
        borderRadius: 4,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header row */}
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 13, color: "#ccc", margin: "0 0 12px", lineHeight: 1.6 }}>
          {item.text}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link
              to={`/game/survey?theme=${item.theme}&direct=true`}
              style={{
                fontSize: 10,
                color: accentColor,
                letterSpacing: "0.1em",
                textDecoration: "none",
                border: `1px solid ${accentBorder}44`,
                padding: "5px 10px",
                borderRadius: 2,
                fontFamily: "var(--font-sans)",
              }}
            >
              TAKE SURVEY →
            </Link>
            {hasDetail && (
              <button
                onClick={() => setExpanded((v) => !v)}
                style={{
                  background: "transparent",
                  border: `1px solid #2a2a2a`,
                  color: expanded ? accentColor : "#555",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  padding: "5px 10px",
                  borderRadius: 2,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {expanded ? "HIDE ▲" : "READ MORE ▼"}
              </button>
            )}
          </div>
          <span style={{ fontSize: 10, color: "#444" }}>
            {agreePct === null ? "NO DATA YET" : `${agreePct}% AGREE`}
          </span>
        </div>
      </div>

      {/* Expandable detail section */}
      {expanded && item.detail && (
        <div
          style={{
            borderTop: `1px solid ${accentBorder}22`,
            background: "#050505",
            padding: "16px 20px",
          }}
        >
          {/* Theory source — where the claim originates */}
          {item.detail.theorySource && (
            <div style={{
              background: "#0d0d0d",
              border: "1px solid #1e1e1e",
              borderRadius: 3,
              padding: "8px 12px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 9, color: "#444", letterSpacing: "0.12em", flexShrink: 0 }}>
                CLAIM ORIGIN
              </span>
              <a
                href={item.detail.theorySource}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 10,
                  color: accentColor,
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  wordBreak: "break-all",
                }}
              >
                {item.detail.theorySource}
              </a>
            </div>
          )}

          {/* Color-coded write-up sections: Blue / Red / Green */}
          <WriteUpSection
            label="GENERAL BELIEF"
            text={item.detail.generalBelief}
            color="#60a5fa"   /* blue */
          />
          <WriteUpSection
            label="WHY PEOPLE BELIEVE THIS"
            text={item.detail.whyBelieve}
            color="#f87171"   /* red */
          />
          <WriteUpSection
            label="SINGAPORE CONTEXT & EXAMPLES"
            text={item.detail.context}
            color="#4ade80"   /* green */
          />
          {item.detail.verification && (
            <WriteUpSection
              label="FACT CHECK"
              text={item.detail.verification}
              color="#a3a3a3"
              isVerification
            />
          )}
          {item.detail.source && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #111" }}>
              <span style={{ fontSize: 9, color: "#444", letterSpacing: "0.12em" }}>SOURCE  </span>
              <a
                href={item.detail.source}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 10, color: "#a78bfa", wordBreak: "break-all", textDecoration: "underline" }}
              >
                {item.detail.source}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WriteUpSection({
  label, text, color, isVerification,
}: {
  label: string;
  text: string;
  color: string;
  isVerification?: boolean;
}) {
  return (
    <div style={{
      marginBottom: 14,
      borderLeft: `2px solid ${color}55`,
      paddingLeft: 10,
    }}>
      <div style={{ fontSize: 9, color, letterSpacing: "0.14em", marginBottom: 5, fontWeight: 600 }}>
        {label}
      </div>
      <p style={{
        fontSize: 12,
        color: isVerification ? "#8a8a8a" : "#999",
        margin: 0,
        lineHeight: 1.7,
      }}>
        {text}
      </p>
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
