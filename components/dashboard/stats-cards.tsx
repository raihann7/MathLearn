import { Flame, Trophy, CheckCircle2, Target } from "lucide-react";

interface StatsCardsProps {
  streakDays: number;
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
}

export function StatsCards({
  streakDays,
  totalQuizzes,
  averageScore,
  highestScore,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Daily Streak Card */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono text-amber-400 font-semibold">
            DAILY_STREAK
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 border border-slate-800 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="text-xl sm:text-3xl font-black text-white font-mono">
            {streakDays} <span className="text-xs sm:text-sm font-normal text-slate-400">Hari</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2">
            {streakDays >= 3
              ? "Konsistensi belajar terjaga optimal."
              : "Selesaikan 1 kuis untuk memicu streak harian."}
          </p>
        </div>
      </div>

      {/* Total Selesai */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono text-indigo-400 font-semibold">
            TOTAL_COMPLETED
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-indigo-400 border border-slate-800 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="text-xl sm:text-3xl font-black text-white font-mono">
            {totalQuizzes} <span className="text-xs sm:text-sm font-normal text-slate-400">Sesi</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2">
            Total modul latihan & ujian terselesaikan
          </p>
        </div>
      </div>

      {/* Average Score */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono text-teal-400 font-semibold">
            AVG_ACCURACY
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-teal-400 border border-slate-800 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="text-xl sm:text-3xl font-black text-teal-400 font-mono">
            {averageScore}%
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2">
            Rasio akurasi kalkulasi seluruh topik
          </p>
        </div>
      </div>

      {/* Highest Score */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono text-purple-400 font-semibold">
            PEAK_EVALUATION
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-purple-400 border border-slate-800 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="text-xl sm:text-3xl font-black text-purple-400 font-mono">
            {highestScore}%
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2">
            Pencapaian skor ujian terbaik tercatat
          </p>
        </div>
      </div>
    </div>
  );
}
