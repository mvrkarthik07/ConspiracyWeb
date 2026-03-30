import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { surveyItems, THEMES, type SurveyItem, type ThemeId } from "@/shared/surveyItems";
import { THEME_COLORS } from "@/shared/themeColors";
import { scoreCMS12, totalCMS12, interpretCMS12, getPersonalityType } from "@/shared/scoring";
import { appendUserSession, createSessionId } from "@/shared/persistence";
import type { UserSession } from "@/shared/types";

type Step = "cms12" | "personalityResult" | "sectionSelect" | "survey" | "results";
type ThemeChoice = ThemeId | "RANDOM";

const CMS12_ITEMS: { id: string; text: string; reverse?: boolean }[] = [
  { id: "CMS12_1",   text: "There are many very important things happening in the world about which the public is not informed." },
  { id: "CMS12_2",   text: "Those at the top do whatever they want." },
  { id: "CMS12_3",   text: "A few powerful groups of people determine the destiny of millions." },
  { id: "CMS12_4",   text: "There are secret organizations that have great influence on political decisions." },
  { id: "CMS12_5_R", text: "I think that the various conspiracy theories circulating in the media are absolute nonsense.", reverse: true },
  { id: "CMS12_6",   text: "Politicians and other leaders are nothing but the string puppets of powers operating in the background." },
  { id: "CMS12_7",   text: "Most people do not recognize to what extent our life is determined by conspiracies that are concocted in secret." },
  { id: "CMS12_8_R", text: "There is no good reason to distrust governments, intelligence agencies, or the media.", reverse: true },
  { id: "CMS12_9",   text: "International intelligence agencies have their hands in our everyday life to a much larger degree than people assume." },
  { id: "CMS12_10",  text: "Secret organizations can manipulate people psychologically so that they do not notice how their life is being controlled by others." },
  { id: "CMS12_11",  text: "There are certain political circles with secret agendas that are very influential." },
  { id: "CMS12_12",  text: "Most people do not see how much our lives are determined by plots hatched in secret." },
];

const SCALE_1_7 = [1, 2, 3, 4, 5, 6, 7] as const;

function takeItems(choice: ThemeChoice): SurveyItem[] {
  if (choice === "RANDOM") {
    const shuffled = [...surveyItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(15, shuffled.length));
  }
  return surveyItems.filter((i) => i.theme === choice);
}

function avg(vals: number[]) {
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// ── Shared style atoms ─────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "calc(100vh - 72px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "var(--font-sans)",
  } as React.CSSProperties,
  card: {
    width: "100%",
    maxWidth: 680,
    background: "#080808",
    border: "1px solid #222",
    borderRadius: 4,
    overflow: "hidden",
  } as React.CSSProperties,
  cardHeader: (accentColor?: string): React.CSSProperties => ({
    padding: "18px 24px",
    borderBottom: "1px solid #1a1a1a",
    background: accentColor ? `linear-gradient(90deg, ${accentColor}12 0%, transparent 100%)` : "#0d0d0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  cardBody: {
    padding: "28px 24px",
  } as React.CSSProperties,
  label: (color?: string): React.CSSProperties => ({
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: color ?? "#555",
    fontFamily: "var(--font-sans)",
  }),
  progressBar: (pct: number, color: string): React.CSSProperties => ({
    height: 2,
    background: `linear-gradient(90deg, ${color} 0%, ${color} ${pct}%, #1a1a1a ${pct}%, #1a1a1a 100%)`,
  }),
};

// ── Scale button component ─────────────────────────────────────────────────

