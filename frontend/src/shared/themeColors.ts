import type { ThemeId } from "./surveyItems";

export const THEME_COLORS: Record<ThemeId, {
  border: string;
  fill: string;
  glow: string;
  dim: string;
  text: string;
}> = {
  political:    { border: "rgba(251,146,60,0.95)",  fill: "rgba(251,146,60,0.08)",  glow: "rgba(251,146,60,0.3)",  dim: "rgba(251,146,60,0.45)",  text: "#fb923c" },
  secrets:      { border: "rgba(34,211,238,0.95)",  fill: "rgba(34,211,238,0.08)",  glow: "rgba(34,211,238,0.3)",  dim: "rgba(34,211,238,0.45)",  text: "#22d3ee" },
  science:      { border: "rgba(74,222,128,0.95)",  fill: "rgba(74,222,128,0.08)",  glow: "rgba(74,222,128,0.3)",  dim: "rgba(74,222,128,0.45)",  text: "#4ade80" },
  elites:       { border: "rgba(251,113,133,0.95)", fill: "rgba(251,113,133,0.08)", glow: "rgba(251,113,133,0.3)", dim: "rgba(251,113,133,0.45)", text: "#fb7185" },
  geopolitical: { border: "rgba(167,139,250,0.95)", fill: "rgba(167,139,250,0.08)", glow: "rgba(167,139,250,0.3)", dim: "rgba(167,139,250,0.45)", text: "#a78bfa" },
};
