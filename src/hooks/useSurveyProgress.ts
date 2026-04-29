import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hb_survey_progress_v1";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface StoredProgress {
  answers: Record<string, string>;
  index: number;
  savedAt: number;
}

/** Persist survey answers + position so a refresh / accidental close doesn't lose progress. */
export function useSurveyProgress() {
  const [hydrated, setHydrated] = useState(false);
  const [initial, setInitial] = useState<StoredProgress | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredProgress;
        if (parsed.savedAt && Date.now() - parsed.savedAt < TTL_MS) {
          setInitial(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const save = useCallback((answers: Record<string, string>, index: number) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, index, savedAt: Date.now() } satisfies StoredProgress)
      );
    } catch {
      /* ignore */
    }
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { hydrated, initial, save, clear };
}