function ScaleButton({
  value,
  selected,
  accentColor,
  onClick,
}: {
  value: number;
  selected: boolean;
  accentColor: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        height: 52,
        border: selected
          ? `2px solid ${accentColor}`
          : hover
          ? "1px solid #555"
          : "1px solid #2a2a2a",
        background: selected ? accentColor : hover ? "#111" : "#050505",
        color: selected ? "#000" : hover ? "#fff" : "#888",
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        fontWeight: 700,
        borderRadius: 3,
        cursor: "pointer",
        transition: "all 0.12s",
        boxShadow: selected ? `0 0 12px ${accentColor}55` : "none",
      }}
    >
      {value}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function SurveyPage() {
  const [sp] = useSearchParams();
  const focusItemId = sp.get("itemId");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // If ?direct=true&theme=XXX, skip CMS12 and go straight to that cluster's survey
  const isDirect = sp.get("direct") === "true";
  const directTheme = sp.get("theme") as ThemeChoice | null;

  const [step, setStep] = useState<Step>(() => {
    if (isDirect && directTheme) return "sectionSelect";
    return "cms12";
  });
  const [cmsIndex, setCmsIndex] = useState(0);
  const [cmsResponses, setCmsResponses] = useState<Record<string, number>>({});

  const [themeChoice, setThemeChoice] = useState<ThemeChoice | null>(directTheme ?? null);
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [surveyResponses, setSurveyResponses] = useState<Record<string, number | null>>({});
  const [currentValue, setCurrentValue] = useState<number | null>(null);

  useEffect(() => {
    if (!focusItemId) return;
    const found = surveyItems.find((x) => x.id === focusItemId);
    if (!found) return;
    setThemeChoice(found.theme);
  }, [focusItemId]);

  const cmsCurrent = CMS12_ITEMS[cmsIndex];
  const cmsScore = useMemo(() => {
    if (isDirect || Object.keys(cmsResponses).length !== CMS12_ITEMS.length) return null;
    return scoreCMS12(cmsResponses);
  }, [cmsResponses, isDirect]);

  const cmsTotal = useMemo(() => {
    if (isDirect || Object.keys(cmsResponses).length !== CMS12_ITEMS.length) return null;
    return totalCMS12(cmsResponses);
  }, [cmsResponses, isDirect]);

  const startTheme = (choice: ThemeChoice) => {
    setThemeChoice(choice);
    const list = takeItems(choice);
    setItems(list);
    setSurveyIndex(0);
    setSurveyResponses({});
    setCurrentValue(null);
    setStep("survey");
  };

  useEffect(() => {
    if (step !== "sectionSelect") return;
    if (themeChoice) startTheme(themeChoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const activeItem = items[surveyIndex] ?? null;

  const results = useMemo(() => {
    if (step !== "results") return null;
    const answered: Array<{ item: SurveyItem; value: number }> = [];
    for (const it of items) {
      const v = surveyResponses[it.id];
      if (typeof v === "number") answered.push({ item: it, value: v });
    }
    const byCategory: Record<string, number[]> = {};
    for (const a of answered) {
      (byCategory[a.item.category] ??= []).push(a.value);
    }
    const categories = [...new Set(items.map((i) => i.category))];
    const radar = categories.map((cat) => ({
      category: cat,
      avg: byCategory[cat]?.length ? Math.round(avg(byCategory[cat]) * 10) / 10 : 0,
    }));
    const sectionAverage = answered.length
      ? Math.round(avg(answered.map((x) => x.value)) * 10) / 10
      : 0;
    const topAgreed = [...answered]
      .filter((x) => x.value >= 6)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    return { radar, sectionAverage, topAgreed, answeredCount: answered.length };
  }, [items, step, surveyResponses]);

  // Save CMS12 personality result when it's computed
  const [cmsSaved, setCmsSaved] = useState(false);
  useEffect(() => {
    if (step !== "personalityResult" || cmsSaved || cmsScore === null) return;
    const session: UserSession = {
      sessionId: createSessionId(),
      theme: "cms12",
      cms12: cmsResponses,
      cms12Score: cmsScore,
      sectionResponses: {},
      completedAt: new Date().toISOString(),
    };
    appendUserSession(session);
    setCmsSaved(true);
  }, [step, cmsSaved, cmsScore, cmsResponses]);

  // Save cluster survey results
  const [surveySaved, setSurveySaved] = useState(false);
  useEffect(() => {
    if (step !== "results" || surveySaved) return;
    const session: UserSession = {
      sessionId: createSessionId(),
      theme: themeChoice && themeChoice !== "RANDOM" ? themeChoice : undefined,
      cms12: cmsResponses,
      cms12Score: cmsScore ?? null,
      sectionResponses: surveyResponses as Record<string, number | null>,
      completedAt: new Date().toISOString(),
    };
    appendUserSession(session);
    setSurveySaved(true);
  }, [step, surveySaved, themeChoice, cmsResponses, cmsScore, surveyResponses]);

  // Accent colour for current theme (fallback white for CMS12)
  const accentColor =
    themeChoice && themeChoice !== "RANDOM"
      ? THEME_COLORS[themeChoice].text
      : "#ffffff";

  // ── CMS12 onboarding ────────────────────────────────────────────────────

  if (step === "cms12") {
    const canNext = typeof cmsResponses[cmsCurrent.id] === "number";
    const pct = Math.round((cmsIndex / CMS12_ITEMS.length) * 100);
    return (
      <div style={S.page} ref={containerRef}>
        <div style={S.card}>
          {/* Progress bar */}
          <div style={S.progressBar(pct, "#ffffff")} />

          {/* Header */}
          <div style={S.cardHeader()}>
            <div>
              <span style={S.label()}>CMS12 BELIEF INVENTORY</span>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>
                General beliefs about how the world works
              </p>
            </div>
            <span style={{ fontSize: 13, color: "#444", letterSpacing: "0.08em" }}>
              {String(cmsIndex + 1).padStart(2, "0")} / {CMS12_ITEMS.length}
            </span>
          </div>

          {/* Question */}
          <div style={S.cardBody}>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e0e0e0", margin: 0 }}>
              {cmsCurrent.text}
            </p>

            {/* Scale */}
            <div style={{ marginTop: 32 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {SCALE_1_7.map((v) => (
                  <ScaleButton
                    key={v}
                    value={v}
                    selected={cmsResponses[cmsCurrent.id] === v}
                    accentColor="#ffffff"
                    onClick={() => setCmsResponses((p) => ({ ...p, [cmsCurrent.id]: v }))}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em" }}>
                  DO NOT AGREE AT ALL
                </span>
                <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em" }}>
                  FULLY AGREE
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
              <ActionButton
                label={cmsIndex + 1 >= CMS12_ITEMS.length ? "SEE SCORE →" : "NEXT →"}
                disabled={!canNext}
                color="#ffffff"
                onClick={() => {
                  if (cmsIndex + 1 >= CMS12_ITEMS.length) setStep("personalityResult");
                  else setCmsIndex((i) => i + 1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Personality Result ───────────────────────────────────────────────────

  if (step === "personalityResult" && cmsScore !== null && cmsTotal !== null) {
    const personality = getPersonalityType(cmsTotal);
    const tendency = interpretCMS12(cmsScore);
    const pct = Math.round((cmsTotal / 84) * 100);
    return (
      <div style={S.page}>
        <div style={S.card}>
          <div style={{ height: 4, background: `linear-gradient(90deg, ${personality.color} 0%, ${personality.color} ${pct}%, #1a1a1a ${pct}%)` }} />
          <div style={S.cardHeader(personality.color)}>
            <div>
              <span style={S.label(personality.color)}>YOUR CONSPIRACY PERSONALITY</span>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#555" }}>CMS12 Belief Inventory — Complete</p>
            </div>
            <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em" }}>CMS12</span>
          </div>
          <div style={S.cardBody}>

            {/* Personality type hero */}
            <div style={{
              background: `${personality.color}0d`,
              border: `1px solid ${personality.color}33`,
              borderLeft: `3px solid ${personality.color}`,
              borderRadius: 4,
              padding: "20px 24px",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 10, color: personality.color, letterSpacing: "0.14em", marginBottom: 6 }}>
                {personality.range} POINTS
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                {personality.title}
              </div>
              <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, margin: "0 0 16px" }}>
                {personality.description}
              </p>
              <div style={{
                background: "#0d0d0d",
                borderRadius: 3,
                padding: "12px 16px",
                borderLeft: `2px solid ${personality.color}66`,
              }}>
                <span style={{ fontSize: 10, color: personality.color, letterSpacing: "0.1em" }}>TIP  </span>
                <span style={{ fontSize: 12, color: "#777" }}>{personality.tip}</span>
              </div>
            </div>

            {/* Score stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.12em", marginBottom: 8 }}>TOTAL SCORE</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: personality.color }}>{cmsTotal}</div>
                <div style={{ fontSize: 9, color: "#333", marginTop: 4 }}>OUT OF 84</div>
              </div>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.12em", marginBottom: 8 }}>AVG RATING</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: personality.color }}>{(Math.round(cmsScore * 10) / 10).toFixed(1)}</div>
                <div style={{ fontSize: 9, color: "#333", marginTop: 4 }}>OUT OF 7.0</div>
              </div>
            </div>

            <StatRow label="TENDENCY" value={tendency.toUpperCase()} />

            <p style={{ marginTop: 20, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
              Now explore a specific belief cluster to see how your views compare on targeted theories.
            </p>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <ActionButton
                label="EXPLORE A CLUSTER →"
                color={personality.color}
                onClick={() => setStep("sectionSelect")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Theme / cluster select ──────────────────────────────────────────────

  if (step === "sectionSelect") {
    return (
      <div style={S.page}>
        <div style={{ width: "100%", maxWidth: 680 }}>
          <div style={{ marginBottom: 24 }}>
            <span style={S.label()}>SELECT A BELIEF CLUSTER</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#555" }}>
              There are no right or wrong answers — we are interested in your personal views.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {THEMES.map((t) => {
              const cfg = THEME_COLORS[t.id];
              const count = surveyItems.filter((i) => i.theme === t.id).length;
              return (
                <ThemeCard
                  key={t.id}
                  label={t.short}
                  description={t.description}
                  count={count}
                  color={cfg.text}
                  borderColor={cfg.border}
                  fillColor={cfg.fill}
                  onClick={() => startTheme(t.id)}
                />
              );
            })}

            {/* Random option */}
            <button
              style={{
                background: "#0a0a0a",
                border: "1px dashed #2a2a2a",
                borderRadius: 4,
                padding: "14px 20px",
                textAlign: "left",
                cursor: "pointer",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => startTheme("RANDOM")}
            >
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#555" }}>
                  RANDOM MIX
                </div>
                <div style={{ fontSize: 11, color: "#333", marginTop: 4 }}>
                  15 randomly selected items from all clusters
                </div>
              </div>
              <span style={{ color: "#333", fontSize: 16 }}>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Survey questions ────────────────────────────────────────────────────

  if (step === "survey" && activeItem) {
    const total = items.length;
    const progress = Math.round((surveyIndex / total) * 100);
    const themeMeta = THEMES.find((t) => t.id === activeItem.theme);
    const cfg = THEME_COLORS[activeItem.theme] ?? null;

    return (
      <div style={S.page}>
        <div style={S.card}>
          {/* Colored progress bar */}
          <div style={S.progressBar(progress, accentColor)} />

          {/* Header */}
          <div style={S.cardHeader(cfg?.text)}>
            <div>
              <span style={S.label(cfg?.text)}>{themeMeta?.short ?? activeItem.theme}</span>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: "#555" }}>
                {activeItem.category}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 13, color: "#555", letterSpacing: "0.06em" }}>
                {String(surveyIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Question */}
          <div style={S.cardBody}>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#e5e5e5", margin: "0 0 32px" }}>
              {activeItem.text}
            </p>

            {/* Scale */}
            <div>
              <div style={{ display: "flex", gap: 6 }}>
                {SCALE_1_7.map((v) => (
                  <ScaleButton
                    key={v}
                    value={v}
                    selected={currentValue === v}
                    accentColor={accentColor}
                    onClick={() => {
                      setCurrentValue(v);
                      // auto-advance after short delay when user picks
                      setTimeout(() => {
                        setSurveyResponses((p) => ({ ...p, [activeItem.id]: v }));
                        setCurrentValue(null);
                        if (surveyIndex + 1 >= items.length) setStep("results");
                        else setSurveyIndex((i) => i + 1);
                      }, 280);
                    }}
                  />
                ))}
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}
              >
                <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em" }}>
                  DO NOT AGREE AT ALL
                </span>
                <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em" }}>
                  FULLY AGREE
                </span>
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ marginTop: 28, display: "flex", gap: 4, flexWrap: "wrap" }}>
              {items.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      i < surveyIndex
                        ? accentColor
                        : i === surveyIndex
                        ? accentColor + "88"
                        : "#1e1e1e",
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>

            {/* Skip */}
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#3a3a3a",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  padding: "6px 0",
                  fontFamily: "var(--font-sans)",
                }}
                onClick={() => {
                  setSurveyResponses((p) => ({ ...p, [activeItem.id]: null }));
                  setCurrentValue(null);
                  if (surveyIndex + 1 >= items.length) setStep("results");
                  else setSurveyIndex((i) => i + 1);
                }}
              >
                SKIP →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ─────────────────────────────────────────────────────────────

  if (step === "results" && results) {
    const effectiveCmsScore = cmsScore ?? 4;
    const sessionId = createSessionId().slice(-4).toUpperCase();
    const themeMeta =
      themeChoice && themeChoice !== "RANDOM"
        ? THEMES.find((t) => t.id === themeChoice)
        : null;
    const themeLabel = themeMeta?.short ?? "RANDOM MIX";
    const cfg = themeMeta ? THEME_COLORS[themeMeta.id] : null;

    const text = buildDiagnostic({
      sessionId,
      cms12Score: Math.round(effectiveCmsScore * 10) / 10,
      tendency: interpretCMS12(effectiveCmsScore).toUpperCase(),
      themeLabel,
      total: items.length,
      completed: results.answeredCount,
      avgAgreement: results.sectionAverage.toFixed(1),
      byCategory: results.radar.map((r) => ({ label: r.category, value: r.avg })),
      top: results.topAgreed.map((x) => ({
        id: x.item.id,
        short: x.item.text.slice(0, 28),
        score: x.value,
      })),
    });

    return (
      <div style={S.page}>
        <div style={S.card}>
          {cfg && <div style={{ height: 3, background: cfg.text }} />}
          <div style={S.cardHeader(cfg?.text)}>
            <span style={S.label(cfg?.text)}>BELIEF DIAGNOSTIC COMPLETE</span>
            <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em" }}>
              #{sessionId}
            </span>
          </div>
          <div style={S.cardBody}>
            {/* Score overview */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <ScoreTile
                label="CMS12 SCORE"
                value={isDirect ? "N/A" : `${(Math.round(effectiveCmsScore * 10) / 10).toFixed(1)} / 7.0`}
                accent={cfg?.text}
              />
              <ScoreTile
                label="AVG AGREEMENT"
                value={`${results.sectionAverage.toFixed(1)} / 7.0`}
                accent={cfg?.text}
              />
              <ScoreTile
                label="COMPLETED"
                value={`${results.answeredCount} / ${items.length}`}
                accent={cfg?.text}
              />
            </div>

            {/* By category bars */}
            {results.radar.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", marginBottom: 14 }}>
                  BY SUB-CLUSTER
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {results.radar.map((r) => (
                    <CategoryBar
                      key={r.category}
                      label={r.category}
                      value={r.avg}
                      color={cfg?.text ?? "#fff"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Top beliefs */}
            {results.topAgreed.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", marginBottom: 12 }}>
                  STRONGLY AGREED
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {results.topAgreed.map((x) => (
                    <div
                      key={x.item.id}
                      style={{
                        background: "#0d0d0d",
                        border: "1px solid #1e1e1e",
                        borderRadius: 3,
                        padding: "10px 14px",
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: cfg?.text ?? "#fff",
                          whiteSpace: "nowrap",
                        }}
                      >
                        [{x.value}/7]
                      </span>
                      <p style={{ fontSize: 12, color: "#aaa", margin: 0, lineHeight: 1.5 }}>
                        {x.item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw diagnostic + actions */}
            <details style={{ marginTop: 8 }}>
              <summary
                style={{ fontSize: 10, color: "#333", letterSpacing: "0.1em", cursor: "pointer" }}
              >
                RAW DIAGNOSTIC OUTPUT
              </summary>
              <pre
                style={{
                  marginTop: 12,
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  lineHeight: 1.4,
                  color: "#555",
                  whiteSpace: "pre",
                  overflowX: "auto",
                }}
              >
                {text}
              </pre>
            </details>

            <div style={{ marginTop: 24, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid #222",
                  color: "#555",
                  padding: "10px 16px",
                  borderRadius: 3,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
                onClick={async () => navigator.clipboard.writeText(text)}
              >
                COPY RESULTS
              </button>
              <ActionButton
                label="RUN AGAIN →"
                color={cfg?.text ?? "#fff"}
                onClick={() => setStep("sectionSelect")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ ...S.card, padding: 32 }}>
        <span style={S.label()}>LOADING</span>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ThemeCard({
  label, description, count, color, borderColor, fillColor, onClick,
}: {
  label: string;
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
        padding: "16px 20px",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", color, fontFamily: "var(--font-sans)" }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#666",
            marginTop: 5,
            lineHeight: 1.5,
            fontFamily: "var(--font-sans)",
            maxWidth: 500,
          }}
        >
          {description}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color }}>
          {count}
        </div>
        <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.1em" }}>ITEMS</div>
      </div>
    </button>
  );
}

function ActionButton({
  label, disabled, color, onClick,
}: {
  label: string;
  disabled?: boolean;
  color: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: disabled ? "transparent" : hover ? color : "transparent",
        border: `1px solid ${disabled ? "#222" : color}`,
        color: disabled ? "#333" : hover ? "#000" : color,
        padding: "10px 20px",
        borderRadius: 3,
        fontSize: 11,
        letterSpacing: "0.1em",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #111",
        padding: "10px 0",
        fontFamily: "var(--font-sans)",
      }}
    >
      <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#ccc" }}>{value}</span>
    </div>
  );
}

function ScoreTile({
  label, value, accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        border: "1px solid #1a1a1a",
        borderRadius: 3,
        padding: "14px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.12em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: accent ?? "#fff" }}>
        {value}
      </div>
    </div>
  );
}

function CategoryBar({
  label, value, color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.round((Math.max(0, Math.min(7, value)) / 7) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "#777" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#555" }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ background: "#111", borderRadius: 2, height: 4 }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Diagnostic text builder ────────────────────────────────────────────────

function padR(s: string, n: number) { return (s + " ".repeat(n)).slice(0, n); }
function padL(s: string, n: number) { return (" ".repeat(n) + s).slice(-n); }
function bar(v: number, max = 10) {
  const f = Math.round((Math.max(0, Math.min(7, v)) / 7) * max);
  return "█".repeat(f) + "░".repeat(Math.max(0, max - f));
}

function buildDiagnostic(input: {
  sessionId: string;
  cms12Score: number;
  tendency: string;
  themeLabel: string;
  total: number;
  completed: number;
  avgAgreement: string;
  byCategory: Array<{ label: string; value: number }>;
  top: Array<{ id: string; short: string; score: number }>;
}) {
  const lines: string[] = [];
  lines.push("╔══════════════════════════════════════════════════╗");
  lines.push(`║  BELIEF DIAGNOSTIC — SESSION #${padR(input.sessionId, 4)}              ║`);
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push(`║  CMS12 SCORE         ${padL(input.cms12Score.toFixed(1), 4)} / 7.0                  ║`);
  lines.push(`║  TENDENCY            ${padR(input.tendency, 22)}║`.replace("║║", "║"));
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push(`║  CLUSTER             ${padR(input.themeLabel.slice(0, 24), 24)}║`.replace("║║", "║"));
  lines.push(`║  COMPLETED           ${padL(String(input.completed), 2)} / ${padR(String(input.total), 2)}                    ║`);
  lines.push(`║  AVG AGREEMENT       ${padL(input.avgAgreement, 4)} / 7.0                  ║`);
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push("║  BY CATEGORY                                    ║");
  lines.push("║  ─────────────────────────────────────────────  ║");
  for (const c of input.byCategory) {
    const label = padR(c.label.toUpperCase().slice(0, 18), 18);
    const b = bar(c.value);
    const v = padL((Math.round(c.value * 10) / 10).toFixed(1), 3);
    lines.push(`║  ${label}    ${b}  ${v}            ║`);
  }
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push("║  TOP BELIEFS                                    ║");
  for (const t of input.top.slice(0, 3)) {
    const left = padR(`${t.id}  ${t.short}`, 34);
    lines.push(`║  > ${left} [${t.score}]  ║`);
  }
  if (input.top.length === 0) lines.push("║  > —                                              ║");
  lines.push("╚══════════════════════════════════════════════════╝");
  return lines.join("\n");
}
