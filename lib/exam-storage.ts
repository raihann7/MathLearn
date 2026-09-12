"use client";

export interface ActiveExamSession {
  topicId: string;
  topicTitle: string;
  topicSlug: string;
  startedAt: number; // timestamp in ms
  expiresAt: number; // timestamp in ms
  durationSec: number; // total allotted duration
  questionIds: string[];
  answers: Record<string, string>;
  flagged: Record<string, boolean>;
  tabSwitches: number;
  currentIndex: number;
  status: "IN_PROGRESS" | "COMPLETED";
}

const STORAGE_KEY = "mathlearn_active_exam";
export const EXAM_EVENT_NAME = "exam-session-change";

/**
 * Mengambil sesi ujian yang sedang aktif dari localStorage
 */
export function getActiveExamSession(): ActiveExamSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session: ActiveExamSession = JSON.parse(raw);
    if (!session || !session.topicId || session.status !== "IN_PROGRESS") {
      return null;
    }

    // Jika sudah lewat 24 jam dari expiry, bersihkan sesi lama yang kadaluarsa
    const oneDayPastExpiry = session.expiresAt + 24 * 60 * 60 * 1000;
    if (Date.now() > oneDayPastExpiry) {
      clearActiveExamSession();
      return null;
    }

    return session;
  } catch (err) {
    console.error("Gagal membaca active exam session:", err);
    return null;
  }
}

/**
 * Menyimpan atau memperbarui sesi ujian aktif
 */
export function saveActiveExamSession(session: ActiveExamSession): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    window.dispatchEvent(
      new CustomEvent(EXAM_EVENT_NAME, { detail: session })
    );
  } catch (err) {
    console.error("Gagal menyimpan active exam session:", err);
  }
}

/**
 * Memperbarui data parsial sesi ujian (jawaban, nomor aktif, tab switch)
 */
export function updateActiveExamSession(
  partial: Partial<ActiveExamSession>
): ActiveExamSession | null {
  const current = getActiveExamSession();
  if (!current) return null;

  const updated: ActiveExamSession = {
    ...current,
    ...partial,
  };

  saveActiveExamSession(updated);
  return updated;
}

/**
 * Menghapus sesi ujian aktif (setelah ujian dikumpulkan atau dibatalkan)
 */
export function clearActiveExamSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(EXAM_EVENT_NAME, { detail: null })
    );
  } catch (err) {
    console.error("Gagal menghapus active exam session:", err);
  }
}

/**
 * Menghitung sisa detik secara presisi berdasarkan absolute wall-clock (expiresAt)
 */
export function getRemainingSeconds(session: ActiveExamSession): number {
  const remainingMs = session.expiresAt - Date.now();
  return Math.max(0, Math.floor(remainingMs / 1000));
}
