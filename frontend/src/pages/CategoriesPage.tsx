import { Link } from "react-router-dom";
import { getCategories, getTheoriesByCategorySlug } from "@/shared/data";

export function CategoriesPage() {
  const categories = getCategories();
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/15 bg-black/40 p-6">
        <p className="text-sm font-semibold text-white">CATEGORIES</p>
        <p className="mt-2 text-xs text-white/60">Browse dataset categories.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((c) => {
          const count = getTheoriesByCategorySlug(c.slug).length;
          return (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="block rounded-lg border border-white/15 bg-black/40 p-5 hover:bg-white/5"
            >
              <p className="text-sm font-semibold text-white">{c.name}</p>
              <p className="mt-2 text-xs text-white/60">{count} theories</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

