import Link from "next/link";
import { Card, SkeletonCard } from "@/components/ui";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { VerdictBadge, CategoryBadge } from "./Badges";
import { getCategoryBySlug, getTopicBySlug } from "@/lib/data";
import type { Theory } from "@/lib/types";

function useCategoryTopic(theory: Theory) {
  const category = getCategoryBySlug(theory.categorySlug);
  const topic = getTopicBySlug(theory.categorySlug, theory.topicSlug);
  return { categoryName: category?.name ?? theory.categorySlug, topicName: topic?.name ?? theory.topicSlug };
}

export function TheoryCard({
  theory,
  showTopic = false,
  featured = false,
  showImage = true,
}: {
  theory: Theory;
  showTopic?: boolean;
  featured?: boolean;
  showImage?: boolean;
}) {
  const href = `/theory/${theory.id}`;
  const { categoryName, topicName } = useCategoryTopic(theory);

  const imageBlock = showImage ? (
    <ImageWithFallback
      src={theory.coverImage}
      alt={theory.title}
      ratio="16/9"
      sizes={featured ? "800px" : "400px"}
      overlayContent={<VerdictBadge verdict={theory.verdict} />}
      hover
    />
  ) : null;

  if (featured) {
    return (
      <Link href={href} className="block group">
        <Card as="article" padding="none" variant="media" interactive className="h-full overflow-hidden transition-shadow duration-normal hover:shadow-ds-lg">
          {imageBlock}
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CategoryBadge name={categoryName} slug={theory.categorySlug} asLink={false} />
              {showTopic && <span className="text-caption text-text-muted">→ {topicName}</span>}
            </div>
            <h2 className="text-h2 font-semibold text-text mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-fast">
              {theory.title}
            </h2>
            <p className="text-small text-text-muted line-clamp-3">{theory.summary}</p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={href} className="block group">
      <Card as="article" padding="none" variant="media" interactive className="h-full overflow-hidden transition-shadow duration-normal hover:shadow-ds-lg">
        {imageBlock}
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <CategoryBadge name={categoryName} slug={theory.categorySlug} asLink={false} />
            {showTopic && <span className="text-caption text-text-muted">→ {topicName}</span>}
          </div>
          <h3 className="text-h3 font-semibold text-text mb-1 line-clamp-2 group-hover:text-accent transition-colors duration-fast">
            {theory.title}
          </h3>
          <p className="text-small text-text-muted line-clamp-2">{theory.summary}</p>
        </div>
      </Card>
    </Link>
  );
}

export function TheoryCardSkeleton() {
  return <SkeletonCard />;
}
