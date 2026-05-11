## Problem

On the Contact step, tapping the country flag opens the OS-native `<select>` list (full white background, dark text, ignores our dark glass theme — visible in the screenshot). It also overlaps the browser chrome on smaller viewports. This is a native-`<select>` limitation of `react-phone-number-input` — its option list cannot be themed cross-browser.

## Decision

The funnel is South-Africa-only (province step is SA provinces, results copy says "SA 18+"). There's no reason to expose 200+ countries. Lock the input to ZA and remove the country picker entirely.

## Changes

**`src/components/ContactCapture.tsx`** (one block, ~5 lines)
- Pass `countries={["ZA"]}`, `defaultCountry="ZA"`, `international={false}`, `addInternationalOption={false}` to `<PhoneInput>`.
- Pass `countrySelectComponent={() => null}` to remove the dropdown trigger entirely. The flag icon stays via `PhoneInputCountryIcon` (rendered separately) — if it disappears too, fall back to keeping the trigger but adding `disabled` so it can't open.

**`src/index.css`** (small additions to the existing `.hb-phone-wrap` block, ~10 lines)
- Add `color-scheme: dark` on `.hb-phone-wrap` as a defensive fallback so any future native popup inherits dark UA chrome.
- Add a fixed `+27` prefix label to the left of the input (small `<span>` in the JSX, styled with muted-foreground) so the user still sees the country context.
- Remove the now-unused `PhoneInputCountrySelectArrow` rule.

## Out of scope

- No change to validation (`isValidPhoneNumber` still works for ZA numbers).
- No change to OTP, Reveal CTA, success screen, or strain-match logic.
- No re-introduction of multi-country support — if you ever expand outside SA, we'd swap to a custom shadcn `Select`-based country picker rather than the native one.

## Verification

1. Open Contact step in the preview at 707×502 (current viewport).
2. Confirm: no country dropdown opens on click, `+27` is shown as a static prefix, the flag still renders, ZA numbers validate, and `Reveal My Match` still posts the right E.164 value.
3. Re-test at 390×844 (mobile) and 1280×720 (desktop) to confirm the form stays inside the glass card.
