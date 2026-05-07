## Goal
Remove the human silhouette that appears in the current ambient `neuron-loop.mp4` clip and replace it with a pure, vector-based neural-signal animation that has zero people in it. Apply this animation as the global ambient layer behind every screen (squeeze, OTP, survey, contact, loading, success).

## Why
The downloaded PBS neuron clip contains a brief shot of a person, which conflicts with the brand. A hand-built SVG/CSS animation guarantees no humans ever appear and also gives us a higher-quality, perfectly looping, lightweight ambient with brand-correct pink → pearl → green pulses.

## Changes

1. **New component** `src/components/NeuronAmbient.tsx`
   - Fixed full-screen, `pointer-events-none`, `-z-10` layer.
   - SVG with ~5 dendrite curves and ~10 synaptic nodes.
   - Travelling stroke-dash gradient pulse (pink → pearl → green) along each dendrite, staggered.
   - Soft node glow that breathes.
   - Respects `prefers-reduced-motion`.
   - Optional `intensity` prop (0–1) so individual screens can dim it further.

2. **`src/pages/Index.tsx`**
   - Import `NeuronAmbient` and render it once at the top of the page wrapper so it shows on every screen state (squeeze / otp / survey / contact / loading / success).
   - Keeps existing `<AmbientParticles />` and `<HeroBackdrop />` intact (they layer above the neuron field).

3. **`src/components/SqueezeScreen.tsx`**
   - Remove the `<video src="/video/neuron-loop.mp4">` block and its surrounding mask wrapper (lines around the AMBIENT NEURON FOOTAGE comment).
   - Remove the `videoRef`, the two `useEffect` hooks driving play/pause, and the `anyFieldActive`-based opacity (no longer needed since there's no video).
   - Keep the SVG dendrite watermark already present inside the form card.

4. **Delete `public/video/neuron-loop.mp4`** to remove the clip with the person from the bundle.

## Result
- No human ever appears anywhere in the ambient.
- A consistent, brand-aligned neural-signal field lives behind every step of the funnel.
- Lighter bundle (drops the 452 KB MP4) and crisper visuals at any resolution.
