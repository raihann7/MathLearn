import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  doublePrecision,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const difficultyEnum = pgEnum("difficulty", [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
]);
export const questionTypeEnum = pgEnum("question_type", [
  "MCQ",
  "NUMERICAL",
  "EXPRESSION",
]);
export const quizModeEnum = pgEnum("quiz_mode", ["PRACTICE", "EXAM"]);

// BetterAuth Core Tables
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum("role").default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  expiresAt: timestamp("expires_at"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Topics Table
export const topics = pgTable(
  "topics",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    category: text("category").notNull(), // Aljabar, Kalkulus, Trigonometri, dll
    difficulty: difficultyEnum("difficulty").default("BEGINNER").notNull(),
    description: text("description").notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("topic_category_idx").on(table.category),
    index("topic_difficulty_idx").on(table.difficulty),
  ]
);

// Materials Table
export const materials = pgTable(
  "materials",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content").notNull(), // Markdown + LaTeX
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("material_topic_order_idx").on(table.topicId, table.order),
    uniqueIndex("material_topic_slug_idx").on(table.topicId, table.slug),
  ]
);

// Questions Table
export const questions = pgTable(
  "questions",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    type: questionTypeEnum("type").default("MCQ").notNull(),
    difficulty: difficultyEnum("difficulty").default("BEGINNER").notNull(),
    content: text("content").notNull(), // Soal Markdown + LaTeX
    options: jsonb("options"), // MCQ: [{ id: "A", text: "..." }]
    correctAnswer: text("correct_answer").notNull(),
    tolerance: doublePrecision("tolerance").default(0.01),
    hintConcept: text("hint_concept").notNull(), // Hint 1
    hintFormula: text("hint_formula").notNull(), // Hint 2 (Formula LaTeX)
    explanation: text("explanation").notNull(), // Pembahasan lengkap
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("question_topic_idx").on(table.topicId),
    index("question_difficulty_idx").on(table.difficulty),
  ]
);

// Quizzes Table
export const quizzes = pgTable(
  "quizzes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    mode: quizModeEnum("mode").default("PRACTICE").notNull(),
    score: doublePrecision("score").default(0).notNull(),
    totalQuestions: integer("total_questions").notNull(),
    correctCount: integer("correct_count").default(0).notNull(),
    timeTakenSec: integer("time_taken_sec").default(0).notNull(),
    tabSwitches: integer("tab_switches").default(0).notNull(),
    completed: boolean("completed").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("quiz_user_idx").on(table.userId),
    index("quiz_topic_idx").on(table.topicId),
  ]
);

// Quiz Answers Table
export const quizAnswers = pgTable(
  "quiz_answers",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    userAnswer: text("user_answer").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    hintsViewed: integer("hints_viewed").default(0).notNull(),
    scratchpad: text("scratchpad"),
  },
  (table) => [
    index("quiz_answer_quiz_idx").on(table.quizId),
  ]
);

// User Progress Table
export const userProgress = pgTable(
  "user_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    masteryLevel: integer("mastery_level").default(0).notNull(), // 0 - 100%
    quizzesTaken: integer("quizzes_taken").default(0).notNull(),
    highestScore: doublePrecision("highest_score").default(0).notNull(),
    lastAttemptAt: timestamp("last_attempt_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_topic_progress_idx").on(table.userId, table.topicId),
  ]
);

// Bookmarks Table
export const bookmarks = pgTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    materialId: text("material_id")
      .notNull()
      .references(() => materials.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("bookmark_user_material_idx").on(table.userId, table.materialId),
  ]
);

// Material Completions Table (Dicoding-style per-module completion tracking)
export const materialCompletions = pgTable(
  "material_completions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    materialId: text("material_id")
      .notNull()
      .references(() => materials.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("material_completion_user_mat_idx").on(table.userId, table.materialId),
    index("material_completion_user_topic_idx").on(table.userId, table.topicId),
  ]
);

// AI Usage Logs Table
export const aiUsageLogs = pgTable(
  "ai_usage_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: text("question_id"),
    promptTokens: integer("prompt_tokens").default(0).notNull(),
    completionTokens: integer("completion_tokens").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("ai_usage_user_time_idx").on(table.userId, table.createdAt),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quizzes: many(quizzes),
  progress: many(userProgress),
  bookmarks: many(bookmarks),
  materialCompletions: many(materialCompletions),
  aiUsage: many(aiUsageLogs),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  materials: many(materials),
  questions: many(questions),
  quizzes: many(quizzes),
  progress: many(userProgress),
  materialCompletions: many(materialCompletions),
}));

export const materialsRelations = relations(materials, ({ one, many }) => ({
  topic: one(topics, { fields: [materials.topicId], references: [topics.id] }),
  bookmarks: many(bookmarks),
  completions: many(materialCompletions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  topic: one(topics, { fields: [questions.topicId], references: [topics.id] }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  user: one(users, { fields: [quizzes.userId], references: [users.id] }),
  topic: one(topics, { fields: [quizzes.topicId], references: [topics.id] }),
  answers: many(quizAnswers),
}));

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
  quiz: one(quizzes, { fields: [quizAnswers.quizId], references: [quizzes.id] }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  topic: one(topics, { fields: [userProgress.topicId], references: [topics.id] }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, { fields: [bookmarks.userId], references: [users.id] }),
  material: one(materials, { fields: [bookmarks.materialId], references: [materials.id] }),
}));

export const materialCompletionsRelations = relations(materialCompletions, ({ one }) => ({
  user: one(users, { fields: [materialCompletions.userId], references: [users.id] }),
  topic: one(topics, { fields: [materialCompletions.topicId], references: [topics.id] }),
  material: one(materials, { fields: [materialCompletions.materialId], references: [materials.id] }),
}));
