## Adopt the Geometric Humanist system font stack

You picked the **Geometric Humanist** stack from modernfontstacks.com — clean, friendly, slightly geometric (think Avenir / Futura family). It's already installed on every device, so we ship 0kb of font data and the page paints instantly.

The stack:
```text
Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif
```
- macOS / iOS → **Avenir** (the hero glyph — soft, premium, very on-brand for wellness)
- Windows → **Corbel**
- Android → **Montserrat** (often present) → falls back gracefully
- Linux → **URW Gothic**

### Plan

**1. `src/index.css`**
- Remove the Google Fonts `@import` for DM Sans + Inter (saves ~80kb, kills render-blocking request)
- Set body font-family to the Geometric Humanist stack
- Set headings font-family to the same stack but with heavier weights (700/800) so headlines still feel distinct from body
- Keep the existing `.font-question` rounded-sans utility idea **off the table for now** — single stack across the app keeps it cohesive

**2. `tailwind.config.ts`**
- Update `fontFamily.display` and `fontFamily.body` both to the Geometric Humanist stack
- This means existing `font-display` / `font-body` classes keep working — no component edits needed

**3. Smoke check**
- Verify `SqueezeScreen`, `SurveyFlow`, header, and results screen still feel right (they should — only the typeface changes, no layout shifts since metrics are similar)

### Trade-offs

- Glyph shape varies by OS (Avenir vs Corbel vs URW Gothic). The *vibe* — geometric, humanist, friendly — stays consistent. This is the modernfontstacks.com philosophy.
- Lose DM Sans's specific personality. Gain instant paint, no FOIT/FOUT, no Google privacy ping, no licensing concerns.
- If you ever miss DM Sans on a specific element (e.g. logo wordmark), we can add it back surgically as a single self-hosted woff2.

### Files to edit
- `src/index.css` (remove import, update font-family declarations)
- `tailwind.config.ts` (update fontFamily tokens)
