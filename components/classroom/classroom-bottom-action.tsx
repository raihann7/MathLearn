"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useModuleProgress } from "@/lib/hooks/use-module-progress";

interface MaterialItem {
  id: string;
  title: string;
  slug: string;
}

interface ClassroomBottomActionProps {
  topic: {
    id: string;
    slug: string;
    title: string;
  };
  currentMaterial: MaterialItem;
  prevMaterial: MaterialItem | null;
  nextMaterial: MaterialItem | null;
  totalMaterialsCount: number;
  currentOrder: number;
}

export function ClassroomBottomAction({
  topic,
  currentMaterial,
  prevMaterial,
  nextMaterial,
  totalMaterialsCount,
  currentOrder,
}: ClassroomBottomActionProps) {
  const router = useRouter();
  const { isCompleted, setMaterialCompletion } = useModuleProgress(topic.id);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completed = isCompleted(currentMaterial.id, currentMaterial.slug);

  const handleMarkCompletedAndContinue = async () => {
    setIsSaving(true);
    try {
      await setMaterialCompletion(
        currentMaterial.id,
        topic.id,
        true,
        currentMaterial.slug
      );

      setToastMessage("Modul diselesaikan! Menuju materi selanjutnya...");

      setTimeout(() => {
        if (nextMaterial) {
          router.push(`/topics/${topic.slug}/materials/${nextMaterial.slug}`);
        } else {
          router.push(`/practice/${topic.slug}`);
        }
      }, 500);
    } catch (err) {
      console.error("Gagal menandai modul selesai:", err);
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsSaving(true);
    try {
      const nextStatus = !completed;
      await setMaterialCompletion(
        currentMaterial.id,
        topic.id,
        nextStatus,
        currentMaterial.slug
      );
      setToastMessage(
        nextStatus
          ? "Modul ditandai selesai! ✓"
          : "Status modul diubah menjadi belum selesai."
      );
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Gagal mengubah status:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative mt-10 pt-6 border-t border-slate-800/90">
      {/* Micro Toast Feedback */}
      {toastMessage && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-indigo-900/90 text-indigo-100 border border-indigo-500/50 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-30 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Action Card with Two-Tier Layout (Status Header + Actions Row) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        {/* Tier 1: Micro Status & Progress Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-semibold text-[11px]">
              <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
              <span>
                MODUL {currentOrder} DARI {totalMaterialsCount}
              </span>
            </span>
            {currentOrder === totalMaterialsCount && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Modul Terakhir</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {completed ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/70 text-emerald-300 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Telah Selesai</span>
                <button
                  onClick={handleToggleStatus}
                  disabled={isSaving}
                  className="ml-1.5 text-[10px] text-slate-400 hover:text-amber-300 underline transition"
                  title="Batalkan tanda selesai"
                >
                  (Batal)
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">
                Belum Ditandai Selesai
              </span>
            )}
          </div>
        </div>

        {/* Tier 2: Uncrowded Two-Column Navigation & Primary Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left Side: Previous Module / Return to Syllabus */}
          <div className="min-w-0 flex-1 sm:max-w-[55%]">
            {prevMaterial ? (
              <Link
                href={`/topics/${topic.slug}/materials/${prevMaterial.slug}`}
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition group text-left w-full"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    Modul Sebelumnya
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                    {prevMaterial.title}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href={`/topics/${topic.slug}`}
                className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-medium transition w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Kembali ke Silabus</span>
              </Link>
            )}
          </div>

          {/* Right Side: Primary Progression Button (Guaranteed 1-Line with whitespace-nowrap) */}
          <div className="sm:shrink-0 flex items-center justify-end">
            {!completed ? (
              <button
                onClick={handleMarkCompletedAndContinue}
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/50 border border-emerald-400/40 transition transform active:scale-98 shrink-0"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {nextMaterial
                    ? "Tandai Selesai & Lanjut"
                    : "Tandai Selesai & Ambil Kuis"}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-200 shrink-0" />
              </button>
            ) : nextMaterial ? (
              <Link
                href={`/topics/${topic.slug}/materials/${nextMaterial.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-end gap-3 px-5 py-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/50 hover:bg-indigo-900 hover:border-indigo-400 text-white transition group text-right shrink-0"
              >
                <div className="flex flex-col text-left sm:text-right min-w-0">
                  <span className="text-[10px] font-mono uppercase text-indigo-300">
                    Modul Selanjutnya
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-100 truncate max-w-[200px] sm:max-w-[240px]">
                    {nextMaterial.title}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-0.5 transition shrink-0" />
              </Link>
            ) : (
              <Link
                href={`/practice/${topic.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-950/50 border border-teal-400/40 transition shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="whitespace-nowrap">
                  Selesai Silabus! Mulai Kuis
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
