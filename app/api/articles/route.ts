import { NextRequest, NextResponse } from "next/server";
import type { ArticleResult } from "@/lib/types";

const MOCK_SOURCES = [
  "Wikipedia",
  "Straits Times",
  "Channel News Asia",
  "Today Online",
  "Reuters",
  "BBC News",
  "The Guardian",
  "Reuters",
];

function mockResults(query: string, count: number): ArticleResult[] {
  const q = query.slice(0, 50).toLowerCase();
  const results: ArticleResult[] = [];
  for (let i = 0; i < count; i++) {
    const source = MOCK_SOURCES[i % MOCK_SOURCES.length];
    const domain = source.toLowerCase().replace(/\s+/g, "");
    results.push({
      title: `Article about ${q.split(" ").slice(0, 3).join(" ")} – ${source}`,
      url: `https://example.com/${domain}/article-${i + 1}?q=${encodeURIComponent(q)}`,
      source,
      snippet: `This is a mock snippet for the query "${q}". In production, results would come from a search API (Wikipedia, Google Programmable Search, or SerpAPI).`,
    });
  }
  return results;
}

async function fetchSerpAPI(query: string): Promise<ArticleResult[] | null> {
  const key = process.env.SERPAPI_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${key}&engine=google&num=8`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const organic = data.organic_results ?? [];
    return organic.slice(0, 8).map((r: { title?: string; link?: string; displayed_link?: string; snippet?: string }) => ({
      title: r.title ?? "",
      url: r.link ?? "#",
      source: r.displayed_link ?? new URL(r.link ?? "https://example.com").hostname,
      snippet: r.snippet ?? "",
    }));
  } catch {
    return null;
  }
}

async function fetchGoogleSearch(query: string): Promise<ArticleResult[] | null> {
  const cx = process.env.GOOGLE_CSE_ID;
  const key = process.env.GOOGLE_API_KEY;
  if (!cx || !key) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(query)}&num=8`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const items = data.items ?? [];
    return items.slice(0, 8).map((r: { title?: string; link?: string; displayLink?: string; snippet?: string }) => ({
      title: r.title ?? "",
      url: r.link ?? "#",
      source: r.displayLink ?? new URL(r.link ?? "https://example.com").hostname,
      snippet: r.snippet ?? "",
    }));
  } catch {
    return null;
  }
}

async function fetchWikipedia(query: string): Promise<ArticleResult[] | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=8`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const search = data.query?.search ?? [];
    return search.map((r: { title: string; snippet: string }) => ({
      title: r.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/\s+/g, "_"))}`,
      source: "Wikipedia",
      snippet: r.snippet?.replace(/<[^>]+>/g, "") ?? "",
    }));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
  const count = Math.min(8, Math.max(5, parseInt(request.nextUrl.searchParams.get("count") ?? "6", 10) || 6));

  if (!query) {
    return NextResponse.json([]);
  }

  // Option A: Google CSE (if keys provided)
  let results: ArticleResult[] | null = await fetchGoogleSearch(query);
  if (results && results.length > 0) {
    return NextResponse.json(results.slice(0, count));
  }

  // Option B: SerpAPI (if key provided)
  results = await fetchSerpAPI(query);
  if (results && results.length > 0) {
    return NextResponse.json(results.slice(0, count));
  }

  // Option C: Wikipedia (no key required) – try first for free tier
  results = await fetchWikipedia(query);
  if (results && results.length > 0) {
    return NextResponse.json(results.slice(0, count));
  }

  // Fallback: mock results for demo without any keys
  return NextResponse.json(mockResults(query, count));
}
