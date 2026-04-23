

## Plan: Reset Admin Password

The password was set to `HealingBuds2025!` but should be `H34l1ng@buds2025`.

### Steps

1. **Re-create the `create-admin` edge function** temporarily to update the password using `supabase.auth.admin.updateUserById()`
2. **Deploy and invoke it** with the correct password `H34l1ng@buds2025`
3. **Delete the edge function** immediately after

No code changes — backend-only password reset.

