# ConspiracyWebSG

A searchable database of conspiracy theories in Singapore. Educational prototype only.

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Build for production:** `npm run build && npm start`

## Optional: env vars for “Related articles from the web”

The `/api/articles` route returns **5–8** links based on the theory’s keywords. Without any keys it falls back to **mock results** so the app is demoable.

To use real search, set **one** of the following:

| Option | Env vars | Notes |
|--------|----------|--------|
| **A** | `GOOGLE_API_KEY`, `GOOGLE_CSE_ID` | Google Programmable Search Engine |
| **B** | `SERPAPI_KEY` | [SerpAPI](https://serpapi.com/) |
| **C** | (none) | Wikipedia API is tried automatically (no key). If that fails, mock results are returned. |

Create a `.env.local` in the project root, e.g.:

```env
# Option A – Google Custom Search
GOOGLE_API_KEY=your_api_key
GOOGLE_CSE_ID=your_cse_id

# Option B – SerpAPI (alternative)
# SERPAPI_KEY=your_serpapi_key
```

## Limitations & production notes

- **Data:** Seed data lives in `data/categories.json`, `data/topics.json`, `data/theories.json`, and `data/game_questions.json`. Placeholder images are generated with `npm run generate:images`. In production you’d use a DB and real media.
- **Auth:** None. In production you’d add auth and restrict who can add/edit content.
- **Articles API:** Without API keys, “Related articles” uses mock or Wikipedia. In production you’d use a stable search provider, rate limiting, and caching.
- **Content:** Wording is framed as “claims” and “verification status”; see footer disclaimer. Not legal or official determinations.
- **Images:** Placeholder SVGs are used; replace with real assets as needed.

## Routes

- `/` — Home: hero + search, featured topic banner, browse topics wall, top theories (featured + grid), game CTA, recently added row
- `/categories` — All categories with counts
- `/category/[slug]` — Category hero + topics grid + featured theories
- `/category/[slug]/topic/[topicSlug]` — Topic banner, verdict/top-only filters, theory cards (image-led)
- `/theory/[id]` — Theory: cover hero, 2-col (claim/verdict/evidence/gallery | articles + related), “How we judge” collapsible
- `/game` — Game landing
- `/game/play` — Quiz (10 questions, feedback per question)
- `/game/results` — Score, skill breakdown, improvement tips
- `/api/articles?query=...` — Returns 5–8 article links (title, url, source, snippet)

## Tech

- Next.js 14 (App Router), TypeScript, TailwindCSS
- Dark-mode-friendly UI, responsive (mobile-first), with loading/empty states

---

## Design decisions

- **Image-first:** Every category, topic, and theory has a cover/hero image (placeholder SVGs in `/public/images/`). Homepage uses a featured topic banner, topic wall grid, and image cards for theories to feel like a curated media site.
- **8px spacing & tokens:** Tailwind theme uses `background`, `panel`, `surface`, `border`, `text`, `accent`, `verdict` colors; `rounded-xl`/`2xl`; `shadow-soft`; consistent container width and section spacing.
- **Component system:** `/components/ui` holds Button, Card, Badge, Input, Chip, Tabs, Skeleton, Modal, Separator. Domain components (TopicTile, TheoryCard, VerdictBadge, GalleryLightbox, ArticleCard, HowWeJudge) reuse them and stay consistent.
- **Asymmetric layouts:** Homepage uses a featured + grid (e.g. 2+2 columns for top theories), topic wall, and horizontal scroll for recently added to avoid a generic template look.
- **Overlays:** All image-led blocks use gradient overlays (and optional blur) so text remains readable and never clashes with imagery.
- **Safety:** All copy uses claims, allegations, verification status; footer disclaimer states educational prototype and that content summarizes circulating claims and public reporting.

## Game scoring rationale

The Conspirational Thinking Game evaluates reasoning and media literacy, not conspiracy beliefs. Skills: Source Evaluation, Bias Detection, Evidence Weighting, Hypothesis Testing. Score is (correct / 10) × 100 with per-skill breakdown and up to 3 improvement tips. Feedback after each answer shows the correct option and a takeaway. The game does not promote specific conspiracy claims.
