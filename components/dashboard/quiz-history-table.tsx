import { QuizHistoryItem } from "@/lib/db/dashboard-queries";
import {
  History,
  ShieldAlert,
  ShieldCheck,
  BrainCircuit,
  Fingerprint,
} from "lucide-react";

interface QuizHistoryTableProps {
  history: QuizHistoryItem[];
}

export function QuizHistoryTable({ history }: QuizHistoryTableProps) {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
        <History className="w-8 h-8 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">
          Belum Ada Catatan Riwayat Sesi
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Selesaikan modul latihan interaktif atau ujian anti-cheat untuk mulai merekam progres analitis Anda di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Buku Catatan Sesi Terakhir</span>
        </h2>
        <span className="text-xs font-mono text-slate-400">
          {history.length} Sesi Terakhir
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <th className="pb-3 px-3">MODE</th>
              <th className="pb-3 px-3">SILABUS MATEMATIKA</th>
              <th className="pb-3 px-3 text-center">SKOR</th>
              <th className="pb-3 px-3 text-center">DURASI</th>
              <th className="pb-3 px-3 text-right">INTEGRITAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {history.map((row) => {
              const minutes = Math.floor(row.timeTakenSec / 60);
              const seconds = row.timeTakenSec % 60;
              const formattedDuration = `${minutes}m ${seconds}s`;
              const isPassed = row.score >= 70;

              return (
                <tr
                  key={row.id}
                  className="hover:bg-slate-950/60 transition"
                >
                  {/* Mode Badge */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                        row.mode === "EXAM"
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-teal-950 text-teal-300 border-teal-800"
                      }`}
                    >
                      {row.mode === "EXAM" ? (
                        <>
                          <Fingerprint className="w-3 h-3 text-amber-400" />
                          <span>EXAM</span>
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="w-3 h-3 text-teal-400" />
                          <span>PRACTICE</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Topic Title */}
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">
                    {row.topicTitle}
                  </td>

                  {/* Score */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-black ${
                        isPassed ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {row.score}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {row.correctCount}/{row.totalQuestions} Benar
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3 text-center text-slate-400">
                    {formattedDuration}
                  </td>

                  {/* Integrity Status */}
                  <td className="py-3 px-3 text-right">
                    {row.mode === "EXAM" ? (
                      row.tabSwitches > 3 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          <span>Penalti ({row.tabSwitches}x)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Aman ({row.tabSwitches}x)</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
