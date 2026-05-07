# Unify the Whole Funnel — Cinematic Emerald Design System

## The problem

Each screen currently has its own visual language:
- **Squeeze**: cinematic emerald backdrop + dark form
- **OTP**: blurred faded image + green accents
- **Survey**: rainbow icon palette (yellow / orange / purple / pink) + brand-gold borders + glass cards

Result: feels stitched together, not designed. Reference shots (deep emerald, single light source, dark photography) need to carry through every step.

## The fix — one design language end-to-end

**Palette discipline**: emerald primary (`--accent-green` / `--primary-green`), white/off-white for text, near-black surfaces. **Kill all gold and rainbow accents in the funnel.**

---

## Changes

### 1. `src/components/HeroBackdrop.tsx` — already cinematic, keep
No change. It's the visual anchor.

### 2. `src/pages/Index.tsx` — backdrop persists across screens
- Render `<HeroBackdrop />` once at root inside a `motion.div` that animates `opacity: 1` (squeeze) → `0.35` (every other screen). The world stays continuous; OTP and Survey sit on the *same* deep emerald scene, just dimmed.
- Soften screen transition: drop scale jump, keep gentle blur+fade `y:16 → 0 → -12`, `0.55s`, ease `[0.22, 1, 0.36, 1]`.
- Style the top progress bar to match: `bg-[hsl(180_45%_3%_/_0.65)]` + `border-b border-[hsl(var(--accent-green)_/_0.08)]` for editorial feel.

### 3. `src/components/OtpVerification.tsx` — remove its own backdrop, match squeeze
- **Delete** the local blurred flower backdrop (lines 73–84) — backdrop is now global.
- Form card: switch from `bg-[hsl(175_6%_12%_/_0.6)]` glass to **same dark plate as squeeze**: `bg-[hsl(180_20%_5%_/_0.88)] backdrop-blur-xl border border-white/[0.08]` with shadow `0 30px 80px -20px hsl(180 30% 2% / 0.6), inset 0 1px 0 hsl(0 0% 100% / 0.05)`.
- Remove the green-to-gold shimmer line (gold doesn't belong here).
- OTP slot active state: emerald-only (current is fine, just remove `data-[active]:shadow` if stale).
- Tighten vertical rhythm: `mb-6` logo → `mb-5`; mail icon block `mb-3` → `mb-4`; consistent with squeeze.

### 4. `src/components/SurveyFlow.tsx` — biggest cleanup
- **Delete `ICON_PALETTES`** (rainbow gradients, lines 22–32). Replace with single emerald token system:
  - Default icon chip: `bg-[hsl(var(--accent-green)_/_0.1)] text-[hsl(var(--accent-green))] border border-[hsl(var(--accent-green)_/_0.2)]`
  - Selected: `bg-[hsl(var(--accent-green)_/_0.2)] text-[hsl(var(--accent-green))] scale-105`
- **Replace gold accents with emerald** throughout:
  - Top accent line: solid `hsl(var(--accent-green))` not green-to-gold gradient.
  - Selected option border `border-[hsl(var(--brand-gold))]` → `border-[hsl(var(--accent-green))]`
  - Selected bg `bg-[hsl(var(--brand-gold)_/_0.12)]` → `bg-[hsl(var(--accent-green)_/_0.12)]`
  - Hover ring → emerald.
  - Checkmark indicator bg → `bg-[hsl(var(--accent-green))]`.
- Card surface: replace `glass-card-elevated` with the same dark-plate pattern as squeeze/OTP for consistency: `bg-[hsl(180_20%_5%_/_0.88)] backdrop-blur-xl border border-white/[0.08]` + the same elevated shadow.
- Section pill, question chip, "Continue" button → emerald only.

### 5. `src/components/SqueezeScreen.tsx` — remove gold from form
- Email input focus ring: `focus:ring-[hsl(var(--brand-gold)_/_0.4)]` → `focus:ring-[hsl(var(--accent-green)_/_0.4)]`, same for border.
- Province select: same swap.
- Consent checkbox: gold accent → emerald (`accent-[hsl(var(--accent-green))]`, border + bg green tints).
- Tagline `2 min · 100% private · lifestyle preference tool` — keep but shrink to `text-[10px]` and `mt-1` so it doesn't compete.

### 6. `src/components/StepProgress.tsx` — small polish
- Already emerald — fine. Just bump label font-weight on active step from `font-medium` to `font-semibold` and add `tracking-[0.04em] uppercase text-[9px]` for editorial ticker feel.

---

## Result

- One palette: emerald + near-black + white. No gold, no rainbow.
- One surface system: dark plate (`hsl(180 20% 5% / 0.88)`) with subtle white inset highlight + heavy soft shadow, used on **every** card.
- One backdrop: cinematic emerald scene visible through every step (full intensity on squeeze, dimmed elsewhere).
- One transition: gentle blur-fade between screens.

This is the difference between a template and a designed product.
