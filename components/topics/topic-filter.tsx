"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Boxes,
  Variable,
  DraftingCompass,
  Spline,
  Grid3X3,
  BarChart3,
  Infinity as InfinityIcon,
  Activity,
  Layers,
  GraduationCap,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";

const CATEGORIES = [
  "Semua",
  "Aljabar",
  "Trigonometri",
  "Geometri",
  "Kalkulus",
  "Statistika",
  "Kalkulus Lanjut",
  "Aljabar Linear",
  "Persamaan Diferensial",
];

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Semua: Layers,
  Aljabar: Variable,
  Trigonometri: DraftingCompass,
  Geometri: Boxes,
  Kalkulus: Spline,
  Statistika: BarChart3,
  "Kalkulus Lanjut": InfinityIcon,
  "Aljabar Linear": Grid3X3,
  "Persamaan Diferensial": Activity,
};

const DIFFICULTIES = [
  { id: "Semua", label: "Semua Level", dot: null },
  { id: "BEGINNER", label: "Dasar", dot: "bg-emerald-400" },
  { id: "INTERMEDIATE", label: "Menengah", dot: "bg-amber-400" },
  { id: "ADVANCED", label: "Lanjutan", dot: "bg-rose-400" },
];

const SORT_OPTIONS = [
  { id: "default", label: "Urutan Silabus" },
  { id: "level-asc", label: "Level: Dasar → Lanjut" },
  { id: "level-desc", label: "Level: Lanjut → Dasar" },
  { id: "name-asc", label: "Nama Topik (A - Z)" },
];

export function TopicFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "Semua";
  const currentDifficulty = searchParams.get("difficulty") || "Semua";
  const currentSort = searchParams.get("sort") || "default";
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "Semua" || value === "default") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("q", search);
  };

  const handleReset = () => {
    setSearch("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilter =
    currentCategory !== "Semua" ||
    currentDifficulty !== "Semua" ||
    currentSort !== "default" ||
    !!searchParams.get("q");

  return (
    <div className="space-y-4 mb-8 bg-slate-900/80 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
      {/* Search Input & Action */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari topik silabus matematika (misal: turunan, integral, matriks, peluang)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold border border-indigo-500 transition shrink-0 shadow-sm"
        >
          {isPending ? "Memuat..." : "Cari"}
        </button>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-medium transition border border-slate-700 flex items-center gap-1.5 shrink-0"
            title="Reset semua filter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </form>

      {/* Tier 1: Category Pills with Section Header */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kategori Silabus:</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {CATEGORIES.length - 1} Bidang Kurikulum
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
          {CATEGORIES.map((cat) => {
            const IconComp = CATEGORY_ICONS[cat] || Boxes;
            const isSelected =
              currentCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => updateFilters("category", cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition border shrink-0 min-h-[36px] ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm"
                    : "bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border-slate-800"
                }`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 2: Dedicated Level (Difficulty) & Sorting Row */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Level Segmented Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5 font-bold mr-1 shrink-0">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Level Kesulitan:</span>
          </span>
          <div className="inline-flex items-center p-1 bg-slate-950/90 border border-slate-800 rounded-xl gap-1 overflow-x-auto no-scrollbar max-w-full">
            {DIFFICULTIES.map((diff) => {
              const isSelected =
                currentDifficulty.toLowerCase() === diff.id.toLowerCase();
              return (
                <button
                  key={diff.id}
                  onClick={() => updateFilters("difficulty", diff.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition shrink-0 min-h-[32px] ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  {diff.dot && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-white" : diff.dot
                      }`}
                    />
                  )}
                  <span>{diff.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sorting Select */}
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>Urutkan:</span>
          </span>
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={currentSort}
              onChange={(e) => updateFilters("sort", e.target.value)}
              className="w-full sm:w-auto bg-slate-950 text-slate-200 text-xs font-mono border border-slate-800 rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-indigo-500 hover:border-slate-700 transition cursor-pointer min-h-[38px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  className="bg-slate-900 text-white"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tier 3: Active Filters Summary Tag Bar (when filters applied) */}
      {hasActiveFilter && (
        <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Filter Aktif:</span>
            {currentCategory !== "Semua" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/80 text-[11px]">
                <span>Kategori: {currentCategory}</span>
                <button
                  onClick={() => updateFilters("category", "Semua")}
                  className="hover:text-white"
                  title="Hapus filter kategori"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentDifficulty !== "Semua" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/80 text-[11px]">
                <span>
                  Level:{" "}
                  {DIFFICULTIES.find((d) => d.id === currentDifficulty)?.label ||
                    currentDifficulty}
                </span>
                <button
                  onClick={() => updateFilters("difficulty", "Semua")}
                  className="hover:text-white"
                  title="Hapus filter level"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSort !== "default" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                <span>
                  Urutan:{" "}
                  {SORT_OPTIONS.find((s) => s.id === currentSort)?.label}
                </span>
                <button
                  onClick={() => updateFilters("sort", "default")}
                  className="hover:text-white"
                  title="Kembalikan urutan default"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchParams.get("q") && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                <span>&quot;{searchParams.get("q")}&quot;</span>
                <button
                  onClick={() => {
                    setSearch("");
                    updateFilters("q", "");
                  }}
                  className="hover:text-white"
                  title="Hapus pencarian"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 underline transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}
    </div>
  );
}
