export function scoreCMS12(responses: Record<string, number>): number {
  const reversed = { ...responses };
  reversed["CMS12_5_R"] = 8 - responses["CMS12_5_R"];
  reversed["CMS12_8_R"] = 8 - responses["CMS12_8_R"];
  const values = Object.values(reversed);
  return values.reduce((a, b) => a + b, 0) / values.length; // Returns 1–7
}

export function interpretCMS12(score: number): string {
  if (score <= 2.5) return "Low tendency toward conspiratorial thinking";
  if (score <= 4.5) return "Moderate — open to questioning authority";
  return "High — strong conspiratorial worldview";
}

