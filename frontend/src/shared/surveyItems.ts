export interface SurveyItem {
  id: string;
  section: "A" | "B" | "C";
  sectionLabel: "Singapore" | "Asia" | "Worldwide";
  category: string;
  text: string;
}

// Duplicated from repo root `data/surveyItems.ts` for SPA build portability.
export { surveyItems } from "../../../data/surveyItems";

