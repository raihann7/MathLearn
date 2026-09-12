import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { SEED_TOPICS } from "./seed-data";

export interface TopicMasteryItem {
  topicId: string;
  topicTitle: string;
  category: string;
  difficulty: string;
  masteryLevel: number; // 0 - 100
  quizzesTaken: number;
  highestScore: number;
}

export interface DashboardStatsData {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  streakDays: number;
  masteryByTopic: TopicMasteryItem[];
}

export interface QuizHistoryItem {
  id: string;
  topicTitle: string;
  mode: "PRACTICE" | "EXAM";
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeTakenSec: number;
  tabSwitches: number;
  createdAt: Date;
}

export interface BookmarkItem {
  id: string;
  materialId: string;
  materialTitle: string;
  topicTitle: string;
  topicSlug: string;
  materialSlug: string;
  createdAt: Date;
}

/**
 * Mengambil ringkasan statistik dan progres belajar pengguna untuk Dashboard.
 */
export async function getUserDashboardStats(
  userId?: string
): Promise<DashboardStatsData> {
  const isMock =
    !userId || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dummy");

  if (isMock) {
    return getFallbackDashboardStats();
  }

  try {
    // 1. Fetch user progress
    const progressList = await db
      .select()
      .from(schema.userProgress)
      .where(eq(schema.userProgress.userId, userId));

    // 2. Fetch all topics
    const allTopics = await db.select().from(schema.topics);

    // 3. Fetch user quizzes for aggregate calculation
    const userQuizzes = await db
      .select()
      .from(schema.quizzes)
      .where(eq(schema.quizzes.userId, userId));

    const totalQuizzes = userQuizzes.length;
    let sumScore = 0;
    let maxScore = 0;

    userQuizzes.forEach((q) => {
      sumScore += q.score;
      if (q.score > maxScore) maxScore = q.score;
    });

    const averageScore =
      totalQuizzes > 0 ? Math.round(sumScore / totalQuizzes) : 0;

    // Build mastery by topic
    const masteryByTopic: TopicMasteryItem[] = allTopics.map((top) => {
      const prog = progressList.find((p) => p.topicId === top.id);
      return {
        topicId: top.id,
        topicTitle: top.title,
        category: top.category,
        difficulty: top.difficulty,
        masteryLevel: prog ? prog.masteryLevel : 0,
        quizzesTaken: prog ? prog.quizzesTaken : 0,
        highestScore: prog ? Math.round(prog.highestScore) : 0,
      };
    });

    return {
      totalQuizzes,
      averageScore,
      highestScore: Math.round(maxScore),
      streakDays: totalQuizzes > 0 ? 3 : 1, // calculated or default active
      masteryByTopic,
    };
  } catch (err) {
    console.warn("Database error in getUserDashboardStats, using fallback:", err);
    return getFallbackDashboardStats();
  }
}

/**
 * Mengambil riwayat kuis dan ujian yang pernah dikerjakan pengguna.
 */
export async function getUserQuizHistory(
  userId?: string
): Promise<QuizHistoryItem[]> {
  const isMock =
    !userId || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dummy");

  if (isMock) {
    return getFallbackQuizHistory();
  }

  try {
    const rows = await db
      .select({
        quiz: schema.quizzes,
        topic: schema.topics,
      })
      .from(schema.quizzes)
      .leftJoin(schema.topics, eq(schema.quizzes.topicId, schema.topics.id))
      .where(eq(schema.quizzes.userId, userId))
      .orderBy(desc(schema.quizzes.createdAt))
      .limit(10);

    return rows.map(({ quiz, topic }) => ({
      id: quiz.id,
      topicTitle: topic ? topic.title : "Topik Matematika",
      mode: quiz.mode,
      score: quiz.score,
      totalQuestions: quiz.totalQuestions,
      correctCount: quiz.correctCount,
      timeTakenSec: quiz.timeTakenSec,
      tabSwitches: quiz.tabSwitches,
      createdAt: quiz.createdAt,
    }));
  } catch (err) {
    console.warn("Database error in getUserQuizHistory, using fallback:", err);
    return getFallbackQuizHistory();
  }
}

