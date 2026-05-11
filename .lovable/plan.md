## Goal

Right now the loading screen runs for a fixed 3-second timer regardless of what the webhook actually does — failures only surface as a small toast and slow networks get no feedback at all. We'll make the loading screen reflect the real status of `submitResults` + `postSurveyAnswersWebhook` and give users a clear way to recover.

## States

The loading screen will move through four states driven by Index:

1. **`loading`** — current animation + cycling status messages (default)
2. **`slow`** — after 6s with no response, swap the headline to "Taking a little longer than usual…" and show a soft sub-line "Hang tight, we're still working on it." Animation keeps running.
3. **`error`** — webhook failed (network or non-2xx). Stop the animation, show a friendly error icon, headline "We couldn't save your results", short description with the underlying reason (offline / server error), plus two buttons: **Retry** (re-runs the webhook calls) and **Continue anyway** (proceeds to success screen — results already exist client-side).
4. **`success`** — brief confirmation tick, then auto-advance to SuccessScreen (replaces the current blind 3-second `setTimeout`).

## Files to change

### `src/components/LoadingScreen.tsx`
- Add `status: "loading" | "slow" | "error" | "success"` and `onRetry`, `onContinue`, `errorReason?` props (all optional, defaults preserve current behaviour).
- When `status === "slow"`: swap headline + freeze the cycling status text on a reassuring line.
- When `status === "error"`: hide the DNA helix progress bar, render an `AlertTriangle` icon in destructive tint, the reason, and the two action buttons (uses existing Button + design tokens).
- When `status === "success"`: render a checkmark + "All set" before the parent transitions away.
- All new motion gated behind `useReducedMotion`.

### `src/pages/Index.tsx`
- Replace the fixed `setTimeout(() => setScreen("success"), 3000)` with real status tracking:
  - Add `submitStatus` state (`"loading" | "slow" | "error" | "success"`) and `submitError` string.
  - Extract the webhook block from `handleSendResults` into a `runSubmit` function that returns `{ resultsOk, webhookRes }`, so Retry can call it again.
  - Start a 6-second timer when submission begins; if still pending, set status to `"slow"`.
  - On `Promise.all` resolve: if either failed, set `"error"` with a humanised reason (offline vs. status code); otherwise set `"success"` and advance to SuccessScreen after ~600ms.
  - Pass `status`, `errorReason`, `onRetry`, `onContinue` into `<LoadingScreen />`.
- Remove the duplicated retry toast (the inline button on the loading screen replaces it). Keep the `resultsOk` toast as a soft non-blocking notice since email is the backup channel.

### Out of scope
- No backend, edge function, or webhook payload changes.
- No new dependencies.
- No changes to OTP, SqueezeScreen, ContactCapture, or SuccessScreen.

## Verification
- Happy path: submit survey → loading animation → success advance, no flicker.
- Throttle network to "Slow 3G" in DevTools → after ~6s the headline swaps to the slow copy, animation continues.
- Block `track-event` / `submit-results` in DevTools → error state appears with both buttons; Retry re-runs and recovers; Continue jumps straight to SuccessScreen.
- macOS Reduce Motion → no jitter, all transitions still legible.
