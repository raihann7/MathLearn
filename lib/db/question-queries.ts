import { QUESTION_DATABASE, QuestionItem } from "@/lib/question-data";
import { SEED_TOPICS } from "@/lib/db/seed-data";
import { TOPIC_SLUG_ALIASES } from "@/lib/db/queries";

export interface GetQuestionsOptions {
  shuffle?: boolean;
  limit?: number;
  mode?: "PRACTICE" | "EXAM" | "ALL";
}

/**
 * Mengacak urutan elemen array menggunakan algoritma Fisher-Yates (Knuth shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Mengambil daftar soal latihan untuk topik tertentu (berdasarkan id, slug, atau alias topik).
 * Mendukung pengacakan urutan (shuffle) dan pembatasan jumlah soal (limit).
 */
export async function getQuestionsByTopic(
  topicIdOrSlug: string,
  options: GetQuestionsOptions = {}
): Promise<QuestionItem[]> {
  const resolvedSlug = TOPIC_SLUG_ALIASES[topicIdOrSlug] || topicIdOrSlug;

  // Resolve slug or alias to canonical topic
  const matchedTopic = SEED_TOPICS.find(
    (t) =>
      t.id === resolvedSlug ||
      t.slug === resolvedSlug ||
      t.id === topicIdOrSlug ||
      t.slug === topicIdOrSlug
  );
  const targetId = matchedTopic ? matchedTopic.id : resolvedSlug;

  const matched = QUESTION_DATABASE.filter(
    (q) =>
      q.topicId === targetId || (matchedTopic && q.topicId === matchedTopic.id)
  );

  let pool = [...matched];

  // Filter berdasarkan mode (PRACTICE vs EXAM) agar soal latihan dan ujian berbeda
  if (options.mode && options.mode !== "ALL") {
    pool = pool.filter((q) => {
      const itemMode = q.mode || "PRACTICE";
      return itemMode === "ALL" || itemMode === options.mode;
    });
  }

  if (options.shuffle) {
    pool = shuffleArray(pool);
  }

  if (options.limit && options.limit > 0 && options.limit < pool.length) {
    pool = pool.slice(0, options.limit);
  }

  return pool;
}

/**
 * Mengambil satu soal spesifik berdasarkan ID
 */
export async function getQuestionById(
  questionId: string
): Promise<QuestionItem | null> {
  const found = QUESTION_DATABASE.find((q) => q.id === questionId);
  return found || null;
}

/**
 * Memvalidasi jawaban user untuk MCQ atau Numerical
 */
export function evaluateAnswer(
  question: QuestionItem,
  userAnswer: string
): { isCorrect: boolean; feedback: string } {
  const cleanUser = userAnswer.trim();
  const cleanCorrect = question.correctAnswer.trim();

  if (question.type === "MCQ") {
    const isCorrect = cleanUser.toUpperCase() === cleanCorrect.toUpperCase();
    return {
      isCorrect,
      feedback: isCorrect
        ? "Jawaban Anda Benar! Pemahaman konsep Anda sangat tepat."
        : `Jawaban Anda belum tepat. Jawaban yang benar adalah pilihan (${cleanCorrect}).`,
    };
  }

  // Numerical evaluation with tolerance
  const numUser = parseFloat(cleanUser.replace(",", "."));
  const numCorrect = parseFloat(cleanCorrect.replace(",", "."));

  if (isNaN(numUser)) {
    return {
      isCorrect: false,
      feedback: "Format angka tidak valid. Masukkan angka bulat atau desimal.",
    };
  }

  const tol = question.tolerance ?? 0.01;
  const isCorrect = Math.abs(numUser - numCorrect) <= tol;

  return {
    isCorrect,
    feedback: isCorrect
      ? "Luar biasa! Perhitungan numerik Anda tepat."
      : `Jawaban Anda (${cleanUser}) belum tepat. Nilai eksak yang benar adalah ${cleanCorrect}.`,
  };
}
