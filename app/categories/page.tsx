import Link from "next/link";
import { getCategories, getTheoriesByCategorySlug } from "@/lib/data";
import { Card, CardTitle, CardDescription } from "@/components/ui";

export const metadata = {
  title: "Categories — ConspiracyWebSG",
  description: "Browse conspiracy theories by category.",
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="container-app py-8">
      <header className="mb-8">
        <h1 className="typography-h1">Categories</h1>
        <p className="mt-1 typography-small">
          Browse by category to explore topics and theories.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = getTheoriesByCategorySlug(cat.slug).length;
          return (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <Card interactive padding="lg" className="h-full">
                <CardTitle as="h2">{cat.name}</CardTitle>
                <CardDescription>
                  {count} theor{count !== 1 ? "ies" : "y"} · View topics
                </CardDescription>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
