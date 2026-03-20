

## Plan: Create Admin Account in Live Environment

**Problem**: The admin user `healingbudsglobal@gmail.com` was created in the test database. The published site at `mystrain.healingbuds.co.za` uses the live database, which has no admin account.

### Steps

1. **Re-create the `create-admin` edge function** temporarily — same as before, uses `supabase.auth.admin.createUser()` with email auto-confirmed
2. **Deploy and invoke it against the live environment** to create the admin account with the same credentials
3. **Delete the edge function** again after the account is created (security cleanup)

This is a backend-only change — no UI code changes needed. The login page and dashboard code are already correct.

