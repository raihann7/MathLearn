"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FORMULA_DATABASE,
  FORMULA_CATEGORIES,
  FormulaCategory,
  FormulaItem,
} from "@/lib/formula-data";
import { MathRenderer } from "@/components/math/math-renderer";
import { ClassroomSymbolGlossary } from "@/components/classroom/classroom-symbol-glossary";
import {
  Search,
  X,
  Copy,
  Check,
  Sigma,
  Boxes,
  Variable,
  DraftingCompass,
  Spline,
  Grid3X3,
  BarChart3,
  BookOpen,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface FormulaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<
  FormulaCategory,
  React.ComponentType<{ className?: string }>
> = {
  Semua: Boxes,
  Aljabar: Variable,
  Trigonometri: DraftingCompass,
  Kalkulus: Spline,
  Matriks: Grid3X3,
  Statistika: BarChart3,
};

export function FormulaDrawer({ isOpen, onClose }: FormulaDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"formulas" | "symbols">("formulas");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FormulaCategory>("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key & manage body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return FORMULA_DATABASE.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.latex.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  const handleCopyLatex = (item: FormulaItem) => {
    navigator.clipboard.writeText(item.latex);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Dark Dim Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Slide-over Right Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full transition-all duration-200 ${
          isWide ? "max-w-4xl" : "max-w-xl lg:max-w-2xl"
        } bg-[#0d131f] border-l border-slate-800 shadow-2xl flex flex-col h-screen max-h-screen z-10 animate-in slide-in-from-right duration-200`}
      >
        {/* 1. Header with Dual Tab Switcher */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-800/80 text-indigo-400 flex items-center justify-center shrink-0">
                <Sigma className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Buku Rumus & Notasi
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Referensi rumus & panduan baca simbol matematika
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsWide(!isWide)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:inline-flex"
                title={isWide ? "Perkecil panel" : "Perlebar panel (Layar Lebar)"}
              >
                {isWide ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveDrawerTab("formulas")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeDrawerTab === "formulas"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sigma className="w-3.5 h-3.5" />
              <span>Daftar Rumus ({FORMULA_DATABASE.length})</span>
            </button>
            <button
              onClick={() => setActiveDrawerTab("symbols")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeDrawerTab === "symbols"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Kamus Simbol</span>
            </button>
          </div>
        </div>

        {activeDrawerTab === "formulas" ? (
          <>
            {/* 2. Search & Category Filters */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 shrink-0 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari rumus (kuadrat, turunan, matriks, sinus)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-14 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter Pills with STEM Icons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {FORMULA_CATEGORIES.map((cat) => {
                  const IconComp = CATEGORY_ICONS[cat] || Boxes;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition font-mono text-xs border ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-500 font-semibold"
                          : "bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 shrink-0" />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick tip about LaTeX copying */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-[11px] text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="leading-tight">
                  Tombol <strong>Salin LaTeX</strong> menyalin kode rumus untuk langsung ditempel di Word, Notion, Obsidian, Desmos, atau prompt AI.
                </span>
              </div>
            </div>

            {/* 3. Scrollable Formula List Container */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5">
              {filteredFormulas.length === 0 ? (
                <div className="text-center py-20 text-slate-500 space-y-3">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
                  <p className="text-sm font-semibold text-slate-300">
                    Rumus tidak ditemukan
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Coba gunakan kata kunci lain atau pilih kategori &apos;Semua&apos;.
                  </p>
                </div>
              ) : (
                filteredFormulas.map((item) => {
                  const CategoryIcon =
                    CATEGORY_ICONS[item.category] || Variable;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition group space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                            <CategoryIcon className="w-3 h-3 text-indigo-400" />
                            <span>{item.category}</span>
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                            {item.title}
                          </h3>
                        </div>

                        <button
                          onClick={() => handleCopyLatex(item)}
                          className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition shrink-0"
                          title="Salin kode LaTeX rumus untuk ditempel di Notion, Obsidian, Word, atau AI"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px] font-bold">
                                TERSALIN
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[10px] font-semibold">Salin LaTeX</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Math Expression Box */}
                      <div className="bg-[#070b12] rounded-lg p-3.5 border border-slate-800 overflow-x-auto text-center">
                        <MathRenderer content={`$$${item.latex}$$`} />
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {item.variables && (
                        <div className="pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-900">
                          <span className="text-slate-500">Keterangan:</span>{" "}
                          {item.variables}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* Symbol Glossary Tab */
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <ClassroomSymbolGlossary onCloseMobile={onClose} layoutMode="drawer" />
          </div>
        )}

        {/* 4. Footer Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center shrink-0 flex items-center justify-between px-4 text-[11px] font-mono text-slate-400">
          <span>Tekan ESC untuk menutup</span>
          <span className="text-slate-500">
            {activeDrawerTab === "formulas"
              ? `${filteredFormulas.length} dari ${FORMULA_DATABASE.length} rumus`
              : "Kamus Simbol & Cara Baca"}
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
