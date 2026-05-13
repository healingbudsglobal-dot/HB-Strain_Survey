## Logo Preview Route

Hidden dev route to compare the etched `BrandLogo` against multiple backdrops and confirm legibility.

### Route

- New file `src/pages/LogoPreview.tsx`, registered in `src/App.tsx` at `/dev/logo-preview` (not linked anywhere in the app, no nav entry, no auth — just URL-only).

### Layout

A single full-bleed page, dark page background, simple top toolbar then a 3×2 grid of tiles. Each tile is a square card showing one backdrop with the `BrandLogo` centered.

Toolbar controls (all client-state, no persistence):
- Vignette: `none` / `subtle` / `strong` (passed to `BrandLogo`).
- Size: `sm` / `md` / `lg` / `xl` (drives logo width 96 / 160 / 240 / 320 px).
- Pattern density: slider 0 → 1 (0 = no fiber, 1 = current default). Multiplies the texture opacity inside `BrandLogo`.
- Light / dark page toggle for the surrounding chrome.

Tiles (curated 6):
1. Solid `--primary-green` (#1C4F4D)
2. `--gradient-teal-midnight`
3. `--gradient-sage-radial`
4. `--gradient-hero` over off-white
5. Bud photo backdrop (reuse an existing hero image asset under `src/assets/`; fall back to a CSS-only mossy radial if none found during exploration).
6. Noisy textured backdrop (inline SVG turbulence at higher density, deep teal base) — stress test for fiber clash.

Each tile shows a small caption underneath with the backdrop name and the resolved background CSS, so it's obvious what's being compared.

### Pattern-density wiring

`BrandLogo` currently hardcodes the fiber overlay opacity (0.18 strong / 0.12 subtle). Add an optional `fiberDensity?: number` prop (default `1`) that multiplies the existing opacity. Existing call sites are unaffected. The preview page passes the slider value through.

### Contrast confirmation

No automated WCAG readout (per the choice). Instead, render a thin "contrast guide" strip across the bottom of each tile: 5 swatches of pure white at opacities 100/80/60/40/20% sitting on the same backdrop. If the logo (white) reads at least as well as the 60% swatch, it passes the visual target. This is a fast eyeball check and avoids a misleading numeric ratio (the etch effect is decorative, not a flat fill).

### Technical notes

- Pure presentation, no data, no Supabase, no analytics.
- `LogoPreview.tsx` ~150 lines: tile array + small `Tile` subcomponent.
- `BrandLogo` change: one new optional prop, one multiplication at the opacity calc — no behavioral change for existing usage.
- Mobile is fine but the page is intentionally desktop-first (grid collapses to 1 column under `md`).
- No new dependencies.

### Files touched

- new: `src/pages/LogoPreview.tsx`
- edit: `src/App.tsx` (add route)
- edit: `src/components/BrandLogo.tsx` (add `fiberDensity` prop)