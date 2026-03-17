import { Suspense } from "react";
import { DrilldownClient } from "@/components/drilldown/DrilldownClient";
import { Skeleton } from "@/components/ui";

function ExploreFallback() {
  return (
    <div className="container-app py-10">
      <Skeleton className="h-9 w-52" />
      <Skeleton className="h-5 w-96 max-w-full mt-3" />
      <Skeleton className="h-12 w-full max-w-xl mt-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton className="h-28 w-full" key={i} />
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Explore — ConspiracyWeb SG",
  description: "Drill down from topics to evidence with smooth navigation.",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <DrilldownClient />
    </Suspense>
  );
}

