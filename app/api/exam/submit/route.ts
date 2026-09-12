import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { getQuestionsByTopic, getQuestionById, evaluateAnswer } from "@/lib/db/question-queries";
import { QuestionItem } from "@/lib/question-data";
import { getTopicBySlug } from "@/lib/db/queries";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await request.json();
    const {
      topicId,
      mode = "EXAM",
      timeTakenSec = 0,
      tabSwitches = 0,
      answers = {},
    } = body;

    if (!topicId || typeof topicId !== "string" || topicId.length > 120) {
      return NextResponse.json(
        { error: "topicId wajib berupa string yang valid" },
        { status: 400 }
      );
    }

    const safeTimeTaken = Math.max(0, Math.min(86400, Number(timeTakenSec) || 0));
    const safeTabSwitches = Math.max(0, Math.min(1000, Number(tabSwitches) || 0));
    const safeAnswers: Record<string, string> =
      typeof answers === "object" && answers !== null && !Array.isArray(answers)
        ? answers
        : {};

    // Resolve topic to ensure foreign key integrity
    const resolvedTopic = await getTopicBySlug(topicId);
    const canonicalTopicId = resolvedTopic ? resolvedTopic.id : topicId;

    // Resolve submitted questions or retrieve canonical topic questions
    const submittedQuestionIds: string[] = Array.isArray(body.questionIds)
      ? body.questionIds.filter(
          (id: unknown): id is string => typeof id === "string" && id.length < 100
        )
      : Object.keys(safeAnswers);

    let questions: QuestionItem[] = [];
    if (submittedQuestionIds.length > 0) {
      const fetched = await Promise.all(
        submittedQuestionIds.map((id) => getQuestionById(id))
      );
      questions = fetched.filter(
        (q): q is QuestionItem =>
          q !== null &&
          (q.topicId === canonicalTopicId ||
            (resolvedTopic !== null && q.topicId === resolvedTopic.id))
      );
    }

    if (questions.length === 0) {
      questions = await getQuestionsByTopic(canonicalTopicId, {
        shuffle: false,
        mode: mode as "PRACTICE" | "EXAM",
      });
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Soal untuk topik ini tidak ditemukan" },
        { status: 404 }
      );
    }

    let correctCount = 0;
    const results = questions.map((q) => {
      const userAns = safeAnswers[q.id] || "";
      const evalResult = evaluateAnswer(q, userAns);

      if (evalResult.isCorrect) {
        correctCount += 1;
      }

      return {
        questionId: q.id,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect: evalResult.isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = questions.length;
    let score = Math.round((correctCount / totalQuestions) * 100);

    // Apply integrity penalty if tab switches exceed threshold (e.g. > 3 switches: -5% per excess switch, min 0)
    let integrityPenalty = false;
    if (safeTabSwitches > 3) {
      integrityPenalty = true;
      const penalty = (safeTabSwitches - 3) * 5;
      score = Math.max(0, score - penalty);
    }

    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // If user is authenticated and DB is ready, persist to Neon
    const isMock = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dummy");
    if (session?.user && !isMock) {
      try {
        await db.insert(schema.quizzes).values({
          id: quizId,
          userId: session.user.id,
          topicId: canonicalTopicId,
          mode: mode as "PRACTICE" | "EXAM",
          score,
          totalQuestions,
          correctCount,
          timeTakenSec: safeTimeTaken,
          tabSwitches: safeTabSwitches,
          completed: true,
        });

        // Insert individual answers
        for (const res of results) {
          await db.insert(schema.quizAnswers).values({
            id: `ans_${quizId}_${res.questionId}`,
            quizId,
            questionId: res.questionId,
            userAnswer: res.userAnswer,
            isCorrect: res.isCorrect,
            hintsViewed: 0,
          });
        }

        // Upsert userProgress
        const [prog] = await db
          .select()
          .from(schema.userProgress)
          .where(
            and(
              eq(schema.userProgress.userId, session.user.id),
              eq(schema.userProgress.topicId, canonicalTopicId)
            )
          )
          .limit(1);

        if (prog) {
          await db
            .update(schema.userProgress)
            .set({
              masteryLevel: Math.max(prog.masteryLevel, score),
              quizzesTaken: prog.quizzesTaken + 1,
              highestScore: Math.max(prog.highestScore, score),
              lastAttemptAt: new Date(),
            })
            .where(eq(schema.userProgress.id, prog.id));
        } else {
          await db.insert(schema.userProgress).values({
            id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            userId: session.user.id,
            topicId: canonicalTopicId,
            masteryLevel: score,
            quizzesTaken: 1,
            highestScore: score,
          });
        }
      } catch (dbErr) {
        console.warn("Could not save exam record to DB:", dbErr);
      }
    }

    return NextResponse.json({
      quizId,
      score,
      totalQuestions,
      correctCount,
      timeTakenSec,
      tabSwitches,
      integrityPenalty,
      results,
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    return NextResponse.json(
      { error: "Gagal memproses pengiriman ujian" },
      { status: 500 }
    );
  }
}
