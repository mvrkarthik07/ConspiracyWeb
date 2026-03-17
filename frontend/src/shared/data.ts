import categoriesData from "../../../data/categories.json";
import topicsData from "../../../data/topics.json";
import theoriesData from "../../../data/theories.json";
import gameQuestionsData from "../../../data/game_questions.json";
import type { Category, Topic, Theory, GameQuestion } from "./types";

const categories = categoriesData as Category[];
const topics = topicsData as Topic[];
const theories = theoriesData as Theory[];
const gameQuestions = gameQuestionsData as GameQuestion[];

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

export function getTheoriesByCategorySlug(categorySlug: string): Theory[] {
  return theories.filter((t) => t.categorySlug === categorySlug);
}

export function getTheoriesByTopicSlug(categorySlug: string, topicSlug: string): Theory[] {
  return theories.filter((t) => t.categorySlug === categorySlug && t.topicSlug === topicSlug);
}

export function getRandomGameQuestions(count: number): GameQuestion[] {
  const shuffled = [...gameQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, gameQuestions.length));
}

