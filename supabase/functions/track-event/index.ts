// Lightweight event tracker — inserts a row into lead_events using the service role.
// Used to track conversion events like "whatsapp_click" with full UTM/source context.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface TrackEventBody {
  event_type: string;
  email?: string;
  payload?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as TrackEventBody;
    if (!body?.event_type || typeof body.event_type !== "string") {
      return new Response(JSON.stringify({ error: "event_type required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Try to resolve lead_id from the most recent lead with this email.
    let lead_id: string | null = null;
    if (body.email) {
      const { data } = await supabase
        .from("leads")
        .select("id")
        .eq("email", body.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      lead_id = data?.id ?? null;
    }

    const payload = {
      ...(body.payload ?? {}),
      email: body.email ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
    };

    const { error } = await supabase.from("lead_events").insert({
      event_type: body.event_type,
      lead_id,
      payload,
    });

    if (error) {
      console.error("track-event insert error:", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("track-event error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
