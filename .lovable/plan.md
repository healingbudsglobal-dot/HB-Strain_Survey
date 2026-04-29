# Admin Settings — WhatsApp Templates & Number

## What you'll get

A new **Settings** page inside the admin area where you can:

1. **Edit the WhatsApp Business number** that messages are sent from (currently hardcoded as `+351939455949` — Portugal number from chat). Saved to the `app_settings` table so changing it later is one-click.
2. **Manage WhatsApp message templates** — edit the existing 2 templates, add new ones, mark one as **Default** (the one used when you click "WhatsApp" on a lead in the dashboard).
3. **Insert variables with one click**: `{{name}}`, `{{strain}}`, `{{compatibility}}`, `{{shop_url}}`, `{{province}}` — pasted into the message body wherever your cursor is.
4. **Live preview** showing the message with sample data filled in.
5. **Channel priority toggle** (WhatsApp-first vs Email-first) — already exists as a setting, surfaced here.

The Admin Dashboard's existing "WhatsApp" button on each lead row will read the **Default template** + **business number** from settings instead of using hardcoded text.

## Page layout

```text
/admin/settings
─────────────────────────────────────────
[ Channel & Number ]
  Business WhatsApp number: [+351939455949    ] [Save]
  Channel priority:         (•) WhatsApp first  ( ) Email first

[ Message Templates ]                   [ + New Template ]
  ┌──────────────────────────────────┐
  │ ★ Default Match Follow-up        │ [Set Default] [Delete]
  │ Variables: name, strain, compat. │
  │ ┌──────────────────────────────┐ │
  │ │ Hi {{name}} 👋 ...           │ │  ← editable textarea
  │ └──────────────────────────────┘ │
  │ Insert: [name][strain][compat.]  │
  │ Preview: "Hi Sarah 👋 ..."       │
  │                          [Save]  │
  └──────────────────────────────────┘
  ┌── Quick Check-in ──────────────────┐
  ...
```

## Technical notes

**Files to create**
- `src/pages/AdminSettings.tsx` — the settings page (auth-guarded, admin-role checked)
- `src/lib/whatsappTemplate.ts` — shared helper `renderTemplate(body, lead)` that swaps `{{var}}` → real values, plus `buildWaLink(number, body)` that returns the `https://wa.me/...` URL

**Files to update**
- `src/App.tsx` — add `/admin/settings` route
- `src/pages/AdminDashboard.tsx` — add a **Settings** link in the header; replace the inline `buildWhatsAppLink` and `HB_WHATSAPP_BUSINESS` constant with `renderTemplate` + `buildWaLink` reading from `app_settings.whatsapp_business_number` and the default `whatsapp_templates` row (fetched once on mount, cached in state)

**Database** — no schema changes needed. Both tables (`app_settings`, `whatsapp_templates`) already exist with correct RLS (`Admins manage` policies). We'll use:
- `app_settings.whatsapp_business_number` (existing, value `+351939455949`)
- `app_settings.channel_priority` (existing, value `whatsapp_first`)
- `whatsapp_templates` (2 existing rows, `is_default` flag drives which is used)

**Variables supported in templates** — `{{name}}`, `{{strain}}`, `{{compatibility}}`, `{{shop_url}}`, `{{province}}`. The `variables` jsonb column on each template tracks which ones are referenced so the preview/insert chips match.

**Default-template invariant** — when a user marks a template as default, we run a 2-step update: clear `is_default` on all rows, then set it on the chosen row. (Simple client-side, no trigger needed.)

**Auth** — the page checks `session` and `has_role(admin)` exactly like `AdminDashboard.tsx` does today; redirects to `/admin/login` otherwise.

## Out of scope (future)

- Auto-send via Meta Cloud API or Twilio — this page sets you up so when we add auto-send, your templates and number are already configured.
- Email template editor — `email_templates` table exists; can be added in a follow-up using the same pattern.
- Per-campaign template overrides.

## Approve to build

Ship this and your dashboard immediately uses whatever number + message you save, no more code edits to change copy.