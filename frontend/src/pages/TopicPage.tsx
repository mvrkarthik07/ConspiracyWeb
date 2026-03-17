import { Link, useParams } from "react-router-dom";
import { getCategoryBySlug, getTopicBySlug, getTheoriesByTopicSlug } from "@/shared/data";

export function TopicPage() {
  const { slug, topicSlug } = useParams();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const topic = slug && topicSlug ? getTopicBySlug(slug, topicSlug) : undefined;
  if (!category || !topic) {
    return (
      <div className="rounded-lg border border-white/15 bg-black/40 p-6">
        <p className="text-sm font-semibold text-white">NOT FOUND</p>
      </div>
    );
  }

  const theories = getTheoriesByTopicSlug(category.slug, topic.slug);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/15 bg-black/40 p-6">
        <p className="text-sm font-semibold text-white">{category.name.toUpperCase()} / {topic.name.toUpperCase()}</p>
        <p className="mt-2 text-xs text-white/60">{topic.description}</p>
        <p className="mt-3 text-xs text-white/60">{theories.length} theories</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {theories.map((t) => (
          <Link
            key={t.id}
            to={`/theory/${t.id}`}
            className="block rounded-lg border border-white/15 bg-black/40 p-5 hover:bg-white/5"
          >
            <p className="text-sm font-semibold text-white">{t.title}</p>
            <p className="mt-2 text-xs text-white/60">{t.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

