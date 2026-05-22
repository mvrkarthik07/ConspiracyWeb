import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { surveyItems, THEMES, type SurveyItem, type ThemeId } from "@/shared/surveyItems";
import { THEME_COLORS } from "@/shared/themeColors";
import { getAgreeRateForItem } from "@/shared/persistence";
import { toQuestion, subClusterLabel } from "@/shared/phrasing";
import { fetchArticles } from "@/shared/articles";
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
    const q = `${themeMeta?.label ?? themeParam} ${category} Singapore`;
    setArticles(null);
    let cancelled = false;
    fetchArticles(q, 6)
      .then((d) => { if (!cancelled) setArticles(d); })
      .catch(() => { if (!cancelled) setArticles([]); });
    return () => { cancelled = true; };
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
          <h2 style={{ fontSize: 13, color: "#bbb", letterSpacing: "0.14em", margin: "0 0 24px" }}>
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
              return (
                <ExploreThemeCard
                  key={t.id}
                  themeId={t.id}
                  short={t.short}
                  question={(t as any).question}
                  description={t.description}
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
              <div style={{ fontSize: 11, color: cfg?.text, letterSpacing: "0.14em", marginBottom: 8 }}>
                {themeMeta?.short}
              </div>
              {(themeMeta as any)?.question && (
                <p style={{ fontSize: 19, color: "#fff", margin: "0 0 10px", lineHeight: 1.35, fontWeight: 600 }}>
                  {(themeMeta as any).question}
                </p>
              )}
              <p style={{ fontSize: 14, color: "#ccc", margin: 0, lineHeight: 1.6, maxWidth: 500 }}>
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

          <h2 style={{ fontSize: 12, color: "#bbb", letterSpacing: "0.14em", margin: "0 0 16px" }}>
            SUB-CLUSTERS
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {categories.map((cat) => {
              return (
                <SubClusterCard
                  key={cat}
                  label={subClusterLabel(cat)}
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
            { label: subClusterLabel(category!), href: `/explore?theme=${themeParam}&category=${encodeURIComponent(category!)}` },
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
              {themeMeta?.short}  ›  {subClusterLabel(category!)}
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
            <div style={{ fontSize: 12, color: "#bbb", letterSpacing: "0.14em", marginBottom: 14 }}>
              BELIEF ITEMS
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
            <div style={{ fontSize: 12, color: "#bbb", letterSpacing: "0.14em", marginBottom: 14 }}>
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
  const [open, setOpen] = useState(false);
  const hasDetail = !!item.detail;

  // Lock body scroll while modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        style={{
          background: "#080808",
          border: "1px solid #1a1a1a",
          borderRadius: 4,
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        <div style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 15, color: "#fff", margin: "0 0 12px", lineHeight: 1.6, fontWeight: 600 }}>
            {toQuestion(item.text)}
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
                  onClick={() => setOpen(true)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${accentBorder}66`,
                    color: accentColor,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    padding: "5px 10px",
                    borderRadius: 2,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  READ MORE  ↗
                </button>
              )}
            </div>
            <span style={{ fontSize: 10, color: "#444" }}>
              {agreePct === null ? "NO DATA YET" : `${agreePct}% AGREE`}
            </span>
          </div>
        </div>
      </div>

      {/* Modal popup — opens when READ MORE is clicked */}
      {open && item.detail && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 720,
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#0a0a0a",
              border: `1px solid ${accentBorder}44`,
              borderLeft: `3px solid ${accentBorder}`,
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              position: "relative",
            }}
          >
            {/* Sticky header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                background: "#0a0a0a",
                borderBottom: "1px solid #1a1a1a",
                padding: "18px 24px 14px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
                zIndex: 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: accentColor, letterSpacing: "0.16em", marginBottom: 8 }}>
                  THEORY DETAIL
                </div>
                <p style={{ fontSize: 18, color: "#fff", margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
                  {toQuestion(item.text)}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: "transparent",
                  border: "1px solid #2a2a2a",
                  color: "#bbb",
                  fontSize: 14,
                  width: 32,
                  height: 32,
                  borderRadius: 3,
                  cursor: "pointer",
                  flexShrink: 0,
                  lineHeight: 1,
                  fontFamily: "var(--font-sans)",
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px 28px" }}>
              {item.detail.theorySource && (
                <div
                  style={{
                    background: "#0d0d0d",
                    border: "1px solid #1e1e1e",
                    borderRadius: 3,
                    padding: "10px 14px",
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.12em", flexShrink: 0 }}>
                    CLAIM ORIGIN
                  </span>
                  <a
                    href={item.detail.theorySource}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 11,
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

              <WriteUpSection
                label="GENERAL BELIEF"
                text={item.detail.generalBelief}
                color="#60a5fa"
              />
              <WriteUpSection
                label="WHY PEOPLE BELIEVE THIS"
                text={item.detail.whyBelieve}
                color="#f87171"
              />
              <WriteUpSection
                label="SINGAPORE CONTEXT & EXAMPLES"
                text={item.detail.context}
                color="#4ade80"
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
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1a1a1a" }}>
                  <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.12em" }}>SOURCE  </span>
                  <a
                    href={item.detail.source}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 11, color: "#a78bfa", wordBreak: "break-all", textDecoration: "underline" }}
                  >
                    {item.detail.source}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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
        fontSize: 14,
        color: isVerification ? "#bbb" : "#e5e5e5",
        margin: 0,
        lineHeight: 1.75,
      }}>
        {text}
      </p>
    </div>
  );
}

// ── Card sub-components ────────────────────────────────────────────────────

function ExploreThemeCard({
  short, question, description, color, borderColor, fillColor, onClick,
}: {
  themeId: ThemeId;
  short: string;
  question?: string;
  description: string;
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
      <div style={{ fontSize: 11, letterSpacing: "0.14em", color, marginBottom: 10 }}>
        {short}
      </div>
      {question && (
        <p style={{ fontSize: 17, color: "#fff", margin: "0 0 12px", lineHeight: 1.4, fontWeight: 600 }}>
          {question}
        </p>
      )}
      <p style={{ fontSize: 14, color: "#ccc", margin: 0, lineHeight: 1.6 }}>
        {description}
      </p>
    </button>
  );
}

function SubClusterCard({
  label, borderColor, fillColor, onClick,
}: {
  label: string;
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
      }}
    >
      <div style={{ fontSize: 14, color: "#fff" }}>{label}</div>
    </button>
  );
}
