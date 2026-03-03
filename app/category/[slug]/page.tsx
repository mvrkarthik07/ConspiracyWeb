import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TopicTile } from "@/components/TopicTile";
import { TheoryCard } from "@/components/TheoryCard";
import { Card, CardTitle, CardDescription } from "@/components/ui";
import {
  getCategoryBySlug,
  getTopicsInCategory,
  getTheoriesByCategorySlug,
  getTopTheories,
} from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const topics = getTopicsInCategory(slug);
  const theories = getTheoriesByCategorySlug(slug);
  const featuredTheories = getTopTheories(3).filter((t) => t.categorySlug === slug);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden">
        <Image
          src={category.heroImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <Breadcrumbs items={[{ label: category.name }]} />
          <h1 className="mt-2 typography-h1">{category.name}</h1>
          <p className="mt-1 text-small text-text-muted max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Topics grid */}
        <section className="mb-10">
          <h2 className="typography-caption mb-4">Topics</h2>
          {topics.length === 0 ? (
            <p className="text-text-muted">No topics in this category.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {topics.map((topic) => (
                <TopicTile key={topic.slug} topic={topic} categorySlug={slug} />
              ))}
            </div>
          )}
        </section>

        {/* Featured theories */}
        {featuredTheories.length > 0 && (
          <section>
            <h2 className="typography-caption mb-4">Featured theories</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTheories.map((t) => (
                <TheoryCard key={t.id} theory={t} showImage />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
