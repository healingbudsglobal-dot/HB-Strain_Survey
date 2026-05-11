
# Fix WhatsApp send, broken email assets, blurred hero, and same-strain bug

I dug into the code + database. Here's what I found and what I'll fix.

## What's actually wrong

**1. Logo + trichome image broken in emails**
Both emails reference `https://biomapsurvey.lovable.app/images/hb-logo-white-full.png` and `…/images/email-trichomes.jpg`. The files are in `public/` (root), not `/images/`, and that domain isn't this project. So both render as broken icons in Gmail.

**2. Strain hero image broken in emails**
The client posts `strain_image_url = strain.imageUrl`, but `strain.imageUrl` is a Vite-bundled asset path (e.g. `/assets/nfs-12-abc123.jpg`) — not an absolute URL. Email clients resolve it to nothing.

**3. WhatsApp doesn't send**
There is no edge function or Twilio call anywhere — only a `wa.me` link helper. WhatsApp send was never wired. We need a Twilio (or WhatsApp Cloud API) integration.

**4. Same strain every time ("NFS 12 · 65%")**
Confirmed in DB — 3 wildly different submissions all returned `NFS 12 / 65%`. Two issues in `src/lib/strainMatcher.ts`:
- `Math.max(compatibility, 65)` floors every score to 65%, masking the real match quality.
- On ties (very common with the current weights), `Array.sort` keeps source order, so the same strain wins repeatedly. There's also no tie-break by strain quality / freshness.

**5. Hero buds are blurred**
`HeroBackdrop.tsx` applies `blur(1.5px)` (2px on mobile) plus heavy tint/vignette overlays — that's why it doesn't look like clear emerald glass.

**6. "Show me all tests sent to healingbudsglobal@gmail.com"**
This project sends via Resend directly with no `email_send_log` table, so there's nothing to query today. I'll add a lightweight log table the admin dashboard can read.

## Plan

### A. Email fixes (`supabase/functions/submit-results/index.ts` + `send-otp-email`)
- Switch logo + trichome `<img src>` to the verified published origin (`https://strain-match-finder.lovable.app/hb-logo-white-full.png` and `…/email-trichomes.jpg` — paths that actually exist).
- For the strain hero, server-side map `data.matched_strain` → an absolute hosted image URL (upload the 7 strain JPGs to `/public/strains/<slug>.jpg` and reference them by slug) instead of trusting the bundled client path.
- Add `text` body fallbacks (already present in OTP, missing in results).

### B. Email audit log
- New table `email_send_log` (id, recipient, template, subject, resend_id, status, error, created_at) with admin-only RLS.
- Both edge functions insert a row after each Resend call.
- Add a "Email Log" panel in `AdminDashboard.tsx` filtered to `healingbudsglobal@gmail.com` by default so you can see every test send.

### C. Hero clarity (`src/components/HeroBackdrop.tsx`)
- Drop the `blur()` filter to 0.
- Reduce `--tint-a` / `--vignette-a` so the bud reads as a sharp emerald-glass photo.
- Keep grain + gentle scrim only at top/bottom for text legibility.
- Bump saturation slightly so green pops without color cast.

### D. Strain matcher (`src/lib/strainMatcher.ts`)
- Remove the `Math.max(..., 65)` floor — return the real percentage; if you still want a friendly minimum we'll display "Best available match" copy when score < 60%.
- Re-balance ties: deterministic but answer-driven tie-break (THC closest to user's intensity preference, then strain `name` hash of the user email so different users get different ties).
- Audit the mapping table for the 5 in-stock strains so each `primary_vibe` has at least 2 distinct winners across the catalog (currently NFS 12 wins many tie groups because of broad effect overlap).
- Add a unit-style sanity log in dev mode to verify diversity.

### E. WhatsApp send (requires your decision — see Technical Notes)
Two ways to actually send WhatsApp:
- **Option 1 — Twilio WhatsApp** via the existing connector. Lowest setup, ~$0.005/msg. Requires Twilio account + approved WhatsApp sender.
- **Option 2 — Make.com scenario** (you already use Make for sheets). I'd add a `send-whatsapp` step to the same webhook; you'd wire WhatsApp Cloud API or 360dialog inside Make.

I'd default to **Option 1 (Twilio)** because it's a single edge function and you already have Resend set up similarly. I'll add a `send-whatsapp` edge function that runs after `submit-results` saves the lead, fires the templated message from `whatsapp_templates` (the table already exists), and writes status back to `leads.whatsapp_status` / `whatsapp_sent_at`.

## Technical notes

- New Supabase migration for `email_send_log` (admin SELECT only, service-role INSERT).
- 7 strain JPGs need to be copied from `src/assets/strains/` to `public/strains/` so they're servable at a stable URL for emails.
- Twilio integration needs `TWILIO_API_KEY` + `TWILIO_AUTH_TOKEN` (or the connector flow) — I'll prompt for those only after you confirm Option 1.
- Edge functions auto-deploy.

## Open questions before I build

1. WhatsApp: confirm **Twilio** (Option 1) or **Make.com** (Option 2)?
2. For the strain matcher, OK to **drop the 65% floor** and show real scores (some users may see 42%)?
