import { Page } from "@playwright/test";

type VerifyResponse =
  | { status: number; body: { ok: true } }
  | { status: number; body: { ok: false; error: string } };

export async function mockVerifyOtp(page: Page, response: VerifyResponse) {
  await page.route("**/functions/v1/verify-otp", async (route) => {
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({
        status: 200,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "POST, OPTIONS",
        },
        body: "",
      });
    }
    await route.fulfill({
      status: response.status,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(response.body),
    });
  });
}

export async function mockSendOtp(page: Page) {
  await page.route("**/functions/v1/send-otp-email", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ ok: true }),
    });
  });
}

export async function gotoOtp(page: Page) {
  await page.goto("/test/otp");
  await page.locator('input[autocomplete="one-time-code"]').waitFor({ state: "attached" });
}

export async function fillOtp(page: Page, code = "123456") {
  const input = page.locator('input[autocomplete="one-time-code"]');
  await input.click();
  await input.pressSequentially(code, { delay: 20 });
}
