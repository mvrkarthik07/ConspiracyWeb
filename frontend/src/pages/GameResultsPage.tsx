import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "conspiracyweb-game-results";

export function GameResultsPage() {
  const [data, setData] = useState<{
    score: number;
    total: number;
    correct: number;
    bySkill: Record<string, { correct: number; total: number }>;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
      else setData(null);
    } catch {
      setData(null);
    }
  }, []);

  const card = "rounded-lg border border-white/15 bg-black/40 p-6";
  const button = "inline-flex rounded border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/5";

  if (!data) {
    return (
      <div className={card}>
        <p className="text-sm font-semibold text-white">NO RESULTS</p>
        <div className="mt-4">
          <Link className={button} to="/game/play">START CLASSIC</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="text-sm font-semibold text-white">YOUR RESULTS</p>
        <p className="mt-2 text-xs text-white/60">
          {data.correct} / {data.total} correct · Score {data.score}/100
        </p>
      </div>

      <div className={card}>
        <p className="text-sm font-semibold text-white">BREAKDOWN</p>
        <div className="mt-4 space-y-2">
          {Object.entries(data.bySkill ?? {}).map(([skill, v]) => {
            const pct = v.total ? Math.round((v.correct / v.total) * 100) : 0;
            return (
              <div key={skill} className="flex items-center justify-between gap-4 text-xs text-white/70">
                <span>{skill}</span>
                <span>{v.correct}/{v.total} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link className={button} to="/game/play">PLAY AGAIN</Link>
        <Link className={button} to="/game">BACK</Link>
      </div>
    </div>
  );
}

