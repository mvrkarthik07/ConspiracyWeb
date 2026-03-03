# Design notes — ConspiracyWeb SG

Summary of the design system used for a professional, client-ready editorial/product hybrid.

---

## 1. Typography scale

| Token       | Size (rem) | Line height | Usage                    |
|------------|------------|-------------|--------------------------|
| **Display**| 2.5        | 1.15        | Hero / marketing headline|
| **H1**     | 1.875      | 1.25        | Page title               |
| **H2**     | 1.5        | 1.3         | Section title            |
| **H3**     | 1.125      | 1.4         | Card title, subsection   |
| **Body**   | 1          | 1.6         | Default text             |
| **Small**  | 0.875      | 1.5         | Secondary text, captions |
| **Caption**| 0.75       | 1.5         | Labels, small caps, meta |

- **Utility classes:** `.typography-display`, `.typography-h1`, `.typography-h2`, `.typography-h3`, `.typography-body`, `.typography-small`, `.typography-caption`
- **Tailwind:** `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`, `text-caption`
- **Semantic headings:** Use a single H1 per page; section headings use H2/H3 in order.

---

## 2. Spacing system

- **Base unit:** 8px (0.5rem). Use Tailwind’s scale: `2` = 8px, `4` = 16px, `6` = 24px, `8` = 32px, etc.
- **Container:** `container-app` = `max-w-container` (72rem) with horizontal padding:
  - `px-4` (16px) default
  - `sm:px-6` (24px)
  - `lg:px-8` (32px)
- **Page rhythm:** `section-spacing` = `py-8 sm:py-10` for vertical section spacing. Consistent `mb-8` for page headers, `gap-4` / `gap-6` for grids.

---

## 3. Image aspect ratios

| Context        | Ratio | Usage                          |
|----------------|-------|---------------------------------|
| Topic tiles    | **4:3**  | Browse-topics grid              |
| Theory cards   | **16:9** | Card image block               |
| Hero banners   | **21:9** | Homepage featured topic, theory/category hero |

- **Overlay:** Gradient `from-black/80 via-black/20 to-transparent` (or similar) + optional `backdrop-blur-[1px]` for text legibility.
- **Badge placement:** Bottom of image, consistent padding (`bottom-2 left-2 right-2`).
- **Hover:** Image scale `1.02`, overlay darkens slightly, card shadow increases (`shadow-ds` → `shadow-ds-lg`).
- **Fallback:** “Image unavailable” state with same aspect ratio and overlay; no broken image icon.

---

## 4. Badge color mapping

| Badge type        | Color   | Use case                          |
|-------------------|--------|------------------------------------|
| **Verdict TRUE**  | Green  | Claim supported by evidence        |
| **Verdict FALSE** | Red    | Claim contradicted / unsupported   |
| **Verdict UNVERIFIED** | Amber | Insufficient or mixed evidence |
| **Category / topic** | Neutral (surface-lighter, text-muted) | Taxonomy labels |

- Verdict badges: `verdict-true`, `verdict-false`, `verdict-unverified` (muted backgrounds + border).
- Category/topic: neutral secondary style; same size (`text-xs`, `px-2 py-0.5`).

---

## 5. Card variants

- **Default:** Standard padding, rounded corners, border, shadow. General content.
- **Compact:** Tighter padding for stacked lists.
- **Media:** No padding on wrapper; image + content. Used for theory cards (image on top, content below).
- **Featured:** Same as default with stronger hover shadow for spotlight blocks.

---

## 6. Key UX decisions

- **Navigation:** Primary links = Topics (anchor to `#browse-topics` on home), Categories, Game. Desktop: full search; mobile: compact menu with search. Logo = “ConspiracyWeb SG” to home.
- **Breadcrumbs:** Shown on all non-home pages (category, topic, theory) for context and back-navigation.
- **Page headers:** Clear title + optional subtitle; right-aligned metadata (e.g. “12 theories”); filters row where relevant (topic page verdict/top-only).
- **Credibility:** “Method” collapsible on theory pages (“How verdicts are assigned”) with four criteria (source credibility, corroboration, primary evidence, recency/context). Disclaimer in footer and on theory pages: “Educational prototype summarizing circulating claims and public reporting. Not an endorsement.”
- **States:** Skeleton loaders for topic tiles, theory cards, and article list (no raw “Loading…”). Empty state: “No theories match your filters” + “Reset filters”. Article fetch error: message + “Try again” + short fallback suggestion.
- **Accessibility:** Keyboard focus states (`focus-visible:outline-accent`), semantic headings, sufficient contrast, reduced-motion respected.

---

## 7. Files reference

- **Theme / globals:** `tailwind.config.ts`, `app/globals.css`
- **Layout / nav:** `components/AppShell.tsx`, `components/Breadcrumbs.tsx`, `components/PageHeader.tsx`
- **UI primitives:** `components/ui/Card.tsx`, `components/ui/Badge.tsx`, `components/ui/Skeleton.tsx`
- **Image system:** `components/ImageWithFallback.tsx`, `components/TopicTile.tsx`, `components/TheoryCard.tsx`
- **Credibility:** `components/Method.tsx`; disclaimer in AppShell footer and theory page.
