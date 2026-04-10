// Re-export all types from the generated backend declarations
// This ensures the frontend always uses the same types as the backend actor
export type {
  UserId,
  Timestamp,
  SessionId,
  QuestionId,
  Question,
  SessionSummary,
  UserProfilePublic,
  InterviewSessionPublic,
  AnswerRecord,
  NlpAnalysisResult,
  SubmitAnswerResult,
} from "./backend.d";

export {
  Category,
  Difficulty,
} from "./backend.d";

import type {
  Category as CategoryType,
  Difficulty as DifficultyType,
} from "./backend.d";

// UI helper maps — keyed by enum values
export const CATEGORY_LABELS: Record<CategoryType, string> = {
  MachineLearning: "Machine Learning",
  AIConcepts: "AI Concepts",
  Database: "Database",
  PythonBasics: "Python Basics",
  DataStructures: "Data Structures",
};

export const CATEGORY_BADGE_CLASS: Record<CategoryType, string> = {
  PythonBasics: "badge-python",
  MachineLearning: "badge-ml",
  DataStructures: "badge-ds",
  AIConcepts: "badge-ai",
  Database: "badge-db",
};

export const DIFFICULTY_LABELS: Record<DifficultyType, string> = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
};
