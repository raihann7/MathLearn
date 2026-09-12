import { TopicMasteryItem } from "@/lib/db/dashboard-queries";
import Link from "next/link";
import {
  TrendingUp,
  BrainCircuit,
  Fingerprint,
  ChevronRight,
  Boxes,
  Variable,
  DraftingCompass,
  Spline,
  Grid3X3,
  BarChart3,
} from "lucide-react";

interface MasteryOverviewProps {
  masteryList: TopicMasteryItem[];
}

const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Aljabar: Variable,
  Trigonometri: DraftingCompass,
  Kalkulus: Spline,
  Matriks: Grid3X3,
  Statistika: BarChart3,
};

export function MasteryOverview({ masteryList }: MasteryOverviewProps) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Penguasaan Kurikulum (Topic Mastery)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Indeks penguasaan dihitung dari akurasi latihan dan skor ujian anti-cheat
          </p>
        </div>

        <Link
          href="/topics"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          <span>Katalog Silabus</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3.5">
        {masteryList.map((item) => {
          let statusLabel = "Belum Diuji";
          let statusColor = "bg-slate-950 text-slate-400 border-slate-800";
          let barColor = "bg-slate-700";

          if (item.masteryLevel >= 80) {
            statusLabel = "Mahir (Advanced)";
            statusColor = "bg-emerald-950 text-emerald-300 border-emerald-800";
            barColor = "bg-emerald-500";
          } else if (item.masteryLevel >= 60) {
            statusLabel = "Kompeten (Solid)";
            statusColor = "bg-indigo-950 text-indigo-300 border-indigo-800";
            barColor = "bg-indigo-500";
          } else if (item.masteryLevel > 0) {
            statusLabel = "Tahap Latihan";
            statusColor = "bg-amber-950 text-amber-300 border-amber-800";
            barColor = "bg-amber-500";
          }

          return (
            <div
              key={item.topicId}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.topicTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      {(() => {
                        const CatIcon =
                          CATEGORY_ICON_MAP[item.category] || Boxes;
                        return <CatIcon className="w-3 h-3 text-indigo-400" />;
                      })()}
                      <span>{item.category}</span>
                    </span>
                    <span className="text-slate-700">•</span>
                    <span>Tingkat {item.difficulty}</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-300">
                      {item.quizzesTaken} Sesi Selesai
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border ${statusColor}`}
                  >
                    {statusLabel}
                  </span>
                  <span className="text-base font-black text-white w-12 text-right font-mono">
                    {item.masteryLevel}%
                  </span>
                </div>
              </div>

              {/* Precise Progress Bar */}
              <div className="w-full bg-slate-900 rounded h-1.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.max(2, Math.min(100, item.masteryLevel))}%` }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Link
                  href={`/practice/${item.topicId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  <BrainCircuit className="w-3 h-3 text-teal-400" />
                  <span>Latihan Soal</span>
                </Link>

                <Link
                  href={`/exam/${item.topicId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-amber-300 hover:text-amber-200 transition"
                >
                  <Fingerprint className="w-3 h-3 text-amber-400" />
                  <span>Ujian Resmi</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
