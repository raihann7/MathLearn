"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Menu,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { BookmarkButton } from "@/components/materials/bookmark-button";
import { useModuleProgress } from "@/lib/hooks/use-module-progress";

interface MaterialItem {
  id: string;
  title: string;
  slug: string;
}

interface ClassroomTopNavProps {
  topic: {
    id: string;
    slug: string;
    title: string;
    category: string;
  };
  materials: MaterialItem[];
  currentMaterialId: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenSymbols?: () => void;
}

export function ClassroomTopNav({
  topic,
  materials,
  currentMaterialId,
  onToggleSidebar,
  isSidebarOpen,
  isFocusMode,
  onToggleFocusMode,
  onOpenSymbols,
}: ClassroomTopNavProps) {
  const { isCompleted } = useModuleProgress(topic.id);

  const completedCount = materials.filter((m) =>
    isCompleted(m.id, m.slug)
  ).length;
  const totalCount = materials.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-16 z-30 bg-[#0a0e17]/95 backdrop-blur-md border-b border-slate-800/90 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Back to Topic & Syllabus Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/topics/${topic.slug}`}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 shrink-0"
            title="Kembali ke Halaman Silabus Topik"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Silabus</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800/60 hidden md:inline-block shrink-0">
                {topic.category}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {topic.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Center/Right: Dicoding Progress Meter */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-mono text-slate-400">
              Progres Kelas
            </div>
            <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 justify-end">
              <span className="text-emerald-400">{completedCount}</span>
              <span className="text-slate-600">/</span>
              <span>{totalCount} Modul</span>
              <span className="text-indigo-400 font-bold">({progressPercent}%)</span>
            </div>
          </div>

          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
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

        {/* Right Action Icons: Bookmark, Math Symbols, Focus Mode, Sidebar Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Math Symbols Glossary Button (Desktop only, mobile accesses via Global Navbar) */}
          {onOpenSymbols && (
            <button
              onClick={onOpenSymbols}
              className="hidden md:flex px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/80 text-slate-300 hover:text-white transition text-xs font-mono items-center gap-1.5 shadow-sm"
              title="Buka Kamus & Cara Baca Simbol Matematika"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Kamus Simbol</span>
            </button>
          )}

          <BookmarkButton materialId={currentMaterialId} />

          {/* Focus Mode Toggle (distraction-free reading) */}
          <button
            onClick={onToggleFocusMode}
            className={`p-2 rounded-lg border text-xs font-semibold transition hidden lg:inline-flex items-center gap-1.5 ${
              isFocusMode
                ? "bg-indigo-950 border-indigo-700 text-indigo-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title={isFocusMode ? "Tampilkan Panel Silabus" : "Mode Fokus (Layar Penuh)"}
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Normal</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Fokus</span>
              </>
            )}
          </button>

          {/* Mobile Syllabus Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden flex items-center gap-1.5 text-xs font-semibold"
            title="Buka Silabus Modul"
          >
            <Menu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs">Modul</span>
          </button>
        </div>
      </div>
    </header>
  );
}
