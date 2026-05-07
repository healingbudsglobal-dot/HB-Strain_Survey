## Dramatically bolder form: email + province + consent + CTA

The circled area is the conversion moment. Right now it reads as three stacked grey rectangles. We'll re-engineer it into a single tactile, premium, "instrument panel" feel — with floating labels, live icons, and stronger CTA presence — without breaking the existing liquid/cannabinoid form-up animation.

### Changes (all in `src/components/SqueezeScreen.tsx`)

**1. Email input → floating-label glass field with live state**
- Mail icon (lucide `Mail`) inside the field, left side, that **pulses mint** when the field is focused and **flips to a checkmark in mint** when the email regex passes
- Floating label "Your email" lifts and shrinks on focus/filled (smooth 200ms)
- Bigger text (`text-[17px]`), more padding (`py-5`), thicker emerald focus ring (2px → soft 4px glow)
- Helper text becomes a thin animated underline progress bar that fills mint as the email becomes valid (replaces the small grey hint line — still keeps an aria-describedby for screen readers)

**2. Province select → premium picker with map-pin icon + chevron rotation**
- `MapPin` icon left, animated chevron right that rotates 180° when open
- Floating label "Province" lifts on selection
- Selected province shows in **DM-Sans-weight emphasis** (heavier than placeholder)
- SelectContent gets glass treatment to match: `bg-card/80 backdrop-blur-xl`, soft mint border, items get a left mint accent bar on hover

**3. Consent row → custom checkbox with mint check animation**
- Replace native checkbox with a custom 18px rounded square; checkmark draws in (SVG path with `pathLength` framer animation) on check
- Whole row gets a subtle mint inner glow when checked (already partial — strengthen it)
- Slightly larger text (`text-[12px]`) and tighter alignment

**4. CTA button → command-button presence**
- Bigger: `py-5 text-[17px]`
- Add a soft animated mint **halo glow** behind the button that pulses gently (2.4s) when consent is checked → signals "ready"
- Disabled state gets a clearer "locked" cue: subtle lock icon + lighter copy "Confirm 18+ to continue"
- Arrow icon scales up slightly and the sheen sweep already exists — keep it
- Add tactile depth: stronger inset highlight on top, deeper shadow below

**5. Section rhythm**
- Tighten gaps from default form spacing to `space-y-3.5` so the four elements read as one cohesive instrument cluster, not four floating cards
- Add a faint mint divider hairline above the CTA (gradient line, fades in/out edges) to separate "your details" from "the action"

### What stays
- The cannabinoid + neural network form-up animation
- The wet-glass card outer shell, breathe animation, droplet sheen
- All existing logic (email regex, province list, consent gate, error handling, submit flow)
- Color tokens — purely additive

### Files to edit
- `src/components/SqueezeScreen.tsx` only

No backend, no schema, no new deps (Mail, MapPin, ChevronDown, Lock from lucide-react are already available).
