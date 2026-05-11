/**
 * Pure-TS mirrors of the email HTML builders in:
 *  - supabase/functions/send-otp-email/index.ts
 *  - supabase/functions/submit-results/index.ts
 *
 * IMPORTANT: keep these in sync with the edge-function templates.
 * The visual snapshot test (e2e/email-snapshots.spec.ts) renders these
 * to catch brand/template regressions.
 */

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildOtpHtml(email: string, otpCode: string): string {
  const safeEmail = escapeHtml(email);
  const safeCode = escapeHtml(otpCode);
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Healing Buds Verification Code</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#101414; font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#101414;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="480" style="max-width:480px; width:100%; background-color:#1A1D1C; border:1px solid #2F3633; border-radius:16px;">
      <tr><td style="height:3px; background:linear-gradient(90deg, #4DBFA1, #E5A31E, #4DBFA1); border-radius:16px 16px 0 0; font-size:0; line-height:0;">&nbsp;</td></tr>
      <tr><td align="center" style="padding:32px 32px 16px;">
        <img src="https://biomapsurvey.lovable.app/images/hb-logo-white-full.png" alt="Healing Buds" width="180" style="display:block; width:180px; height:auto;" />
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
              <span style="font-size:11px; color:#4DBFA1; font-weight:500; letter-spacing:0.08em; text-transform:uppercase;">EU GMP Certified</span>
            </td>
          </tr></table></td>
          <td align="center" style="padding:0 12px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding:8px 16px; border:1px solid #2F3633; border-radius:8px; background-color:#101414;">
              <span style="font-size:11px; color:#4DBFA1; font-weight:500; letter-spacing:0.08em; text-transform:uppercase;">POPIA Compliant</span>
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
        <p style="margin:0 0 12px; font-size:11px; color:#7F958E;">Precision-matched medical cannabis &middot; South Africa</p>
        <p style="margin:0; font-size:11px;">
          <a href="https://healingbuds.co.za" style="color:#4DBFA1; text-decoration:none;">healingbuds.co.za</a>
          &nbsp;&middot;&nbsp;
          <a href="https://mystrain.healingbuds.co.za" style="color:#4DBFA1; text-decoration:none;">mystrain.healingbuds.co.za</a>
        </p>
      </td></tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="480" style="max-width:480px; width:100%;">
      <tr><td align="center" style="padding:20px 16px;">
        <p style="margin:0; font-size:10px; color:#7F958E;">&copy; 2026 Healing Buds (Pty) Ltd. All rights reserved.<br/>This is a transactional email related to your strain bio-mapping verification.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildEffectPills(effects: string): string {
  return effects.split(", ").map(e =>
    `<td style="padding:0 4px 6px 0;"><span style="display:inline-block; padding:5px 12px; background-color:#162220; border:1px solid #2F3633; border-radius:20px; font-size:12px; color:#4DBFA1; font-weight:500;">${e}</span></td>`
  ).join("");
}

function buildFlavourPills(flavours: string): string {
  return flavours.split(", ").map(f =>
    `<td style="padding:0 4px 6px 0;"><span style="display:inline-block; padding:5px 12px; background-color:#1C1A14; border:1px solid #3D3520; border-radius:20px; font-size:12px; color:#E5A31E; font-weight:500;">${f}</span></td>`
  ).join("");
}

export function buildResultsHtml(data: Record<string, string>): string {
  const name = data.name || "there";
  const compatNum = parseInt(data.compatibility) || 85;

  const surveyKeys = [
    { key: "exp_level", label: "Experience Level" },
    { key: "primary_vibe", label: "Desired Vibe" },
    { key: "specific_benefit", label: "Primary Benefit" },
    { key: "body_impact", label: "Body Impact" },
    { key: "terpene_pref", label: "Terpene Preference" },
    { key: "consumption_format", label: "Consumption Method" },
    { key: "time_of_day", label: "Time of Day" },
  ];

  const profileRows = surveyKeys
    .filter(s => data[s.key])
    .map(s => `<tr><td style="padding:6px 0; border-bottom:1px solid #2F3633;"><span style="font-size:11px; color:#7F958E; text-transform:uppercase; letter-spacing:0.06em;">${s.label}</span><br/><span style="font-size:13px; color:#F0F3F2; font-weight:500;">${data[s.key]}</span></td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Clinical Strain Profile - Healing Buds</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#101414; font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#101414;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="520" style="max-width:520px; width:100%; background-color:#1A1D1C; border:1px solid #2F3633; border-radius:16px;">
      <tr><td style="height:3px; background:linear-gradient(90deg, #4DBFA1, #E5A31E, #4DBFA1); border-radius:16px 16px 0 0; font-size:0; line-height:0;">&nbsp;</td></tr>
      <tr><td align="center" style="padding:32px 32px 16px;"><img src="https://biomapsurvey.lovable.app/images/hb-logo-white-full.png" alt="Healing Buds" width="180" style="display:block; width:180px; height:auto;" /></td></tr>
      <tr><td align="center" style="padding:8px 32px 4px;"><h1 style="margin:0; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:22px; font-weight:700; color:#F0F3F2; letter-spacing:0.02em;">Your Clinical Strain Profile</h1></td></tr>
      <tr><td align="center" style="padding:4px 32px 24px;"><p style="margin:0; font-size:14px; line-height:1.6; color:#7F958E;">Hey <span style="color:#F0F3F2; font-weight:500;">${name}</span>, your precision bio-mapping is complete. Here's your personalised match.</p></td></tr>

      <tr><td style="padding:0 24px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#0B2A22; border:1px solid #14463A; border-radius:14px; overflow:hidden;">
          <tr><td style="padding:0; font-size:0; line-height:0;">
            <img src="${data.strain_image_url || "https://biomapsurvey.lovable.app/images/email-trichomes.jpg"}" alt="${data.matched_strain}" width="520" style="display:block; width:100%; max-width:520px; height:200px; object-fit:cover; border-radius:14px 14px 0 0;" />
          </td></tr>
          <tr><td style="padding:18px 22px 4px; background:linear-gradient(180deg, #0E3B2E, #0B2A22);">
            <p style="margin:0 0 2px; font-size:10px; color:#7CE3B4; text-transform:uppercase; letter-spacing:0.16em; font-weight:700;">Your Matched Strain</p>
            <h2 style="margin:0; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:30px; font-weight:700; color:#F0F3F2; letter-spacing:-0.01em; line-height:1.15;">${data.matched_strain}</h2>
          </td></tr>
          <tr><td align="center" style="padding:18px 22px 24px; background-color:#0B2A22;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
              <tr>
                <td align="center" valign="middle" style="width:160px; padding-right:16px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="150" height="96" viewBox="0 0 150 96" style="display:block;">
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#7CE3B4"/>
                        <stop offset="100%" stop-color="#4DBFA1"/>
                      </linearGradient>
                    </defs>
                    <path d="M12,84 A63,63 0 0,1 138,84" fill="none" stroke="#14463A" stroke-width="14" stroke-linecap="round"/>
                    <path d="M12,84 A63,63 0 0,1 138,84" fill="none" stroke="url(#gaugeGrad)" stroke-width="14" stroke-linecap="round" stroke-dasharray="198" stroke-dashoffset="${(198 * (100 - compatNum) / 100).toFixed(1)}"/>
                    <text x="75" y="74" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#7CE3B4">${compatNum}<tspan font-size="18" fill="#A0D9C4" dx="2">%</tspan></text>
                  </svg>
                </td>
                <td valign="middle" style="vertical-align:middle;">
                  <p style="margin:0 0 4px; font-size:10px; color:#7CE3B4; text-transform:uppercase; letter-spacing:0.14em; font-weight:700;">Bio-Match Score</p>
                  <p style="margin:0 0 6px; font-family:'DM Sans',sans-serif; font-size:18px; font-weight:700; color:#F0F3F2; line-height:1.2;">${data.compatibility} compatibility</p>
                  <p style="margin:0; font-size:12px; line-height:1.5; color:#A0D9C4;">A precision match across your terpene, vibe &amp; lifestyle profile.</p>
                </td>
              </tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%; margin-top:16px; height:8px; background-color:#14463A; border-radius:4px;">
              <tr><td style="width:${compatNum}%; height:8px; background:linear-gradient(90deg, #7CE3B4, #4DBFA1); border-radius:4px; font-size:0; line-height:0;">&nbsp;</td><td style="font-size:0; line-height:0;">&nbsp;</td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 24px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
          <tr>
            <td style="width:33%; padding:0 4px 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#101414; border:1px solid #2F3633; border-radius:10px;">
                <tr><td align="center" style="padding:16px 8px;">
                  <p style="margin:0 0 2px; font-size:10px; color:#7F958E; text-transform:uppercase; letter-spacing:0.08em;">THC</p>
                  <p style="margin:0; font-family:'DM Sans',sans-serif; font-size:22px; font-weight:700; color:#F0F3F2;">${data.strain_thc}</p>
                </td></tr>
              </table>
            </td>
            <td style="width:33%; padding:0 4px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#101414; border:1px solid #2F3633; border-radius:10px;">
                <tr><td align="center" style="padding:16px 8px;">
                  <p style="margin:0 0 2px; font-size:10px; color:#7F958E; text-transform:uppercase; letter-spacing:0.08em;">CBD</p>
                  <p style="margin:0; font-family:'DM Sans',sans-serif; font-size:22px; font-weight:700; color:#F0F3F2;">${data.strain_cbd}</p>
                </td></tr>
              </table>
            </td>
            <td style="width:33%; padding:0 0 0 4px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#101414; border:1px solid #2F3633; border-radius:10px;">
                <tr><td align="center" style="padding:16px 8px;">
                  <p style="margin:0 0 2px; font-size:10px; color:#7F958E; text-transform:uppercase; letter-spacing:0.08em;">Price</p>
                  <p style="margin:0; font-family:'DM Sans',sans-serif; font-size:16px; font-weight:700; color:#F0F3F2;">${data.strain_price}</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 24px 8px;">
        <p style="margin:0 0 8px; font-size:11px; color:#7F958E; text-transform:uppercase; letter-spacing:0.08em; font-weight:600;">Effects</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buildEffectPills(data.strain_effects)}</tr></table>
      </td></tr>
      <tr><td style="padding:0 24px 20px;">
        <p style="margin:0 0 8px; font-size:11px; color:#7F958E; text-transform:uppercase; letter-spacing:0.08em; font-weight:600;">Flavour Profile</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buildFlavourPills(data.strain_flavours)}</tr></table>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 24px;">
        <a href="${data.strain_shop_url}" style="display:inline-block; background:linear-gradient(135deg, #7CE3B4, #4DBFA1); color:#0B2A22; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:15px; font-weight:700; text-decoration:none; padding:16px 40px; border-radius:10px; letter-spacing:0.02em;">Shop ${data.matched_strain} &rarr;</a>
      </td></tr>

      <tr><td style="padding:0 32px;"><div style="height:1px; background-color:#2F3633;"></div></td></tr>
      <tr><td style="padding:24px 24px 8px;">
        <p style="margin:0 0 4px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; color:#F0F3F2;">Your Bio-Map Profile</p>
        <p style="margin:0 0 12px; font-size:12px; color:#7F958E;">Key answers that shaped your match</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
          ${profileRows}
        </table>
      </td></tr>

      <tr><td align="center" style="padding:24px 32px 32px;">
        <p style="margin:0 0 8px; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; font-size:13px; font-weight:600; color:#F0F3F2;">Healing Buds</p>
        <p style="margin:0; font-size:11px; color:#7F958E;">Precision-matched medical cannabis &middot; South Africa</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export const SAMPLE_OTP = {
  email: "snapshot@healingbuds.co.za",
  code: "428193",
};

export const SAMPLE_RESULTS: Record<string, string> = {
  name: "Alex",
  email: "snapshot@healingbuds.co.za",
  matched_strain: "Northern Lights",
  compatibility: "92%",
  strain_thc: "18%",
  strain_cbd: "0.5%",
  strain_price: "R450",
  strain_effects: "Relaxed, Sleepy, Euphoric, Happy",
  strain_flavours: "Pine, Earthy, Sweet",
  strain_shop_url: "https://healingbuds.co.za/shop/northern-lights",
  exp_level: "Intermediate",
  primary_vibe: "Calm & Grounded",
  specific_benefit: "Better Sleep",
  body_impact: "Heavy Body Relaxation",
  terpene_pref: "Myrcene-forward",
  consumption_format: "Vape",
  time_of_day: "Evening",
};
