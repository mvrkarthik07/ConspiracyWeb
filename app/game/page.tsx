import Link from "next/link";
import { Button } from "@/components/ui";
import { Card, CardTitle, CardDescription } from "@/components/ui";

export const metadata = {
  title: "Conspirational Thinking Game — ConspiracyWeb SG",
  description: "Test your critical thinking with scenario-based questions on source evaluation, bias detection, and evidence weighting.",
};

export default function GameLandingPage() {
  return (
    <div className="mx-auto max-w-container px-page py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-text sm:text-4xl">
          Conspirational Thinking Game
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          A short scenario-based quiz that evaluates how you weigh evidence, spot bias, and evaluate sources. 
          Designed for media literacy and reasoning—not to promote any conspiracy beliefs.
        </p>
        <ul className="mt-6 space-y-2 text-text-muted">
          <li>• 10 questions per session (randomised from a larger bank)</li>
          <li>• Immediate feedback after each answer</li>
          <li>• Score breakdown by skill: Source Evaluation, Bias Detection, Evidence Weighting, Hypothesis Testing</li>
          <li>• Tailored improvement tips at the end</li>
        </ul>
        <Link href="/game/play" className="mt-10 inline-block">
          <Button size="lg">Start game</Button>
        </Link>
      </div>
    </div>
  );
}
