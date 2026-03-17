import { useParams } from "react-router-dom";
import { getCategoryBySlug, getTheoryById, getTopicBySlug } from "@/shared/data";

export function TheoryPage() {
  const { id } = useParams();
  const theory = id ? getTheoryById(id) : undefined;
  if (!theory) {
    return (
      <div className="rounded-lg border border-white/15 bg-black/40 p-6">
        <p className="text-sm font-semibold text-white">NOT FOUND</p>
      </div>
    );
  }
  const cat = getCategoryBySlug(theory.categorySlug);
  const top = getTopicBySlug(theory.categorySlug, theory.topicSlug);

  const badge = "inline-flex items-center rounded border border-white/15 px-2 py-0.5 text-xs text-white/80";
  const card = "rounded-lg border border-white/15 bg-black/40 p-6";

  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="text-sm font-semibold text-white">{theory.title}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={badge}>{cat?.name ?? theory.categorySlug}</span>
          <span className={badge}>{top?.name ?? theory.topicSlug}</span>
          <span className={badge}>{theory.verdict.toUpperCase()}</span>
        </div>
        <p className="mt-4 text-xs text-white/60">{theory.summary}</p>
      </div>

      <div className={card}>
        <p className="text-sm font-semibold text-white">CLAIM</p>
        <p className="mt-2 text-xs text-white/60">{theory.claim}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={card}>
          <p className="text-sm font-semibold text-white">SUPPORTING POINTS</p>
          <ul className="mt-3 space-y-2 text-xs text-white/60 list-disc list-inside">
            {theory.supportingPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div className={card}>
          <p className="text-sm font-semibold text-white">COUNTERPOINTS</p>
          <ul className="mt-3 space-y-2 text-xs text-white/60 list-disc list-inside">
            {theory.counterPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

