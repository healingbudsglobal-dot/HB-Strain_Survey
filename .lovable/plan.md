## Healing Buds Growth Platform — Strategic Roadmap

Goal: evolve the current single-page funnel into a measurable growth engine with a separated admin portal, full analytics, ad-platform integrations, campaign automation, and exportable reports.

---

### Domain & App Architecture

```text
mystrain.healingbuds.co.za   →  Public funnel (survey, OTP, results)
sosuit.healingbuds.co.za     →  Admin portal (login, dashboard, campaigns, reports)
```

How: same Lovable project, same DB. Detect hostname at boot in `App.tsx`:
- `mystrain.*` → mounts public routes only (`/`, `/results`)
- `sosuit.*` → mounts admin routes only (`/login`, `/dashboard`, `/campaigns`, `/reports`, `/settings`)
- Localhost/preview → both

DNS: A-record `sosuit` → `185.158.133.1`, then add the custom domain in Project Settings → Domains.

---

### Phase 2A — Conversion Optimization (funnel)

Industry-validated lifts:

1. Survey FIRST, OTP AFTER teasing the result ("Your match is ready — verify email to unlock"). Expected +25–40% completed leads.
2. Trim survey to 8 core required questions + 7 optional "refine my match".
3. Persist survey progress to localStorage (resume on refresh).
4. WhatsApp opt-in becomes the primary CTA on the contact step ("Get your match instantly on WhatsApp"); email is fallback.
5. Social proof bar on squeeze (live counter + 3 rotating testimonials).
6. Capture UTM params (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referrer`, `landing_page`, `device`, `gclid`, `fbclid`, `ttclid`) into the `leads` and `survey_submissions` tables.

---

### Phase 2B — Admin Portal at sosuit.healingbuds.co.za

Sections:

- **Login** — email/password + Google sign-in. Admin role enforced via `user_roles` table + `has_role()` security-definer function. Only `healingbudsglobal@gmail.com` seeded as admin initially.
- **Dashboard** — KPIs: leads today/week/month, completion rate, top strain, top province, top campaign, WA opt-in %, unread/uncontacted count.
- **Leads** — current table + filters (campaign, source, contacted, opted-in WA, province, date range), bulk export CSV.
- **Campaigns** — see Phase 2C.
- **Reports** — see Phase 2D.
- **Settings**:
  - Editable WhatsApp Business number
  - Editable WhatsApp prefilled message templates (named, multiple)
  - Editable OTP email subject/body
  - Editable results email template
  - Toggle: WhatsApp-first vs email-first delivery
  - Pixel IDs: Meta Pixel, TikTok Pixel, Google Ads, GA4 measurement ID
  - Webhook URL (Make.com) editable

---

### Phase 2C — Campaign Builder & Ad Automation

Create named campaigns without code:

- Form: name, source (Meta / TikTok / Google / Email / Organic), budget, start/end date, custom UTMs, custom hero headline, hero image upload, primary CTA color, A/B variant slot.
- Auto-generates trackable URL: `https://mystrain.healingbuds.co.za/?c={slug}` which expands to full UTM set on landing.
- Per-campaign view: impressions, clicks, leads, completed surveys, WA opt-ins, CPL, ROAS (when ad-spend pulled).
- A/B framework: per campaign, define 2–4 variants (different hero copy/image/CTA), traffic auto-split, winner highlighted at statistical significance.
- One-click duplicate / pause / archive.
- "Send to ads" buttons (Phase 2C.2):
  - **Google Ads**: create/edit responsive search ads via Google Ads API (requires Google Ads OAuth + developer token)
  - **Meta Ads**: create/edit ad sets via Marketing API (requires Meta Business + access token)
  - **TikTok Ads**: create campaigns via TikTok Marketing API
  - Each platform: edit headlines, descriptions, destination URL (auto-uses campaign trackable URL), budget, status (active/paused)

---

### Phase 2D — Analytics, Reports & Exports

**Pixels & tracking** (auto-fired from funnel based on Settings IDs):
- Meta Pixel: PageView, ViewContent (per question), Lead (contact submit), CompleteRegistration (success)
- TikTok Pixel: same event mapping
- Google Ads conversion + GA4 events
- Server-side conversion API mirror (Meta CAPI, TikTok Events API, Google Enhanced Conversions) via edge functions for iOS 14+ accuracy

**Reports section**:
- Funnel report: drop-off per step, completion rate, time-on-step
- Campaign performance: leads, CPL, ROAS, by-day trend
- Channel mix: pie + table
- Strain match distribution
- WhatsApp engagement: opt-in %, sent, replied, contacted-to-sale
- Geographic: leads by province (SA map heatmap)
- Date range picker, compare-to-previous-period

**Exports**:
- CSV: leads, submissions, campaigns
- PDF: branded report (weekly/monthly summary)
- Scheduled email digest: daily/weekly to admin
- Direct push to Google Sheets connector (replaces fragile Make.com webhook)

**Ad-spend ingestion** (for true CPL/ROAS):
- Daily edge function pulls spend from Meta/Google/TikTok ad APIs into `ad_spend_daily` table
- Joined with leads on `utm_campaign` for unified ROI

---

### Phase 2E — WhatsApp Automation (optional, volume-dependent)

- Twilio WhatsApp connector for automated send when `whatsapp_opt_in = true`
- Approved templates managed from Settings
- Inbound replies logged to lead timeline (Twilio webhook → edge function)
- Lead pipeline: New → Contacted → Replied → Booked → Sold → Lost

---

### Database Schema Changes

New columns on `leads` and `survey_submissions`:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- `referrer`, `landing_page`, `device_type`, `browser`
- `gclid`, `fbclid`, `ttclid`
- `campaign_id` (FK)
- `variant` (A/B slot)
- Lead pipeline: `status`, `notes`, `last_contacted_at`

New tables:
- `user_roles` (user_id, role) + `has_role()` security definer fn
- `campaigns` (slug, name, source, budget, dates, hero_headline, hero_image_url, cta_color, status, ab_parent_id)
- `campaign_variants` (campaign_id, variant_label, traffic_weight, hero_headline, hero_image_url, cta_color)
- `campaign_metrics_daily` (campaign_id, date, impressions, clicks, leads, completions, spend, source)
- `ad_spend_daily` (date, source, campaign_id_external, campaign_id, spend, impressions, clicks)
- `whatsapp_templates` (name, body, variables, is_default)
- `email_templates` (key, subject, html_body)
- `app_settings` (key, value) — singleton row for WA number, pixel IDs, channel priority, webhook URL
- `lead_events` (lead_id, event_type, payload, created_at) — timeline log

---

### Technical Details

- Hostname split via `window.location.hostname` in `App.tsx` mounting different `Routes` trees. Shared components reused.
- Admin auth via Lovable Cloud auth (email + Google), role check via `has_role(auth.uid(), 'admin')`. RLS on all admin tables: SELECT/UPDATE only for admins, INSERT for service role.
- UTM capture: `useUtmTracking()` hook reads `URLSearchParams` on mount, persists to sessionStorage, attaches to all submissions.
- Pixels: dynamic injection from `app_settings`; conditional on production hostnames only.
- Server-side conversion APIs: 3 edge functions (`meta-capi`, `tiktok-events`, `google-conversions`) called from `submit-results`.
- Ad-platform connectors: each requires OAuth setup; user supplies credentials in Settings or via Lovable Cloud secrets.
- Reports: built with existing chart libs; PDF export via `pdf-lib` or HTML→PDF in edge function.
- Google Sheets connector replaces Make.com webhook for primary sync; Make.com kept as fallback toggle.

---

### Implementation Order (recommended)

1. **2A** — funnel reorder, UTM capture, social proof, WA-first opt-in, progress save (1 session)
2. **Domain split** — sosuit.healingbuds.co.za + admin role gating + auth (1 session)
3. **2B settings** — editable templates, WA number, pixel IDs, channel priority (1 session)
4. **2C campaigns** — campaign builder + trackable URLs + dynamic hero (1 session)
5. **Pixels + GA4** — Meta/TikTok/Google client + server-side events (1 session)
6. **2D reports** — funnel/campaign/channel reports + CSV/PDF export + scheduled digest (2 sessions)
7. **Ad APIs** — Meta/Google/TikTok create-ad-from-Lovable + spend ingestion (2 sessions, per platform)
8. **2E WhatsApp automation** — Twilio + pipeline + inbound replies (1 session)
9. **A/B testing framework** (1 session)

Total: ~11 focused sessions to a complete platform. Each phase ships independently and adds value.

---

### Decisions Needed Before Build

- Confirm sosuit subdomain DNS will be added (or use a different subdomain).
- Confirm priority order — recommend 2A + Domain Split + 2B first (highest ROI, unlocks everything else).
- Which ad platforms first: Meta, Google, TikTok, or all three?
- WhatsApp automation now (Twilio) or later?
- Pixel IDs: do you have Meta Pixel / TikTok Pixel / GA4 / Google Ads conversion IDs ready, or set up later in Settings?