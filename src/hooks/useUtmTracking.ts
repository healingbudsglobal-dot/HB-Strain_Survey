import { useEffect, useState } from "react";

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  campaign_slug?: string;
  variant?: string;
  referrer?: string;
  landing_page?: string;
  device_type?: string;
  browser?: string;
}

const STORAGE_KEY = "hb_utm_v1";
const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ttclid",
] as const;

function detectDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "safari";
  if (ua.includes("Firefox/")) return "firefox";
  return "other";
}

function readStored(): UtmData {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStored(data: UtmData) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/**
 * Captures UTM + click-id params on first load and persists them in sessionStorage
 * so every downstream submission carries the same attribution.
 *
 * Also captures referrer, landing page, device, browser.
 * Supports `?c={campaign-slug}` shorthand for trackable campaign URLs.
 */
export function useUtmTracking(): UtmData {
  const [data, setData] = useState<UtmData>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const stored = readStored();
    const next: UtmData = { ...stored };

    let captured = false;
    TRACKED_PARAMS.forEach((p) => {
      const v = params.get(p);
      if (v) {
        next[p] = v;
        captured = true;
      }
    });

    // Shorthand: ?c=campaign-slug
    const slug = params.get("c") || params.get("campaign");
    if (slug) {
      next.campaign_slug = slug;
      // If no explicit utm_campaign, fall back to slug
      if (!next.utm_campaign) next.utm_campaign = slug;
      captured = true;
    }

    // A/B variant override
    const variant = params.get("v") || params.get("variant");
    if (variant) {
      next.variant = variant;
      captured = true;
    }

    // Always refresh ambient context (cheap)
    next.referrer = next.referrer || document.referrer || undefined;
    next.landing_page = next.landing_page || window.location.pathname + window.location.search;
    next.device_type = detectDevice();
    next.browser = detectBrowser();

    if (captured || Object.keys(stored).length === 0) {
      writeStored(next);
    }
    setData(next);
  }, []);

  return data;
}

/** Pure helper to merge UTM data into a flat string payload for edge-function submission. */
export function utmToPayload(utm: UtmData): Record<string, string> {
  const out: Record<string, string> = {};
  (Object.keys(utm) as (keyof UtmData)[]).forEach((k) => {
    const v = utm[k];
    if (v) out[k] = String(v);
  });
  return out;
}
