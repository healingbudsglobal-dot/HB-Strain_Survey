## Honest review of current state (mobile, 390×844)

I screenshotted the live preview. You're right — it looks unprofessional. Here's what's wrong vs award-winning landers (Cann, Aeriz, Fable, Hims, Houseplant 2026):

1. **Background is a "dead swamp"** — over-desaturated and hue-shifted, the macro flower lost its cinematic quality without becoming clean. Pros either commit to a rich darkened image (heavy vignette, edge-only texture) or go fully clean dark gradient. The half-faded path is the worst option.
2. **Button is olive/mustard** — the gold gradient on dark reads dated and clashes with the mint headline. Modern landers use one solid accent (mint or white).
3. **Form is glass-on-mud** — translucent card over a busy muddy background kills legibility. Pros use a near-solid dark plate that *anchors* the form.
4. **Mobile hierarchy is flat** — logo too small, headline-to-form spacing tight, no breathing room.
5. **Decorative gold shimmer line on form** is noise, not signal.

## Fixes

### 1. `src/components/HeroBackdrop.tsx` — recover the cinematic image
- Restore natural saturation (`saturate(1.05) contrast(1.15) brightness(0.65)`) — deepen instead of desaturating.
- Drop the hue-rotate hack.
- Add a **heavy radial center vignette** so the form sits on near-black while edges keep the rich flower texture.
- Forest tint stays subtle (`hsl(178 60% 8% / 0.55)` multiply) for brand cohesion.
- Stronger top + bottom scrims for full-bleed legibility.

### 2. `src/components/SqueezeScreen.tsx` — modernize the form & CTA
- **Logo**: bump to `h-16 sm:h-20`, more space below (`mb-8`).
- **Form card**: switch from translucent glass to a near-solid dark plate (`bg-[hsl(180 20% 5% / 0.88)]`) with a soft elevated shadow. Anchors content properly.
- **Remove** the green-to-gold shimmer line at the top of the form (visual noise).
- **CTA button**: replace olive gradient + pulse-glow with a solid mint (`bg-[hsl(var(--accent-green))]`) and dark forest text — high contrast, modern, matches the mint headline. Drop the always-on pulse animation (looks like a bug, not a feature).
- Consent checkbox and helper text stay as-is.

### 3. Mobile-first verified
After applying, re-screenshot at 390×844 to confirm: anchored form, readable type, balanced rhythm, single accent color.

## Out of scope
- No copy changes.
- No removal of consent / province (legal & matching require both).
- Hero image asset stays the same — just treated better.
