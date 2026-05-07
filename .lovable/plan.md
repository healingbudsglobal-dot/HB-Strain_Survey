## Goal

Two related additions:

1. **Reduced-motion support** — honor `prefers-reduced-motion: reduce` so flicker-prone animations are disabled at the OS level.
2. **Timing telemetry** — measure first paint, screen-swap duration, and OTP render so we can verify the flicker gap is gone and catch regressions.

---

## 1. Reduced-motion support

### CSS-level kill switch (`src/index.css`)

Append a global `@media (prefers-reduced-motion: reduce)` block that:
- Sets `animation-duration: 0.001ms !important` and `transition-duration: 0.001ms !important` on `*, *::before, *::after`.
- Removes `mix-blend-mode`, `backdrop-filter`, and heavy `filter: blur(...)` on ambient layers (`.hero-backdrop`, `BudAmbient`, `NeuronAmbient`, `AmbientParticles` root).
- Disables the `animate-pulse-glow`, `auroraShift`, `caret-blink`, and any infinite keyframes.

This catches every framer-motion and Tailwind animation in one shot — no per-component refactor needed.

### Component-level guards

Use framer-motion's `useReducedMotion()` in:
- `src/pages/Index.tsx` — when reduced, skip the `AnimatePresence` opacity swap entirely (render the active screen directly).
- `src/components/HeroBackdrop.tsx` — already has a `lite` mode; force `lite=true` when reduced.
- `src/components/BudAmbient.tsx` — return `null` when reduced (pure decorative).
- `src/components/NeuronAmbient.tsx`, `src/components/AmbientParticles.tsx` — return `null` when reduced.
- `src/components/LoadingScreen.tsx` — replace the DNA helix + spinning ring with a static spinner SVG when reduced.
- `src/components/SuccessScreen.tsx` — drop the radial halo, keep static layout.

---

## 2. Timing telemetry

A tiny instrumentation module that logs to `console` and exposes a `window.__perf` object for quick inspection.

### New file: `src/lib/perf.ts`

Exports:
- `markFirstPaint()` — called once from `src/main.tsx` after `createRoot().render(...)`. Reads `performance.getEntriesByType('paint')` to log FP and FCP, plus `performance.now()` as "react-mounted".
- `markScreenEnter(screen: string)` — called when a new screen becomes the active screen. Logs ms since previous `markScreenExit` (the swap gap) and stores the timestamp.
- `markScreenExit(screen: string)` — called from the previous screen's unmount. Records exit time.
- `markOtpReady()` — called from `OtpVerification` mount effect. Logs ms from "otp" screen swap → first OTP paint.
- All entries pushed to `window.__perf = { events: [...], summary() }` for ad-hoc inspection.

### Wiring

- `src/main.tsx` — call `markFirstPaint()` after render.
- `src/pages/Index.tsx` — `useEffect` keyed on `screen` to call `markScreenEnter(screen)`; cleanup calls `markScreenExit(screen)`.
- `src/components/OtpVerification.tsx` — `useEffect(() => markOtpReady(), [])` on mount. Use `requestAnimationFrame` so it fires after first paint, not before.

### Output format

Each event logs as:
```
[perf] otp-render: 42ms (since screen-enter)
[perf] screen-swap squeeze→otp: 18ms gap
```

`window.__perf.summary()` prints a table of the last 50 events.

---

## Technical details

- No new dependencies — `useReducedMotion` ships with framer-motion (already installed).
- Telemetry is dev-friendly but kept in production builds (it's <1KB, console-only, no network).
- The CSS reduced-motion block is the single highest-leverage change for residual flicker; component guards are belt-and-braces for any animation that escapes CSS (e.g., framer-motion driving inline styles).

## Files touched

- `src/index.css` (append reduced-motion block)
- `src/lib/perf.ts` (new)
- `src/main.tsx` (call `markFirstPaint`)
- `src/pages/Index.tsx` (reduced-motion guard + screen markers)
- `src/components/HeroBackdrop.tsx` (force lite when reduced)
- `src/components/BudAmbient.tsx` (null when reduced)
- `src/components/NeuronAmbient.tsx` (null when reduced)
- `src/components/AmbientParticles.tsx` (null when reduced)
- `src/components/LoadingScreen.tsx` (static fallback when reduced)
- `src/components/SuccessScreen.tsx` (drop halo when reduced)
- `src/components/OtpVerification.tsx` (call `markOtpReady`)
