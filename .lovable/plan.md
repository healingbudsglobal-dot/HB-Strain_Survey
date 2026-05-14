# Whole-app polish cascade

Bring the etched-logo quality bar to every surface. Focused on visual/UX layers only — no business logic, scoring, or data flow changes.

## 1. Shared design primitives (index.css + tailwind)

Add a small set of reusable tokens so the same polish lands everywhere instead of being re-coded per component.

- **Etched text utilities** — `.text-etched` (subtle inset white highlight on top, soft dark shadow on bottom) and `.text-etched-strong` for headings on dark/teal backdrops. Mirrors the new BrandLogo treatment.
- **Glass surface utilities** — `.glass-card` (border, inner highlight ring, backdrop-blur, sage-tinted shadow), `.glass-card-strong`, `.glass-input` (matching field treatment). Single source of truth so SqueezeScreen / SurveyFlow / ContactCapture / OTP / Admin all share one look.
- **Contrast scrim utility** — `.scrim-readable` for any text laid over photo/gradient backdrops (used today only on squeeze; will extend to results + success).
- **Motion tokens** — formalize `--ease-spring`, `--ease-smooth` (already partially there) and add `.animate-step-in` / `.animate-step-out` for funnel step transitions.

Tokens stay HSL; no new colors.

## 2. Squeeze screen (`SqueezeScreen.tsx`)

- Re-skin headline + subhead with `.text-etched-strong`.
- Convert the email card and CTA cluster to `.glass-card` + `.glass-input`.
- Tighten vignette stops where text sits (mobile keeps the existing lite path; desktop richer per your "Allow richer mobile" choice — we will still gate the heaviest filters behind `prefers-reduced-motion` and a low-end heuristic).
- Add micro-motion: CTA press + email focus ring spring.

## 3. Survey flow (`SurveyFlow.tsx`, `StepProgress.tsx`)

- Each question card → `.glass-card-strong` with embossed question label.
- Option chips/buttons get etched depth on hover/active, spring scale on press.
- Step transitions use `.animate-step-in/out` with crossfade + 8px slide.
- Progress bar gets a subtle inner highlight + sage glow at the active fill edge.
- Audit text/background contrast on all option states (especially selected on light cards).

## 4. OTP + Contact capture (`OtpVerification.tsx`, `ContactCapture.tsx`)

- Card → `.glass-card-strong`.
- OTP digit boxes → `.glass-input` with focus glow + spring fill animation as digits arrive.
- Province + contact-pref selectors → consistent chip styling shared with survey options.
- Inline validation messaging uses `text-destructive` token (not arbitrary reds) and respects AA on the glass background.

## 5. Reveal, success, loading (`CinematicMatchReveal.tsx`, `SuccessScreen.tsx`, `LoadingScreen.tsx`)

- Match reveal headline + product card → etched headings, glass card consistency, gentle parallax already there preserved.
- Success screen CTAs (download PDF, contact, share) → unified glass button treatment + hover/press motion.
- Loading screen copy → etched on dark backdrop; spinner unchanged.

## 6. Admin (`AdminLogin`, `AdminDashboard`, `AdminSettings`)

Lighter pass — admin should feel from the same family without becoming flashy.

- Login card → `.glass-card-strong`, etched H1, spring on submit.
- Dashboard stat cards → `.glass-card`, hover lift, consistent shadow token.
- Settings forms → `.glass-input` for all fields; section headings get `.text-etched`.
- Tables and destructive actions: leave structure alone, only token + contrast cleanup.

## 7. Cross-cutting QA

- Run a contrast pass on every text/background pair touched; fix any below WCAG AA by darkening foreground or boosting scrim, not by changing brand colors.
- Verify mobile: confirm the new effects don't regress the "lite mode" budget — keep the `useIsMobile` gate already added on heavy filters; allow richer effects only where measurably smooth.
- Use `/dev/logo-preview` pattern as visual reference for etched depth.

## Out of scope

- No copy rewrites, no new screens, no scoring/data changes, no schema or webhook edits.
- No new dependencies.
- Branding palette unchanged; only token additions, never overrides.

## Technical notes

- All new utilities live in `src/index.css` under a clearly-marked "Polish cascade" block.
- `.glass-*` utilities will replace ad-hoc `backdrop-blur-* bg-white/10 border border-white/20` clusters scattered across components — search-and-replace per file.
- `.text-etched` uses two `text-shadow` layers (top inset highlight, bottom soft drop) and is GPU-cheap; safe on mobile.
- Step transitions wired via existing AnimatePresence in SurveyFlow — no new animation lib.
- Estimated edit footprint: ~10 files, ~250–350 LOC net (mostly class swaps + token additions).
