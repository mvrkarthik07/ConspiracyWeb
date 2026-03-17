import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { surveyItems, type SurveyItem } from "@/shared/surveyItems";
import { getAgreeRateForItem } from "@/shared/persistence";
import type { ArticleResult } from "@/shared/types";

const FRAMINGS = [
  { id: "belief", label: "Why do people believe in this?" },
  { id: "evidence", label: "What evidence exists for and against?" },
  { id: "spread", label: "How widespread is this belief?" },
] as const;

function sectionLabel(sec: "A" | "B" | "C") {
  if (sec === "A") return "🇸🇬 Singapore";
  if (sec === "B") return "🌏 Asia";
  return "🌍 Worldwide";
}

export function ExplorePage() {
  const [sp, setSp] = useSearchParams();
  const section = (sp.get("section") as "A" | "B" | "C" | null) ?? null;
  const category = sp.get("category");
  const framing = sp.get("framing");

  const [articles, setArticles] = useState<ArticleResult[] | null>(null);

  const categories = useMemo(() => {
    if (!section) return [];
    return Array.from(new Set(surveyItems.filter((i) => i.section === section).map((i) => i.category)));
  }, [section]);

  const items = useMemo(() => {
    if (!section || !category) return [] as SurveyItem[];
    return surveyItems.filter((i) => i.section === section && i.category === category);
  }, [section, category]);

  useEffect(() => {
    if (!section || !category || !framing) return;
    const q = `${sectionLabel(section)} ${category} ${framing}`;
    setArticles(null);
    fetch(`/api/articles?query=${encodeURIComponent(q)}&count=6`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? setArticles(d) : setArticles([])))
      .catch(() => setArticles([]));
  }, [section, category, framing]);

  const card = "rounded-lg border border-white/15 bg-black/40 p-6";
  const button = "rounded border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/5";

  if (!section) {
    return (
      <div className={card}>
        <p className="text-sm font-semibold text-white">EXPLORE</p>
        <p className="mt-2 text-xs text-white/60">Layer 1: choose a section</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(["A", "B", "C"] as const).map((s) => (
            <button key={s} className={button} onClick={() => setSp({ section: s })}>
              {sectionLabel(s)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (section && !category) {
    return (
      <div className={card}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{sectionLabel(section)}</p>
            <p className="mt-2 text-xs text-white/60">Layer 2: choose a category</p>
          </div>
          <button className={button} onClick={() => setSp({})}>RESET</button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <button key={c} className={button} onClick={() => setSp({ section, category: c })}>
              {c.toUpperCase()} ({surveyItems.filter((i) => i.section === section && i.category === c).length})
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (section && category && !framing) {
    return (
      <div className={card}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{sectionLabel(section)} · {category.toUpperCase()}</p>
            <p className="mt-2 text-xs text-white/60">Layer 3: choose a framing prompt</p>
          </div>
          <button className={button} onClick={() => setSp({ section })}>BACK</button>
        </div>
        <div className="mt-6 grid gap-3">
          {FRAMINGS.map((f) => (
            <button key={f.id} className={button} onClick={() => setSp({ section, category, framing: f.id })}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={card}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">{sectionLabel(section)} · {category!.toUpperCase()}</p>
            <p className="mt-2 text-xs text-white/60">Layer 4: items + links</p>
          </div>
          <div className="flex gap-2">
            <button className={button} onClick={() => setSp({ section, category: category ?? "" })}>BACK</button>
            <Link className={button} to={`/game/survey?section=${section}`}>SURVEY</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={card}>
          <p className="text-sm font-semibold text-white">ITEMS</p>
          <div className="mt-4 space-y-3">
            {items.map((it) => {
              const ar = getAgreeRateForItem(it.id);
              return (
                <div key={it.id} className="rounded border border-white/15 bg-black p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-white/90">{it.text}</p>
                    <span className="text-xs text-white/80 border border-white/15 rounded px-2 py-0.5">
                      {ar.pct === null ? "BE THE FIRST" : `AGREE ${ar.pct}%`}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link className={button} to={`/game/survey?itemId=${encodeURIComponent(it.id)}`}>TAKE THIS</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold text-white">LINKS</p>
          <p className="mt-2 text-xs text-white/60">Fetched via `/api/articles`</p>
          <div className="mt-4 space-y-3">
            {articles === null ? (
              <p className="text-xs text-white/60">Loading…</p>
            ) : articles.length === 0 ? (
              <p className="text-xs text-white/60">No results.</p>
            ) : (
              articles.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded border border-white/15 bg-black p-4 hover:bg-white/5"
                >
                  <p className="text-sm text-white/90">{a.title}</p>
                  <p className="mt-1 text-xs text-white/60">{a.source}</p>
                  {a.snippet && <p className="mt-2 text-xs text-white/60">{a.snippet}</p>}
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

