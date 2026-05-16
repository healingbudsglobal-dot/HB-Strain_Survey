// Admin-only diagnostic function to send branded test emails.
// Sends real Resend emails using the production templates with sample data.
// Skips DB inserts (leads/submissions) and the Make.com webhook.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ASSET_ORIGIN = "https://strain-match-finder.lovable.app";
const LOGO_URL = `${ASSET_ORIGIN}/hb-logo-white-full.png`;
const TRICHOME_FALLBACK = `${ASSET_ORIGIN}/email-trichomes.jpg`;

const STRAIN_IMAGE_BY_NAME: Record<string, string> = {
  "BlockBerry": `${ASSET_ORIGIN}/strains/blockberry.jpg`,
  "Blue Zushi": `${ASSET_ORIGIN}/strains/blue-zushi.jpg`,
  "Candy Pave": `${ASSET_ORIGIN}/strains/candy-pave.jpg`,
  "Caribbean Breeze": `${ASSET_ORIGIN}/strains/caribbean-breeze.jpg`,
  "Femme Fatale": `${ASSET_ORIGIN}/strains/femme-fatale.jpg`,
  "NFS 12": `${ASSET_ORIGIN}/strains/nfs-12.jpg`,
  "Peanut Butter Breath": `${ASSET_ORIGIN}/strains/peanut-butter-breath.jpg`,
};

