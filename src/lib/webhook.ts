import { supabase } from "@/integrations/supabase/client";

const WEBHOOK_URL = "https://hook.eu1.make.com/70z505ty60nkksvtl6l6r1yzj4cs58tb";

/** Legacy direct webhook — kept as fallback */
export async function sendWebhook(data: Record<string, unknown>): Promise<void> {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        source: "healing-buds-biomap",
        ...data,
      }),
    });
  } catch (err) {
    console.error("Webhook error:", err);
  }
}

/**
 * Post the user's email plus all 15 survey answers directly to the Make.com webhook
 * as a JSON POST. Returns { ok, status } so callers can show a retry message on non-200.
 */
export async function postSurveyAnswersWebhook(
  email: string,
  answers: Record<string, string>
): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "survey_answers",
        timestamp: new Date().toISOString(),
        source: "healing-buds-biomap",
        email,
        survey_answers: answers,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("Survey webhook error:", err);
    return { ok: false, status: 0 };
  }
}

/** Send OTP verification email via Resend (edge function). Returns true on success. */
export async function sendOtpEmail(email: string, otpCode: string): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke("send-otp-email", {
      body: { email, otp_code: otpCode },
    });
    if (error) {
      console.error("OTP email error:", error);
      await sendWebhook({ email, otp_code: otpCode, type: "otp_verification" });
      return false;
    }
    return true;
  } catch (err) {
    console.error("OTP email failed, falling back to webhook:", err);
    await sendWebhook({ email, otp_code: otpCode, type: "otp_verification" });
    return false;
  }
}

/** Submit survey results — sends email via Resend + logs to Google Sheets via Make.com. Returns true on success. */
export async function submitResults(payload: Record<string, string>): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke("submit-results", {
      body: payload,
    });
    if (error) {
      console.error("Submit results error:", error);
      await sendWebhook(payload);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Submit results failed, falling back to webhook:", err);
    await sendWebhook(payload);
    return false;
  }
}
