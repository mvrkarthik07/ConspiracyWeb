import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { surveyItems, type SurveyItem } from "@/shared/surveyItems";
import { scoreCMS12, interpretCMS12 } from "@/shared/scoring";
import { appendUserSession, createSessionId } from "@/shared/persistence";
import type { UserSession } from "@/shared/types";

type Step = "cms12" | "cms12Result" | "sectionSelect" | "survey" | "results";
type SectionChoice = "A" | "B" | "C" | "RANDOM";

const CMS12_ITEMS: { id: string; text: string; reverse?: boolean }[] = [
  { id: "CMS12_1", text: "There are many very important things happening in the world about which the public is not informed." },
  { id: "CMS12_2", text: "Those at the top do whatever they want." },
  { id: "CMS12_3", text: "A few powerful groups of people determine the destiny of millions." },
  { id: "CMS12_4", text: "There are secret organizations that have great influence on political decisions." },
  { id: "CMS12_5_R", text: "I think that the various conspiracy theories circulating in the media are absolute nonsense.", reverse: true },
  { id: "CMS12_6", text: "Politicians and other leaders are nothing but the string puppets of powers operating in the background." },
  { id: "CMS12_7", text: "Most people do not recognize to what extent our life is determined by conspiracies that are concocted in secret." },
  { id: "CMS12_8_R", text: "There is no good reason to distrust governments, intelligence agencies, or the media.", reverse: true },
  { id: "CMS12_9", text: "International intelligence agencies have their hands in our everyday life to a much larger degree than people assume." },
  { id: "CMS12_10", text: "Secret organizations can manipulate people psychologically so that they do not notice how their life is being controlled by others." },
  { id: "CMS12_11", text: "There are certain political circles with secret agendas that are very influential." },
  { id: "CMS12_12", text: "Most people do not see how much our lives are determined by plots hatched in secret." },
];

const SCALE_1_7 = [1, 2, 3, 4, 5, 6, 7] as const;
const NOTE = "There are no right or wrong answers. We are interested in your personal beliefs and opinions.";

const CATEGORY_ORDER = [
  "Government/Political",
  "Economic/Financial",
  "Media/Information",
  "Health/Pandemic",
  "Science/Technology",
  "Security/Crime",
  "Foreign Relations/Security",
] as const;

function sectionLabel(sec: "A" | "B" | "C") {
  if (sec === "A") return "🇸🇬 Singapore";
  if (sec === "B") return "🌏 Asia";
  return "🌍 Worldwide";
}

function takeItems(choice: SectionChoice): SurveyItem[] {
  if (choice === "A" || choice === "B" || choice === "C") return surveyItems.filter((i) => i.section === choice);
  const shuffled = [...surveyItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(15, shuffled.length));
}

function avg(values: number[]) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

