"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getRandomGameQuestions } from "@/lib/data";
import type { GameQuestion } from "@/lib/types";
import { Button, Card } from "@/components/ui";
import { Skeleton } from "@/components/ui";

const QUESTIONS_PER_SESSION = 10;
const STORAGE_KEY = "conspiracyweb-game-results";

export function GamePlayClient() {
  const router = useRouter();
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; optionIndex: number; isCorrect: boolean; skillTag: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuestions(getRandomGameQuestions(QUESTIONS_PER_SESSION));
    setLoading(false);
  }, []);

  const current = questions[index];
  const progress = questions.length ? ((index + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || !current) return;
    const option = current.options[selectedOption];
    const isCorrect = option.isCorrect;
    setAnswers((a) => [...a, { questionId: current.id, optionIndex: selectedOption, isCorrect, skillTag: current.skillTag }]);
    setAnswered(true);
  }, [current, selectedOption]);

  const handleNext = useCallback(() => {
    if (index + 1 >= questions.length) {
      const allAnswers = answers;
      const correct = allAnswers.filter((a) => a.isCorrect).length;
      const total = allAnswers.length;
      const score = total ? Math.round((correct / total) * 100) : 0;
      const bySkill: Record<string, { correct: number; total: number }> = {};
      allAnswers.forEach((a) => {
        if (!bySkill[a.skillTag]) bySkill[a.skillTag] = { correct: 0, total: 0 };
        bySkill[a.skillTag].total++;
        if (a.isCorrect) bySkill[a.skillTag].correct++;
      });
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ score, total, correct, bySkill, answers: allAnswers })
        );
      } catch {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ score: 0, total: 0, correct: 0, bySkill: {}, answers: [] }));
      }
      router.push("/game/results");
      return;
    }
    setIndex((i) => i + 1);
    setSelectedOption(null);
    setAnswered(false);
  }, [index, questions.length, answers, router]);

  if (loading || !questions.length) {
    return (
      <div className="mx-auto max-w-container px-page py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!current) {
    return null;
  }

  const option = selectedOption !== null ? current.options[selectedOption] : null;

  return (
    <div className="mx-auto max-w-container px-page py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="text-sm text-text-muted">
          Question {index + 1} of {questions.length}
        </span>
        <div className="flex-1 h-2 max-w-xs rounded-full bg-surface-light overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-normal"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card padding="lg" className="mb-6">
        <p className="text-text font-medium mb-4">{current.scenario}</p>
        {current.evidenceCards?.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-text-muted">Evidence snippets:</p>
            {current.evidenceCards.map((card, i) => (
              <div key={i} className="rounded-ds border border-border bg-panel p-3 text-sm">
                <span className="font-medium text-text">{card.title}</span>
                <span className="text-text-muted text-xs block mt-0.5">{card.sourceType} · {card.credibilityHint}</span>
                <p className="text-text-muted mt-1">{card.snippet}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm font-medium text-text mb-2">Choose the best response:</p>
        <div className="space-y-2">
          {current.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => !answered && setSelectedOption(i)}
              className={`w-full text-left rounded-ds border px-4 py-3 text-sm transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                answered
                  ? opt.isCorrect
                    ? "border-verdict-true bg-verdict-true-muted"
                    : selectedOption === i
                    ? "border-verdict-false bg-verdict-false-muted"
                    : "border-border bg-surface-light opacity-70"
                  : selectedOption === i
                  ? "border-accent bg-accent-subtle"
                  : "border-border bg-surface-light hover:bg-surface-lighter"
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </Card>

      {!answered ? (
        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null}
        >
          Submit
        </Button>
      ) : (
        <div className="space-y-4">
          <Card padding="md" className={option?.isCorrect ? "border-verdict-true/40 bg-verdict-true-muted/30" : "border-verdict-false/40 bg-verdict-false-muted/30"}>
            <p className="font-medium text-text">{option?.isCorrect ? "Correct." : "Incorrect."}</p>
            <p className="text-sm text-text-muted mt-1">{option?.explanation}</p>
            <ul className="mt-2 list-disc list-inside text-sm text-text-muted">
              {current.options.filter((o) => o.isCorrect).map((o, i) => (
                <li key={i}>{o.explanation}</li>
              ))}
            </ul>
            <p className="text-sm font-medium text-text mt-3">Takeaway: {current.takeaway}</p>
          </Card>
          <Button onClick={handleNext}>
            {index + 1 >= questions.length ? "See results" : "Next question"}
          </Button>
        </div>
      )}
    </div>
  );
}
