"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getActiveExamSession,
  ActiveExamSession,
  EXAM_EVENT_NAME,
} from "@/lib/exam-storage";
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  FileEdit,
  CheckCircle2,
} from "lucide-react";

export function ActiveExamBanner() {
  const [session, setSession] = useState<ActiveExamSession | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Initial fetch
    const current = getActiveExamSession();
    setSession(current);
    if (current) {
      setSecondsRemaining(
        Math.max(0, Math.floor((current.expiresAt - Date.now()) / 1000))
      );
    }

    // Listener for local changes
    const handleSessionChange = () => {
      const updated = getActiveExamSession();
      setSession(updated);
      if (updated) {
        setSecondsRemaining(
          Math.max(0, Math.floor((updated.expiresAt - Date.now()) / 1000))
        );
      } else {
        setSecondsRemaining(null);
      }
    };

    window.addEventListener(EXAM_EVENT_NAME, handleSessionChange);
    window.addEventListener("storage", handleSessionChange);

    // Live countdown interval
    const interval = setInterval(() => {
      const active = getActiveExamSession();
      if (!active) {
        setSession(null);
        setSecondsRemaining(null);
        return;
      }

      const remaining = Math.max(
        0,
        Math.floor((active.expiresAt - Date.now()) / 1000)
      );
      setSecondsRemaining(remaining);
    }, 1000);

    return () => {
      window.removeEventListener(EXAM_EVENT_NAME, handleSessionChange);
      window.removeEventListener("storage", handleSessionChange);
      clearInterval(interval);
    };
  }, []);

  if (!session || session.status !== "IN_PROGRESS") {
    return null;
  }

  const isExpired = secondsRemaining !== null && secondsRemaining <= 0;
  const minutes = secondsRemaining !== null ? Math.floor(secondsRemaining / 60) : 0;
  const seconds = secondsRemaining !== null ? secondsRemaining % 60 : 0;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const answeredCount = Object.keys(session.answers || {}).length;
  const totalCount = session.questionIds?.length || 0;
  const percentAnswered =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  const isCritical = secondsRemaining !== null && secondsRemaining <= 60;
  const isWarning =
    secondsRemaining !== null && secondsRemaining <= 180 && secondsRemaining > 60;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-600/60 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-5 sm:p-6 shadow-xl shadow-amber-950/20 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              SESI UJIAN AKTIF (REALTIME)
            </span>

            {session.tabSwitches > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>{session.tabSwitches}x Switch Tab</span>
              </span>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{session.topicTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Sesi ujian resmi Anda terputus atau dialihkan. Waktu terus berjalan secara realtime dan progres jawaban Anda tetap tersimpan.
            </p>
          </div>

          {/* Progress & Integrity status */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <FileEdit className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                Jawaban: <strong className="text-white">{answeredCount}</strong>/{totalCount} Soal ({percentAnswered}%)
              </span>
            </div>

            <div className="w-24 sm:w-32 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentAnswered}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Timer & CTA Action */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono font-bold text-sm sm:text-base ${
              isExpired
                ? "bg-rose-950 text-rose-300 border-rose-700 animate-pulse"
                : isCritical
                ? "bg-rose-950 text-rose-300 border-rose-700 animate-pulse"
                : isWarning
                ? "bg-amber-950 text-amber-300 border-amber-700"
                : "bg-slate-950 text-slate-200 border-slate-800"
            }`}
          >
            {isExpired ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>WAKTU HABIS</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{formattedTime}</span>
              </>
            )}
          </div>

          <Link
            href={`/exam/${session.topicSlug || session.topicId}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition group"
          >
            {isExpired ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Kumpulkan Ujian Sekarang</span>
              </>
            ) : (
              <>
                <span>Lanjutkan Ujian Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
