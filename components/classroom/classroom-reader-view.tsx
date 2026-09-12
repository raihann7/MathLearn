"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ListTree,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { MathRenderer } from "@/components/math/math-renderer";
import { TableOfContents } from "@/components/materials/table-of-contents";
import { ClassroomSidebar } from "@/components/classroom/classroom-sidebar";
import { ClassroomBottomAction } from "@/components/classroom/classroom-bottom-action";
import { ClassroomTopNav } from "@/components/classroom/classroom-top-nav";
import { useModuleProgress } from "@/lib/hooks/use-module-progress";

interface MaterialItem {
  id: string;
  title: string;
  slug: string;
  order: number;
  content: string;
}

interface ClassroomReaderViewProps {
  topic: {
    id: string;
    slug: string;
    title: string;
    category: string;
    difficulty: string;
  };
  material: MaterialItem;
  prevMaterial: MaterialItem | null;
  nextMaterial: MaterialItem | null;
  allMaterials: MaterialItem[];
}

export function ClassroomReaderView({
  topic,
  material,
  prevMaterial,
  nextMaterial,
  allMaterials,
}: ClassroomReaderViewProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"modules" | "symbols">("modules");
  const { recordLastVisited, isCompleted } = useModuleProgress(topic.id);

  const completed = isCompleted(material.id, material.slug);

  const handleOpenSymbols = () => {
    setSidebarTab("symbols");
    if (isFocusMode) setIsFocusMode(false);
    setIsMobileSidebarOpen(true);
  };

  // Automatically record this module as last visited in this topic
  useEffect(() => {
    recordLastVisited(topic.slug, material.slug);
    recordLastVisited(topic.id, material.slug);
  }, [topic.slug, topic.id, material.slug, recordLastVisited]);

  // Estimate reading duration
  const wordCount = material.content
    .replace(/[#*$`_]/g, "")
    .split(/\s+/).length;
  const readingMinutes = Math.max(3, Math.ceil(wordCount / 140));

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col">
      {/* Top Classroom Navigation Bar */}
      <ClassroomTopNav
        topic={topic}
        materials={allMaterials}
        currentMaterialId={material.id}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isSidebarOpen={isMobileSidebarOpen}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        onOpenSymbols={handleOpenSymbols}
      />

      {/* Main Classroom Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Desktop Classroom Syllabus & Symbol Dictionary) */}
          {!isFocusMode && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-20">
              <ClassroomSidebar
                topic={topic}
                materials={allMaterials}
                currentMaterialId={material.id}
                activeTab={sidebarTab}
                onTabChange={setSidebarTab}
              />
            </aside>
          )}

          {/* Central Reader Column */}
          <main
            className={`${
              isFocusMode ? "lg:col-span-12 max-w-4xl mx-auto" : "lg:col-span-8"
            } w-full space-y-6`}
          >
            {/* Breadcrumb Navigation */}
            <nav className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <Link href="/topics" className="hover:text-white transition">
                Katalog
              </Link>
              <span className="text-slate-600">/</span>
              <Link
                href={`/topics/${topic.slug}`}
                className="hover:text-white text-slate-300 transition"
              >
                {topic.title}
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-indigo-400 font-semibold">
                Modul {material.order}: {material.title}
              </span>
            </nav>

            {/* Dicoding-style Classroom Reader Card */}
            <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
              {/* Header Meta: Module order, category, reading duration */}
              <div className="mb-8 pb-6 border-b border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800/60">
                    MODUL {material.order} DARI {allMaterials.length}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {topic.category}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/80 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{readingMinutes} menit baca</span>
                  </span>
                  {completed && (
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Telah Selesai</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
                  {material.title}
                </h1>
              </div>

              {/* On-Page Table of Contents (for quick jump) */}
              <div className="mb-8">
                <TableOfContents content={material.content} />
              </div>

              {/* Pedagogical Callout Box: Catatan Kunci Modul */}
              <div className="mb-8 p-4 sm:p-5 rounded-xl bg-indigo-950/40 border border-indigo-800/70 text-indigo-100 flex items-start gap-3.5">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <div className="font-bold text-white">
                    Fokus Pembelajaran Modul Ini
                  </div>
                  <p className="text-indigo-200/90 leading-relaxed">
                    Pelajari definisi formal, penurunan rumus, dan cara kerja matematika di balik konsep ini. Jangan lupa untuk mencoba contoh soal langkah demi langkah secara mandiri sebelum melanjutkan.
                  </p>
                </div>
              </div>

              {/* LaTeX & Markdown Content via MathRenderer */}
              <div className="prose prose-invert max-w-none text-slate-200">
                <MathRenderer content={material.content} />
              </div>

              {/* Bottom Tip Callout */}
              <div className="mt-10 p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-start gap-3.5 text-xs sm:text-sm">
                <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Tips Pemahaman: </span>
                  <span>
                    Gunakan fitur <strong>Interactive Scratchpad</strong> pada mode latihan untuk mencoret-coret turunan rumus dan membiasakan diri sebelum menghadapi ujian resmi anti-cheat.
                  </span>
                </div>
              </div>

              {/* The Iconic Dicoding "Tandai Selesai & Lanjut" Action Bar */}
              <ClassroomBottomAction
                topic={topic}
                currentMaterial={material}
                prevMaterial={prevMaterial}
                nextMaterial={nextMaterial}
                totalMaterialsCount={allMaterials.length}
                currentOrder={material.order}
              />
            </article>
          </main>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Syllabus Modal */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-[85vw] sm:max-w-sm md:max-w-md bg-slate-900 h-full p-3.5 sm:p-4 overflow-y-auto z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            <ClassroomSidebar
              topic={topic}
              materials={allMaterials}
              currentMaterialId={material.id}
              activeTab="modules"
              hideSymbolsTab={true}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
