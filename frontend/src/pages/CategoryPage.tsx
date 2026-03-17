import { Link, useParams } from "react-router-dom";
import { getCategoryBySlug, getTopicsInCategory, getTheoriesByCategorySlug } from "@/shared/data";

export function CategoryPage() {
  const { slug } = useParams();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  if (!category) {
    return (
      <div className="rounded-lg border border-white/15 bg-black/40 p-6">
        <p className="text-sm font-semibold text-white">NOT FOUND</p>
      </div>
    );
  }

  const topics = getTopicsInCategory(category.slug);
  const theories = getTheoriesByCategorySlug(category.slug);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/15 bg-black/40 p-6">
        <p className="text-sm font-semibold text-white">{category.name.toUpperCase()}</p>
        <p className="mt-2 text-xs text-white/60">{category.description}</p>
        <p className="mt-3 text-xs text-white/60">{topics.length} topics · {theories.length} theories</p>
      </div>

      <div className="rounded-lg border border-white/15 bg-black/40 p-6">
        <p className="text-sm font-semibold text-white">TOPICS</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {topics.map((t) => (
            <Link
              key={t.slug}
              to={`/category/${category.slug}/topic/${t.slug}`}
              className="block rounded border border-white/15 bg-black p-4 hover:bg-white/5"
            >
              <p className="text-sm text-white/90">{t.name}</p>
              <p className="mt-1 text-xs text-white/60">{t.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

