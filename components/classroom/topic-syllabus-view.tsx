"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PlayCircle,
  Sparkles,
  ChevronRight,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";
import { useModuleProgress } from "@/lib/hooks/use-module-progress";

interface MaterialItem {
  id: string;
  title: string;
  slug: string;
  order: number;
  content: string;
}

interface TopicSyllabusViewProps {
  topic: {
    id: string;
    title: string;
    slug: string;
    category: string;
    difficulty: string;
    description: string;
  };
  materials: MaterialItem[];
}

export function TopicSyllabusView({ topic, materials }: TopicSyllabusViewProps) {
  const { isCompleted, getLastVisited } = useModuleProgress(topic.id);

  // Compute completed count and progress percentage
  const completedCount = useMemo(() => {
    return materials.filter((m) => isCompleted(m.id, m.slug)).length;
  }, [materials, isCompleted]);

  const totalMaterials = materials.length;
  const progressPercent =
    totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;

  // Determine the next recommended module to study (resume learning)
  const resumeMaterial = useMemo(() => {
    const lastVisitedSlug = getLastVisited(topic.slug);
    if (lastVisitedSlug) {
      const found = materials.find((m) => m.slug === lastVisitedSlug);
      if (found) return found;
    }

    // Otherwise find the first uncompleted module
    const firstUncompleted = materials.find((m) => !isCompleted(m.id, m.slug));
    return firstUncompleted || materials[0] || null;
  }, [materials, isCompleted, getLastVisited, topic.slug]);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link
            href="/topics"
            className="hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Katalog Kurikulum</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500">{topic.category}</span>
          <span className="text-slate-600">/</span>
          <span className="text-indigo-400 font-semibold truncate max-w-[240px]">
            {topic.title}
          </span>
        </div>

        {/* Topic Header & Overview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[11px]">
            <span className="px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800/60">
              {topic.category}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium border border-slate-700">
              Level {topic.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>{totalMaterials} Modul Teori</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
            {topic.title}
          </h1>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-3xl">
            {topic.description}
          </p>

          {/* Dicoding-style Student Learning Progress Card */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Progres Belajar Anda</span>
              </span>
              <span className="font-bold text-indigo-300">
                {completedCount} dari {totalMaterials} Modul Selesai ({progressPercent}%)
              </span>
            </div>

            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  progressPercent === 100
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-indigo-500 to-teal-400"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Row: Resume Learning + Interactive Practice + Official Exam */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-3 items-center">
            {resumeMaterial && (
              <Link
                href={`/topics/${topic.slug}/materials/${resumeMaterial.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold border border-indigo-500 shadow-md shadow-indigo-950/40 transition"
              >
                <PlayCircle className="w-4 h-4" />
                <span>
                  {completedCount === 0
                    ? "Mulai Belajar (Modul 1)"
                    : completedCount === totalMaterials
                    ? "Ulas Kembali Materi"
                    : `Lanjutkan Belajar: Modul ${resumeMaterial.order}`}
                </span>
              </Link>
            )}

            <Link
              href={`/practice/${topic.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Latihan Kuis Interaktif</span>
            </Link>

            <Link
              href={`/exam/${topic.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs sm:text-sm font-semibold border border-amber-500/40 hover:border-amber-500 transition"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Ujian Resmi (Anti-Cheat)</span>
            </Link>
          </div>
        </div>

        {/* Dicoding-style Curriculum Modules Syllabus */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Silabus Modul Pembelajaran</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {totalMaterials} Modul Teori, KaTeX & Soal
            </span>
          </div>

          <div className="space-y-2.5">
            {materials.map((mat, idx) => {
              const completed = isCompleted(mat.id, mat.slug);
              const isNextToStudy = resumeMaterial?.id === mat.id && !completed;

              // Estimate reading duration
              const wordCount = mat.content
                .replace(/[#*$`_]/g, "")
                .split(/\s+/).length;
              const readTime = Math.max(3, Math.ceil(wordCount / 140));

              return (
                <Link
                  key={mat.id}
                  href={`/topics/${topic.slug}/materials/${mat.slug}`}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition duration-200 ${
                    completed
                      ? "bg-slate-900/90 border-slate-800/90 hover:border-emerald-500/50"
                      : isNextToStudy
                      ? "bg-indigo-950/40 border-indigo-500/50 hover:border-indigo-400"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Status Icon Indicator */}
                    <div className="shrink-0">
                      {completed ? (
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 shadow-sm"
                          title="Telah selesai dipelajari"
                        >
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                        </div>
                      ) : isNextToStudy ? (
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-900/80 border border-indigo-400 text-indigo-300 shadow-sm animate-pulse"
                          title="Rekomendasi untuk dipelajari selanjutnya"
                        >
                          <PlayCircle className="w-4 h-4 fill-indigo-400/30" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs font-bold group-hover:border-indigo-500/60 group-hover:text-indigo-400 transition">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          MODUL {idx + 1}
                        </span>
                        {completed && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/60">
                            SELESAI
                          </span>
                        )}
                        {isNextToStudy && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-700">
                            LANJUTKAN
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-semibold truncate transition ${
                          completed
                            ? "text-slate-200 group-hover:text-white"
                            : isNextToStudy
                            ? "text-white group-hover:text-indigo-200"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {mat.title}
                      </h3>

                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3 font-mono text-[11px]">
                        <span className="flex items-center gap-1 text-slate-500">
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>Teori & KaTeX</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>~{readTime} menit</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 group-hover:text-indigo-400 transition shrink-0 ml-3">
                    <span className="hidden sm:inline">
                      {completed ? "Ulas Modul" : "Buka Modul"}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
