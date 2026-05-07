import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function buildOtpHtml(email: string, otpCode: string): string {
  const digits = String(otpCode).split('');
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0F1F1E;font-family:Inter,system-ui,sans-serif;color:#E8F0EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F1F1E;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="540" style="max-width:540px;width:100%;background:#162C2A;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:32px 32px 16px;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#A8E6CF;">Healing Buds — Verification</h1>
        <p style="margin:0 0 24px;font-size:14px;color:#B8C9C7;">Hi ${email}, your one-time code is:</p>
        <div style="font-family:'Courier New',monospace;font-size:36px;letter-spacing:12px;color:#FFFFFF;background:#0B1817;padding:20px;border-radius:12px;text-align:center;font-weight:700;">
          ${digits.join('')}
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#8FA3A1;">This code expires in 5 minutes. If you didn't request it, you can safely ignore this email.</p>
      </td></tr>
      <tr><td align="center" style="padding:18px 16px 28px;"><p style="margin:0;font-size:10px;color:#4F6B65;line-height:1.6;">© 2026 Healing Buds (Pty) Ltd · Transactional verification email</p></td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function generateOtpCode(): string {
  // Cryptographically secure 6-digit code
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0] % 900000));
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trimmed = String(email).trim().toLowerCase();
    if (trimmed.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    // Generate the OTP server-side, store only its hash.
    const otp_code = generateOtpCode();
    const code_hash = await sha256Hex(otp_code);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { error: insertErr } = await admin
      .from('otp_codes')
      .insert({ email: trimmed, code_hash, expires_at });
    if (insertErr) {
      console.error('otp insert error:', insertErr);
      return new Response(
        JSON.stringify({ error: 'Failed to issue code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const textBody = [
      `Healing Buds — Bio-Map Verification`,
      ``,
      `Your verification code: ${otp_code}`,
      ``,
      `This code expires in 5 minutes and can only be used once.`,
      ``,
      `If you didn't request this code, ignore this email.`,
      ``,
      `— Healing Buds`,
    ].join('\n');

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Healing Buds <noreply@send.healingbuds.co.za>',
        to: [trimmed],
        subject: `${otp_code} is your Healing Buds code`,
        html: buildOtpHtml(trimmed, otp_code),
        text: textBody,
        headers: {
          'List-Unsubscribe': '<mailto:healingbudsglobal@gmail.com?subject=unsubscribe>',
        },
        tags: [
          { name: 'category', value: 'transactional' },
          { name: 'type', value: 'otp_verification' },
        ],
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Never return the code to the client.
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('send-otp-email error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
