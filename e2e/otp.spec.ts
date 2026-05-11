import { test, expect } from "@playwright/test";
import { fillOtp, gotoOtp, mockSendOtp, mockVerifyOtp } from "./helpers/otpHarness";

test.beforeEach(async ({ page }) => {
  await mockSendOtp(page);
});

test("valid code → Verified! and onVerified fires", async ({ page }) => {
  await mockVerifyOtp(page, { status: 200, body: { ok: true } });
  await gotoOtp(page);
  await fillOtp(page);

  await expect(page.getByRole("heading", { name: "Verified!" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__otpVerified === true)).toBe(true);
});

test("invalid_code → error shown, input cleared & re-focused", async ({ page }) => {
  await mockVerifyOtp(page, {
    status: 400,
    body: { ok: false, error: "invalid_code" },
  });
  await gotoOtp(page);
  await fillOtp(page);

  await expect(page.getByRole("alert")).toHaveText(/Incorrect code/i);
  const input = page.locator('input[autocomplete="one-time-code"]');
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
});

test("no_code → error shown, Resend immediately enabled", async ({ page }) => {
  await mockVerifyOtp(page, {
    status: 400,
    body: { ok: false, error: "no_code" },
  });
  await gotoOtp(page);
  await fillOtp(page);

  await expect(page.getByRole("alert")).toHaveText(/No code found/i);
  await expect(page.getByRole("button", { name: /Resend code/i })).toBeEnabled();
});

test("expired → expiry message, Resend enabled", async ({ page }) => {
  await mockVerifyOtp(page, {
    status: 400,
    body: { ok: false, error: "expired" },
  });
  await gotoOtp(page);
  await fillOtp(page);

  await expect(page.getByRole("alert")).toHaveText(/expired/i);
  await expect(page.getByRole("button", { name: /Resend code/i })).toBeEnabled();
});

test("too_many_attempts → lockout card visible, input disabled", async ({ page }) => {
  await mockVerifyOtp(page, {
    status: 429,
    body: { ok: false, error: "too_many_attempts" },
  });
  await gotoOtp(page);
  await fillOtp(page);

  await expect(page.getByText(/Too many attempts — try again in/i)).toBeVisible();
  await expect(page.locator('input[autocomplete="one-time-code"]')).toBeDisabled();
  await expect(page.getByRole("button", { name: /Locked \(\d+s\)/ })).toBeDisabled();
});
