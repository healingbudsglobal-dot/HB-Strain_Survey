const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function buildOtpHtml(email: string, otpCode: string): string {
  const digits = String(otpCode).split('');
  const digitCells = digits
    .map(
      (d) =>
        `<td align="center" style="padding:0 4px;"><div style="display:inline-block; min-width:44px; padding:14px 8px; background:linear-gradient(180deg,#0E2622 0%,#0A1A18 100%); border:1px solid rgba(77,191,161,0.35); border-radius:12px; box-shadow: 0 0 24px -8px rgba(77,191,161,0.45), inset 0 1px 0 rgba(255,255,255,0.04); font-family:'DM Sans','Courier New',monospace; font-size:30px; font-weight:700; color:#A8E6CF; letter-spacing:0.04em; line-height:1;">${d}</div></td>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Your Healing Buds Verification Code</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Inter:wght@400;500&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display:block; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    a { color:#4DBFA1; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#070D0C; font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
  Your verification code is ${otpCode} — valid for 5 minutes.
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:radial-gradient(ellipse at top,#0E2622 0%,#070D0C 60%);">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="520" style="max-width:520px; width:100%; background-color:#0B1716; border:1px solid rgba(77,191,161,0.18); border-radius:20px; overflow:hidden; box-shadow:0 30px 80px -20px rgba(0,0,0,0.6);">
        <!-- Aurora top bar -->
        <tr><td style="height:3px; background:linear-gradient(90deg, transparent, #4DBFA1, #A8E6CF, #4DBFA1, transparent); font-size:0; line-height:0;">&nbsp;</td></tr>

        <!-- Hero image band with logo overlay -->
        <tr>
          <td style="position:relative; padding:0; background-color:#0A1A18;">
            <img src="https://mystrain.healingbuds.co.za/images/email-trichomes.jpg" alt="" width="520" style="width:100%; max-width:520px; height:auto; display:block; opacity:0.85;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 32px 8px; background:linear-gradient(180deg, rgba(11,23,22,0) 0%, #0B1716 60%); margin-top:-60px; position:relative;">
            <img src="https://mystrain.healingbuds.co.za/images/hb-logo-white-full.png" alt="Healing Buds" width="170" style="display:block; width:170px; height:auto; margin:0 auto;" />
          </td>
        </tr>

        <!-- Eyebrow chip -->
        <tr><td align="center" style="padding:18px 32px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:6px 14px; border:1px solid rgba(77,191,161,0.35); border-radius:999px; background-color:rgba(77,191,161,0.08);"><span style="font-size:10px; color:#A8E6CF; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;">✦ Bio-Map Verification</span></td></tr></table>
        </td></tr>

        <!-- Headline -->
        <tr><td align="center" style="padding:14px 32px 4px;">
          <h1 style="margin:0; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:28px; font-weight:700; color:#F0F3F2; letter-spacing:-0.01em; line-height:1.15;">
            Your <span style="background:linear-gradient(110deg,#A8E6CF,#4DBFA1,#7FE3C4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; color:#4DBFA1;">access code</span><br/>is ready.
          </h1>
        </td></tr>

        <tr><td align="center" style="padding:8px 32px 24px;">
          <p style="margin:0; font-size:14px; line-height:1.6; color:#8FA8A2;">For <span style="color:#F0F3F2; font-weight:500;">${email}</span></p>
        </td></tr>

        <!-- OTP digit cells -->
        <tr><td align="center" style="padding:0 24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>${digitCells}</tr></table>
        </td></tr>

        <tr><td align="center" style="padding:14px 32px 8px;">
          <p style="margin:0; font-size:12px; color:#8FA8A2;">Expires in <span style="color:#A8E6CF; font-weight:600;">5 minutes</span> · One-time use</p>
        </td></tr>

        <!-- Trust badges -->
        <tr><td align="center" style="padding:24px 32px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding:0 8px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:8px 14px; border:1px solid rgba(77,191,161,0.25); border-radius:8px; background:linear-gradient(180deg,rgba(77,191,161,0.06),rgba(77,191,161,0.02));"><span style="font-size:10px; color:#A8E6CF; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;">✓ EU GMP</span></td></tr></table></td>
              <td align="center" style="padding:0 8px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:8px 14px; border:1px solid rgba(77,191,161,0.25); border-radius:8px; background:linear-gradient(180deg,rgba(77,191,161,0.06),rgba(77,191,161,0.02));"><span style="font-size:10px; color:#A8E6CF; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;">🔒 POPIA</span></td></tr></table></td>
              <td align="center" style="padding:0 8px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:8px 14px; border:1px solid rgba(77,191,161,0.25); border-radius:8px; background:linear-gradient(180deg,rgba(77,191,161,0.06),rgba(77,191,161,0.02));"><span style="font-size:10px; color:#A8E6CF; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;">🌱 Lab Verified</span></td></tr></table></td>
            </tr>
          </table>
        </td></tr>

        <tr><td align="center" style="padding:20px 32px 8px;"><p style="margin:0; font-size:12px; line-height:1.6; color:#8FA8A2;">Didn't request this? Ignore this email — your account stays safe.</p></td></tr>

        <tr><td style="padding:20px 32px 0;"><div style="height:1px; background:linear-gradient(90deg, transparent, rgba(77,191,161,0.2), transparent);"></div></td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding:24px 32px 32px;">
          <p style="margin:0 0 6px; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:13px; font-weight:600; color:#F0F3F2; letter-spacing:0.04em;">HEALING BUDS</p>
          <p style="margin:0 0 12px; font-size:11px; color:#8FA8A2;">Precision-matched botanical wellness · South Africa</p>
          <p style="margin:0; font-size:11px;"><a href="https://healingbuds.co.za" style="color:#4DBFA1; text-decoration:none;">healingbuds.co.za</a> &middot; <a href="https://mystrain.healingbuds.co.za" style="color:#4DBFA1; text-decoration:none;">mystrain.healingbuds.co.za</a></p>
        </td></tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="520" style="max-width:520px; width:100%;">
        <tr><td align="center" style="padding:20px 16px;"><p style="margin:0; font-size:10px; color:#5A726C; line-height:1.6;">© 2026 Healing Buds (Pty) Ltd · Transactional verification email<br/>Sent because you started a strain bio-mapping session.</p></td></tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp_code } = await req.json();

    if (!email || !otp_code) {
      return new Response(
        JSON.stringify({ error: 'email and otp_code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Server-side email format validation
    const trimmed = String(email).trim().toLowerCase();
    if (trimmed.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!/^\d{6}$/.test(String(otp_code))) {
      return new Response(
        JSON.stringify({ error: 'Invalid OTP code format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Healing Buds <noreply@send.healingbuds.co.za>',
        to: [email],
        subject: `Your Healing Buds Verification Code: ${otp_code}`,
        html: buildOtpHtml(email, otp_code),
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('send-otp-email error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
