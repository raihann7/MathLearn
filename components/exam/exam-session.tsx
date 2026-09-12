"use client";

import { useState, useCallback, useEffect } from "react";
import { QuestionItem } from "@/lib/question-data";
import { TopicWithMaterials } from "@/lib/db/queries";
import { MathRenderer } from "@/components/math/math-renderer";
import { ExamTimer } from "@/components/exam/exam-timer";
import { AntiCheatGuard } from "@/components/exam/anti-cheat-guard";
import { ScratchpadCanvas } from "@/components/practice/scratchpad-canvas";
import {
  getActiveExamSession,
  saveActiveExamSession,
  updateActiveExamSession,
  clearActiveExamSession,
  ActiveExamSession,
} from "@/lib/exam-storage";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  PenTool,
  Flag,
  Trophy,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Lock,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface ExamSessionProps {
  topic: TopicWithMaterials;
  questions: QuestionItem[];
}

interface ExamSubmissionResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeTakenSec: number;
  tabSwitches: number;
  integrityPenalty: boolean;
  results: Array<{
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export function ExamSession({ topic, questions }: ExamSessionProps) {
  // Duration: 3 minutes per question (e.g. 5 questions = 900s / 15 minutes)
  const initialDuration = Math.max(300, questions.length * 180);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(initialDuration);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [conflictingExam, setConflictingExam] = useState<ActiveExamSession | null>(null);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<ExamSubmissionResult | null>(null);

  const currentQ = questions[currentIndex];

  const handleSubmitExam = useCallback(
    async (forcedByTimeout = false) => {
      if (isSubmitting || isCompleted) return;
      setIsSubmitting(true);
      setShowConfirmModal(false);

      const timeTakenSec = Math.max(0, initialDuration - secondsRemaining);

      try {
        const res = await fetch("/api/exam/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topicId: topic.id,
            mode: "EXAM",
            timeTakenSec,
            tabSwitches,
            answers,
            questionIds: questions.map((q) => q.id),
          }),
        });

        if (!res.ok) {
          throw new Error("Gagal mengumpulkan lembar jawaban ujian");
        }

        const data = await res.json();
        setSubmissionResult(data);
        setIsCompleted(true);
      } catch (err) {
        console.error("Submit exam error:", err);
        // Fallback offline evaluation
        let correctCount = 0;
        const results = questions.map((q) => {
          const userAns = (answers[q.id] || "").trim();
          const isCorrect =
            userAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();
          if (isCorrect) correctCount++;
          return {
            questionId: q.id,
            userAnswer: userAns,
            correctAnswer: q.correctAnswer,
            isCorrect,
            explanation: q.explanation,
          };
        });

        let score = Math.round((correctCount / questions.length) * 100);
        let integrityPenalty = false;
        if (tabSwitches > 3) {
          integrityPenalty = true;
          score = Math.max(0, score - (tabSwitches - 3) * 5);
        }

        setSubmissionResult({
          quizId: `local_${Date.now()}`,
          score,
          totalQuestions: questions.length,
          correctCount,
          timeTakenSec,
          tabSwitches,
          integrityPenalty,
          results,
        });
        setIsCompleted(true);
      } finally {
        setIsSubmitting(false);
        clearActiveExamSession();
      }
    },
    [
      isSubmitting,
      isCompleted,
      initialDuration,
      secondsRemaining,
      topic.id,
      tabSwitches,
      answers,
      questions,
    ]
  );

  // Periksa sesi aktif atau konflik saat komponen di-mount
  useEffect(() => {
    const active = getActiveExamSession();
    if (!active) return;

    if (active.topicId === topic.id) {
      setAnswers(active.answers || {});
      setFlagged(active.flagged || {});
      setTabSwitches(active.tabSwitches || 0);
      setCurrentIndex(active.currentIndex || 0);
      setExpiresAt(active.expiresAt);
      setHasStarted(true);

      const remaining = Math.max(
        0,
        Math.floor((active.expiresAt - Date.now()) / 1000)
      );
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        handleSubmitExam(true);
      }
    } else {
      setConflictingExam(active);
    }
  }, [topic.id, handleSubmitExam]);

  // Lockdown navigasi (beforeunload & popstate) selama ujian resmi berlangsung
  useEffect(() => {
    if (!hasStarted || isCompleted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowExitConfirmModal(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasStarted, isCompleted]);

  const handleStartExam = () => {
    const active = getActiveExamSession();
    if (active && active.topicId !== topic.id) {
      setConflictingExam(active);
      return;
    }

    const now = Date.now();
    const expiry = now + initialDuration * 1000;
    const newSession: ActiveExamSession = {
      topicId: topic.id,
      topicTitle: topic.title,
      topicSlug: topic.slug,
      startedAt: now,
      expiresAt: expiry,
      durationSec: initialDuration,
      questionIds: questions.map((q) => q.id),
      answers: {},
      flagged: {},
      tabSwitches: 0,
      currentIndex: 0,
      status: "IN_PROGRESS",
    };

    saveActiveExamSession(newSession);
    setExpiresAt(expiry);
    setSecondsRemaining(initialDuration);
    setHasStarted(true);
  };

  const handleViolation = useCallback(() => {
    setTabSwitches((prev) => {
      const next = prev + 1;
      updateActiveExamSession({ tabSwitches: next });
      return next;
    });
  }, []);

  const handleSelectAnswer = (ans: string) => {
    if (isCompleted || !currentQ) return;
    setAnswers((prev) => {
      const next = {
        ...prev,
        [currentQ.id]: ans,
      };
      updateActiveExamSession({ answers: next });
      return next;
    });
  };

  const handleToggleFlag = () => {
    if (!currentQ) return;
    setFlagged((prev) => {
      const next = {
        ...prev,
        [currentQ.id]: !prev[currentQ.id],
      };
      updateActiveExamSession({ flagged: next });
      return next;
    });
  };

  const handleNavigateIndex = (idx: number) => {
    setCurrentIndex(idx);
    updateActiveExamSession({ currentIndex: idx });
  };

  // 1. Briefing Screen before exam starts
  if (!hasStarted) {
    if (conflictingExam) {
      return (
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-slate-900 border border-amber-600/70 rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl shadow-amber-950/20">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 font-semibold border border-amber-700">
                RESTRIKSI INTEGRITAS: SATU UJIAN AKTIF
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Lock className="w-6 h-6 text-amber-400 shrink-0" />
                <span>Sesi Ujian Lain Sedang Berlangsung</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Anda memiliki sesi ujian resmi yang sedang berjalan untuk topik:{" "}
                <strong className="text-amber-300">{conflictingExam.topicTitle}</strong>.
                Sistem integritas pengawasan MathLearn membatasi akses hanya ke satu sesi ujian aktif dalam satu waktu.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Status Ujian Berjalan:</span>
              </div>
              <p className="text-slate-400">
                Topik Terkunci: <span className="text-white">{conflictingExam.topicTitle}</span>
              </p>
              <p className="text-slate-400">
                Jawaban Terisi:{" "}
                <span className="text-white">
                  {Object.keys(conflictingExam.answers || {}).length} / {conflictingExam.questionIds?.length || 0} Soal
                </span>
              </p>
              <p className="text-slate-400">
                Waktu ujian terus berkurang secara realtime di latar belakang sampai lembar jawaban dikumpulkan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/exam/${conflictingExam.topicSlug || conflictingExam.topicId}`}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition text-center"
              >
                <span>Lanjutkan Ujian: {conflictingExam.topicTitle}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition text-center"
              >
                Ke Dashboard
              </Link>
              <Link
                href={`/topics/${topic.slug}`}
                className="py-2.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-semibold text-xs sm:text-sm border border-slate-800 transition text-center"
              >
                Kembali ke Silabus
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 font-semibold border border-amber-800/60">
              ANTI_CHEAT_PROCTOR_STATION
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sesi Ujian Evaluasi: {topic.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ujian komprehensif ini dirancang untuk memvalidasi pemahaman konsep analitis secara independen dan terukur di bawah protokol integritas akademik.
            </p>
          </div>

          {/* Exam Rules & Integrity specs */}
          <div className="space-y-3 p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300">
            <h3 className="font-bold text-white flex items-center gap-2 font-mono text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PROTOKOL & ATURAN PENGAWASAN</span>
            </h3>
            <ul className="space-y-2 list-disc list-inside text-slate-400 text-xs leading-relaxed">
              <li>
                <strong className="text-slate-200">Format Evaluasi:</strong>{" "}
                {questions.length} Butir Soal (Pilihan Ganda & Isian Numerik Presisi).
              </li>
              <li>
                <strong className="text-slate-200">Batas Waktu:</strong>{" "}
                {Math.round(initialDuration / 60)} Menit hitung mundur otomatis realtime.
              </li>
              <li>
                <strong className="text-slate-200">Detektor Layar:</strong>{" "}
                Perpindahan tab atau kehilangan fokus jendela dicatat otomatis. Toleransi maksimal 3 kali.
              </li>
              <li>
                <strong className="text-slate-200">Scratchpad Digital:</strong>{" "}
                Kanvas kalkulasi coretan tangan tetap dapat diakses di dalam lembar ujian.
              </li>
              <li>
                <strong className="text-slate-200">Lockdown Mode:</strong>{" "}
                Navigasi keluar dinonaktifkan. Sesi tetap berjalan di latar belakang jika browser tertutup.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleStartExam}
              className="flex-1 py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm border border-indigo-500 transition text-center"
            >
              Mulai Sesi Ujian Sekarang
            </button>
            <Link
              href={`/topics/${topic.slug}`}
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition text-center"
            >
              Kembali ke Silabus
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Exam Result Review Screen
  if (isCompleted && submissionResult) {
    const isPassed = submissionResult.score >= 70;
    const minutesTaken = Math.floor(submissionResult.timeTakenSec / 60);
    const secondsTaken = submissionResult.timeTakenSec % 60;

    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        {/* Score Hero Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 text-center space-y-6">
          <div
            className={`w-14 h-14 rounded-xl mx-auto flex items-center justify-center border ${
              isPassed
                ? "bg-slate-950 border-emerald-500/40 text-emerald-400"
                : "bg-slate-950 border-amber-500/40 text-amber-400"
            }`}
          >
            <Trophy className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hasil Lembar Ujian: {topic.title}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-mono">
              Evaluasi Objektif Skor Akhir & Verifikasi Integritas
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">
                Skor Nilai
              </span>
              <span
                className={`text-2xl sm:text-3xl font-black mt-1 block font-mono ${
                  isPassed ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {submissionResult.score}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">
                Akurasi
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block font-mono">
                {submissionResult.correctCount}/{submissionResult.totalQuestions}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">
                Waktu
              </span>
              <span className="text-xl sm:text-2xl font-black text-white mt-1 block font-mono">
                {minutesTaken}m {secondsTaken}s
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">
                Integritas
              </span>
              <span
                className={`text-xs sm:text-sm font-bold block mt-2 font-mono ${
                  submissionResult.tabSwitches === 0
                    ? "text-emerald-400"
                    : submissionResult.integrityPenalty
                    ? "text-rose-400"
                    : "text-amber-400"
                }`}
              >
                {submissionResult.tabSwitches === 0
                  ? "0x (Terverifikasi)"
                  : `${submissionResult.tabSwitches}x Switch`}
              </span>
            </div>
          </div>

          {submissionResult.integrityPenalty && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs sm:text-sm max-w-xl mx-auto flex items-center gap-3 text-left">
              <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <strong>Penalti Integritas Diterapkan:</strong> Terdeteksi perpindahan tab sebanyak {submissionResult.tabSwitches} kali (melebihi batas toleransi 3x). Pengurangan poin otomatis telah diaplikasikan.
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                clearActiveExamSession();
                setHasStarted(false);
                setIsCompleted(false);
                setSubmissionResult(null);
                setAnswers({});
                setFlagged({});
                setTabSwitches(0);
                setCurrentIndex(0);
                setExpiresAt(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm border border-indigo-500 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Ujian</span>
            </button>
            <Link
              href={`/practice/${topic.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Latihan Bebas (Hint Aktif)</span>
            </Link>
            <Link
              href={`/topics/${topic.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-slate-800 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Kembali ke Silabus</span>
            </Link>
          </div>
        </div>

        {/* Detailed Question Reviews with KaTeX Explanations */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            <span>Tinjauan Pembahasan & Kunci Jawaban</span>
          </h2>

          <div className="space-y-4">
            {submissionResult.results.map((item, idx) => {
              const qObj = questions.find((q) => q.id === item.questionId);
              if (!qObj) return null;

              return (
                <div
                  key={item.questionId}
                  className={`p-6 rounded-2xl border transition bg-slate-900 ${
                    item.isCorrect
                      ? "border-emerald-800/60"
                      : "border-rose-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Soal #{idx + 1} ({qObj.type === "MCQ" ? "Pilihan Ganda" : "Isian Numerik"})
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                        item.isCorrect
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-rose-950 text-rose-300 border border-rose-800"
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Jawaban Benar</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Jawaban Salah</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div className="text-sm sm:text-base text-slate-100 font-medium mb-4">
                    <MathRenderer content={qObj.content} />
                  </div>

                  {/* Comparison Row */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono space-y-1 mb-4">
                    <p className="text-slate-400">
                      Jawaban Anda:{" "}
                      <span
                        className={`font-semibold ${
                          item.isCorrect ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {item.userAnswer || "(Kosong)"}
                      </span>
                    </p>
                    {!item.isCorrect && (
                      <p className="text-slate-400">
                        Kunci Jawaban Benar:{" "}
                        <span className="font-semibold text-emerald-400">
                          {item.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Math Explanation */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5">
                    <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Langkah Pembahasan Matematis:</span>
                    </div>
                    <MathRenderer content={item.explanation} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Exam Mode Screen
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Sticky Control Header */}
        <header className="sticky top-20 z-30 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
            <AntiCheatGuard
              tabSwitches={tabSwitches}
              onViolation={handleViolation}
              isCompleted={isCompleted}
            />
            <ExamTimer
              initialSeconds={initialDuration}
              expiresAt={expiresAt || undefined}
              isPaused={isCompleted || isSubmitting}
              onTimeUp={() => handleSubmitExam(true)}
              onTick={(left) => setSecondsRemaining(left)}
            />
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto gap-2">
            <button
              onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition min-h-[38px] ${
                isScratchpadOpen
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Scratchpad</span>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold border border-emerald-500 transition min-h-[38px] shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kumpulkan Ujian</span>
            </button>
          </div>
        </header>

        {/* Question Grid Navigator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <span className="text-xs text-slate-400 font-mono">
            LEMBAR JAWABAN: {answeredCount}/{questions.length} TERISI
          </span>

          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isFlag = !!flagged[q.id];
              const isCurrent = idx === currentIndex;

              let btnClass = "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850";

              if (isFlag) {
                btnClass = "bg-amber-950 border-amber-700 text-amber-300";
              } else if (isAnswered) {
                btnClass = "bg-indigo-950 border-indigo-700 text-indigo-200 font-semibold";
              }

              if (isCurrent) {
                btnClass += " ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0a0e17]";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => handleNavigateIndex(idx)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-xl text-xs font-mono border relative transition flex items-center justify-center ${btnClass}`}
                >
                  {idx + 1}
                  {isFlag && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900/60 font-semibold">
                  SOAL {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {currentQ.type === "MCQ" ? "Pilihan Ganda" : "Isian Numerik"}
                </span>
              </div>

              <button
                onClick={handleToggleFlag}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                  flagged[currentQ.id]
                    ? "bg-amber-950 text-amber-300 border-amber-700"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {flagged[currentQ.id] ? "Tersimpan Ragu" : "Tandai Ragu"}
                </span>
              </button>
            </div>

            {/* LaTeX Question Statement */}
            <div className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
              <MathRenderer content={currentQ.content} />
            </div>

            {/* Interactive Answer Input */}
            <div className="pt-2">
              {currentQ.type === "MCQ" && currentQ.options ? (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectAnswer(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition flex items-center gap-3.5 ${
                          isSelected
                            ? "bg-indigo-950/60 border-indigo-500 text-white"
                            : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-900 border border-slate-800 text-slate-400"
                          }`}
                        >
                          {opt.id}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-200 flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2 max-w-md">
                  <label className="block text-xs font-mono text-slate-400">
                    Masukkan Jawaban Angka Eksak:
                  </label>
                  <input
                    type="text"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleSelectAnswer(e.target.value)}
                    placeholder="Misal: 14 atau -2.5"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-white text-sm font-mono"
                  />
                </div>
              )}
            </div>

            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => handleNavigateIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs sm:text-sm font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() =>
                    handleNavigateIndex(
                      Math.min(questions.length - 1, currentIndex + 1)
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold border border-indigo-500 transition"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold border border-emerald-500 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai & Kumpulkan</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scratchpad Overlay */}
        {currentQ && (
          <ScratchpadCanvas
            questionId={currentQ.id}
            isOpen={isScratchpadOpen}
            onToggle={() => setIsScratchpadOpen(false)}
          />
        )}

        {/* Confirm Submit Dialog */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-indigo-400 border border-slate-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Kumpulkan Lembar Ujian?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pastikan semua perhitungan telah Anda periksa sebelum konfirmasi akhir.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Soal Terjawab:</span>
                  <strong className="text-emerald-400">
                    {answeredCount} / {questions.length}
                  </strong>
                </div>
                {unansweredCount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Belum Dijawab:</span>
                    <strong>{unansweredCount} Soal</strong>
                  </div>
                )}
                {Object.values(flagged).filter(Boolean).length > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Masih Ragu-ragu:</span>
                    <strong>
                      {Object.values(flagged).filter(Boolean).length} Soal
                    </strong>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition border border-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSubmitExam(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs border border-emerald-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Mengumpulkan..." : "Ya, Kumpulkan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exit Warning Modal (Back Navigation Interception) */}
        {showExitConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in">
            <div className="max-w-md w-full bg-slate-900 border border-amber-600/70 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Tinggalkan Sesi Ujian?
                </h3>
                <p className="text-xs text-amber-300 font-semibold mt-1">
                  Waktu ujian TIDAK BERHENTI dan terus berkurang secara realtime!
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  Sesi ujian ini tetap aktif di latar belakang. Progres lembar jawaban Anda telah tersimpan otomatis dan dapat dilanjutkan kapan saja melalui banner di puncak Dashboard sebelum batas waktu berakhir.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowExitConfirmModal(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition border border-indigo-500 shadow-sm"
                >
                  Tetap Mengerjakan
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirmModal(false);
                    window.location.href = "/dashboard";
                  }}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition border border-slate-700"
                >
                  Ke Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
