# Survey icon + animation polish

Goal: every survey option icon should map cleanly to its label (no duplicate "dartboards"), and the select/hover feedback should feel intentional and rewarding without competing motion or indefinite pulses.

---

## 1. Fix icon relevance — `src/data/surveyQuestions.ts`

Current issues found in the 15 questions:

| Question | Option | Today | Change to | Why |
|---|---|---|---|---|
| primary_vibe | "Relaxed & Stress-Free" | `heart` | `wind` | `heart` is reused for "Sex/Intimacy" later — visual collision |
| primary_vibe | "Creative & Inspired" | `lightbulb` | `palette` | Match the other two "creative" options (consistent visual language) |
| specific_benefit | "Focus & flow state" | `target` | `crosshair` | Removes the duplicate "dartboard" — `target` stays only on "Focused & Clear" |
| specific_benefit | "Calm & unwind from a busy day" | `brain` | `coffee` | `brain` reads cognitive, not unwind |
| thc_reaction | "Average – standard profiles suit me" | `minus` | `equal` | Conveys "balanced/average" vs a generic dash |
| terpene_pref | "No strong preference" | `minus` | `shuffle` | More expressive of "any/open" |
| recovery_support | "Not a priority right now" | `minus` | `circle-dashed` | Soft "skip" cue |
| effects_avoid | "Racing thoughts" | `zap` | `gauge` | `zap` is reused for "Energized & Productive" (positive) — semantic clash |
| effects_avoid | "Sleepiness" | `moon` | `bed-double` | `moon` is positive for "Restful nights" elsewhere |

No structural changes — only string swaps. Lucide icon names verified.

---

## 2. Tighten select + hover micro-interactions — `src/components/SurveyFlow.tsx`

**Problem today**
- Selected option pulses indefinitely via `emeraldPulse` (2.4s loop). Loud and counter to the ADHD-safe UX rule.
- Hover stacks three competing motions on each option: button `scale 1.02 + x:4`, label `translate-x-0.5`, and an extra hover shadow.
- The icon "snap" on select is just a `scale-110` Tailwind class — no satisfying micro-burst.

**Changes**
- Remove `option-emerald-selected` infinite pulse class. Replace with a one-shot framer-motion sequence on the icon container: scale 1 → 1.18 → 1.1 (spring), opacity ring burst from 0 → 0.6 → 0 over 450ms.
- Keep `option-emerald-focus` keyboard pulse (a11y — only fires on `:focus-visible`).
- Drop the label's `group-hover:translate-x-0.5` so only the parent button moves on hover. Keep `whileHover={{ scale: 1.02, x: 4 }}`.
- Add `useReducedMotion()` guard: when set, skip hover/x motion and the ring burst; selection just shows a quick opacity fade on the check.
- The selected-state check icon (already there) gets a subtle `rotate: -90 → 0` on entry for a "snap into place" feel.

**Net effect**: each tap feels like a single satisfying click instead of a constant heartbeat; hover feels lighter; nothing loops forever once chosen.

---

## 3. Out of scope

- No changes to scoring logic, question count, section copy, or section emojis.
- No changes to SuccessScreen, LoadingScreen, ContactCapture, SqueezeScreen.
- No new dependencies.

## 4. Verification

- Walk through all 15 questions in preview; confirm each icon visually matches its label and no two options in the same question share an icon.
- Tap an option: icon should pulse once and settle, then auto-advance (single-select) — no ongoing pulse on the previous selection when navigating back.
- Toggle macOS Reduce Motion → hover/x and burst suppressed; selection still legible.
- Tab-focus an option → emerald keyboard pulse still appears (a11y preserved).
