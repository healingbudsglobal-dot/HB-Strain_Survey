## Goal

Add a Playwright end-to-end test suite that drives the real OtpVerification UI in a browser and verifies the five OTP outcome paths: **valid**, **invalid_code**, **no_code**, **expired**, and **too_many_attempts**.

## Approach

The verify-otp edge function is already covered by manual testing. For deterministic, fast E2E we will **mock the Supabase Functions HTTP calls at the network layer** using Playwright's `page.route()`. This avoids polluting the live `otp_codes` table, removes timing flakiness (real expiry is 5 min), and lets us force any reason code on demand.

Each test:
1. Navigates to `/` and walks through the funnel to the OTP screen, OR mounts a small `/test/otp` route guarded by `import.meta.env.DEV` that renders `<OtpVerification>` directly with a fixed email. (Preferred — much faster and isolates the unit under test.)
2. Stubs `POST **/functions/v1/verify-otp` and `POST **/functions/v1/send-otp-email` to return the scenario response.
3. Types `123456` into the 6 OTP slots.
4. Asserts the visible UI message and follow-up state.

## Files to add

```text
playwright.config.ts              # base URL http://localhost:8080, webServer runs `npm run dev`
e2e/otp.spec.ts                   # the 5 scenarios
e2e/helpers/otpHarness.ts         # navigation + fill helper
src/pages/OtpTestHarness.tsx      # DEV-only route mounting <OtpVerification>
```

Update:
- `src/App.tsx` — add `{import.meta.env.DEV && <Route path="/test/otp" element={<OtpTestHarness />} />}`
- `package.json` — add `"test:e2e": "playwright test"` script and devDeps `@playwright/test`
- `.gitignore` — add `test-results/`, `playwright-report/`

## Test scenarios

| # | Name | Mock response | Assertion |
|---|------|---------------|-----------|
| 1 | valid | `200 {ok:true}` | "Verified!" heading appears, onVerified fires (spy via `window.__otpVerified`) |
| 2 | invalid_code | `400 {ok:false,error:"invalid_code"}` | "Incorrect code. Please try again." visible; input cleared; first slot focused |
| 3 | no_code | `400 {ok:false,error:"no_code"}` | "No code found. Tap Resend…" visible; Resend button enabled immediately |
| 4 | expired | `400 {ok:false,error:"expired"}` | "This code has expired…" visible; Resend enabled |
| 5 | too_many_attempts | `429 {ok:false,error:"too_many_attempts"}` | Lockout card "Too many attempts — try again in 60s" visible; OTP input disabled; resend button shows "Locked (60s)" |

## Technical notes

- Playwright's `webServer` config will boot `vite` on port 8080 so CI runs standalone.
- Route pattern: `**/functions/v1/verify-otp` matches both local and Supabase URLs.
- Use `await page.route(..., route => route.fulfill({ status, contentType:'application/json', body: JSON.stringify(...) }))`.
- Fill OTP via `page.locator('input[autocomplete="one-time-code"]').pressSequentially('123456')` — the `input-otp` library exposes a single hidden input.
- For scenario 1 the harness exposes `window.__otpVerified = true` from its `onVerified` callback so the test can assert without a redirect.
- Do not run against the published preview URL — always against the local dev server to keep tests hermetic.

## Out of scope

- Server-side tests of the edge function itself (already validated).
- Resend cooldown timer (covered indirectly by the no_code/expired assertions).
- CI wiring — the npm script is sufficient; user can plug it into their pipeline.
