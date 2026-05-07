import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "@supabase/supabase-js";

const MAX_ATTEMPTS = 5;

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json();
    const trimmedEmail = String(email ?? '').trim().toLowerCase();
    const trimmedCode = String(code ?? '').trim();

    if (
      !trimmedEmail ||
      trimmedEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) ||
      !/^\d{6}$/.test(trimmedCode)
    ) {
      return new Response(
        JSON.stringify({ ok: false, error: 'invalid_input' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: rows, error: selErr } = await admin
      .from('otp_codes')
      .select('id, code_hash, expires_at, consumed_at, attempts')
      .eq('email', trimmedEmail)
      .order('created_at', { ascending: false })
      .limit(1);

    if (selErr) {
      console.error('select error:', selErr);
      return new Response(
        JSON.stringify({ ok: false, error: 'server_error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const row = rows?.[0];
    if (!row) {
      return new Response(
        JSON.stringify({ ok: false, error: 'no_code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (row.consumed_at) {
      return new Response(
        JSON.stringify({ ok: false, error: 'already_used' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (new Date(row.expires_at).getTime() <= Date.now()) {
      return new Response(
        JSON.stringify({ ok: false, error: 'expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if ((row.attempts ?? 0) >= MAX_ATTEMPTS) {
      return new Response(
        JSON.stringify({ ok: false, error: 'too_many_attempts' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const candidateHash = await sha256Hex(trimmedCode);
    const matched = timingSafeEqual(candidateHash, row.code_hash);

    if (!matched) {
      await admin
        .from('otp_codes')
        .update({ attempts: (row.attempts ?? 0) + 1 })
        .eq('id', row.id);
      return new Response(
        JSON.stringify({ ok: false, error: 'invalid_code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await admin
      .from('otp_codes')
      .update({ consumed_at: new Date().toISOString() })
      .eq('id', row.id);

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('verify-otp error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'server_error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
