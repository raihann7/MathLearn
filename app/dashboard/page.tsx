import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getUserDashboardStats,
  getUserQuizHistory,
  getUserBookmarks,
} from "@/lib/db/dashboard-queries";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MasteryOverview } from "@/components/dashboard/mastery-overview";
import { QuizHistoryTable } from "@/components/dashboard/quiz-history-table";
import { SavedBookmarks } from "@/components/dashboard/saved-bookmarks";
import { ActiveExamBanner } from "@/components/dashboard/active-exam-banner";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  ShieldCheck,
  Compass,
  User,
  LogIn,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  const stats = await getUserDashboardStats(userId);
  const quizHistory = await getUserQuizHistory(userId);
  const bookmarks = await getUserBookmarks(userId);

  const isGuest = !session?.user;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Active In-Progress Official Exam Session */}
        <ActiveExamBanner />

        {/* Guest Preview Notice */}
        {isGuest && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Pratinjau Dashboard Siswa
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Data yang tampil adalah simulasi progres belajar lokal. Masuk untuk menyimpan riwayat permanen di cloud.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white border border-indigo-500 transition"
              >
                <span>Daftar Akun</span>
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Header Profile Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center font-bold text-base font-mono">
              {session?.user?.name ? (
                session.user.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {session?.user?.name
                  ? `Panel Evaluasi: ${session.user.name}`
                  : "Stasiun Analitika Pembelajaran"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Pantau akselerasi pemahaman matematika dan riwayat evaluasi Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold border border-indigo-500 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Katalog Kurikulum</span>
            </Link>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <StatsCards
          streakDays={stats.streakDays}
          totalQuizzes={stats.totalQuizzes}
          averageScore={stats.averageScore}
          highestScore={stats.highestScore}
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column: Mastery Progress & Quiz History */}
          <div className="lg:col-span-8 space-y-8">
            <MasteryOverview masteryList={stats.masteryByTopic} />
            <QuizHistoryTable history={quizHistory} />
          </div>

          {/* Right Sidebar Column: Saved Bookmarks & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <SavedBookmarks bookmarks={bookmarks} />

            {/* Quick Action Navigation Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Pintas Evaluasi</span>
              </h3>

              <div className="space-y-2 pt-1">
                <Link
                  href="/topics"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Eksplorasi Modul Teori</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {stats.masteryByTopic.length} Topik
                  </span>
                </Link>

                <Link
                  href="/topics/turunan-dan-aplikasi"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ujian Resmi (Anti-Cheat)</span>
                  </span>
                  <span className="text-amber-400 text-[11px] font-mono font-bold">
                    SIAP_UJI
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
