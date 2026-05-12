# Trim expensive filters/blurs on the squeeze page

The squeeze page currently composites many large blurred layers + multi-stop `drop-shadow()` filter stacks every frame. On mobile GPUs each filter region forces an offscreen pass; combined with `backdrop-filter: blur(24px) saturate(160%)` on the form, animated `glassDrift`/`glassSheen`/`nervePulse`, and a 4-stop drop-shadow on the headline — scroll/animation can stutter.

Strategy: keep the desktop look intact, gate the heaviest effects behind the existing `disableAurora` flag (true on mobile or `prefers-reduced-motion`), and shrink/collapse blur radii where the visual delta is imperceptible.

## Changes

**`src/components/BrandLogo.tsx`**
- Accept already-existing call sites; add an internal `useIsMobile()` (or a new `lite?: boolean` prop — preferred: read `useIsMobile()` once so consumers don't change).
- On mobile / reduced motion:
  - Reduce `ETCH_FILTER` from 4 drop-shadows to 2: keep top highlight + bottom shadow, drop the 2px contact + 8px ambient.
  - Reduce vignette `blur(8px|6px)` → `blur(4px|3px)`.
  - Skip the fiber-texture layer entirely (it adds an extra masked composited layer for near-zero perceived value at small sizes).

**`src/components/SqueezeScreen.tsx`** — gate behind `disableAurora` (already computed, line 53):
1. **Logo nerve-signal** (lines 144-191): when `disableAurora`, render only the primary sweep gradient (drop the trailing ember + pink spark + 28px-blur pulse). Keeps the wow on desktop, removes 3 blurred composited layers on mobile.
2. **Headline embossed text** (lines 222-224, 239-240): reduce both `drop-shadow` stacks from 4 stops to 2 (top highlight + bottom shadow). Drop the 22px / 28px outer glows when `disableAurora`.
3. **Form backdrop-filter** (lines 423-424): reduce `blur(24px) saturate(160%)` → `blur(12px) saturate(130%)` when `disableAurora`. (`backdrop-filter` over a large rounded rect is the single biggest mobile cost.)
4. **Conic sheen** (lines 436-445): when `disableAurora`, set `display: none` (already animated 18s, but the 40px blur on a large conic gradient is expensive).
5. **Chromatic blobs** (lines 467-486): when `disableAurora`, reduce `blur(28px|32px)` → `blur(16px|18px)` and stop the `glassDrift` animation (already covered by reduced-motion CSS, but explicit gate avoids GPU upload churn).
6. **Ambient logo halo** (line 193): the `blur-3xl` (~64px) on a `scale-2` rounded full bg is huge — when `disableAurora`, swap to `blur-2xl` (40px) and remove `scale-[2]` (use `scale-[1.4]`).
7. **CTA halo** (line 774): reduce `blur(22px)` → `blur(14px)` on mobile.

No changes to layout, copy, color tokens, click handlers, or animation timing on desktop. Reduced-motion users automatically get the lite path via `disableAurora`.

## Technical notes

- All gates inline via `disableAurora ? <lite> : <full>` ternaries on existing style objects — no new state, no new components.
- BrandLogo gains one internal hook call; props API unchanged so SqueezeScreen / ContactCapture / OtpVerification / SurveyFlow consumers stay identical.
- Filter-region cost ≈ pixel-area × pass-count. Cutting blur radii roughly halves the offscreen buffer; eliminating layers is multiplicative.
- No new dependencies, no asset changes.

## Verification

- Visual diff at desktop viewport: nerve sweep, embossed headline, glass form, drift blobs all unchanged.
- Mobile viewport (390×844) via `set_preview_device_viewport`: confirm logo still legible/etched, form still glassy, no visible banding.
- `browser--performance_profile` before/after on mobile viewport: expect lower script + paint cost during scroll/idle.
- `tsc --noEmit` clean.

## Out of scope

- No removal of any animation desktop users see today.
- No restructuring of SqueezeScreen layout or BrandLogo public API.
- No changes to ContactCapture / OTP / SurveyFlow surfaces beyond what BrandLogo's internal mobile gate gives them automatically.
