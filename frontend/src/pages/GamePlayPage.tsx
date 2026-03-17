import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomGameQuestions } from "@/shared/data";
import type { GameQuestion } from "@/shared/types";

const QUESTIONS_PER_SESSION = 10;
const STORAGE_KEY = "conspiracyweb-game-results";

export function GamePlayPage() {
  const nav = useNavigate();
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; optionIndex: number; isCorrect: boolean; skillTag: string }[]>([]);

  useEffect(() => {
    setQuestions(getRandomGameQuestions(QUESTIONS_PER_SESSION));
  }, []);

  const current = questions[index];
  const progress = questions.length ? ((index + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  const option = useMemo(() => {
    if (selectedOption === null || !current) return null;
    return current.options[selectedOption];
  }, [current, selectedOption]);

  const card = "rounded-lg border border-white/15 bg-black/40 p-6";
  const button = "rounded border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-40";

  if (!current) {
    return (
      <div className={card}>
        <p className="text-xs text-white/60">Loading…</p>
      </div>
    );
  }

  const submit = () => {
    if (selectedOption === null) return;
    const isCorrect = current.options[selectedOption].isCorrect;
    setAnswers((a) => [...a, { questionId: current.id, optionIndex: selectedOption, isCorrect, skillTag: current.skillTag }]);
    setAnswered(true);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      const all = answers;
      const correct = all.filter((a) => a.isCorrect).length;
      const total = all.length;
      const score = total ? Math.round((correct / total) * 100) : 0;
      const bySkill: Record<string, { correct: number; total: number }> = {};
      all.forEach((a) => {
        if (!bySkill[a.skillTag]) bySkill[a.skillTag] = { correct: 0, total: 0 };
        bySkill[a.skillTag].total++;
        if (a.isCorrect) bySkill[a.skillTag].correct++;
      });
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ score, total, correct, bySkill, answers: all }));
      nav("/game/results");
      return;
    }
    setIndex((i) => i + 1);
    setSelectedOption(null);
    setAnswered(false);
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <div className="flex items-center justify-between gap-4 text-xs text-white/60">
          <span>Question {index + 1} of {questions.length}</span>
          <div className="h-1.5 w-40 rounded bg-white/10 overflow-hidden">
            <div className="h-full bg-white/40" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="mt-4 text-white/90">{current.scenario}</p>
        {current.evidenceCards?.length > 0 && (
          <div className="mt-4 space-y-2">
            {current.evidenceCards.map((c, i) => (
              <div key={i} className="rounded border border-white/15 bg-black p-3">
                <p className="text-xs text-white/80">{c.title}</p>
                <p className="mt-1 text-xs text-white/60">{c.sourceType} · {c.credibilityHint}</p>
                <p className="mt-2 text-xs text-white/60">{c.snippet}</p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-white/60">Choose the best response:</p>
        <div className="mt-2 space-y-2">
          {current.options.map((opt, i) => {
            const selected = selectedOption === i;
            const state =
              !answered
                ? selected
                  ? "border-white/50 bg-white/10"
                  : "border-white/15 bg-black hover:bg-white/5"
                : opt.isCorrect
                ? "border-white/60 bg-white/10"
                : selected
                ? "border-white/30 bg-white/5 opacity-80"
                : "border-white/10 bg-black/40 opacity-70";
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => !answered && setSelectedOption(i)}
                className={`w-full text-left rounded border p-3 text-xs text-white/80 ${state}`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      {!answered ? (
        <button className={button} disabled={selectedOption === null} onClick={submit}>SUBMIT</button>
      ) : (
        <div className="space-y-3">
          <div className={card}>
            <p className="text-sm font-semibold text-white">{option?.isCorrect ? "CORRECT" : "INCORRECT"}</p>
            <p className="mt-2 text-xs text-white/60">{option?.explanation}</p>
            <p className="mt-3 text-xs text-white/60">Takeaway: {current.takeaway}</p>
          </div>
          <button className={button} onClick={next}>{index + 1 >= questions.length ? "SEE RESULTS" : "NEXT"}</button>
        </div>
      )}
    </div>
  );
}

