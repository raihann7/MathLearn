"use client";

import { useState } from "react";
import { QuestionItem } from "@/lib/question-data";
import { TopicWithMaterials } from "@/lib/db/queries";
import { MathRenderer } from "@/components/math/math-renderer";
import { ScratchpadCanvas } from "@/components/practice/scratchpad-canvas";
import { SocraticHintCard } from "@/components/practice/socratic-hint-card";
import { FormulaDrawer } from "@/components/math/formula-drawer";
import { evaluateAnswer } from "@/lib/db/question-queries";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  PenTool,
  Calculator,
  RotateCcw,
  Sparkles,
  Trophy,
  Loader2,
} from "lucide-react";

interface PracticeQuizProps {
  topic: TopicWithMaterials;
  questions: QuestionItem[];
}

interface AnswerRecord {
  userAnswer: string;
  isChecked: boolean;
  isCorrect: boolean;
  feedback?: string;
}

export function PracticeQuiz({ topic, questions }: PracticeQuizProps) {
  const [questionList, setQuestionList] = useState<QuestionItem[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotification, setAiNotification] = useState<string | null>(null);

  const currentQ = questionList[currentIndex] || questionList[0];
  const currentRecord = currentQ ? answers[currentQ.id] : undefined;

  const handleGenerateAiQuestion = async () => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);
    setAiNotification(null);
    try {
      const res = await fetch("/api/ai/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: topic.id,
          difficulty: topic.difficulty,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menghubungi server generator");
      }

      const data = await res.json();
      if (data.question) {
        const nextIndex = questionList.length;
        setQuestionList((prev) => [...prev, data.question]);
        setCurrentIndex(nextIndex);
        setIsCompleted(false);
        setAiNotification(
          data.isLiveAi
            ? "✨ Soal variasi baru berhasil diracik secara realtime via OpenRouter AI!"
            : "✨ Soal variasi baru berhasil ditambahkan ke stasiun latihan!"
        );
        setTimeout(() => setAiNotification(null), 6000);
      }
    } catch {
      setAiNotification("Gagal meracik variasi soal baru. Silakan coba kembali.");
      setTimeout(() => setAiNotification(null), 5000);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSelectAnswer = (ans: string) => {
    if (currentRecord?.isChecked) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        userAnswer: ans,
        isChecked: false,
        isCorrect: false,
      },
    }));
  };

  const handleCheckAnswer = () => {
    if (!currentRecord?.userAnswer) return;

    const result = evaluateAnswer(currentQ, currentRecord.userAnswer);
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        isChecked: true,
        isCorrect: result.isCorrect,
        feedback: result.feedback,
      },
    }));
  };

  const handleResetCurrent = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const totalChecked = Object.values(answers).filter((a) => a.isChecked).length;
  const totalCorrect = Object.values(answers).filter(
    (a) => a.isChecked && a.isCorrect
  ).length;

  if (isCompleted) {
    const scorePct = Math.round((totalCorrect / questionList.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-14 h-14 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center mb-6">
            <Trophy className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Sesi Latihan Selesai
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-mono">
            Evaluasi Konseptual: <span className="text-indigo-300 font-semibold">{topic.title}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 my-8 max-w-sm mx-auto">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Nilai Akurasi</span>
              <p className="text-3xl font-black text-indigo-400 mt-1">{scorePct}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Soal Benar</span>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                {totalCorrect} / {questionList.length}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setAnswers({});
                setCurrentIndex(0);
                setIsCompleted(false);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold border border-slate-700 transition"
            >
              Ulangi Latihan
            </button>
            <button
              onClick={handleGenerateAiQuestion}
              disabled={isGeneratingAi}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold border border-indigo-500 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isGeneratingAi ? "Meracik Soal..." : "Latih Variasi Baru (AI)"}</span>
            </button>
            <Link
              href={`/topics/${topic.slug}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-slate-800 transition"
            >
              Kembali ke Topik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Header & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <Link
            href={`/topics/${topic.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Silabus: {topic.title}</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Stasiun Latihan Interaktif
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 font-medium border border-teal-800/60">
              PRACTICE_MODE
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isScratchpadOpen
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title="Buka kanvas coretan kalkulasi"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Scratchpad</span>
          </button>

          <button
            onClick={() => setIsFormulaDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
            title="Buka buku rumus cepat"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Rumus</span>
          </button>
        </div>
      </div>

      {/* Question Progress Dots & AI Generator Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {questionList.map((q, idx) => {
            const ans = answers[q.id];
            const isCurrent = idx === currentIndex;
            let statusColor = "bg-slate-900 text-slate-400 border-slate-800";

            if (ans?.isChecked) {
              statusColor = ans.isCorrect
                ? "bg-emerald-950 border-emerald-700 text-emerald-300 font-bold"
                : "bg-rose-950 border-rose-700 text-rose-300 font-bold";
            } else if (ans?.userAnswer) {
              statusColor = "bg-indigo-950 border-indigo-700 text-indigo-300";
            }

            if (isCurrent) {
              statusColor += " ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0a0e17]";
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border font-mono text-xs flex items-center justify-center transition ${statusColor}`}
              >
                {idx + 1}
              </button>
            );
          })}

          <button
            onClick={handleGenerateAiQuestion}
            disabled={isGeneratingAi}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-mono font-semibold transition disabled:opacity-50"
            title="Racik variasi soal matematika baru dengan AI"
          >
            {isGeneratingAi ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>{isGeneratingAi ? "Meracik..." : "+ Variasi AI"}</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Soal {currentIndex + 1} dari {questionList.length}
        </span>
      </div>

      {/* AI Generation Notification Banner */}
      {aiNotification && (
        <div className="p-3.5 rounded-xl bg-indigo-950/90 border border-indigo-700/80 text-indigo-200 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{aiNotification}</span>
        </div>
      )}

      {/* Interactive Scratchpad Canvas (if toggled open) */}
      <ScratchpadCanvas
        questionId={currentQ.id}
        isOpen={isScratchpadOpen}
        onToggle={() => setIsScratchpadOpen(false)}
      />

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono border border-slate-800">
              Tipe: {currentQ.type === "MCQ" ? "Pilihan Ganda" : "Isian Numerik"}
            </span>
            {currentQ.id.startsWith("q-ai-") && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono font-medium">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>AI Generated</span>
              </span>
            )}
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900/60 font-mono font-medium">
            Tingkat {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text with KaTeX */}
        <div className="text-base sm:text-lg font-medium text-white">
          <MathRenderer content={currentQ.content} />
        </div>

        {/* Answer Options */}
        {currentQ.type === "MCQ" ? (
          <div className="space-y-2.5">
            {currentQ.options?.map((opt) => {
              const isSelected = currentRecord?.userAnswer === opt.id;
              const isChecked = currentRecord?.isChecked;
              const isCorrectOpt = opt.id === currentQ.correctAnswer;

              let cardStyle =
                "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200";

              if (isSelected && !isChecked) {
                cardStyle =
                  "border-indigo-500 bg-indigo-950/60 text-white";
              }

              if (isChecked) {
                if (isCorrectOpt) {
                  cardStyle =
                    "border-emerald-500 bg-emerald-950/60 text-emerald-200 font-semibold";
                } else if (isSelected && !currentRecord.isCorrect) {
                  cardStyle =
                    "border-rose-500 bg-rose-950/60 text-rose-200 line-through opacity-80";
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer(opt.id)}
                  disabled={isChecked}
                  className={`w-full p-3.5 rounded-xl border flex items-center gap-3.5 text-left transition duration-150 ${cardStyle}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg font-mono flex items-center justify-center text-xs font-bold transition ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {opt.id}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm">
                    <MathRenderer content={opt.text} />
                  </div>
                  {isChecked && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isChecked && isSelected && !currentRecord.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* Numerical Input */
          <div className="space-y-3">
            <label className="block text-xs font-mono text-slate-400">
              Masukkan nilai numerik hasil perhitungan:
            </label>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={currentRecord?.userAnswer || ""}
                onChange={(e) => handleSelectAnswer(e.target.value)}
                disabled={currentRecord?.isChecked}
                placeholder="Misal: 4.5 atau 12..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              Toleransi akurasi perhitungan: $\pm 0.01$
            </p>
          </div>
        )}

        {/* Verification Trigger & Inline Result */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!currentRecord?.isChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!currentRecord?.userAnswer}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold border border-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition"
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={handleResetCurrent}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            )}
          </div>

          {/* Inline Feedback Banner */}
          {currentRecord?.isChecked && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                currentRecord.isCorrect
                  ? "bg-emerald-950/90 text-emerald-300 border border-emerald-800/80"
                  : "bg-rose-950/90 text-rose-300 border border-rose-800/80"
              }`}
            >
              {currentRecord.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{currentRecord.feedback}</span>
            </div>
          )}
        </div>

        {/* Step-by-Step KaTeX Explanation */}
        {currentRecord?.isChecked && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Pembahasan Analisis:</span>
            </h4>
            <MathRenderer content={currentQ.explanation} />
          </div>
        )}
      </div>

      {/* Socratic Hint Accordion */}
      <SocraticHintCard question={currentQ} />

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 disabled:opacity-40 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Soal Sebelumnya</span>
        </button>

        {currentIndex < questionList.length - 1 ? (
          <button
            onClick={() =>
              setCurrentIndex((prev) => Math.min(questionList.length - 1, prev + 1))
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold border border-indigo-500 transition"
          >
            <span>Soal Selanjutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsCompleted(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold border border-teal-500 transition"
          >
            <Trophy className="w-4 h-4" />
            <span>Selesaikan Latihan</span>
          </button>
        )}
      </div>

      {/* Formula Drawer Overlay */}
      <FormulaDrawer
        isOpen={isFormulaDrawerOpen}
        onClose={() => setIsFormulaDrawerOpen(false)}
      />
    </div>
  );
}
