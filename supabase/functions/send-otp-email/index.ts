const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function buildOtpHtml(email: string, otpCode: string): string {
  const digits = String(otpCode).split('');
  // White digits on solid emerald gradient — survives Gmail dark-mode inversion
  const digitCells = digits
    .map(
      (d) =>
        `<td align="center" style="padding:0 5px;"><div style="display:inline-block; min-width:48px; padding:18px 10px; background:#0F3D35; background-image:linear-gradient(160deg,#1F8B72 0%,#0E5A48 55%,#0A3D31 100%); border:1px solid #4DBFA1; border-radius:14px; font-family:'DM Sans','Courier New',monospace; font-size:34px; font-weight:700; color:#FFFFFF; letter-spacing:0.02em; line-height:1; text-shadow:0 1px 0 rgba(0,0,0,0.35);">${d}</div></td>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="dark only" />
  <meta name="supported-color-schemes" content="dark only" />
  <title>Your Healing Buds Verification Code</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display:block; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    a { color:#7FE3C4; }
    /* Force dark — block Gmail color inversion on key elements */
    u + .body .gmail-fix { color:#FFFFFF !important; }
  </style>
</head>
<body class="body" style="margin:0; padding:0; background-color:#050B0A; font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; color:transparent;">
  ${otpCode} is your Healing Buds code — expires in 5 minutes.
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#050B0A" style="background-color:#050B0A;">
  <tr>
    <td align="center" style="padding:32px 12px; background:#050B0A; background-image:radial-gradient(ellipse 80% 50% at 50% 0%,#0F3D35 0%,#050B0A 70%);">

      <!-- Aurora ribbon above card -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="540" style="max-width:540px; width:100%;">
        <tr><td height="6" style="height:6px; font-size:0; line-height:0; background:linear-gradient(90deg,#4DBFA1 0%,#A8E6CF 35%,#7FE3C4 65%,#4DBFA1 100%); border-radius:6px 6px 0 0;">&nbsp;</td></tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="540" bgcolor="#0A1614" style="max-width:540px; width:100%; background-color:#0A1614; border:1px solid #1F4A40; border-top:none; border-radius:0 0 22px 22px; overflow:hidden;">

        <!-- Hero band with trichomes + dark scrim + logo overlay -->
        <tr>
          <td bgcolor="#071210" style="padding:0; background-color:#071210; position:relative;">
            <!--[if !mso]><!-->
            <div style="position:relative; line-height:0;">
              <img src="https://mystrain.healingbuds.co.za/images/email-trichomes.jpg" alt="" width="540" style="width:100%; max-width:540px; height:auto; display:block; opacity:0.55;" />
            </div>
            <!--<![endif]-->
          </td>
        </tr>

        <!-- Logo + eyebrow tucked under hero -->
        <tr>
          <td align="center" bgcolor="#0A1614" style="padding:28px 32px 4px; background-color:#0A1614;">
            <img src="https://mystrain.healingbuds.co.za/images/hb-logo-white-full.png" alt="Healing Buds" width="180" style="display:block; width:180px; height:auto; margin:0 auto 18px;" />
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td bgcolor="#0F3D35" style="padding:7px 16px; background-color:#0F3D35; border:1px solid #4DBFA1; border-radius:999px;">
                <span style="font-family:'DM Sans',Arial,sans-serif; font-size:10px; color:#A8E6CF; font-weight:700; letter-spacing:0.22em; text-transform:uppercase;">✦ Secure Bio-Map Access</span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Headline (white only — inversion safe) -->
        <tr><td align="center" bgcolor="#0A1614" style="padding:22px 32px 6px; background-color:#0A1614;">
          <h1 class="gmail-fix" style="margin:0; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:30px; font-weight:800; color:#FFFFFF; letter-spacing:-0.02em; line-height:1.1;">
            Your access code<br/>is ready to roll.
          </h1>
        </td></tr>

        <tr><td align="center" bgcolor="#0A1614" style="padding:10px 32px 26px; background-color:#0A1614;">
          <p style="margin:0; font-size:13px; line-height:1.6; color:#9DB8B1;">For <span style="color:#FFFFFF; font-weight:600;">${email}</span></p>
        </td></tr>

        <!-- OTP digit cells -->
        <tr><td align="center" bgcolor="#0A1614" style="padding:0 20px 14px; background-color:#0A1614;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>${digitCells}</tr></table>
        </td></tr>

        <tr><td align="center" bgcolor="#0A1614" style="padding:18px 32px 6px; background-color:#0A1614;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td bgcolor="#0F3D35" style="padding:8px 16px; background-color:#0F3D35; border:1px solid #2C7D7A; border-radius:999px;">
              <span style="font-family:'DM Sans',Arial,sans-serif; font-size:11px; color:#A8E6CF; font-weight:600; letter-spacing:0.08em;">⏱ Expires in 5 minutes · One-time use</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Divider -->
        <tr><td bgcolor="#0A1614" style="padding:28px 32px 8px; background-color:#0A1614;"><div style="height:1px; background:#1F4A40; line-height:1px; font-size:0;">&nbsp;</div></td></tr>

        <!-- Trust badges row -->
        <tr><td align="center" bgcolor="#0A1614" style="padding:14px 24px 8px; background-color:#0A1614;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td align="center" style="padding:0 6px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#0F2925" style="padding:9px 14px; background-color:#0F2925; border:1px solid #2C7D7A; border-radius:8px;"><span style="font-family:'DM Sans',Arial,sans-serif; font-size:10px; color:#A8E6CF; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;">✓ EU GMP</span></td></tr></table></td>
            <td align="center" style="padding:0 6px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#0F2925" style="padding:9px 14px; background-color:#0F2925; border:1px solid #2C7D7A; border-radius:8px;"><span style="font-family:'DM Sans',Arial,sans-serif; font-size:10px; color:#A8E6CF; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;">🔒 POPIA</span></td></tr></table></td>
            <td align="center" style="padding:0 6px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#0F2925" style="padding:9px 14px; background-color:#0F2925; border:1px solid #2C7D7A; border-radius:8px;"><span style="font-family:'DM Sans',Arial,sans-serif; font-size:10px; color:#A8E6CF; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;">🌱 Lab Verified</span></td></tr></table></td>
          </tr></table>
        </td></tr>

        <tr><td align="center" bgcolor="#0A1614" style="padding:18px 32px 4px; background-color:#0A1614;"><p style="margin:0; font-size:12px; line-height:1.6; color:#7E9892;">Didn't request this? Just ignore — your account stays safe.</p></td></tr>

        <!-- Footer -->
        <tr><td align="center" bgcolor="#071210" style="padding:24px 32px 28px; background-color:#071210; border-top:1px solid #1F4A40;">
          <p style="margin:0 0 6px; font-family:'DM Sans',Arial,sans-serif; font-size:13px; font-weight:700; color:#FFFFFF; letter-spacing:0.18em;">HEALING&nbsp;BUDS</p>
          <p style="margin:0 0 10px; font-size:11px; color:#7E9892;">Precision-matched botanical wellness · South Africa</p>
          <p style="margin:0; font-size:11px;"><a href="https://healingbuds.co.za" style="color:#7FE3C4; text-decoration:none; font-weight:600;">healingbuds.co.za</a> &nbsp;·&nbsp; <a href="https://mystrain.healingbuds.co.za" style="color:#7FE3C4; text-decoration:none; font-weight:600;">mystrain.healingbuds.co.za</a></p>
        </td></tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="540" style="max-width:540px; width:100%;">
        <tr><td align="center" style="padding:18px 16px 8px;"><p style="margin:0; font-size:10px; color:#4F6B65; line-height:1.6;">© 2026 Healing Buds (Pty) Ltd · Transactional verification email<br/>Sent because you started a strain bio-mapping session.</p></td></tr>
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
