import { Suspense } from "react";
import { SurveyGameClient } from "@/components/survey/SurveyGameClient";
import { Skeleton } from "@/components/ui";

export const metadata = {
  title: "Survey Mode — ConspiracyWeb SG",
  description: "Answer Likert-scale questions and see a profile of your responses.",
};

export default function SurveyModePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-container px-page py-8"><Skeleton className="h-10 w-56" /></div>}>
      <SurveyGameClient />
    </Suspense>
  );
}

