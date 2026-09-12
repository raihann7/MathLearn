"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";

interface AntiCheatGuardProps {
  tabSwitches: number;
  onViolation: () => void;
  isCompleted: boolean;
}

export function AntiCheatGuard({
  tabSwitches,
  onViolation,
  isCompleted,
}: AntiCheatGuardProps) {
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    if (isCompleted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onViolation();
        setShowWarningModal(true);
      }
    };

    const handleWindowBlur = () => {
      onViolation();
      setShowWarningModal(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isCompleted, onViolation]);

  return (
    <>
      {/* Mini Status Badge in Header */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold ${
          tabSwitches > 3
            ? "bg-rose-950 text-rose-300 border-rose-800"
            : tabSwitches > 0
            ? "bg-amber-950 text-amber-300 border-amber-800"
            : "bg-slate-950 text-slate-300 border-slate-800"
        }`}
        title="Sistem pengawasan integritas ujian MathLearn"
      >
        {tabSwitches > 0 ? (
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span className="hidden sm:inline">INTEGRITAS:</span>
        <span>
          {tabSwitches === 0 ? "AMAN (0x)" : `${tabSwitches}x SWITCH`}
        </span>
      </div>

      {/* Warning Overlay Modal when tab switch is detected */}
      {showWarningModal && !isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-slate-900 border border-amber-600 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 border border-amber-600/50 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Peringatan Integritas Ujian
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Anda terdeteksi berpindah tab atau meninggalkan jendela browser.
              Sistem mencatat aktivitas ini secara otomatis untuk validasi penilaian.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Total Pelanggaran Layar:</span>
              <p
                className={`text-xl font-black mt-0.5 ${
                  tabSwitches > 3 ? "text-rose-400" : "text-amber-400"
                }`}
              >
                {tabSwitches} Kali
              </p>
              {tabSwitches > 3 ? (
                <p className="text-rose-400 text-[11px] mt-1 font-sans">
                  ⚠️ Toleransi maksimal (3x) telah terlampaui. Skor akhir akan dikenakan penalti integritas otomatis.
                </p>
              ) : (
                <p className="text-slate-500 text-[11px] mt-1 font-sans">
                  Batas toleransi maksimal: 3 kali perpindahan tab.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm border border-amber-400 transition"
            >
              Saya Mengerti & Lanjutkan Ujian
            </button>
          </div>
        </div>
      )}
    </>
  );
}
