"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { Input } from "@/components/ui";
import { scoreCMS12, interpretCMS12 } from "@/utils/scoring";
import { appendUserSession, createSessionId, loadUserSessions } from "@/utils/persistence";
import type { UserSession } from "@/lib/types";
import { surveyItems, type SurveyItem } from "@/data/surveyItems";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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

const MAIN_NOTE =
  "There are no right or wrong answers. We are interested in your personal beliefs and opinions.";

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
  if (sec === "A") return "Singapore";
  if (sec === "B") return "Asia";
  return "Worldwide";
}

function sectionEmoji(sec: "A" | "B" | "C") {
  if (sec === "A") return "🇸🇬";
  if (sec === "B") return "🌏";
  return "🌍";
}

function takeItems(choice: SectionChoice): SurveyItem[] {
  if (choice === "A" || choice === "B" || choice === "C") return surveyItems.filter((i) => i.section === choice);
  // RANDOM mix across all sections (15 items)
  const shuffled = [...surveyItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(15, shuffled.length));
}

function categoryBadge(category: string) {
  const icon =
    category === "Government/Political"
      ? "🏛"
      : category === "Economic/Financial"
      ? "💰"
      : category === "Media/Information"
      ? "🛰"
      : category === "Health/Pandemic"
      ? "🧬"
      : category === "Science/Technology"
      ? "🧪"
      : category === "Security/Crime"
      ? "🛡"
      : category === "Foreign Relations/Security"
      ? "🌐"
      : "🏷";
  return `${icon} ${category}`;
}

function avg(values: Array<number>) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function clamp1(n: number) {
  return Math.max(1, Math.min(7, n));
}

