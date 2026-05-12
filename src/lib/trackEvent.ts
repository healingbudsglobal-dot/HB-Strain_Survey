import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "hb_utm_v1";
const DEDUPE_MS = 5000;

/** In-memory dedupe buffer — keys expire after DEDUPE_MS */
const RECENT = new Map<string, number>();

function readUtm(): Record<string, unknown> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function makeDedupeKey(
  event_type: string,
  opts: { email?: string; payload?: Record<string, unknown> }
): string {
  const p = opts.payload ?? {};
  return [
    event_type,
    opts.email ?? "",
    String(p.recipient ?? ""),
    String(p.strain ?? ""),
  ].join("|");
}

function pruneExpired(): void {
  const cutoff = Date.now() - DEDUPE_MS;
  for (const [k, ts] of RECENT) {
    if (ts < cutoff) RECENT.delete(k);
  }
}

/**
 * Fire-and-forget event tracker with deduplication and throttling.
 * Identical events within 5s are dropped to prevent double-tap duplicates.
 * Returns a Promise so callers can await before navigating away.
 */
export async function trackEvent(
  event_type: string,
  opts: { email?: string; payload?: Record<string, unknown> } = {}
): Promise<void> {
  const key = makeDedupeKey(event_type, opts);
  const last = RECENT.get(key);
  if (last && Date.now() - last < DEDUPE_MS) {
    return; // deduped
  }
  RECENT.set(key, Date.now());
  pruneExpired();

  const utm = readUtm();
  const body = {
    event_type,
    email: opts.email,
    payload: {
      ...utm,
      ...(opts.payload ?? {}),
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
      ts: new Date().toISOString(),
    },
  };

  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-event`;
    const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
  } catch {
    /* fall through to fetch */
  }

  // Fallback — supabase-js invoke (handles auth headers automatically)
  await supabase.functions.invoke("track-event", { body }).catch((err) => {
    console.warn("trackEvent failed:", err);
  });
}