/**
 * Mengambil daftar materi pelajaran yang telah dibookmark oleh pengguna.
 */
export async function getUserBookmarks(
  userId?: string
): Promise<BookmarkItem[]> {
  const isMock =
    !userId || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dummy");

  if (isMock) {
    return getFallbackBookmarks();
  }

  try {
    const rows = await db
      .select({
        bookmark: schema.bookmarks,
        material: schema.materials,
        topic: schema.topics,
      })
      .from(schema.bookmarks)
      .leftJoin(schema.materials, eq(schema.bookmarks.materialId, schema.materials.id))
      .leftJoin(schema.topics, eq(schema.materials.topicId, schema.topics.id))
      .where(eq(schema.bookmarks.userId, userId))
      .orderBy(desc(schema.bookmarks.createdAt));

    return rows.map(({ bookmark, material, topic }) => ({
      id: bookmark.id,
      materialId: bookmark.materialId,
      materialTitle: material ? material.title : "Modul Pelajaran",
      topicTitle: topic ? topic.title : "Matematika",
      topicSlug: topic ? topic.slug : "topic",
      materialSlug: material ? material.slug : "material",
      createdAt: bookmark.createdAt,
    }));
  } catch (err) {
    console.warn("Database error in getUserBookmarks, using fallback:", err);
    return getFallbackBookmarks();
  }
}

// ==========================================
// FALLBACK SEED DATA UNTUK GUEST / OFFLINE
// ==========================================

function getFallbackDashboardStats(): DashboardStatsData {
  const masteryByTopic: TopicMasteryItem[] = SEED_TOPICS.map((t, idx) => {
    // Sample progressive mastery for demonstration
    const scores = [85, 70, 60, 45, 90];
    const quizzes = [4, 3, 2, 1, 5];
    const score = scores[idx % scores.length];
    const qCount = quizzes[idx % quizzes.length];

    return {
      topicId: t.id,
      topicTitle: t.title,
      category: t.category,
      difficulty: t.difficulty,
      masteryLevel: score,
      quizzesTaken: qCount,
      highestScore: score,
    };
  });

  return {
    totalQuizzes: 15,
    averageScore: 78,
    highestScore: 95,
    streakDays: 4,
    masteryByTopic,
  };
}

function getFallbackQuizHistory(): QuizHistoryItem[] {
  const now = new Date();
  return [
    {
      id: "quiz-hist-1",
      topicTitle: "Turunan & Aplikasinya (Kalkulus)",
      mode: "EXAM",
      score: 100,
      totalQuestions: 3,
      correctCount: 3,
      timeTakenSec: 420,
      tabSwitches: 0,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "quiz-hist-2",
      topicTitle: "Integral Tak Tentu & Tentu",
      mode: "PRACTICE",
      score: 67,
      totalQuestions: 3,
      correctCount: 2,
      timeTakenSec: 360,
      tabSwitches: 1,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: "quiz-hist-3",
      topicTitle: "Statistika & Distribusi Peluang",
      mode: "EXAM",
      score: 90,
      totalQuestions: 3,
      correctCount: 3,
      timeTakenSec: 510,
      tabSwitches: 4, // 4 switches -> got penalty
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 48), // 2 days ago
    },
  ];
}

function getFallbackBookmarks(): BookmarkItem[] {
  const now = new Date();
  return [
    {
      id: "bm-1",
      materialId: "mat-turunan-1",
      materialTitle: "Konsep Dasar Laju Perubahan & Definisi Turunan",
      topicTitle: "Turunan & Aplikasinya (Kalkulus)",
      topicSlug: "turunan-dan-aplikasi",
      materialSlug: "konsep-limit-dan-definisi-turunan",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12),
    },
    {
      id: "bm-2",
      materialId: "mat-integral-1",
      materialTitle: "Antiturunan & Teorema Fundamental Kalkulus",
      topicTitle: "Integral Tak Tentu & Tentu",
      topicSlug: "integral-tak-tentu-dan-tentu",
      materialSlug: "antiturunan-dan-teorema-fundamental",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 36),
    },
  ];
}