export function SurveyGameClient() {
  const router = useRouter();
  const params = useSearchParams();
  const focusItemId = params.get("itemId") ?? null;

  const [step, setStep] = useState<Step>("cms12");

  // Step 1: CMS12
  const [cmsIndex, setCmsIndex] = useState(0);
  const [cmsResponses, setCmsResponses] = useState<Record<string, number>>({});

  // Step 2: section select
  const [sectionChoice, setSectionChoice] = useState<SectionChoice | null>(null);

  // Step 3: main survey
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [surveyResponses, setSurveyResponses] = useState<Record<string, number | null>>({});
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (!focusItemId) return;
    const found = surveyItems.find((x) => x.id === focusItemId);
    if (!found) return;
    // Jump into the main survey flow after CMS12 (still required by spec)
    setSectionChoice(found.section);
  }, [focusItemId]);

  const cmsCurrent = CMS12_ITEMS[cmsIndex];
  const cmsProgress = ((cmsIndex + 1) / CMS12_ITEMS.length) * 100;
  const cmsCanNext = typeof cmsResponses[cmsCurrent?.id ?? ""] === "number";

  const cmsScore = useMemo(() => {
    if (Object.keys(cmsResponses).length !== CMS12_ITEMS.length) return null;
    return scoreCMS12(cmsResponses);
  }, [cmsResponses]);

  const cmsInterpretation = cmsScore === null ? null : interpretCMS12(cmsScore);

  const startSection = (choice: SectionChoice) => {
    setSectionChoice(choice);
    const list = takeItems(choice);
    setItems(list);
    setSurveyIndex(0);
    setSurveyResponses({});
    setCurrentValue(null);
    setFilterText("");
    setStep("survey");
  };

  useEffect(() => {
    if (step !== "sectionSelect") return;
    if (sectionChoice) {
      startSection(sectionChoice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const activeItem = items[surveyIndex] ?? null;

  const filteredPreview = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.text.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }, [items, filterText]);

  const goCmsNext = () => {
    if (cmsIndex + 1 >= CMS12_ITEMS.length) {
      setStep("cms12Result");
      return;
    }
    setCmsIndex((i) => i + 1);
  };

  const beginMainSurvey = () => {
    setStep("sectionSelect");
  };

  const setMainAnswer = (v: number) => {
    setCurrentValue(v);
  };

  const skipMain = () => {
    if (!activeItem) return;
    setSurveyResponses((prev) => ({ ...prev, [activeItem.id]: null }));
    setCurrentValue(null);
    if (surveyIndex + 1 >= items.length) {
      setStep("results");
    } else {
      setSurveyIndex((i) => i + 1);
    }
  };

  const submitMain = () => {
    if (!activeItem || currentValue === null) return;
    setSurveyResponses((prev) => ({ ...prev, [activeItem.id]: clamp1(currentValue) }));
    setCurrentValue(null);
    if (surveyIndex + 1 >= items.length) {
      setStep("results");
    } else {
      setSurveyIndex((i) => i + 1);
    }
  };

  const results = useMemo(() => {
    if (step !== "results") return null;
    const answered: Array<{ item: SurveyItem; value: number }> = [];
    for (const it of items) {
      const v = surveyResponses[it.id];
      if (typeof v === "number") answered.push({ item: it, value: v });
    }
    const byCategory: Record<string, number[]> = {};
    for (const a of answered) {
      if (!byCategory[a.item.category]) byCategory[a.item.category] = [];
      byCategory[a.item.category].push(a.value);
    }
    const radar = CATEGORY_ORDER.map((cat) => ({
      category: cat,
      avg: byCategory[cat]?.length ? Math.round(avg(byCategory[cat]) * 10) / 10 : 0,
    }));
    const sectionAverage = answered.length ? Math.round(avg(answered.map((x) => x.value)) * 10) / 10 : 0;
    const topAgreed = [...answered]
      .filter((x) => x.value >= 6)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    return { radar, sectionAverage, topAgreed, answeredCount: answered.length };
  }, [items, step, surveyResponses]);

  const persistSession = () => {
    if (!cmsScore || !results) return;
    const session: UserSession = {
      sessionId: createSessionId(),
      cms12: cmsResponses,
      cms12Score: cmsScore,
      sectionResponses: surveyResponses,
      completedAt: new Date().toISOString(),
    };
    appendUserSession(session);
  };

  useEffect(() => {
    if (step !== "results") return;
    if (cmsScore === null) return;
    persistSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const comparisonData = useMemo(() => {
    if (!results || cmsScore === null) return [];
    return [
      { name: "CMS12", score: Math.round(cmsScore * 10) / 10 },
      { name: "Section avg", score: results.sectionAverage },
    ];
  }, [results, cmsScore]);

  const share = async () => {
    if (!results || cmsScore === null) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // background
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // glow blob
    const g = ctx.createRadialGradient(760, 240, 0, 760, 240, 700);
    g.addColorStop(0, "rgba(88,166,255,0.22)");
    g.addColorStop(0.45, "rgba(167,139,250,0.14)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // card
    const pad = 80;
    const cardX = pad;
    const cardY = 110;
    const cardW = canvas.width - pad * 2;
    const cardH = canvas.height - 200;
    ctx.fillStyle = "rgba(19,23,29,0.9)";
    roundRect(ctx, cardX, cardY, cardW, cardH, 28);
    ctx.fill();
    ctx.strokeStyle = "rgba(230,237,243,0.14)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#e6edf3";
    ctx.font = "700 44px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText("ConspiracyWeb SG — Survey Summary", cardX + 44, cardY + 86);

    ctx.fillStyle = "rgba(230,237,243,0.75)";
    ctx.font = "500 28px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(`CMS12 score: ${Math.round(cmsScore * 10) / 10} / 7`, cardX + 44, cardY + 150);
    ctx.fillText(`Section avg: ${results.sectionAverage} / 7`, cardX + 44, cardY + 195);

    ctx.fillStyle = "rgba(230,237,243,0.9)";
    ctx.font = "700 30px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText("Top agreed items (≥ 6):", cardX + 44, cardY + 270);

    ctx.fillStyle = "rgba(230,237,243,0.75)";
    ctx.font = "500 24px system-ui, -apple-system, Segoe UI, sans-serif";

    const lines = results.topAgreed.length
      ? results.topAgreed.map((t) => `(${t.value}) ${t.item.id}: ${t.item.text}`)
      : ["No items at 6–7 in this run."];
    wrapText(ctx, lines.join("\n"), cardX + 44, cardY + 320, cardW - 88, 34);

    // footer
    ctx.fillStyle = "rgba(230,237,243,0.55)";
    ctx.font = "500 22px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText("Educational prototype · No right/wrong answers", cardX + 44, cardY + cardH - 44);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "conspiracyweb-survey-summary.png";
    a.click();
  };

  return (
    <div className="mx-auto max-w-container px-page py-8 sm:px-6">
      <AnimatePresence mode="wait" initial={false}>
        {step === "cms12" && (
          <motion.div
            key="cms12"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text sm:text-3xl">Onboarding (CMS12)</h1>
              <p className="mt-2 text-text-muted max-w-2xl">
                1 (Do not agree at all) → 7 (Fully agree)
              </p>
            </div>

            <div className="mb-6 flex items-center justify-between gap-4">
              <span className="text-sm text-text-muted">
                Question {cmsIndex + 1} of {CMS12_ITEMS.length}
              </span>
              <div className="flex-1 h-2 max-w-xs rounded-full bg-surface-light overflow-hidden">
                <div className="h-full bg-accent transition-all duration-normal" style={{ width: `${cmsProgress}%` }} />
              </div>
            </div>

            <Card padding="lg" className="border-border-strong">
              <div className="flex items-center justify-between gap-3 mb-4">
                <Badge variant="accent">CMS12</Badge>
                {cmsCurrent?.reverse && <Badge variant="default">Reverse scored</Badge>}
              </div>
              <p className="text-text font-medium mb-5">{cmsCurrent?.text}</p>
              <div className="grid grid-cols-7 gap-2">
                {SCALE_1_7.map((v) => {
                  const selected = cmsResponses[cmsCurrent.id] === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCmsResponses((p) => ({ ...p, [cmsCurrent.id]: v }))}
                      className={[
                        "rounded-ds border px-0 py-3 text-sm transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                        selected ? "border-accent bg-accent-subtle text-text" : "border-border bg-surface-light hover:bg-surface-lighter text-text-muted",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span>Do not agree at all</span>
                <span>Fully agree</span>
              </div>
            </Card>

            <div className="mt-6 flex gap-3">
              <Button onClick={goCmsNext} disabled={!cmsCanNext}>
                {cmsIndex + 1 >= CMS12_ITEMS.length ? "See score" : "Next"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "cms12Result" && cmsScore !== null && (
          <motion.div
            key="cms12Result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <h1 className="text-2xl font-bold text-text sm:text-3xl">Conspiracy Mentality Score</h1>
            <p className="mt-2 text-text-muted">{MAIN_NOTE}</p>

            <Card padding="lg" className="mt-8 border-border-strong">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-caption text-text-muted">CMS12 score (1–7)</p>
                  <p className="text-4xl font-bold text-text mt-2">{Math.round(cmsScore * 10) / 10}</p>
                </div>
                <Badge variant="accent">{cmsInterpretation ?? ""}</Badge>
              </div>
            </Card>

            <div className="mt-8 flex gap-3">
              <Button onClick={beginMainSurvey}>Continue</Button>
              <Button variant="secondary" onClick={() => router.push("/")}>
                Back home
              </Button>
            </div>
          </motion.div>
        )}

        {step === "sectionSelect" && (
          <motion.div
            key="sectionSelect"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <h1 className="text-2xl font-bold text-text sm:text-3xl">Choose a section</h1>
            <p className="mt-2 text-text-muted">{MAIN_NOTE}</p>

            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {(["A", "B", "C"] as const).map((sec) => {
                const count = surveyItems.filter((i) => i.section === sec).length;
                return (
                  <button key={sec} type="button" onClick={() => startSection(sec)} className="text-left">
                    <Card interactive padding="lg" className="h-full border-border-strong">
                      <p className="text-h3 font-semibold text-text">
                        {sectionEmoji(sec)} {sectionLabel(sec)}
                      </p>
                      <p className="text-small text-text-muted mt-2">{count} questions</p>
                      <p className="text-caption text-text-muted mt-4">Select →</p>
                    </Card>
                  </button>
                );
              })}
              <button type="button" onClick={() => startSection("RANDOM")} className="text-left">
                <Card interactive padding="lg" className="h-full border-border-strong">
                  <p className="text-h3 font-semibold text-text">🎲 Random Mix</p>
                  <p className="text-small text-text-muted mt-2">15 questions across all sections</p>
                  <p className="text-caption text-text-muted mt-4">Select →</p>
                </Card>
              </button>
            </div>
          </motion.div>
        )}

        {step === "survey" && activeItem && (
          <motion.div
            key={`survey_${activeItem.id}_${surveyIndex}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <span className="text-sm text-text-muted">
                Question {surveyIndex + 1} of {items.length}
              </span>
              <div className="flex-1 h-2 max-w-xs rounded-full bg-surface-light overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-normal"
                  style={{ width: `${((surveyIndex + 1) / Math.max(1, items.length)) * 100}%` }}
                />
              </div>
            </div>

            <Card padding="lg" className="border-border-strong">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">
                    {sectionEmoji(activeItem.section)} {activeItem.sectionLabel}
                  </Badge>
                  <Badge variant="default">{categoryBadge(activeItem.category)}</Badge>
                </div>
                <Badge variant="default">{activeItem.id}</Badge>
              </div>

              <p className="text-text font-medium text-lg leading-snug mb-5">{activeItem.text}</p>

              <p className="text-small text-text-muted mb-3">1 = Strongly Disagree → 7 = Strongly Agree</p>
              <div className="grid grid-cols-7 gap-2">
                {SCALE_1_7.map((v) => {
                  const selected = currentValue === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMainAnswer(v)}
                      className={[
                        "rounded-ds border px-0 py-3 text-sm transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                        selected ? "border-accent bg-accent-subtle text-text" : "border-border bg-surface-light hover:bg-surface-lighter text-text-muted",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={submitMain} disabled={currentValue === null}>
                  Next
                </Button>
                <Button variant="secondary" onClick={skipMain}>
                  Skip
                </Button>
              </div>
            </Card>

            <div className="mt-6">
              <p className="text-caption text-text-muted mb-2">Search within this section</p>
              <Input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter questions by text/category…"
              />
              {filterText.trim() && (
                <p className="text-xs text-text-muted mt-2">
                  {filteredPreview.length} / {items.length} matching (does not change the question order).
                </p>
              )}
            </div>
          </motion.div>
        )}

        {step === "results" && results && cmsScore !== null && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <h1 className="text-2xl font-bold text-text sm:text-3xl">Results dashboard</h1>
            <p className="mt-2 text-text-muted">Saved locally. Agree-rate will update on the homepage graph.</p>

            <div className="grid gap-6 lg:grid-cols-2 mt-8">
              <Card padding="lg" className="border-border-strong">
                <h2 className="text-lg font-semibold text-text mb-2">Agreement by category</h2>
                <p className="text-small text-text-muted mb-4">Averages are on a 1–7 scale.</p>
                <div className="h-[340px] w-full">
                  <ResponsiveContainer>
                    <RadarChart data={results.radar}>
                      <PolarGrid stroke="rgba(230,237,243,0.12)" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: "rgba(230,237,243,0.8)", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[1, 7]} tick={{ fill: "rgba(230,237,243,0.55)", fontSize: 11 }} />
                      <Radar dataKey="avg" stroke="#58a6ff" fill="rgba(56,139,253,0.25)" fillOpacity={1} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card padding="lg" className="border-border-strong">
                <h2 className="text-lg font-semibold text-text mb-2">CMS12 vs section average</h2>
                <p className="text-small text-text-muted mb-4">Are your baseline and topic answers consistent?</p>
                <div className="h-[340px] w-full">
                  <ResponsiveContainer>
                    <BarChart data={comparisonData} layout="vertical" margin={{ left: 30 }}>
                      <XAxis type="number" domain={[1, 7]} tick={{ fill: "rgba(230,237,243,0.55)", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "rgba(230,237,243,0.8)", fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="rgba(167,139,250,0.8)" radius={[8, 8, 8, 8]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card padding="lg" className="mt-6 border-border-strong">
              <h2 className="text-lg font-semibold text-text mb-2">Highlighted items</h2>
              <p className="text-small text-text-muted mb-4">
                Top agreements (score ≥ 6). Answered: {results.answeredCount} / {items.length}
              </p>
              <div className="grid gap-3">
                {results.topAgreed.length ? (
                  results.topAgreed.map((x) => (
                    <div key={x.item.id} className="rounded-ds border border-border bg-surface-light p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-medium text-text">{x.item.id}</p>
                          <p className="text-sm text-text-muted mt-1">{x.item.text}</p>
                        </div>
                        <Badge variant="accent">{x.value}/7</Badge>
                      </div>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <Badge variant="default">{sectionEmoji(x.item.section)} {x.item.sectionLabel}</Badge>
                        <Badge variant="default">{categoryBadge(x.item.category)}</Badge>
                        <Button variant="secondary" onClick={() => router.push(`/game/survey?itemId=${encodeURIComponent(x.item.id)}`)}>
                          Take this question
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-muted">No items at 6–7 in this run.</p>
                )}
              </div>
            </Card>

            <div className="mt-10 flex gap-4 flex-wrap">
              <Button onClick={share}>Share (download image)</Button>
              <Button variant="secondary" onClick={() => setStep("sectionSelect")}>
                Take another section
              </Button>
              <Button variant="secondary" onClick={() => router.push("/explore")}>
                Explore questions
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const paragraphs = text.split("\n");
  let yy = y;
  for (const p of paragraphs) {
    const words = p.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, x, yy);
        yy += lineHeight;
        line = w;
      } else {
        line = test;
      }
    }
    if (line) {
      ctx.fillText(line, x, yy);
      yy += lineHeight;
    }
    yy += lineHeight * 0.3;
  }
}