function strainImageFor(name: unknown): string {
  const key = String(name ?? '').trim();
  return STRAIN_IMAGE_BY_NAME[key] || TRICHOME_FALLBACK;
}

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(raw: unknown): string {
  const s = String(raw ?? '').trim();
  if (!/^https:\/\/[^\s"'<>]+$/i.test(s)) return '#';
  return esc(s);
}

function buildEffectPills(effects: string): string {
  return String(effects || '').split(', ').map(e =>
    `<td style="padding:0 4px 6px 0;"><span style="display:inline-block; padding:5px 12px; background-color:#162220; border:1px solid #2F3633; border-radius:20px; font-size:12px; color:#4DBFA1; font-weight:500;">${esc(e)}</span></td>`
  ).join('');
}

function buildFlavourPills(flavours: string): string {
  return String(flavours || '').split(', ').map(f =>
    `<td style="padding:0 4px 6px 0;"><span style="display:inline-block; padding:5px 12px; background-color:#1C1A14; border:1px solid #3D3520; border-radius:20px; font-size:12px; color:#E5A31E; font-weight:500;">${esc(f)}</span></td>`
  ).join('');
}

function buildOtpHtml(email: string, otpCode: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Healing Buds Verification Code (TEST)</title>
<style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Inter:wght@400;500&display=swap');body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}body{margin:0;padding:0;}</style></head>
<body style="margin:0;padding:0;background-color:#101414;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#101414;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="480" style="max-width:480px;width:100%;background-color:#1A1D1C;border:1px solid #2F3633;border-radius:16px;">
<tr><td style="height:3px;background:linear-gradient(90deg,#4DBFA1,#E5A31E,#4DBFA1);border-radius:16px 16px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td align="center" style="padding:32px 32px 16px;"><img src="${LOGO_URL}" alt="Healing Buds" width="180" style="display:block;width:180px;height:auto;"/></td></tr>
<tr><td align="center" style="padding:8px 32px 4px;"><h1 style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:22px;font-weight:700;color:#F0F3F2;letter-spacing:0.02em;">Verify Your Email</h1></td></tr>
<tr><td align="center" style="padding:4px 32px 24px;"><p style="margin:0;font-size:14px;line-height:1.6;color:#7F958E;">Enter the code below to verify <span style="color:#F0F3F2;font-weight:500;">${esc(email)}</span></p></td></tr>
<tr><td align="center" style="padding:0 32px 8px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td align="center" style="background-color:#101414;border:2px solid #E5A31E;border-radius:12px;padding:20px 40px;"><span style="font-family:'DM Sans','Courier New',monospace;font-size:36px;font-weight:700;letter-spacing:12px;color:#E5A31E;line-height:1;">${esc(otpCode)}</span></td></tr></table></td></tr>
<tr><td align="center" style="padding:12px 32px 28px;"><p style="margin:0;font-size:12px;color:#7F958E;">This code expires in <span style="color:#4DBFA1;font-weight:500;">5 minutes</span></p></td></tr>
<tr><td style="padding:0 32px;"><div style="height:1px;background-color:#2F3633;"></div></td></tr>
<tr><td align="center" style="padding:24px 32px 32px;">
<p style="margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;font-size:13px;font-weight:600;color:#F0F3F2;">Healing Buds</p>
<p style="margin:0 0 12px;font-size:11px;color:#7F958E;">Precision-matched medical cannabis · South Africa</p>
<p style="margin:0;font-size:11px;"><a href="https://healingbuds.co.za" style="color:#4DBFA1;text-decoration:none;">healingbuds.co.za</a> &middot; <a href="https://mystrain.healingbuds.co.za" style="color:#4DBFA1;text-decoration:none;">mystrain.healingbuds.co.za</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function buildResultsHtml(data: Record<string, string>): string {
  const name = data.name || 'there';
  const compatNum = parseInt(data.compatibility) || 92;
  const surveyKeys = [
    { key: 'exp_level', label: 'Experience Level' },
    { key: 'primary_vibe', label: 'Desired Vibe' },
    { key: 'specific_benefit', label: 'Primary Benefit' },
    { key: 'body_impact', label: 'Body Impact' },
    { key: 'terpene_pref', label: 'Terpene Preference' },
    { key: 'consumption_format', label: 'Consumption Method' },
    { key: 'time_of_day', label: 'Time of Day' },
  ];
  const profileRows = surveyKeys
    .filter(s => data[s.key])
    .map(s => `<tr><td style="padding:6px 0;border-bottom:1px solid #2F3633;"><span style="font-size:11px;color:#7F958E;text-transform:uppercase;letter-spacing:0.06em;">${esc(s.label)}</span><br/><span style="font-size:13px;color:#F0F3F2;font-weight:500;">${esc(data[s.key])}</span></td></tr>`)
    .join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Your Clinical Strain Profile (TEST)</title>
<style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Inter:wght@400;500&display=swap');img{border:0;height:auto;outline:none;text-decoration:none;}body{margin:0;padding:0;}</style></head>
<body style="margin:0;padding:0;background-color:#101414;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#101414;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="520" style="max-width:520px;width:100%;background-color:#1A1D1C;border:1px solid #2F3633;border-radius:16px;">
<tr><td style="height:3px;background:linear-gradient(90deg,#4DBFA1,#E5A31E,#4DBFA1);border-radius:16px 16px 0 0;">&nbsp;</td></tr>
<tr><td align="center" style="padding:32px 32px 16px;"><img src="${LOGO_URL}" alt="Healing Buds" width="180" style="display:block;width:180px;height:auto;"/></td></tr>
<tr><td align="center" style="padding:8px 32px 4px;"><h1 style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:22px;font-weight:700;color:#F0F3F2;letter-spacing:0.02em;">Your Clinical Strain Profile</h1></td></tr>
<tr><td align="center" style="padding:4px 32px 24px;"><p style="margin:0;font-size:14px;line-height:1.6;color:#7F958E;">Hey <span style="color:#F0F3F2;font-weight:500;">${esc(name)}</span>, your precision bio-mapping is complete. Here's your personalised match.</p></td></tr>
<tr><td style="padding:0 24px 20px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0B2A22;border:1px solid #14463A;border-radius:14px;overflow:hidden;">
<tr><td style="padding:0;font-size:0;line-height:0;"><img src="${strainImageFor(data.matched_strain)}" alt="${esc(data.matched_strain)}" width="520" style="display:block;width:100%;max-width:520px;height:200px;object-fit:cover;border-radius:14px 14px 0 0;"/></td></tr>
<tr><td style="padding:18px 22px 4px;background:linear-gradient(180deg,#0E3B2E,#0B2A22);">
<p style="margin:0 0 2px;font-size:10px;color:#7CE3B4;text-transform:uppercase;letter-spacing:0.16em;font-weight:700;">Your Matched Strain</p>
<h2 style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:30px;font-weight:700;color:#F0F3F2;letter-spacing:-0.01em;line-height:1.15;">${esc(data.matched_strain)}</h2>
</td></tr>
<tr><td align="center" style="padding:18px 22px 24px;background-color:#0B2A22;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr>
<td align="center" valign="middle" style="width:160px;padding-right:16px;"><svg xmlns="http://www.w3.org/2000/svg" width="150" height="96" viewBox="0 0 150 96" style="display:block;"><defs><linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7CE3B4"/><stop offset="100%" stop-color="#4DBFA1"/></linearGradient></defs><path d="M12,84 A63,63 0 0,1 138,84" fill="none" stroke="#14463A" stroke-width="14" stroke-linecap="round"/><path d="M12,84 A63,63 0 0,1 138,84" fill="none" stroke="url(#gg)" stroke-width="14" stroke-linecap="round" stroke-dasharray="198" stroke-dashoffset="${(198 * (100 - compatNum) / 100).toFixed(1)}"/><text x="75" y="74" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#7CE3B4">${compatNum}<tspan font-size="18" fill="#A0D9C4" dx="2">%</tspan></text></svg></td>
<td valign="middle"><p style="margin:0 0 4px;font-size:10px;color:#7CE3B4;text-transform:uppercase;letter-spacing:0.14em;font-weight:700;">Bio-Match Score</p>
<p style="margin:0 0 6px;font-family:'DM Sans',sans-serif;font-size:18px;font-weight:700;color:#F0F3F2;line-height:1.2;">${esc(data.compatibility)} compatibility</p>
<p style="margin:0;font-size:12px;line-height:1.5;color:#A0D9C4;">A precision match across your terpene, vibe &amp; lifestyle profile.</p></td>
</tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:0 24px 16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr>
<td style="width:33%;padding:0 4px 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#101414;border:1px solid #2F3633;border-radius:10px;"><tr><td align="center" style="padding:16px 8px;"><p style="margin:0 0 2px;font-size:10px;color:#7F958E;text-transform:uppercase;letter-spacing:0.08em;">THC</p><p style="margin:0;font-family:'DM Sans',sans-serif;font-size:22px;font-weight:700;color:#F0F3F2;">${esc(data.strain_thc)}</p></td></tr></table></td>
<td style="width:33%;padding:0 4px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#101414;border:1px solid #2F3633;border-radius:10px;"><tr><td align="center" style="padding:16px 8px;"><p style="margin:0 0 2px;font-size:10px;color:#7F958E;text-transform:uppercase;letter-spacing:0.08em;">CBD</p><p style="margin:0;font-family:'DM Sans',sans-serif;font-size:22px;font-weight:700;color:#F0F3F2;">${esc(data.strain_cbd)}</p></td></tr></table></td>
<td style="width:33%;padding:0 0 0 4px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#101414;border:1px solid #2F3633;border-radius:10px;"><tr><td align="center" style="padding:16px 8px;"><p style="margin:0 0 2px;font-size:10px;color:#7F958E;text-transform:uppercase;letter-spacing:0.08em;">Price</p><p style="margin:0;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:700;color:#F0F3F2;">${esc(data.strain_price)}</p></td></tr></table></td>
</tr></table></td></tr>
<tr><td style="padding:0 24px 8px;"><p style="margin:0 0 8px;font-size:11px;color:#7F958E;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Effects</p><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buildEffectPills(data.strain_effects)}</tr></table></td></tr>
<tr><td style="padding:0 24px 20px;"><p style="margin:0 0 8px;font-size:11px;color:#7F958E;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Flavour Profile</p><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buildFlavourPills(data.strain_flavours)}</tr></table></td></tr>
<tr><td align="center" style="padding:8px 32px 24px;"><a href="${safeUrl(data.strain_shop_url)}" style="display:inline-block;background:linear-gradient(135deg,#7CE3B4,#4DBFA1);color:#0B2A22;font-family:'DM Sans',Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;letter-spacing:0.02em;">Shop ${esc(data.matched_strain)} →</a></td></tr>
<tr><td style="padding:0 32px;"><div style="height:1px;background-color:#2F3633;"></div></td></tr>
${profileRows ? `<tr><td style="padding:24px 24px 8px;"><p style="margin:0 0 4px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;color:#F0F3F2;">📋 Your Bio-Map Profile</p><p style="margin:0 0 12px;font-size:12px;color:#7F958E;">Key answers that shaped your match</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">${profileRows}</table></td></tr>` : ''}
<tr><td align="center" style="padding:24px 32px 32px;">
<p style="margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;font-size:13px;font-weight:600;color:#F0F3F2;">Healing Buds</p>
<p style="margin:0 0 12px;font-size:11px;color:#7F958E;">Precision-matched medical cannabis · South Africa</p>
<p style="margin:0;font-size:11px;"><a href="https://healingbuds.co.za" style="color:#4DBFA1;text-decoration:none;">healingbuds.co.za</a> &middot; <a href="https://mystrain.healingbuds.co.za" style="color:#4DBFA1;text-decoration:none;">mystrain.healingbuds.co.za</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function buildAdminNotificationHtml(data: Record<string, string>): string {
  const surveyKeys = [
    { key: 'exp_level', label: 'Experience Level' },
    { key: 'primary_vibe', label: 'Desired Vibe' },
    { key: 'specific_benefit', label: 'Primary Benefit' },
    { key: 'body_impact', label: 'Body Impact' },
    { key: 'terpene_pref', label: 'Terpene Preference' },
    { key: 'consumption_format', label: 'Consumption Method' },
    { key: 'time_of_day', label: 'Time of Day' },
  ];
  const surveyRows = surveyKeys
    .filter(s => data[s.key])
    .map(s => `<tr><td style="padding:8px 12px;border-bottom:1px solid #2F3633;font-size:12px;color:#7F958E;">${esc(s.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #2F3633;font-size:13px;color:#F0F3F2;font-weight:500;">${esc(data[s.key])}</td></tr>`)
    .join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>New Lead — Healing Buds (TEST)</title></head>
<body style="margin:0;padding:0;background-color:#101414;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#101414;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="520" style="max-width:520px;width:100%;background-color:#1A1D1C;border:1px solid #2F3633;border-radius:16px;">
<tr><td style="height:3px;background:linear-gradient(90deg,#4DBFA1,#E5A31E,#4DBFA1);border-radius:16px 16px 0 0;">&nbsp;</td></tr>
<tr><td style="padding:24px 24px 16px;"><h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#4DBFA1;">🧬 New Bio-Map Lead</h1><p style="margin:0;font-size:13px;color:#7F958E;">${new Date().toLocaleString('en-ZA',{ timeZone: 'Africa/Johannesburg' })}</p></td></tr>
<tr><td style="padding:0 24px 16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#101414;border:1px solid #2F3633;border-radius:10px;"><tr><td style="padding:16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
<tr><td style="padding:4px 0;font-size:12px;color:#7F958E;">Name</td><td style="padding:4px 0;font-size:14px;color:#F0F3F2;font-weight:600;">${esc(data.name || '—')}</td></tr>
<tr><td style="padding:4px 0;font-size:12px;color:#7F958E;">Email</td><td style="padding:4px 0;font-size:14px;color:#4DBFA1;font-weight:500;">${esc(data.email)}</td></tr>
<tr><td style="padding:4px 0;font-size:12px;color:#7F958E;">WhatsApp</td><td style="padding:4px 0;font-size:14px;color:#F0F3F2;">${esc(data.whatsapp || '—')}</td></tr>
<tr><td style="padding:4px 0;font-size:12px;color:#7F958E;">Province</td><td style="padding:4px 0;font-size:14px;color:#F0F3F2;">${esc(data.province || '—')}</td></tr>
</table></td></tr></table></td></tr>
<tr><td style="padding:0 24px 16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#101414;border:1px solid #2F3633;border-radius:10px;"><tr><td style="padding:16px;">
<p style="margin:0 0 4px;font-size:11px;color:#7F958E;text-transform:uppercase;letter-spacing:0.1em;">Matched Strain</p>
<p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#E5A31E;">${esc(data.matched_strain)}</p>
<p style="margin:0;font-size:14px;color:#4DBFA1;font-weight:600;">${esc(data.compatibility)} compatibility</p>
</td></tr></table></td></tr>
${surveyRows ? `<tr><td style="padding:0 24px 16px;"><p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#F0F3F2;">Survey Answers</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#101414;border:1px solid #2F3633;border-radius:10px;">${surveyRows}</table></td></tr>` : ''}
<tr><td style="padding:16px 24px 24px;"><p style="margin:0;font-size:11px;color:#7F958E;">This is an automated notification from the Healing Buds Bio-Map Survey.</p></td></tr>
</table></td></tr></table></body></html>`;
}

const SAMPLE_PAYLOAD: Record<string, string> = {
  name: 'Test User',
  email: '',
  whatsapp: '+27 82 123 4567',
  province: 'Western Cape',
  matched_strain: 'Blue Zushi',
  compatibility: '92%',
  strain_thc: '24%',
  strain_cbd: '<1%',
  strain_price: 'R280/g',
  strain_effects: 'Relaxed, Uplifted, Creative',
  strain_flavours: 'Berry, Citrus, Earthy',
  strain_shop_url: 'https://healingbuds.co.za/shop/blue-zushi',
  exp_level: 'Intermediate',
  primary_vibe: 'Calm focus',
  specific_benefit: 'Stress relief',
  body_impact: 'Light body, clear head',
  terpene_pref: 'Limonene-forward',
  consumption_format: 'Vape',
  time_of_day: 'Evening',
};

async function sendResend(apiKey: string, from: string, to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: [to], subject, html,
      headers: { 'List-Unsubscribe': '<mailto:healingbudsglobal@gmail.com?subject=unsubscribe>' },
      tags: [{ name: 'category', value: 'test' }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    // Verify caller is an authenticated admin
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: hasRole, error: roleErr } = await admin.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });
    if (roleErr || !hasRole) {
      return new Response(JSON.stringify({ error: 'Forbidden — admin only' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || 'send'); // 'send' | 'preview'
    const recipientRaw = String(body.recipient || '').trim().toLowerCase();
    const template = String(body.template || 'all');

    // Preview mode: render templates and return HTML/subject without sending.
    if (mode === 'preview') {
      const previewEmail = recipientRaw && /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(recipientRaw)
        ? recipientRaw
        : 'preview@example.com';
      const sample = { ...SAMPLE_PAYLOAD, email: previewEmail };
      const code = '123456';
      const previews: Record<string, { subject: string; html: string }> = {
        otp: {
          subject: `[TEST] ${code} is your Healing Buds code`,
          html: buildOtpHtml(previewEmail, code),
        },
        results: {
          subject: `[TEST] Your Strain Match: ${sample.matched_strain} (${sample.compatibility} compatibility)`,
          html: buildResultsHtml(sample),
        },
        admin: {
          subject: `[TEST] 🧬 New Lead: ${sample.name} → ${sample.matched_strain} (${sample.compatibility})`,
          html: buildAdminNotificationHtml(sample),
        },
      };
      return new Response(JSON.stringify({ success: true, previews }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(recipientRaw)) {
      return new Response(JSON.stringify({ error: 'Invalid recipient email' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const wantOtp = template === 'otp' || template === 'all';
    const wantResults = template === 'results' || template === 'all';
    const wantAdmin = template === 'admin' || template === 'all';

    const results: Record<string, { ok: boolean; status: number; resend_id?: string; error?: string }> = {};
    const sample = { ...SAMPLE_PAYLOAD, email: recipientRaw };

    const logSend = async (template_name: string, subject: string, ok: boolean, resend_id: string | null, error: unknown) => {
      try {
        await admin.from('email_send_log').insert({
          recipient_email: recipientRaw,
          template_name,
          subject,
          resend_id,
          status: ok ? 'sent' : 'failed',
          error_message: ok ? null : JSON.stringify(error).slice(0, 500),
          metadata: { test: true, triggered_by: userData.user.email },
        });
      } catch (e) { console.error('email_send_log insert failed:', e); }
    };

    if (wantOtp) {
      const code = '123456';
      const subject = `[TEST] ${code} is your Healing Buds code`;
      const r = await sendResend(RESEND_API_KEY, 'Healing Buds <noreply@send.healingbuds.co.za>', recipientRaw, subject, buildOtpHtml(recipientRaw, code));
      results.otp = { ok: r.ok, status: r.status, resend_id: r.data?.id, error: r.ok ? undefined : JSON.stringify(r.data) };
      await logSend('test_otp', subject, r.ok, r.ok ? (r.data?.id ?? null) : null, r.data);
    }
    if (wantResults) {
      const subject = `[TEST] Your Strain Match: ${sample.matched_strain} (${sample.compatibility} compatibility)`;
      const r = await sendResend(RESEND_API_KEY, 'Healing Buds <noreply@send.healingbuds.co.za>', recipientRaw, subject, buildResultsHtml(sample));
      results.results = { ok: r.ok, status: r.status, resend_id: r.data?.id, error: r.ok ? undefined : JSON.stringify(r.data) };
      await logSend('test_results', subject, r.ok, r.ok ? (r.data?.id ?? null) : null, r.data);
    }
    if (wantAdmin) {
      const subject = `[TEST] 🧬 New Lead: ${sample.name} → ${sample.matched_strain} (${sample.compatibility})`;
      const r = await sendResend(RESEND_API_KEY, 'Healing Buds Bio-Map <noreply@send.healingbuds.co.za>', recipientRaw, subject, buildAdminNotificationHtml(sample));
      results.admin = { ok: r.ok, status: r.status, resend_id: r.data?.id, error: r.ok ? undefined : JSON.stringify(r.data) };
      await logSend('test_admin_notification', subject, r.ok, r.ok ? (r.data?.id ?? null) : null, r.data);
    }

    const allOk = Object.values(results).every(r => r.ok);
    return new Response(JSON.stringify({ success: allOk, results }), {
      status: allOk ? 200 : 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('send-test-email error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
