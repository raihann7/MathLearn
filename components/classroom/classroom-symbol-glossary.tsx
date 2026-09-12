"use client";

import { useState, useMemo } from "react";
import {
  MATH_SYMBOLS_DATABASE,
  MATH_SYMBOL_CATEGORIES,
  MathSymbolCategory,
  MathSymbolItem,
} from "@/lib/math-symbols-data";
import { MathRenderer } from "@/components/math/math-renderer";
import {
  Search,
  X,
  Volume2,
  Sparkles,
  BookOpen,
  Check,
  Copy,
  Layers,
  HelpCircle,
  Hash,
  Variable,
  Spline,
  Grid3X3,
  RotateCcw,
} from "lucide-react";

interface ClassroomSymbolGlossaryProps {
  onCloseMobile?: () => void;
  layoutMode?: "sidebar" | "drawer";
}

const CATEGORY_ICONS: Record<
  MathSymbolCategory,
  React.ComponentType<{ className?: string }>
> = {
  Semua: Layers,
  "Dasar & Operasi": Hash,
  "Himpunan & Logika": HelpCircle,
  "Aljabar & Fungsi": Variable,
  Kalkulus: Spline,
  "Vektor & Geometri": Grid3X3,
};

export function ClassroomSymbolGlossary({
  onCloseMobile,
  layoutMode = "sidebar",
}: ClassroomSymbolGlossaryProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<MathSymbolCategory>("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Filter symbols based on category & search term
  const filteredSymbols = useMemo(() => {
    const q = search.toLowerCase().trim();
    return MATH_SYMBOLS_DATABASE.filter((item) => {
      const matchCat =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.pronunciation.toLowerCase().includes(q) ||
        item.plainMeaning.toLowerCase().includes(q) ||
        item.exampleReading.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.exampleLatex.toLowerCase().includes(q) ||
        item.visualNicknames?.some((nick) => nick.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  const handleCopySymbol = (item: MathSymbolItem) => {
    navigator.clipboard.writeText(item.symbol);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-2.5">
      {/* 1. Compact Guide Tip / Banner */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
        <div className="flex items-center gap-1.5 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate text-[11px] font-medium">
            Panduan pelafalan simbol matematika SMA & Kuliah
          </span>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-[10px] font-mono text-indigo-300 hover:text-white underline shrink-0 ml-2"
        >
          {showHelp ? "Tutup" : "Bantuan"}
        </button>
      </div>

      {showHelp && (
        <div className="bg-indigo-950/60 border border-indigo-800/60 rounded-xl p-3 text-xs text-slate-300 leading-relaxed space-y-1">
          <p className="font-semibold text-white">Bagaimana cara menggunakannya?</p>
          <p className="text-[11px] text-slate-300">
            Setiap kartu menampilkan nama resmi, pelafalan bahasa Indonesia yang lazim digunakan dosen & guru, arti dalam bahasa sederhana, serta contoh pemakaiannya dalam rumus.
          </p>
        </div>
      )}

      {/* 2. Instant Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, simbol, atau bentuk visual (contoh: angka 8 tidur, cacing, segitiga, sigma)..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            title="Hapus pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Category Filter Pills (Single Row Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
        {MATH_SYMBOL_CATEGORIES.map((cat) => {
          const IconComp = CATEGORY_ICONS[cat] || Layers;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition border ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-500 font-bold shadow-sm"
                  : "bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border-slate-800"
              }`}
            >
              <IconComp className="w-3 h-3 shrink-0" />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Toolbar: Count, Reset & Status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-0.5 pt-0.5">
        <div className="flex items-center gap-2">
          <span>
            Menampilkan <span className="text-indigo-300 font-bold">{filteredSymbols.length}</span> simbol
          </span>
          {(search || selectedCategory !== "Semua") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("Semua");
              }}
              className="text-[10px] text-amber-400/90 hover:text-amber-300 flex items-center gap-1 underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <span className="text-[10px] text-slate-500 hidden sm:inline">
          Klik tombol salin untuk copy LaTeX
        </span>
      </div>

      {/* 5. Scrollable Symbol Cards List */}
      <div
        className={`flex-1 overflow-y-auto pr-1 ${
          layoutMode === "drawer"
            ? "grid grid-cols-1 gap-3.5"
            : "grid grid-cols-1 gap-3"
        }`}
      >
        {filteredSymbols.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 space-y-2 bg-slate-950/60 rounded-xl border border-slate-800/60 p-4">
            <BookOpen className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <p className="text-xs font-semibold text-slate-300">
              Simbol tidak ditemukan
            </p>
            <p className="text-[11px] text-slate-500">
              Coba cari dengan nama atau bentuk visual (misal: &apos;angka 8 tidur&apos;, &apos;cacing&apos;, &apos;segitiga&apos;, &apos;e terbalik&apos;, &apos;sigma&apos;).
            </p>
          </div>
        ) : (
          filteredSymbols.map((item) => {
            const isCopied = copiedId === item.id;
            const CategoryIcon = CATEGORY_ICONS[item.category] || Layers;

            return (
              <div
                key={item.id}
                className="bg-slate-950/80 hover:bg-slate-900/90 p-4 sm:p-4.5 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-200 flex flex-col gap-3 group shadow-sm hover:shadow-md"
              >
                {/* 1. Card Header: Category + Name + Copy LaTeX */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                      <CategoryIcon className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{item.category}</span>
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopySymbol(item)}
                    className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition shrink-0"
                    title="Salin kode LaTeX simbol"
                  >
                    {isCopied ? (
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

                {/* Sebutan Bentuk Fisik / Awam */}
                {item.visualNicknames && item.visualNicknames.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap -mt-1">
                    <span className="text-[10px] font-mono text-slate-500">Ciri visual:</span>
                    {item.visualNicknames.slice(0, 3).map((nick, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400"
                      >
                        {nick}
                      </span>
                    ))}
                  </div>
                )}

                {/* 2. Unclipped Math Showcase Area */}
                <div className="bg-[#070b14] rounded-xl py-3.5 px-4 border border-slate-800/90 flex items-center justify-center min-h-[72px] overflow-x-auto text-center group-hover:border-indigo-500/30 transition-colors">
                  <MathRenderer
                    content={`$$${item.symbol}$$`}
                    className="text-2xl sm:text-3xl font-bold text-indigo-100 select-all [&_.katex-display]:my-0"
                  />
                </div>

                {/* 3. Cara Baca Lisan (Spoken Pronunciation) */}
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200">
                  <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block mb-0.5">
                      Cara Baca Lisan:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-snug">
                      &ldquo;{item.pronunciation}&rdquo;
                    </p>
                  </div>
                </div>

                {/* 4. Arti Bahasa Awam */}
                <div className="space-y-1 px-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">
                    Arti / Makna Sederhana:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.plainMeaning}
                  </p>
                </div>

                {/* 5. Contoh Pemakaian Rumus & Cara Bacanya */}
                <div className="rounded-xl bg-[#070b14] border border-slate-800/80 p-3 space-y-2 mt-auto">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800/80 pb-1.5">
                    <span className="uppercase font-semibold text-slate-400">Contoh Rumus</span>
                    <span className="text-indigo-400 font-medium">Cara Membaca Contoh</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                    <div className="overflow-x-auto scrollbar-none py-0.5">
                      <MathRenderer
                        content={`$${item.exampleLatex}$`}
                        className="text-xs sm:text-sm font-semibold text-slate-100 [&_p]:my-0 whitespace-nowrap"
                      />
                    </div>
                    <span className="text-xs text-indigo-300 font-medium sm:text-right sm:max-w-[55%] leading-tight">
                      &ldquo;{item.exampleReading}&rdquo;
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
