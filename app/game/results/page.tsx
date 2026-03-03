"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";

const STORAGE_KEY = "conspiracyweb-game-results";

const SKILL_LABELS: Record<string, string> = {
  "Source Evaluation": "Source Evaluation",
  "Bias Detection": "Bias Detection",
  "Evidence Weighting": "Evidence Weighting",
  "Hypothesis Testing": "Hypothesis Testing",
};

function getAdvice(bySkill: Record<string, { correct: number; total: number }>): string[] {
  const tips: string[] = [];
  const entries = Object.entries(bySkill).filter(([, v]) => v.total > 0);
  const weak = entries
    .map(([skill, v]) => ({ skill, pct: v.total ? Math.round((v.correct / v.total) * 100) : 0 }))
    .filter((x) => x.pct < 70)
    .sort((a, b) => a.pct - b.pct);
  if (weak.length >= 1) {
    tips.push(`Focus on ${weak[0].skill}: try to find primary sources and check incentives before accepting claims.`);
  }
  if (weak.length >= 2) {
    tips.push(`Practice ${weak[1].skill}: seek out opposing or mixed evidence to avoid confirmation bias.`);
  }
  if (weak.some((w) => w.skill === "Evidence Weighting")) {
    tips.push("Weigh evidence by type and volume: peer-reviewed and systematic research usually outweigh single opinions or anecdotes.");
  }
  if (tips.length < 3) {
    tips.push("Keep questioning: even when you score well, revisit the takeaways from each question to reinforce good habits.");
  }
  return tips.slice(0, 3);
}

export default function GameResultsPage() {
  const [data, setData] = useState<{
    score: number;
    total: number;
    correct: number;
    bySkill: Record<string, { correct: number; total: number }>;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({
          score: parsed.score ?? 0,
          total: parsed.total ?? 0,
          correct: parsed.correct ?? 0,
          bySkill: parsed.bySkill ?? {},
        });
      }
    } catch {
      setData(null);
    }
  }, []);

  if (data === null) {
    return (
      <div className="mx-auto max-w-container px-page py-12">
        <p className="text-text-muted">No results found. Play a game first.</p>
        <Link href="/game/play" className="mt-4 inline-block">
          <Button>Start game</Button>
        </Link>
      </div>
    );
  }

  const advice = getAdvice(data.bySkill);

  return (
    <div className="mx-auto max-w-container px-page py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Your results</h1>
      <p className="mt-2 text-text-muted">
        You got {data.correct} out of {data.total} correct.
      </p>

      <div className="mt-8 flex items-center justify-center">
        <div className="rounded-full border-4 border-accent w-32 h-32 flex items-center justify-center">
          <span className="text-3xl font-bold text-text">{data.score}</span>
          <span className="text-lg text-text-muted ml-0.5">/ 100</span>
        </div>
      </div>

      {Object.keys(data.bySkill).length > 0 && (
        <Card padding="lg" className="mt-8">
          <h2 className="text-lg font-semibold text-text mb-4">Breakdown by skill</h2>
          <ul className="space-y-3">
            {Object.entries(data.bySkill).map(([skill, v]) => {
              const pct = v.total ? Math.round((v.correct / v.total) * 100) : 0;
              return (
                <li key={skill} className="flex items-center justify-between gap-4">
                  <span className="text-text">{SKILL_LABELS[skill] ?? skill}</span>
                  <span className="text-text-muted text-sm">
                    {v.correct}/{v.total} ({pct}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {advice.length > 0 && (
        <Card padding="lg" className="mt-6">
          <h2 className="text-lg font-semibold text-text mb-4">Improvement tips</h2>
          <ul className="space-y-2 list-disc list-inside text-text-muted text-sm">
            {advice.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-10 flex gap-4">
        <Link href="/game/play">
          <Button>Play again</Button>
        </Link>
        <Link href="/game">
          <Button variant="secondary">Back to game info</Button>
        </Link>
      </div>
    </div>
  );
}
