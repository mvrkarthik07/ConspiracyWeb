import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata = {
  title: "Survey Results — ConspiracyWeb SG",
  description: "Survey results are shown at the end of the survey flow.",
};

export default function SurveyResultsPage() {
  return (
    <div className="mx-auto max-w-container px-page py-12 sm:px-6">
      <p className="text-text-muted">
        Results are shown at the end of Survey Mode. Start a new run to see your dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/game/survey">
          <Button>Start survey</Button>
        </Link>
        <Link href="/game">
          <Button variant="secondary">Back to game</Button>
        </Link>
      </div>
    </div>
  );
}

