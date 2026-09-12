"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  Sparkles,
  Layers,
  Clock,
  X,
  BookOpen,
} from "lucide-react";
import { useModuleProgress } from "@/lib/hooks/use-module-progress";
import { ClassroomSymbolGlossary } from "@/components/classroom/classroom-symbol-glossary";

interface MaterialItem {
  id: string;
  title: string;
  slug: string;
  order: number;
  content: string;
}

interface ClassroomSidebarProps {
  topic: {
    id: string;
    title: string;
    slug: string;
    category: string;
  };
  materials: MaterialItem[];
  currentMaterialId: string;
  onCloseMobile?: () => void;
  activeTab?: "modules" | "symbols";
  onTabChange?: (tab: "modules" | "symbols") => void;
  hideSymbolsTab?: boolean;
}

export function ClassroomSidebar({
  topic,
  materials,
  currentMaterialId,
  onCloseMobile,
  activeTab: controlledTab,
  onTabChange,
  hideSymbolsTab = false,
}: ClassroomSidebarProps) {
  const [internalTab, setInternalTab] = useState<"modules" | "symbols">("modules");
  const activeTab = hideSymbolsTab ? "modules" : (controlledTab ?? internalTab);

  const handleTabChange = (tab: "modules" | "symbols") => {
    if (hideSymbolsTab) return;
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const { isCompleted } = useModuleProgress(topic.id);

  // Calculate progress
  const completedCount = materials.filter((m) =>
    isCompleted(m.id, m.slug)
  ).length;
  const totalCount = materials.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Sidebar Header: Tab switch & Course info */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/70 space-y-3">
        {/* Top Control Bar: Tab Switcher & Mobile Close */}
        <div className="flex items-center justify-between gap-2">
          {hideSymbolsTab ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  Silabus Modul
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {materials.length} Unit Materi
                </span>
              </div>
            </div>
          ) : (
            /* Segmented Tab Switcher */
            <div className="flex-1 flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
              <button
                onClick={() => handleTabChange("modules")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-mono font-semibold transition ${
                  activeTab === "modules"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Silabus ({materials.length})</span>
              </button>
              <button
                onClick={() => handleTabChange("symbols")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-mono font-semibold transition ${
                  activeTab === "symbols"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Kamus Simbol Matematika & Cara Baca"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Kamus Simbol</span>
              </button>
            </div>
          )}

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden shrink-0"
              title="Tutup panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {activeTab === "modules" ? (
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug mb-2.5">
              {topic.title}
            </h3>

            {/* Real-time Dicoding Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Progres Belajar</span>
                <span className="font-bold text-indigo-300">
                  {completedCount} dari {totalCount} Selesai ({progressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
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
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Panduan Membaca Simbol</span>
            <span className="text-amber-400 font-semibold">Untuk Orang Awam</span>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === "modules" ? (
        <>
          {/* Module Units List (Dicoding signature checklist) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[calc(100vh-280px)] divide-y divide-slate-800/40">
            {materials.map((mat, idx) => {
              const isCurrent =
                mat.id === currentMaterialId || mat.slug === currentMaterialId;
              const completed = isCompleted(mat.id, mat.slug);

              // Estimate reading time
              const wordCount = mat.content
                .replace(/[#*$`_]/g, "")
                .split(/\s+/).length;
              const readTime = Math.max(3, Math.ceil(wordCount / 140));

              return (
                <Link
                  key={mat.id}
                  href={`/topics/${topic.slug}/materials/${mat.slug}`}
                  onClick={onCloseMobile}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                    isCurrent
                      ? "bg-indigo-950/80 border border-indigo-500/50 shadow-sm"
                      : completed
                      ? "hover:bg-slate-800/60 border border-transparent"
                      : "hover:bg-slate-800/40 border border-transparent text-slate-400"
                  }`}
                >
                  {/* Dicoding Status Icon */}
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <div
                        className="w-5 h-5 rounded-full bg-emerald-950/90 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-sm"
                        title="Modul telah selesai dipelajari"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20" />
                      </div>
                    ) : isCurrent ? (
                      <div
                        className="w-5 h-5 rounded-full bg-indigo-900/80 border border-indigo-400 flex items-center justify-center text-indigo-300 animate-pulse"
                        title="Sedang dipelajari saat ini"
                      >
                        <PlayCircle className="w-3.5 h-3.5 fill-indigo-400/30" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-mono font-semibold group-hover:border-slate-700">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Module Title & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-mono font-medium ${
                          isCurrent
                            ? "text-indigo-400 font-bold"
                            : completed
                            ? "text-emerald-400"
                            : "text-slate-500"
                        }`}
                      >
                        MODUL {idx + 1}
                      </span>
                      {completed && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/60">
                          SELESAI
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-700">
                          AKTIF
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs font-semibold leading-snug line-clamp-2 transition ${
                        isCurrent
                          ? "text-white"
                          : completed
                          ? "text-slate-200 group-hover:text-white"
                          : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      {mat.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>~{readTime} menit</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer: Practice & Quiz Bridge */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-950/80">
            <Link
              href={`/practice/${topic.slug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-slate-600 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Latihan Kuis Topik</span>
            </Link>
          </div>
        </>
      ) : (
        /* Tab 2: Kamus Simbol & Cara Baca */
        <div className="flex-1 overflow-y-auto p-3.5 max-h-[calc(100vh-220px)]">
          <ClassroomSymbolGlossary onCloseMobile={onCloseMobile} layoutMode="sidebar" />
        </div>
      )}
    </div>
  );
}
