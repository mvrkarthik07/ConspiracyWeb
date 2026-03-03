import { Suspense } from "react";
import { HomePageClient } from "@/components/HomePageClient";
import { Skeleton, SkeletonTopicTile, SkeletonTheoryCard } from "@/components/ui";

function HomeFallback() {
  return (
    <div className="container-app py-8">
      <div className="mb-8 text-center">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 max-w-full mx-auto mt-3" />
        <Skeleton className="h-12 max-w-xl mx-auto mt-8" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonTopicTile key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <SkeletonTheoryCard />
        </div>
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonTheoryCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomePageClient />
    </Suspense>
  );
}
