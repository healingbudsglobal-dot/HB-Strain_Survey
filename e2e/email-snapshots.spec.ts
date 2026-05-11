/**
 * Visual snapshot tests for transactional email templates.
 *
 * Renders the OTP and Results email HTML (mirrored in
 * e2e/fixtures/email-templates.ts) directly into the page, blocks
 * remote font/image requests for determinism, and snapshots the result.
 *
 * Update baselines:  npx playwright test email-snapshots --update-snapshots
 */
import { test, expect, type Route } from "@playwright/test";
import {
  buildOtpHtml,
  buildResultsHtml,
  SAMPLE_OTP,
  SAMPLE_RESULTS,
} from "./fixtures/email-templates";

// 1x1 transparent PNG used to stub all <img> sources for stable snapshots.
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

async function stubExternalAssets(route: Route) {
  const url = route.request().url();
  if (url.startsWith("data:") || url.startsWith("about:")) {
    return route.continue();
  }
  const type = route.request().resourceType();
  if (type === "image") {
    return route.fulfill({
      status: 200,
      contentType: "image/png",
      body: TRANSPARENT_PNG,
    });
  }
  if (type === "font" || type === "stylesheet") {
    return route.fulfill({ status: 200, contentType: "text/css", body: "" });
  }
  return route.continue();
}

test.describe("Email visual snapshots", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/*", stubExternalAssets);
  });

  test("OTP email renders consistently", async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 1000 });
    await page.setContent(buildOtpHtml(SAMPLE_OTP.email, SAMPLE_OTP.code), {
      waitUntil: "load",
    });
    await page.evaluate(() => (document as any).fonts?.ready);
    await expect(page).toHaveScreenshot("otp-email.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });

  test("Results email renders consistently", async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 1600 });
    await page.setContent(buildResultsHtml(SAMPLE_RESULTS), {
      waitUntil: "load",
    });
    await page.evaluate(() => (document as any).fonts?.ready);
    await expect(page).toHaveScreenshot("results-email.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });
});
