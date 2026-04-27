

## Plan: WhatsApp Lead Collection & Automation Strategy

### Research Summary — Current Method

**What you already have:**
- ✅ Optional WhatsApp number captured on `ContactCapture` screen (free text, no validation)
- ✅ Stored in `leads.whatsapp` column in Lovable Cloud database
- ✅ Sent in admin email notification via Resend
- ✅ Forwarded to Make.com webhook → Google Sheets
- ✅ Visible in admin dashboard

**Gaps:**
1. No phone format validation (any text accepted — bad data risk)
2. No country code prefix helper (SA users may type `0821234567` instead of `+27821234567` — breaks WhatsApp deep links)
3. No automated WhatsApp message sent to the lead (manual follow-up only)
4. No "Click to WhatsApp" button in the admin dashboard for fast outreach
5. No tracking of which leads have been contacted

### Best Practice Research

**WhatsApp Business — three tiers:**

| Option | Cost | Use Case | Setup |
|---|---|---|---|
| **WhatsApp Business App** (free) | Free | <100 msgs/day, manual replies on a phone | Just install the app |
| **WhatsApp Click-to-Chat links** (`wa.me/`) | Free | Send pre-filled messages from email/dashboard | No setup — works today |
| **WhatsApp Business API (Cloud API via Meta)** | Pay-per-conversation (~$0.03–0.08 per SA conversation) | Automated messages, templates, chatbots | Meta Business verification + approved templates |

**Industry best practice for cannabis/medical leads (POPIA-compliant):**
- Always require explicit opt-in checkbox before storing WhatsApp number
- Send a single "session-opening" WhatsApp template within 24h of opt-in
- Use it to deliver the strain match + a single CTA (book consult / shop)
- Never spam — WhatsApp will block your number fast

### Proposed Solution — Three-Phase Rollout

**Phase 1 — Quick wins (no API cost, ship today)**
1. Add a proper phone input with country selector (default +27 South Africa) on `ContactCapture.tsx` — uses `react-phone-number-input` library, validates E.164 format
2. Add explicit POPIA opt-in checkbox: *"Send my strain match via WhatsApp"*
3. Store validated `whatsapp_e164` + `whatsapp_opt_in` (boolean) in the `leads` table
4. Add a **"Message on WhatsApp"** button on each row in the admin dashboard — opens `https://wa.me/{number}?text={pre-filled-strain-match-message}` in a new tab
5. Add a **"Contacted"** toggle on each lead so you can track follow-up status

**Phase 2 — Automated WhatsApp delivery (requires Meta setup)**
1. Connect **Twilio WhatsApp** (already available as a Lovable connector — uses gateway, no SDK needed) OR **Meta Cloud API** directly
2. Create an edge function `send-whatsapp-match` that fires after `submit-results` when `whatsapp_opt_in = true`
3. Send an approved template message: *"Hi {name}, your Healing Buds strain match is {strain} ({compatibility}). View details: {link}"*
4. Log delivery status back to the lead row (`whatsapp_sent_at`, `whatsapp_status`)

**Phase 3 — Spreadsheet & CRM sync improvements**
1. Replace fragile Make.com webhook with a direct **Google Sheets connector** edge function (already available, uses gateway) — adds a row per lead with all fields including WhatsApp opt-in status
2. Add daily digest: edge function on cron sends a summary of new leads to admin
3. Optional: pipe leads into HubSpot connector for full CRM if volume grows

### Recommended starting point

**Build Phase 1 only first** — it's free, ships today, gives you validated WhatsApp numbers and 1-click outreach from the dashboard. Phase 2 (automated sending) needs a Twilio or Meta Business account decision and ~$50–100 in template-approval lead time, so we tackle that once Phase 1 is live and you confirm the volume justifies it.

### Technical Details

- **Library**: `react-phone-number-input` (lightweight, ~15KB, works with E.164)
- **DB migration**: add `whatsapp_e164 text`, `whatsapp_opt_in boolean default false`, `contacted boolean default false`, `contacted_at timestamptz`, `whatsapp_sent_at timestamptz`, `whatsapp_status text` to `leads` table
- **RLS**: extend existing policies to allow authenticated admin to UPDATE the `contacted` and `contacted_at` fields
- **Admin dashboard**: add WhatsApp icon button (green) per row + filter "Show uncontacted only"
- **Click-to-chat URL format**: `https://wa.me/27821234567?text=Hi%20{name}%2C%20your%20Healing%20Buds%20match...`
- **Phase 2 connector choice**: Twilio WhatsApp (simpler, already in Lovable connectors) vs Meta Cloud API (cheaper at scale, more setup)

