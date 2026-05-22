/**
 * Convert a declarative theory statement into a non-endorsing question form.
 * The original `text` is kept as the underlying statement (used in detail
 * write-ups). When displayed as a TITLE, we wrap it with "Is it true that …?"
 * so the website is clearly framed as inquiry, not endorsement.
 */

// Words we consider safe to lowercase at the start of a sentence — common
// English determiners / quantifiers. Anything else (names, places, acronyms)
// is left as-is so we don't break proper nouns like "Lee Kuan Yew" or "MRT".
const LOWERCASEABLE_LEADERS = new Set([
  "The", "A", "An", "Some", "Many", "Most", "All", "Every", "This", "That",
  "These", "Those", "Our", "His", "Her", "Their", "Its", "There",
]);

/**
 * Maps internal sub-cluster (category) keys to the question form used for
 * display. Keys not present here fall back to the raw category label.
 */
export const SUB_CLUSTER_QUESTIONS: Record<string, string> = {
  "Electoral Manipulation": "Could elections be influenced in unseen ways?",
  "PAP Power Plays":
    "Is there a power play involved in the People's Action Party's political dominance?",
  "Covered Incidents": "Are there covered-up incidents the public is unaware of?",
  "Institutional Bias":
    "Is there institutional bias in how public decisions are made or outcomes are shaped?",
};

export function subClusterLabel(category: string): string {
  return SUB_CLUSTER_QUESTIONS[category] ?? category;
}

export function toQuestion(text: string): string {
  if (!text) return text;
  // Strip trailing punctuation
  let body = text.trim().replace(/[.!?]+$/, "");

  // Lowercase the first word ONLY if it's a generic leader word
  const spaceIdx = body.indexOf(" ");
  const firstWord = spaceIdx === -1 ? body : body.slice(0, spaceIdx);
  if (LOWERCASEABLE_LEADERS.has(firstWord)) {
    body = firstWord.toLowerCase() + body.slice(firstWord.length);
  }

  return `Is it true that ${body}?`;
}
