## Goal
Make the bud photo on SqueezeScreen appear in rich, full color — no washed-out darkness — while keeping form legibility.

## Single file change: `src/components/SqueezeScreen.tsx` (hero image block, lines ~78–96)

1. **Remove `mixBlendMode: "soft-light"`** on the hero `<motion.img>` — this is the main cause of the bud disappearing into the dark background.
2. **Update filter** from `saturate(1.3) contrast(1.1)` to `saturate(1.35) contrast(1.08) brightness(1.1)` for vivid but natural color.
3. **Replace the heavy overlay stack** (radial vignette + dual gradient + green `overlay` tint) with two lightweight layers:
   - Soft top→bottom gradient: transparent at the top 50%, fading to `hsl(180 8% 7% / 0.75)` only at the bottom (where the form sits) for legibility.
   - Very subtle brand tint: `hsl(var(--primary-green) / 0.08)` on `multiply` — keeps cohesion without dulling the bud.
4. Keep the slow Ken Burns motion exactly as-is.

## Out of scope
No layout, logo, copy, legal, or webhook changes. No new files or assets.