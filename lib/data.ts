import categoriesData from "@/data/categories.json";
import topicsData from "@/data/topics.json";
import theoriesData from "@/data/theories.json";
import gameQuestionsData from "@/data/game_questions.json";
import surveyQuestionsData from "@/data/survey_questions.json";
import type { Category, Topic, Theory, GameQuestion, SurveyQuestion } from "@/lib/types";

const categories = categoriesData as Category[];
const topics = topicsData as Topic[];
const theories = theoriesData as Theory[];
const gameQuestions = gameQuestionsData as GameQuestion[];
const surveyQuestions = surveyQuestionsData as SurveyQuestion[];

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllTopics(): Topic[] {
  return topics;
}

export function getTopicsInCategory(categorySlug: string): Topic[] {
  return topics.filter((t) => t.categorySlug === categorySlug);
}

export function getTopicBySlug(categorySlug: string, topicSlug: string): Topic | undefined {
  return topics.find((t) => t.categorySlug === categorySlug && t.slug === topicSlug);
}

export function getAllTheories(): Theory[] {
  return theories;
}

export function getTheoryById(id: string): Theory | undefined {
  return theories.find((t) => t.id === id);
}

export function getTopTheories(limit = 6): Theory[] {
  return theories.filter((t) => t.isTop).slice(0, limit);
}

export function getTheoriesByCategorySlug(categorySlug: string): Theory[] {
  return theories.filter((t) => t.categorySlug === categorySlug);
}

export function getTheoriesByTopicSlug(categorySlug: string, topicSlug: string): Theory[] {
  return theories.filter((t) => t.categorySlug === categorySlug && t.topicSlug === topicSlug);
}

export function getRelatedTheories(theory: Theory, limit = 4): Theory[] {
  return theories
    .filter(
      (t) =>
        t.id !== theory.id &&
        (t.topicSlug === theory.topicSlug || t.categorySlug === theory.categorySlug)
    )
    .slice(0, limit);
}

export function searchTheories(query: string): Theory[] {
  const q = query.trim().toLowerCase();
  if (!q) return theories;
  return theories.filter((t) => {
    const cat = getCategoryBySlug(t.categorySlug);
    const top = getTopicBySlug(t.categorySlug, t.topicSlug);
    return (
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)) ||
      (cat && cat.name.toLowerCase().includes(q)) ||
      (top && top.name.toLowerCase().includes(q))
    );
  });
}

/** Featured topic for homepage hero (e.g. first topic with featured theories). */
export function getFeaturedTopic(): Topic | undefined {
  return topics.find((t) => t.featuredTheoryIds && t.featuredTheoryIds.length > 0) ?? topics[0];
}

/** Latest/recently updated theories (mocked: last N from list). */
export function getLatestTheories(limit = 6): Theory[] {
  return [...theories].reverse().slice(0, limit);
}

export function getGameQuestions(): GameQuestion[] {
  return gameQuestions;
}

export function getRandomGameQuestions(count: number): GameQuestion[] {
  const shuffled = [...gameQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, gameQuestions.length));
}

export function getSurveyQuestions(): SurveyQuestion[] {
  return surveyQuestions;
}

export function getRandomSurveyQuestions(count: number): SurveyQuestion[] {
  const shuffled = [...surveyQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, surveyQuestions.length));
}
