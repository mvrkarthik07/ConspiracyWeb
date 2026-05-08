import type { ArticleResult } from "@/shared/types";

/**
 * Fetch related-reading articles for a topic.
 *
 * Strategy:
 *   1. Try the local `/api/articles` endpoint (Next.js / Netlify function),
 *      which has the cascading Google CSE → SerpAPI → Wikipedia logic.
 *   2. If that fails (e.g. running only Vite without Next.js), fall back to
 *      a direct browser-side Wikipedia search so the section is never empty.
 */
export async function fetchArticles(query: string, count = 6): Promise<ArticleResult[]> {
  // Step 1: server endpoint
  try {
    const res = await fetch(`/api/articles?query=${encodeURIComponent(query)}&count=${count}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    /* fall through to Wikipedia */
  }

  // Step 2: client-side Wikipedia fallback (CORS-enabled with origin=*)
  return fetchWikipediaDirect(query, count);
}

async function fetchWikipediaDirect(query: string, count: number): Promise<ArticleResult[]> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=${count}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const hits: Array<{ title: string; snippet: string }> = data?.query?.search ?? [];
    return hits.slice(0, count).map((h) => ({
      title: h.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(h.title.replace(/ /g, "_"))}`,
      source: "Wikipedia",
      snippet: stripHtml(h.snippet ?? ""),
    }));
  } catch {
    return [];
  }
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}
