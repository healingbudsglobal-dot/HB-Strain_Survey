# Admin Login Convenience + WhatsApp Clarification

## Three things you asked about

### 1. WhatsApp Business API — keeping manual wa.me (your choice ✓)

No code change needed. Current setup in `AdminDashboard` and `AdminSettings` already opens prefilled WhatsApp via `wa.me/<number>?text=<rendered template>`. It's free, no Meta verification, no template approval, you control every send. We can swap to Twilio/Meta Cloud API later — the template engine in `src/lib/whatsappTemplate.ts` will still work.

### 2. Admin password & login info

- **Email**: `healingbudsglobal@gmail.com` (whoever signs up with this email is auto-promoted to admin via the `handle_new_admin_user` trigger).
- **Password**: I cannot read your password — it's hashed in Supabase auth and not visible to anyone, including me. If you've forgotten it, the safe path is **password reset** (see "Optional follow-up" below).
- **Login URL**: `/admin/login` → redirects to `/admin` on success.

### 3. Dev-only auto-fill button + password eye

- **Eye toggle**: already implemented at `AdminLogin.tsx:71-77` — works today. No change.
- **Auto-fill button**: new. Only renders when `import.meta.env.DEV === true` (i.e. localhost + Lovable preview). Hidden on the published `mystrain.healingbuds.co.za` site.

## How auto-fill will work

You add two values to your local `.env` (NOT committed since `.env` is in `.gitignore`):

```
VITE_DEV_ADMIN_EMAIL=healingbudsglobal@gmail.com
VITE_DEV_ADMIN_PASSWORD=your-dev-password
```

The login page will show a small **"Auto-fill dev login"** button under the form (dev only). Click it → email + password fields populate → you click Sign In as normal. No automatic submit (safer; lets you verify before logging in).

If the env vars are missing, the button doesn't render at all.

### Security guarantees

- Button hidden in production builds (`import.meta.env.DEV` is `false` after `vite build`).
- Password sits in your local `.env` only — Lovable doesn't sync it to git, and it isn't bundled into the published app.
- Even if someone sees the button on dev, they need your local `.env` values for it to do anything.

## Files to change

- `src/pages/AdminLogin.tsx` — add the conditional auto-fill button under the Sign In button.

That's it. One file, ~15 lines.

## Optional follow-up (ask if you want it)

If you don't remember your admin password, I can add a **"Forgot password"** link on the login page that emails a reset link via the existing Resend setup. Requires:
- A new `/reset-password` page that handles the recovery token and lets you set a new password.
- Calling `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })`.

Say the word and I'll add it in the same pass.
