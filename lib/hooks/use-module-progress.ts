"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

const LOCAL_STORAGE_KEY = "mathlearn_completed_materials";
const LAST_VISITED_KEY = "mathlearn_last_visited_materials";
const PROGRESS_EVENT = "mathlearn:module-progress-updated";

export function useModuleProgress(topicId?: string) {
  const { data: session } = useSession();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Read from localStorage safely
  const getLocalCompletions = useCallback((): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  // Save to localStorage safely
  const setLocalCompletions = useCallback((ids: string[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: ids }));
    } catch {
      // ignore
    }
  }, []);

  // Load completions on mount / user change
  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      setIsLoading(true);
      const local = getLocalCompletions();

      if (isMounted) {
        setCompletedIds(local);
      }

      // If user is logged in, sync with database
      if (session?.user) {
        try {
          const url = topicId
            ? `/api/materials/progress?topicId=${encodeURIComponent(topicId)}`
            : "/api/materials/progress";
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.completedMaterialIds && Array.isArray(data.completedMaterialIds)) {
              // Merge local and remote
              const merged = Array.from(
                new Set([...local, ...data.completedMaterialIds])
              );
              if (isMounted) {
                setCompletedIds(merged);
                setLocalCompletions(merged);
              }
            }
          }
        } catch (err) {
          console.error("Gagal sinkronisasi progres modul:", err);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    loadProgress();

    // Listen to custom event for real-time sync across components
    const handleProgressUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (customEvent.detail && isMounted) {
        setCompletedIds(customEvent.detail);
      }
    };

    window.addEventListener(PROGRESS_EVENT, handleProgressUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(PROGRESS_EVENT, handleProgressUpdate);
    };
  }, [session, topicId, getLocalCompletions, setLocalCompletions]);

  // Check if a material is completed (checks both ID and slug)
  const isCompleted = useCallback(
    (materialId: string, materialSlug?: string) => {
      if (completedIds.includes(materialId)) return true;
      if (materialSlug && completedIds.includes(materialSlug)) return true;
      return false;
    },
    [completedIds]
  );

  // Toggle or set completion status
  const setMaterialCompletion = useCallback(
    async (
      materialId: string,
      targetTopicId: string,
      completed: boolean,
      materialSlug?: string
    ) => {
      // Optimistic update
      const current = getLocalCompletions();
      let updated: string[];

      const identifiersToRemove = [materialId, materialSlug].filter(Boolean) as string[];

      if (completed) {
        updated = Array.from(new Set([...current, materialId, ...(materialSlug ? [materialSlug] : [])]));
      } else {
        updated = current.filter((id) => !identifiersToRemove.includes(id));
      }

      setCompletedIds(updated);
      setLocalCompletions(updated);

      // Background DB sync if logged in
      if (session?.user) {
        try {
          await fetch("/api/materials/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              materialId,
              topicId: targetTopicId,
              completed,
            }),
          });
        } catch (err) {
          console.error("Gagal menyimpan status modul ke server:", err);
        }
      }

      return completed;
    },
    [getLocalCompletions, setLocalCompletions, session]
  );

  // Record last visited module for a topic
  const recordLastVisited = useCallback((topicSlugOrId: string, materialSlug: string) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(LAST_VISITED_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[topicSlugOrId] = materialSlug;
      localStorage.setItem(LAST_VISITED_KEY, JSON.stringify(parsed));
    } catch {
      // ignore
    }
  }, []);

  // Get last visited module for a topic
  const getLastVisited = useCallback((topicSlugOrId: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(LAST_VISITED_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed[topicSlugOrId] || null;
    } catch {
      return null;
    }
  }, []);

  return {
    completedIds,
    isLoading,
    isCompleted,
    setMaterialCompletion,
    recordLastVisited,
    getLastVisited,
  };
}
