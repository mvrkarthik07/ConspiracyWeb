import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryBadge, TopicBadge, VerdictBadge } from "@/components/Badges";
import { VerdictBlock } from "@/components/VerdictBlock";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { getTheoryById, getRelatedTheories, getCategoryBySlug, getTopicBySlug } from "@/lib/data";
import { RelatedArticles } from "@/components/RelatedArticles";
import { Method } from "@/components/Method";
import { TheoryCard } from "@/components/TheoryCard";
import { Card } from "@/components/ui";
import { Separator } from "@/components/ui";

type Props = { params: Promise<{ id: string }> };

export default async function TheoryPage({ params }: Props) {
  const { id } = await params;
  const theory = getTheoryById(id);
  if (!theory) notFound();

  const category = getCategoryBySlug(theory.categorySlug);
  const topic = getTopicBySlug(theory.categorySlug, theory.topicSlug);
  const related = getRelatedTheories(theory, 4);

  const categoryName = category?.name ?? theory.categorySlug;
  const topicName = topic?.name ?? theory.topicSlug;

  return (
    <div className="min-h-screen">
      {/* Hero cover — 21:9 */}
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface-lighter">
        <Image
          src={theory.coverImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 container-app">
          <Breadcrumbs
            items={[
              { label: categoryName, href: `/category/${theory.categorySlug}` },
              {
                label: topicName,
                href: `/category/${theory.categorySlug}/topic/${theory.topicSlug}`,
              },
              { label: theory.title },
            ]}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CategoryBadge name={categoryName} slug={theory.categorySlug} />
            <TopicBadge name={topicName} slug={theory.topicSlug} categorySlug={theory.categorySlug} />
            <VerdictBadge verdict={theory.verdict} />
          </div>
          <h1 className="mt-3 typography-h1">{theory.title}</h1>
          <p className="mt-2 text-small text-text-muted">{theory.summary}</p>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Left: Claim, Verdict, Evidence, Gallery */}
          <div className="space-y-8">
            <section aria-labelledby="claim-heading">
              <h2 id="claim-heading" className="typography-h3 mb-2">
                Claim
              </h2>
              <p className="text-text-muted leading-relaxed">{theory.claim}</p>
            </section>

            <Separator />

            <section aria-labelledby="verdict-heading">
              <h2 id="verdict-heading" className="typography-h3 mb-3">
                Verdict
              </h2>
              <VerdictBlock verdict={theory.verdict} rationale={theory.rationale} maxBullets={3} />
            </section>

            <Separator />

            <section aria-labelledby="evidence-heading">
              <h2 id="evidence-heading" className="typography-h3 mb-3">
                Evidence
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card padding="md" as="div">
                  <h3 className="text-sm font-medium text-verdict-true mb-2">Supporting points</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-text-muted">
                    {theory.supportingPoints.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </Card>
                <Card padding="md" as="div">
                  <h3 className="text-sm font-medium text-verdict-false mb-2">Counterpoints</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-text-muted">
                    {theory.counterPoints.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            </section>

            {theory.galleryImages?.length > 0 && (
              <section aria-labelledby="gallery-heading">
                <h2 id="gallery-heading" className="typography-h3 mb-3">
                  Images
                </h2>
                <GalleryLightbox
                  images={theory.galleryImages}
                  altTexts={theory.imageAltText ?? theory.galleryImages.map((_, i) => `Image ${i + 1}`)}
                  title={theory.title}
                />
              </section>
            )}

            <Method />
            <p className="text-caption text-text-muted border border-border rounded-ds-lg p-4 bg-panel">
              Educational prototype summarizing circulating claims and public reporting. Not an endorsement.
            </p>
          </div>

          {/* Right: Articles, Related theories */}
          <aside className="lg:pt-0 pt-8 space-y-8">
            <section aria-labelledby="articles-heading">
              <h2 id="articles-heading" className="typography-h3 mb-4">
                Related articles from the web
              </h2>
              <RelatedArticles keywords={theory.keywords} title={theory.title} />
            </section>

            {related.length > 0 && (
              <section aria-labelledby="related-heading">
                <h2 id="related-heading" className="typography-h3 mb-4">
                  Related theories
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {related.map((t) => (
                    <TheoryCard key={t.id} theory={t} showTopic showImage />
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
