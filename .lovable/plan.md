## Goal

Keep the **current glass design language** of the squeeze card but elevate the craft to "award-winning" — the kind of detailing seen on Awwwards / FWA dev portfolios. No structural rework, no new fields, no copy changes.

## What's already there (keep)

- Organic morphing rounded card, deep teal glass with `backdrop-blur(24px) saturate(160%)`.
- Etched logo, dark vignette behind it, mint accent halos.
- Email input with floating label + bottom progress wire.
- Custom Province `Select` and animated consent checkbox.
- Gradient mint CTA with sheen sweep.

## What changes (polish only — single file: `src/components/SqueezeScreen.tsx` + a few keyframes in `src/index.css`)

### 1. Card surface — depth & light
- Layered glass: keep blur, add a faint **inner top-edge highlight** (`box-shadow: inset 0 1px 0 hsl(160 60% 90% / 0.08)`) and **inner bottom soft shadow** for a real lensed feel.
- Add a slow-drifting **conic-gradient sheen** overlay (very low opacity, `mix-blend-overlay`, 18 s loop) so the glass subtly catches light when idle.
- Soften the morph easing from linear/keyframed to a 12 s cubic-bezier, so the radius breathes instead of ticking.

### 2. Cursor-reactive parallax
- On pointer move over the card, tilt the inner content ±2° / translate orbs ±8 px using `motion`'s `useMotionValue` + `useSpring` (no library add). Disabled on touch and when `prefers-reduced-motion`.
- Mint orb halos (`-top-16 -left-12`, `-bottom-20 -right-10`) gain a parallax offset 2–3× stronger than content — classic depth illusion.

### 3. Field micro-interactions
- Email input: animate floating label scale/y with spring; bottom progress wire (already there) gets a subtle gradient shimmer when focused.
- On valid email, the focus ring transitions to a soft pulsing mint glow (1 s ease-in-out, 2 cycles, then settle) and the leading mail icon swaps to a check with a small `scale-in` spring.
- Province Select: trigger gets a 1 px inner ring on focus and a tiny chevron rotation 0→180° on open.
- Consent checkbox: when toggled on, a 1-frame mint ring pulses outward (`@keyframes ringPulse` in index.css) and the tick draws via SVG `pathLength` 0→1 (180 ms).

### 4. CTA — the hero element
- Replace the static gradient with a slow animated mint-to-teal **gradient flow** (`background-size: 200% 200%; animation: gradientFlow 8s ease infinite`) so the CTA feels alive but not loud.
- Sheen sweep: switch from constant loop to "every 5 s plus on-hover", easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hover: lift `y: -2`, deepen mint shadow to `0 18px 36px -10px hsl(164 80% 35% / 0.7)`, slight `letter-spacing: -0.005em` shift.
- Press: spring scale 0.98 + 80 ms haptic-feeling shadow collapse.
- Disabled: kill all animations, drop opacity to 0.55, `cursor-not-allowed` (already partial).

### 5. Entry choreography
- Stagger the card's children using `framer-motion` variants (logo → headline → fields → consent → CTA), each with `opacity 0 → 1`, `y 12 → 0`, `filter blur(6px) → 0`, `duration 0.55s`, ease `[0.16, 1, 0.3, 1]`. Replaces any current ad-hoc fade-ins for a unified rhythm.
- Logo gets an extra `scale 0.96 → 1` on entry so the etched bevel "settles" into the surface.

### 6. Ambient touches
- Very faint **film grain** overlay on the card (SVG fractalNoise, 4 % opacity, `mix-blend-overlay`) for that filmic premium feel.
- Mint orb behind CTA gets a slow `scale 1 → 1.06 → 1` breathing loop (6 s).

### 7. Accessibility & perf
- All new motion gated behind `useReducedMotion()` from framer-motion — animations collapse to static styling when reduced motion is on.
- `will-change: transform, opacity` only on the actively animated layers (CTA, orbs); removed afterwards.
- No new dependencies. No image regenerations.

## Out of scope

- No layout, copy, field, or flow changes.
- No changes to validation, OTP, Make.com, or downstream screens.
- No background photo swap.

## Verification

1. Preview at 390 × 844, 707 × 502 (current), and 1280 × 720 — card breathes, no jitter, no clipped shadows.
2. Tab through fields — focus rings visible, animations trigger correctly.
3. Toggle macOS "Reduce Motion" — orbs, sheen, and gradient flow pause; entry stays a simple fade.
4. Lighthouse Performance on `/` should not regress more than 2 points (animations are CSS/transform-only).
