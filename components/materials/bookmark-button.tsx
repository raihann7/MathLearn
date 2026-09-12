"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  materialId: string;
}

export function BookmarkButton({ materialId }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await fetch(`/api/bookmarks?materialId=${materialId}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setIsBookmarked(data.bookmarked);
        }
      } catch (err) {
        console.error("Failed to check bookmark status:", err);
      }
    }
    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [materialId, session]);

  const handleToggle = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.bookmarked);
        setMessage(data.message);
        setTimeout(() => setMessage(null), 2500);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
          isBookmarked
            ? "bg-amber-950/70 border-amber-850 text-amber-300 hover:bg-amber-900/60"
            : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
        title={isBookmarked ? "Hapus dari Bookmark" : "Simpan materi ini"}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isBookmarked ? (
          <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
        ) : (
          <Bookmark className="w-3.5 h-3.5" />
        )}
        <span>{isBookmarked ? "Tersimpan" : "Bookmark"}</span>
      </button>

      {message && (
        <div className="absolute right-0 top-full mt-1.5 z-20 whitespace-nowrap px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-200 border border-slate-700 shadow-lg animate-in fade-in">
          {message}
        </div>
      )}
    </div>
  );
}
