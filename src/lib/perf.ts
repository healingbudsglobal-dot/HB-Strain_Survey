/**
 * Lightweight in-page perf telemetry.
 * Logs to console + exposes window.__perf for ad-hoc inspection.
 */
type PerfEvent = { name: string; t: number; meta?: Record<string, unknown> };

declare global {
  interface Window {
    __perf?: {
      events: PerfEvent[];
      summary: () => void;
    };
  }
}

const events: PerfEvent[] = [];
const marks: Record<string, number> = {};

const push = (name: string, meta?: Record<string, unknown>) => {
  const t = performance.now();
  const ev = { name, t, meta };
  events.push(ev);
  if (events.length > 100) events.shift();
  // eslint-disable-next-line no-console
  console.log(`[perf] ${name}`, meta ?? "", `@${t.toFixed(1)}ms`);
};

if (typeof window !== "undefined") {
  window.__perf = {
    events,
    summary: () => {
      // eslint-disable-next-line no-console
      console.table(events.map((e) => ({ name: e.name, t: e.t.toFixed(1), ...e.meta })));
    },
  };
}

export const markFirstPaint = () => {
  push("react-mounted");
  // Report after the browser has had a chance to paint
  requestAnimationFrame(() => {
    const paints = performance.getEntriesByType("paint");
    paints.forEach((p) => push(p.name, { duration: Math.round(p.startTime) }));
  });
};

export const markScreenEnter = (screen: string) => {
  const lastExit = marks["__last_exit_t"];
  const gap = lastExit != null ? performance.now() - lastExit : 0;
  marks[`enter:${screen}`] = performance.now();
  push(`screen-enter:${screen}`, lastExit != null ? { gap_ms: Math.round(gap) } : undefined);
};

export const markScreenExit = (screen: string) => {
  marks["__last_exit_t"] = performance.now();
  push(`screen-exit:${screen}`);
};

export const markOtpReady = () => {
  const enter = marks["enter:otp"];
  const since = enter != null ? performance.now() - enter : 0;
  push("otp-render", { since_enter_ms: Math.round(since) });
};
