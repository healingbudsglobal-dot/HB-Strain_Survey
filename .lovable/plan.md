# Plant-fiber texture behind BrandLogo

Add a faint, organic plant-fiber texture layer inside `<BrandLogo />` so the white logo reads as gently carved into the dark-green surface. Texture appears whenever `vignette` is `subtle` or `strong`; `none` stays flat. No new image assets — texture is an inline SVG data URI so it scales crisply at any size and adds zero network cost.

## Changes

**Edit `src/components/BrandLogo.tsx`** — add a new texture layer between the existing vignette div and the `<img>`:

1. Define an inline SVG data URI of overlapping thin diagonal fiber strokes + low-amplitude turbulence, rendered as a CSS `background-image`. Two layered backgrounds:
   - SVG `<filter feTurbulence baseFrequency="0.9" numOctaves="2"/>` masked through alpha → micro grain.
   - SVG of ~12 hair-thin diagonal lines at varied angles (≈15°, -20°) → directional fiber feel.
2. Wrap both in a single `aria-hidden` div positioned `absolute inset-0` behind the logo (z-index below `<img>`, above the vignette gradient).
3. Tune per variant (passed via existing `vignette` prop):
   - `subtle`: opacity ~0.12, mix-blend-mode `soft-light`, mask radial-gradient fading to transparent at 70% so texture only shows under the logo footprint.
   - `strong`: opacity ~0.18, same blend, mask fading at 80%.
   - `none`: layer not rendered.
4. Texture color: `hsl(var(--primary-foreground))` at low alpha so it inherits theme and stays subtle on any deep-green backdrop.

No changes to `size`, `priority`, `imgClassName`, or any consuming surface — they automatically inherit the new texture because they already pass `vignette="subtle"` or `"strong"`.

## Technical notes

- Stack inside the wrapper, bottom → top: vignette gradient div → fiber texture div (with radial mask) → `<img>`.
- Use `pointer-events-none` on the texture layer.
- `mix-blend-mode: soft-light` keeps the fiber barely perceptible on near-black teal but visible on lighter green vignette halos — gives the "carved into surface" feel without dirtying the logo edges.
- Mask via `-webkit-mask-image` + `mask-image` radial-gradient so texture concentrates around the logo and dissolves at the edges (no hard rectangle).
- Inline SVG kept under ~1 KB, base64-encoded once as a module constant.

## Verification

- Visual check on SqueezeScreen (strong) and ContactCapture / OtpVerification / SurveyFlow header (subtle): texture visible on close inspection, logo still high-contrast and crisp.
- Confirm nerve-signal shimmer on SqueezeScreen still composites correctly above the new texture.
- Admin pages (no vignette) unchanged.
- `tsc --noEmit` clean.

## Out of scope

- No new asset files, no changes to etch filter, no changes to consuming surfaces, no animation on the texture itself.
