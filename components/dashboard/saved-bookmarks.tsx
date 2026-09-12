import { BookmarkItem } from "@/lib/db/dashboard-queries";
import Link from "next/link";
import { Bookmark, BookOpen, ChevronRight } from "lucide-react";

interface SavedBookmarksProps {
  bookmarks: BookmarkItem[];
}

export function SavedBookmarks({ bookmarks }: SavedBookmarksProps) {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
        <Bookmark className="w-6 h-6 text-slate-600 mx-auto" />
        <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
          Belum Ada Modul Disimpan
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Tandai modul pembelajaran penting saat membaca materi untuk kemudahan akses cepat di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-indigo-400" />
          <span>Modul Terfavorit (Bookmarks)</span>
        </h2>
        <span className="text-xs font-mono text-slate-400">
          {bookmarks.length} Modul
        </span>
      </div>

      <div className="space-y-2">
        {bookmarks.map((bm) => (
          <Link
            key={bm.id}
            href={`/topics/${bm.topicSlug}/materials/${bm.materialSlug}`}
            className="group flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center shrink-0 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition">
                  {bm.materialTitle}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Topik: {bm.topicTitle}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
