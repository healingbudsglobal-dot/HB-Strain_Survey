import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "hb_utm_v1";

function readUtm(): Record<string, unknown> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Fire-and-forget event tracker. Inserts a row into lead_events via the
 * `track-event` edge function with full UTM/source attribution attached.
 *
 * Uses sendBeacon when available so the request survives navigation
 * (e.g. when the user is being sent off to wa.me in a new tab).
 */
export function trackEvent(
  event_type: string,
  opts: { email?: string; payload?: Record<string, unknown> } = {}
): void {
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
  supabase.functions.invoke("track-event", { body }).catch((err) => {
    console.warn("trackEvent failed:", err);
  });
}
