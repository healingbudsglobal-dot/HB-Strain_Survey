## Goal
Make the green "Send My Match on WhatsApp" button on the Contact Capture screen actually open WhatsApp with the user's strain match pre-filled — zero cost, no Twilio, no Cloud API.

## How it will work
1. When the user fills in their name + WhatsApp number, ticks the opt-in, and taps the green button:
   - Submit the lead exactly as today (results email + Make.com webhook still fire in the background).
   - Immediately open `https://wa.me/<businessNumber>?text=<prefilled message>` in a new tab.
2. The prefilled message goes FROM the user TO the Healing Buds business number (read from `app_settings.whatsapp_business_number`, currently `+351939455949`). Because the user sends first, business can reply for free within the 24h WhatsApp service window.
3. On the success screen, also show a persistent "Open WhatsApp" button in case the popup was blocked, using the same wa.me link.

## Prefilled message (rendered from the default `whatsapp_templates` row, with fallback)
```
Hi Healing Buds 🌿
I'm {name} and I just completed the Bio-Mapping Survey.
My #1 match: {strain} ({compatibility})
Province: {province}
Please send me details and next steps.
```

## Technical changes (frontend only)
- `src/lib/whatsappTemplate.ts`: add `loadDefaultTemplate()` that fetches business number + default template (already partially there). Add safe fallback message if DB read fails.
- `src/components/ContactCapture.tsx`:
  - On submit with `hasValidWa && optIn`, build the wa.me URL and `window.open(url, "_blank", "noopener")` BEFORE calling `onSubmit` (must run inside the click handler so the popup isn't blocked on iOS Safari).
  - Keep current `onSubmit(...)` so the loading→success flow continues.
- `src/components/SuccessScreen.tsx`:
  - Add a green "Open WhatsApp" CTA above the existing email CTA when the user opted in. It rebuilds the same wa.me link from `result` + cached business number.
- `src/pages/Index.tsx`: pass `whatsappE164` and the chosen wa.me link (or business number + opt-in flag) into `SuccessScreen` so the success-screen button works after navigation.

## Out of scope
- No Twilio, no Cloud API, no edge function for sending — fully client-side.
- No change to email delivery, OTP flow, strain matching, or hero image.

## Verification
- Manual: complete a survey, enter a SA WhatsApp number, opt in, tap button → WhatsApp opens with prefilled text to +351 939 455 949.
- Fallback: if popup blocked, tap CTA on success screen → same behavior.
