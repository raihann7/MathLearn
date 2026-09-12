"use client";

import { useState } from "react";
import { QuestionItem } from "@/lib/question-data";
import { MathRenderer } from "@/components/math/math-renderer";
import {
  Lightbulb,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Brain,
  Unlock,
  Loader2,
  Cpu,
} from "lucide-react";

interface SocraticHintCardProps {
  question: QuestionItem;
}

export function SocraticHintCard({ question }: SocraticHintCardProps) {
  const [unlockedTiers, setUnlockedTiers] = useState<number[]>([]);
  const [openTiers, setOpenTiers] = useState<number[]>([]);
  const [tier3Content, setTier3Content] = useState<string>(question.socraticPrompt);
  const [isLiveAi, setIsLiveAi] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchLiveAiHint = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          tier: 3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setTier3Content(data.content);
        }
        if (data.isLiveAi) {
          setIsLiveAi(true);
        }
      }
    } catch {
      // Keep static socratic prompt fallback on network failure
    } finally {
      setLoadingAi(false);
    }
  };

  const toggleTier = (tier: number) => {
    if (!unlockedTiers.includes(tier)) {
      setUnlockedTiers((prev) => [...prev, tier]);
      setOpenTiers((prev) => [...prev, tier]);

      // If opening Tier 3 for the first time, check for live AI hint
      if (tier === 3 && !isLiveAi) {
        fetchLiveAiHint();
      }
    } else {
      setOpenTiers((prev) =>
        prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
      );
    }
  };

  const unlockedCount = unlockedTiers.length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 border border-slate-800 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Bimbingan Bertahap Socratic
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              Petunjuk analitis terukur tanpa langsung membocorkan jawaban
            </p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded bg-slate-950 font-mono text-slate-300 border border-slate-800">
          {unlockedCount}/3 Terbuka
        </span>
      </div>

      {/* Tier 1: Konsep Kunci */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <button
          onClick={() => toggleTier(1)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/80 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center text-xs font-mono font-bold">
              1
            </div>
            <div>
              <span className="text-xs font-semibold text-white">
                Tier 1: Konsep & Strategi Awal
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                Prinsip matematis fundamental untuk membedah problem
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            {unlockedTiers.includes(1) ? (
              openTiers.includes(1) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            ) : (
              <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Buka
              </span>
            )}
          </div>
        </button>
        {unlockedTiers.includes(1) && openTiers.includes(1) && (
          <div className="px-4 pb-4 pt-2 border-t border-slate-800 text-xs text-slate-300 leading-relaxed bg-slate-900/60">
            <p>{question.hintConcept}</p>
          </div>
        )}
      </div>

      {/* Tier 2: Formula KaTeX */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <button
          onClick={() => toggleTier(2)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/80 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
              2
            </div>
            <div>
              <span className="text-xs font-semibold text-white">
                Tier 2: Teorema & Formula Relevan
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                Identitas rumus LaTeX spesifik yang diaplikasikan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            {unlockedTiers.includes(2) ? (
              openTiers.includes(2) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            ) : (
              <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Buka
              </span>
            )}
          </div>
        </button>
        {unlockedTiers.includes(2) && openTiers.includes(2) && (
          <div className="px-4 pb-4 pt-2 border-t border-slate-800 text-xs text-slate-300 leading-relaxed bg-slate-900/60">
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 text-center my-1">
              <MathRenderer content={question.hintFormula} />
            </div>
          </div>
        )}
      </div>

      {/* Tier 3: Bimbingan Socratic */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <button
          onClick={() => toggleTier(3)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/80 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 text-teal-400 flex items-center justify-center text-xs font-mono font-bold">
              3
            </div>
            <div>
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Tier 3: Pertanyaan Reflektif Socratic</span>
                <BrainCircuit className="w-3.5 h-3.5 text-teal-400" />
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                Pertanyaan pembimbing untuk memverifikasi kalkulasi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            {unlockedTiers.includes(3) ? (
              openTiers.includes(3) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            ) : (
              <span className="text-[11px] text-teal-400 font-medium flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Buka
              </span>
            )}
          </div>
        </button>
        {unlockedTiers.includes(3) && openTiers.includes(3) && (
          <div className="px-4 pb-4 pt-2 border-t border-slate-800 text-xs text-slate-300 leading-relaxed bg-slate-900/60">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 my-1 text-teal-200 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-teal-300 flex items-center gap-1.5 text-xs font-mono">
                  <Brain className="w-3.5 h-3.5" /> Arah Berpikir:
                </p>
                {isLiveAi ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    <Cpu className="w-3 h-3 text-teal-400" />
                    <span>OPENROUTER_LIVE_AI</span>
                  </span>
                ) : loadingAi ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Menghubungi AI...</span>
                  </span>
                ) : null}
              </div>
              <MathRenderer content={tier3Content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
