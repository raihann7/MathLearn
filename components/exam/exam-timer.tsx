"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface ExamTimerProps {
  initialSeconds: number;
  expiresAt?: number;
  isPaused: boolean;
  onTimeUp: () => void;
  onTick?: (secondsRemaining: number) => void;
}

export function ExamTimer({
  initialSeconds,
  expiresAt,
  isPaused,
  onTimeUp,
  onTick,
}: ExamTimerProps) {
  const calculateRemaining = () => {
    if (expiresAt) {
      return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    }
    return initialSeconds;
  };

  const [secondsRemaining, setSecondsRemaining] = useState(calculateRemaining);

  useEffect(() => {
    if (isPaused) return;

    // Sync immediately on mount or expiresAt change
    const initial = calculateRemaining();
    setSecondsRemaining(initial);
    if (onTick) onTick(initial);

    if (initial <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      const currentRemaining = calculateRemaining();
      setSecondsRemaining(currentRemaining);
      if (onTick) onTick(currentRemaining);

      if (currentRemaining <= 0) {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, expiresAt, onTimeUp, onTick]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const isWarning = secondsRemaining <= 180 && secondsRemaining > 60;
  const isCritical = secondsRemaining <= 60;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs sm:text-sm font-bold transition ${
        isCritical
          ? "bg-rose-950 text-rose-300 border-rose-700 animate-pulse"
          : isWarning
          ? "bg-amber-950 text-amber-300 border-amber-700"
          : "bg-slate-950 text-slate-200 border-slate-800"
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      ) : (
        <Clock
          className={`w-3.5 h-3.5 shrink-0 ${
            isWarning ? "text-amber-400" : "text-indigo-400"
          }`}
        />
      )}
      <span>{formattedTime}</span>
    </div>
  );
}