export function SurveyPage() {
  const [sp] = useSearchParams();
  const focusItemId = sp.get("itemId");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState<Step>("cms12");
  const [cmsIndex, setCmsIndex] = useState(0);
  const [cmsResponses, setCmsResponses] = useState<Record<string, number>>({});

  const [sectionChoice, setSectionChoice] = useState<SectionChoice | null>(null);
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [surveyResponses, setSurveyResponses] = useState<Record<string, number | null>>({});
  const [currentValue, setCurrentValue] = useState<number | null>(null);

  useEffect(() => {
    if (!focusItemId) return;
    const found = surveyItems.find((x) => x.id === focusItemId);
    if (!found) return;
    setSectionChoice(found.section);
  }, [focusItemId]);

  const cmsCurrent = CMS12_ITEMS[cmsIndex];
  const cmsScore = useMemo(() => {
    if (Object.keys(cmsResponses).length !== CMS12_ITEMS.length) return null;
    return scoreCMS12(cmsResponses);
  }, [cmsResponses]);

  const startSection = (choice: SectionChoice) => {
    setSectionChoice(choice);
    const list = takeItems(choice);
    setItems(list);
    setSurveyIndex(0);
    setSurveyResponses({});
    setCurrentValue(null);
    setStep("survey");
  };

  useEffect(() => {
    if (step !== "sectionSelect") return;
    if (sectionChoice) startSection(sectionChoice);
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
    const radar = CATEGORY_ORDER.map((cat) => ({ category: cat, avg: byCategory[cat]?.length ? Math.round(avg(byCategory[cat]) * 10) / 10 : 0 }));
    const sectionAverage = answered.length ? Math.round(avg(answered.map((x) => x.value)) * 10) / 10 : 0;
    const topAgreed = [...answered].filter((x) => x.value >= 6).sort((a, b) => b.value - a.value).slice(0, 3);
    return { radar, sectionAverage, topAgreed, answeredCount: answered.length };
  }, [items, step, surveyResponses]);

  useEffect(() => {
    if (step !== "results") return;
    if (cmsScore === null) return;
    const session: UserSession = {
      sessionId: createSessionId(),
      cms12: cmsResponses,
      cms12Score: cmsScore,
      sectionResponses: surveyResponses,
      completedAt: new Date().toISOString(),
    };
    appendUserSession(session);
  }, [cmsResponses, cmsScore, step, surveyResponses]);

  const button = "terminal-btn-secondary";
  const card = "terminal-panel";

  if (step === "cms12") {
    const canNext = typeof cmsResponses[cmsCurrent.id] === "number";
    return (
      <div ref={containerRef} className={`${card} p-6`}>
        <pre style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
        <div className="flex items-center justify-between">
          <span className="section-label">CMS12 ONBOARDING</span>
          <span className="section-label">Q.{String(cmsIndex + 1).padStart(2, "0")} / 12</span>
        </div>
        <pre style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
        <p className="body-copy" style={{ marginTop: 12, color: "var(--text-secondary)" }}>
          {cmsCurrent.text}
        </p>
        <pre style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
        <div className="mt-4 grid grid-cols-7 gap-2" style={{ fontFamily: "var(--font-sans)" }}>
          {SCALE_1_7.map((v) => {
            const selected = cmsResponses[cmsCurrent.id] === v;
            return (
              <button
                key={v}
                className={[
                  "border px-0 py-3 text-sm",
                  selected
                    ? "bg-white text-black border-[var(--border-active)]"
                    : "bg-transparent text-white border-[var(--border-default)]",
                ].join(" ")}
                onClick={() => setCmsResponses((p) => ({ ...p, [cmsCurrent.id]: v }))}
              >
                {v}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: "var(--text-secondary)" }}>
          <span>Do not agree at all</span>
          <span>Fully agree</span>
        </div>
        <pre style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
        <div className="mt-4 flex justify-end">
          <button
            className={button}
            disabled={!canNext}
            onClick={() => {
              if (cmsIndex + 1 >= CMS12_ITEMS.length) setStep("cms12Result");
              else setCmsIndex((i) => i + 1);
            }}
          >
            {cmsIndex + 1 >= CMS12_ITEMS.length ? "SEE SCORE" : "NEXT"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "cms12Result" && cmsScore !== null) {
    return (
      <div className={`${card} p-6`}>
        <pre style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
          {"══════════════════════════════════════════════════"}
        </pre>
        <div className="flex items-center justify-between">
          <span className="section-label">CONSPIRACY MENTALITY SCORE</span>
          <span className="section-label">CMS12</span>
        </div>
        <pre style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"══════════════════════════════════════════════════"}
        </pre>
        <div style={{ marginTop: 12 }}>
          <Line label="CMS12 SCORE" value={`${Math.round(cmsScore * 10) / 10} / 7.0`} />
          <Line label="TENDENCY" value={interpretCMS12(cmsScore).toUpperCase()} />
        </div>
        <pre style={{ margin: "12px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"══════════════════════════════════════════════════"}
        </pre>
        <div className="mt-4 flex justify-end">
          <button className="terminal-btn-primary" onClick={() => setStep("sectionSelect")}>CONTINUE →</button>
        </div>
      </div>
    );
  }

  if (step === "sectionSelect") {
    return (
      <div className={`${card} p-6`}>
        <p className="section-label">SECTION SELECT</p>
        <p className="body-copy mt-3">{NOTE}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2" style={{ fontFamily: "var(--font-sans)" }}>
          {(["A", "B", "C"] as const).map((sec) => (
            <button key={sec} className="terminal-btn-secondary" onClick={() => startSection(sec)}>
              {sectionLabel(sec)} ({surveyItems.filter((i) => i.section === sec).length})
            </button>
          ))}
          <button className="terminal-btn-secondary" onClick={() => startSection("RANDOM")}>RANDOM MIX (15)</button>
        </div>
      </div>
    );
  }

  if (step === "survey" && activeItem) {
    const sectionCount = items.length;
    const idxLabel = String(surveyIndex + 1).padStart(2, "0");
    return (
      <div className={`${card} p-6`}>
        <pre style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
        <div className="flex items-center justify-between">
          <span className="section-label">
            SECTION {activeItem.section}   {activeItem.category.toUpperCase()}   Q.{idxLabel} / {sectionCount}
          </span>
        </div>
        <pre style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
        <div className="body-copy" style={{ marginTop: 12 }}>
          {wrap(activeItem.text, 54).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
        <pre style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
        <div className="mt-4 grid grid-cols-7 gap-2" style={{ fontFamily: "var(--font-sans)" }}>
          {SCALE_1_7.map((v) => {
            const selected = currentValue === v;
            return (
              <button
                key={v}
                className={[
                  "border px-0 py-3 text-sm",
                  selected ? "bg-white text-black border-[var(--border-active)]" : "bg-transparent text-white border-[var(--border-default)]",
                ].join(" ")}
                onClick={() => setCurrentValue(v)}
              >
                {v}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="terminal-btn-secondary"
            onClick={() => {
              setSurveyResponses((p) => ({ ...p, [activeItem.id]: null }));
              setCurrentValue(null);
              // flicker overwrite
              document.documentElement.style.opacity = "0.85";
              setTimeout(() => (document.documentElement.style.opacity = "1"), 40);
              if (surveyIndex + 1 >= items.length) setStep("results");
              else setSurveyIndex((i) => i + 1);
            }}
          >
            [SKIP →]
          </button>
        </div>
        <pre style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
          {"──────────────────────────────────────────────────"}
        </pre>
      </div>
    );
  }

  if (step === "results" && results && cmsScore !== null) {
    const sessionId = createSessionId().slice(-4).toUpperCase();
    const sec = items[0]?.section ?? "A";
    const completed = results.answeredCount;
    const total = items.length;
    const cms = Math.round(cmsScore * 10) / 10;
    const tendency = interpretCMS12(cmsScore).toUpperCase();
    const avgAgree = results.sectionAverage.toFixed(1);

    const byCat = CATEGORY_ORDER.map((c) => {
      const v = results.radar.find((r) => r.category === c)?.avg ?? 0;
      return { label: c, value: v };
    });

    const text = buildDiagnostic({
      sessionId,
      cms12Score: cms,
      tendency,
      section: sectionLabel(sec as any),
      total,
      completed,
      avgAgreement: avgAgree,
      byCategory: byCat,
      top: results.topAgreed.map((x) => ({ id: x.item.id, short: x.item.text.slice(0, 28), score: x.value })),
    });

    return (
      <div className={`${card} p-6`}>
        <pre
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            lineHeight: 1.35,
            color: "var(--text-primary)",
            whiteSpace: "pre",
          }}
        >
          {text}
        </pre>
        <div className="mt-4 flex justify-end gap-3">
          <button
            className="terminal-btn-secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(text);
            }}
          >
            [COPY RESULTS]
          </button>
          <button className="terminal-btn-primary" onClick={() => setStep("sectionSelect")}>
            RUN AGAIN →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${card} p-6`}>
      <p className="section-label">LOADING</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontFamily: "var(--font-sans)", fontSize: 12 }}>
      <span style={{ color: "var(--text-secondary)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: "var(--text-primary)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function wrap(text: string, width: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (t.length > width) {
      lines.push(line);
      line = w;
    } else {
      line = t;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function bar(value: number, maxBars = 10) {
  const v = Math.max(0, Math.min(7, value));
  const filled = Math.round((v / 7) * maxBars);
  return "█".repeat(filled) + "░".repeat(Math.max(0, maxBars - filled));
}

function padRight(s: string, n: number) {
  return (s + " ".repeat(n)).slice(0, n);
}

function padLeft(s: string, n: number) {
  return (" ".repeat(n) + s).slice(-n);
}

function buildDiagnostic(input: {
  sessionId: string;
  cms12Score: number;
  tendency: string;
  section: string;
  total: number;
  completed: number;
  avgAgreement: string;
  byCategory: Array<{ label: string; value: number }>;
  top: Array<{ id: string; short: string; score: number }>;
}) {
  const lines: string[] = [];
  lines.push("╔══════════════════════════════════════════════════╗");
  lines.push(`║  BELIEF DIAGNOSTIC — SESSION #${padRight(input.sessionId, 4)}              ║`);
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push(`║  CMS12 SCORE         ${padLeft(input.cms12Score.toFixed(1), 4)} / 7.0                  ║`);
  lines.push(`║  TENDENCY            ${padRight(input.tendency, 22)}║`.replace("║║", "║"));
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push(`║  SECTION             ${padRight(input.section, 24)}║`.replace("║║", "║"));
  lines.push(`║  COMPLETED           ${padLeft(String(input.completed), 2)} / ${padRight(String(input.total), 2)}                    ║`);
  lines.push(`║  AVG AGREEMENT       ${padLeft(input.avgAgreement, 4)} / 7.0                  ║`);
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push("║  BY CATEGORY                                    ║");
  lines.push("║  ─────────────────────────────────────────────  ║");
  for (const c of input.byCategory) {
    const label = padRight(c.label.replace("/", " / ").toUpperCase().slice(0, 18), 18);
    const b = bar(c.value);
    const v = padLeft((Math.round(c.value * 10) / 10).toFixed(1), 3);
    lines.push(`║  ${label}    ${b}  ${v}            ║`);
  }
  lines.push("╠══════════════════════════════════════════════════╣");
  lines.push("║  TOP BELIEFS                                    ║");
  for (const t of input.top.slice(0, 3)) {
    const left = padRight(`${t.id}  ${t.short}`, 34);
    lines.push(`║  > ${left} [${t.score}]  ║`);
  }
  if (input.top.length === 0) {
    lines.push("║  > —                                              ║");
  }
  lines.push("╚══════════════════════════════════════════════════╝");
  return lines.join("\n");
}

