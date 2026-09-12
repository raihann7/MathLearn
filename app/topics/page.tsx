import { getTopics } from "@/lib/db/queries";
import { TopicCard } from "@/components/topics/topic-card";
import { TopicFilter } from "@/components/topics/topic-filter";
import { BookOpen, GraduationCap } from "lucide-react";
import { Suspense } from "react";

interface TopicsPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
  const params = await searchParams;
  const topics = await getTopics({
    category: params.category,
    difficulty: params.difficulty,
    sort: params.sort,
    search: params.q,
  });

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 border-b border-slate-800/80 pb-6 sm:flex sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-indigo-500/30 text-[11px] font-mono font-medium text-indigo-300 mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>KURIKULUM STEM TERSTRUKTUR</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Katalog Topik Matematika
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pilih topik silabus untuk mempelajari konsep teori analitik, menurunkan formula LaTeX,
              dan menguji pemahaman dengan kalkulasi coretan langsung.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-xs font-mono text-slate-400">
            Total Topik: <span className="text-indigo-400 font-bold">{topics.length}</span>
          </div>
        </div>

        {/* Filter Controls with Suspense */}
        <Suspense fallback={<div className="h-28 bg-slate-900 animate-pulse rounded-2xl mb-8 border border-slate-800" />}>
          <TopicFilter />
        </Suspense>

        {/* Topics Grid */}
        {topics.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">Tidak ada topik yang sesuai</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Silakan sesuaikan kata kunci pencarian atau reset filter kategori dan tingkat kesulitan di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
