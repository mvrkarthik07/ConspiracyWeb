"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getRandomSurveyQuestions } from "@/lib/data";
import type { LikertChoice, SurveyAnswer, SurveyQuestion, SurveySessionResult } from "@/lib/types";
import { Button, Card, Badge } from "@/components/ui";
import { Skeleton } from "@/components/ui";

const QUESTIONS_PER_SESSION = 8;
const STORAGE_KEY_LATEST = "conspiracyweb-survey-latest";
const STORAGE_KEY_HISTORY = "conspiracyweb-survey-history";

const CHOICES: { label: LikertChoice; value: 1 | 2 | 3 | 4 | 5 }[] = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Neutral", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly Agree", value: 5 },
];

export function SurveyPlayClient() {
  const router = useRouter();
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<(1 | 2 | 3 | 4 | 5) | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  useEffect(() => {
    setStartedAt(Date.now());
    setQuestions(getRandomSurveyQuestions(QUESTIONS_PER_SESSION));
    setLoading(false);
  }, []);

  const current = questions[index];
  const progress = questions.length ? ((index + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  const selectedChoice = useMemo(() => {
    if (selected === null) return null;
    return CHOICES.find((c) => c.value === selected) ?? null;
  }, [selected]);

  const submit = useCallback(() => {
    if (!current || selected === null) return;
    const choice = CHOICES.find((c) => c.value === selected);
    if (!choice) return;

    setAnswers((prev) => [
      ...prev,
      {
        questionId: current.id,
        choice: choice.label,
        value: selected,
        categorySlug: current.categorySlug,
        topicSlug: current.topicSlug,
      },
    ]);
    setAnswered(true);
  }, [current, selected]);

  const next = useCallback(() => {
    const last = index + 1 >= questions.length;
    if (last) {
      const finishedAt = Date.now();
      const session: SurveySessionResult = {
        startedAt,
        finishedAt,
        answers,
      };
      try {
        sessionStorage.setItem(STORAGE_KEY_LATEST, JSON.stringify(session));
      } catch {
        // ignore
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
        const history = raw ? (JSON.parse(raw) as SurveySessionResult[]) : [];
        history.push(session);
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(-50)));
      } catch {
        // ignore
      }
      router.push("/game/survey/results");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  }, [answers, index, questions.length, router, startedAt]);

  if (loading || !questions.length) {
    return (
      <div className="mx-auto max-w-container px-page py-8">
        <Skeleton className="h-8 w-56 mb-6" />
        <Skeleton className="h-28 w-full mb-6" />
        <Skeleton className="h-12 w-full mb-3" />
        <Skeleton className="h-12 w-full mb-3" />
        <Skeleton className="h-12 w-full mb-3" />
      </div>
    );
  }

  if (!current) return null;

  const topicTag = `${current.categorySlug}/${current.topicSlug}`;

  return (
    <div className="mx-auto max-w-container px-page py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="text-sm text-text-muted">
          Question {index + 1} of {questions.length}
        </span>
        <div className="flex-1 h-2 max-w-xs rounded-full bg-surface-light overflow-hidden">
          <div className="h-full bg-accent transition-all duration-normal" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card padding="lg" className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-lg font-semibold text-text">How much do you agree?</h1>
          <Badge variant="accent">{topicTag}</Badge>
        </div>
        <p className="text-text font-medium mb-4">{current.prompt}</p>

        <div className="space-y-2">
          {CHOICES.map((c) => {
            const isSelected = selected === c.value;
            return (
              <button
                key={c.value}
                type="button"
                disabled={answered}
                onClick={() => !answered && setSelected(c.value)}
                className={[
                  "w-full text-left rounded-ds border px-4 py-3 text-sm transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                  answered
                    ? isSelected
                      ? "border-accent bg-accent-subtle"
                      : "border-border bg-surface-light opacity-70"
                    : isSelected
                    ? "border-accent bg-accent-subtle"
                    : "border-border bg-surface-light hover:bg-surface-lighter",
                ].join(" ")}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </Card>

      {!answered ? (
        <Button onClick={submit} disabled={selected === null}>
          Submit
        </Button>
      ) : (
        <div className="space-y-4">
          <Card padding="md" className="border-border-strong">
            <p className="font-medium text-text">Your answer: {selectedChoice?.label}</p>
            <p className="text-sm text-text-muted mt-2">{current.insight}</p>
            {typeof current.populationAgreePct === "number" && (
              <p className="text-sm text-text-muted mt-2">
                Data point: <span className="text-text">{current.populationAgreePct}%</span> of respondents agree (example benchmark).
              </p>
            )}
          </Card>
          <Button onClick={next}>{index + 1 >= questions.length ? "See results" : "Next question"}</Button>
        </div>
      )}
    </div>
  );
}

