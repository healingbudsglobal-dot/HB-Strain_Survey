## Goal

Logo reads cleanly on every dark-green backdrop (squeeze bud photo, contact capture vignette, OTP screen, survey header). Centralize the etch/shadow recipe so future tweaks happen in one place.

## New file

**`src/components/BrandLogo.tsx`** — single source of truth.

Props:
- `size`: `"sm" | "md" | "lg" | "xl"` → `h-10 / h-12 sm:h-14 / h-14 sm:h-16 / h-28 sm:h-36 md:h-40`
- `vignette`: `"none" | "subtle" | "strong"` (default `"subtle"`)
- `className?`, `priority?` (eager decode for above-the-fold)

Renders an `<img>` wrapped in a relative div. Vignette is an `aria-hidden` radial-gradient div behind the image; intensity scales with the prop.

### Tuned etch filter (replaces SqueezeScreen's current stack)

Current bottom shadow is heavy and the top highlight is too dim on bright backdrop areas. New stack:

```
filter:
  drop-shadow(0 -0.5px 0 hsl(0 0% 100% / 0.85))    /* crisp 1px top highlight, neutral white  */
  drop-shadow(0 1px 0 hsl(180 65% 4% / 0.95))      /* crisp 1px bottom etch */
  drop-shadow(0 2px 3px hsl(180 60% 3% / 0.55))    /* contact shadow, tighter than before */
  drop-shadow(0 8px 18px hsl(180 60% 3% / 0.45));  /* ambient lift, lighter so it doesn't muddy small sizes */
```

Why the change:
- Highlight switches from sage-tinted `hsl(160 30% 92% / 0.55)` to neutral white at higher opacity → survives on both bright bud-photo highlights and uniform deep-teal.
- Bottom etch opacity bumped to 0.95 and contact/ambient shadows softened so the logo at `sm` doesn't get a heavy halo.

### Vignette variants (behind the logo)

```
subtle:  radial-gradient(ellipse at center,
           hsl(180 50% 4% / 0.35) 0%,
           hsl(180 50% 4% / 0.20) 45%,
           transparent 78%);  blur(6px); -inset 6/4

strong:  same stops at 0.78 / 0.55 / 0.18 / transparent 85%; blur(8px); -inset-x-10 -inset-y-6
none:    not rendered
```

`subtle` is what gets applied to ContactCapture / OTP / SurveyFlow header — just enough to guarantee contrast where the page background varies, without a visible halo on uniform dark sections.

`strong` reproduces the existing SqueezeScreen treatment (where the bud backdrop demands it).

## Surface swaps

| File | Before | After |
|------|--------|-------|
| `src/components/SqueezeScreen.tsx` (lines ~123-145) | Inline vignette + etch + nerve-signal mask | `<BrandLogo size="xl" vignette="strong" />` then keep the existing nerve-signal mask div as a sibling overlay (it references `hbLogoWhite` directly — leaves intact) |
| `src/components/ContactCapture.tsx` (line 142) | bare `<img class="h-12 sm:h-14">` | `<BrandLogo size="md" vignette="subtle" />` |
| `src/components/OtpVerification.tsx` (line 107) | bare `<img class="h-12 sm:h-14">` | `<BrandLogo size="md" vignette="subtle" />` |
| `src/components/SurveyFlow.tsx` (lines 266-270) | bare `<img class="h-12 sm:h-14">` | `<BrandLogo size="md" vignette="subtle" />` |

Admin pages (`AdminLogin`, `AdminDashboard`, `AdminSettings`) are on light/neutral chrome — left as plain `<img>`. Out of scope.

## Verification

- Visual walk-through of all 4 surfaces at mobile + desktop widths in the preview.
- Check SqueezeScreen logo: vignette + etch render, nerve-signal shimmer still sweeps across the mark (mask still works since `hbLogoWhite` import stays).
- Confirm admin screens unchanged.
- `tsc --noEmit` clean.

## Out of scope

- No changes to admin chrome, survey question icons, success screen, or animation logic.
- No new SVG assets — keeps `hb-logo-white-full.svg`.
