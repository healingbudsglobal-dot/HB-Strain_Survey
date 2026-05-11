import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildOtpHtml(email: string, otpCode: string): string {
  const safeEmail = escapeHtml(email);
  const safeCode = escapeHtml(otpCode);
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Your Healing Buds Verification Code</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Inter:wght@400;500&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#101414; font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">Your verification code is ${safeCode} — valid for 5 minutes.&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#101414;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="480" style="max-width:480px; width:100%; background-color:#1A1D1C; border:1px solid #2F3633; border-radius:16px;">
      <tr><td style="height:3px; background:linear-gradient(90deg, #4DBFA1, #E5A31E, #4DBFA1); border-radius:16px 16px 0 0; font-size:0; line-height:0;">&nbsp;</td></tr>
      <tr><td align="center" style="padding:32px 32px 16px;">
        <img src="https://strain-match-finder.lovable.app/hb-logo-white-full.png" alt="Healing Buds" width="180" style="display:block; width:180px; height:auto;" />
      </td></tr>
      <tr><td align="center" style="padding:8px 32px 4px;">
        <h1 style="margin:0; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:22px; font-weight:700; color:#F0F3F2; letter-spacing:0.02em;">Verify Your Email</h1>
      </td></tr>
      <tr><td align="center" style="padding:4px 32px 24px;">
        <p style="margin:0; font-size:14px; line-height:1.6; color:#7F958E;">Enter the code below to verify <span style="color:#F0F3F2; font-weight:500;">${safeEmail}</span></p>
      </td></tr>
      <tr><td align="center" style="padding:0 32px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
          <td align="center" style="background-color:#101414; border:2px solid #E5A31E; border-radius:12px; padding:20px 40px;">
            <span style="font-family:'DM Sans','Courier New',monospace; font-size:36px; font-weight:700; letter-spacing:12px; color:#E5A31E; line-height:1;">${safeCode}</span>
          </td>
        </tr></table>
      </td></tr>
      <tr><td align="center" style="padding:12px 32px 28px;">
        <p style="margin:0; font-size:12px; color:#7F958E;">This code expires in <span style="color:#4DBFA1; font-weight:500;">5 minutes</span></p>
      </td></tr>
      <tr><td style="padding:0 32px;"><div style="height:1px; background-color:#2F3633;"></div></td></tr>
      <tr><td align="center" style="padding:24px 32px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td align="center" style="padding:0 12px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding:8px 16px; border:1px solid #2F3633; border-radius:8px; background-color:#101414;">
              <span style="font-size:11px; color:#4DBFA1; font-weight:500; letter-spacing:0.08em; text-transform:uppercase;">✓ EU GMP Certified</span>
            </td>
          </tr></table></td>
          <td align="center" style="padding:0 12px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding:8px 16px; border:1px solid #2F3633; border-radius:8px; background-color:#101414;">
              <span style="font-size:11px; color:#4DBFA1; font-weight:500; letter-spacing:0.08em; text-transform:uppercase;">🔒 POPIA Compliant</span>
            </td>
          </tr></table></td>
        </tr></table>
      </td></tr>
      <tr><td align="center" style="padding:16px 32px 28px;">
        <p style="margin:0; font-size:12px; line-height:1.5; color:#7F958E;">If you didn't request this code, you can safely ignore this email.<br/>Your information is secure and protected.</p>
      </td></tr>
      <tr><td style="padding:0 32px;"><div style="height:1px; background-color:#2F3633;"></div></td></tr>
      <tr><td align="center" style="padding:24px 32px 32px;">
        <p style="margin:0 0 8px; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:13px; font-weight:600; color:#F0F3F2;">Healing Buds</p>
        <p style="margin:0 0 12px; font-size:11px; color:#7F958E;">Precision-matched medical cannabis · South Africa</p>
        <p style="margin:0; font-size:11px;">
          <a href="https://healingbuds.co.za" style="color:#4DBFA1; text-decoration:none;">healingbuds.co.za</a>
          &nbsp;&middot;&nbsp;
          <a href="https://mystrain.healingbuds.co.za" style="color:#4DBFA1; text-decoration:none;">mystrain.healingbuds.co.za</a>
        </p>
      </td></tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="480" style="max-width:480px; width:100%;">
      <tr><td align="center" style="padding:20px 16px;">
        <p style="margin:0; font-size:10px; color:#7F958E;">© 2026 Healing Buds (Pty) Ltd. All rights reserved.<br/>This is a transactional email related to your strain bio-mapping verification.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
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

    // Rate limit: max 5 codes per email per 10 minutes, and min 30s between sends
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recent, error: recentErr } = await admin
      .from('otp_codes')
      .select('created_at')
      .eq('email', trimmed)
      .gte('created_at', tenMinAgo)
      .order('created_at', { ascending: false });
    if (recentErr) {
      console.error('rate check error:', recentErr);
    } else if (recent && recent.length > 0) {
      if (recent.length >= 5) {
        return new Response(
          JSON.stringify({ error: 'Too many code requests. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const lastSent = new Date(recent[0].created_at).getTime();
      if (Date.now() - lastSent < 30 * 1000) {
        return new Response(
          JSON.stringify({ error: 'Please wait a moment before requesting another code.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

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
    // Audit log (admin-visible)
    try {
      await admin.from('email_send_log').insert({
        recipient_email: trimmed,
        template_name: 'otp_verification',
        subject: `${otp_code} is your Healing Buds code`,
        resend_id: resendRes.ok ? (resendData?.id ?? null) : null,
        status: resendRes.ok ? 'sent' : 'failed',
        error_message: resendRes.ok ? null : JSON.stringify(resendData).slice(0, 500),
      });
    } catch (e) { console.error('email_send_log otp insert failed:', e); }
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
