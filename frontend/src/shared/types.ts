export type Verdict = "true" | "false" | "unverified";

export interface Category {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  accentColor?: string;
}

export interface Topic {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  coverImage: string;
  featuredTheoryIds: string[];
}

export interface Theory {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  topicSlug: string;
  summary: string;
  claim: string;
  verdict: Verdict;
  rationale: string[];
  supportingPoints: string[];
  counterPoints: string[];
  keywords: string[];
  isTop: boolean;
  coverImage: string;
  galleryImages: string[];
  imageAltText: string[];
  timeline?: { dateLabel: string; event: string; sourceHint: string }[];
  contentWarnings?: string[];
}

export interface ArticleResult {
  title: string;
  url: string;
  source: string;
  snippet: string;
}

export type GameSkillTag =
  | "Source Evaluation"
  | "Bias Detection"
  | "Evidence Weighting"
  | "Hypothesis Testing";

export interface GameEvidenceCard {
  title: string;
  sourceType: string;
  snippet: string;
  credibilityHint: string;
}

export interface GameOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface GameQuestion {
  id: string;
  skillTag: GameSkillTag;
  difficulty: 1 | 2 | 3;
  scenario: string;
  evidenceCards: GameEvidenceCard[];
  options: GameOption[];
  takeaway: string;
}

export interface GameSessionState {
  answers: { questionId: string; optionIndex: number; isCorrect: boolean; skillTag: GameSkillTag }[];
  currentIndex: number;
  startedAt: number;
}

export interface UserSession {
  sessionId: string;
  cms12: Record<string, number>;
  cms12Score: number;
  sectionResponses: {
    [itemId: string]: number | null; // 1–7 or null (skipped)
  };
  completedAt: string; // ISO timestamp
}

