-- Revoke direct EXECUTE on SECURITY DEFINER helpers from public roles.
-- They remain callable from RLS policies and triggers (which run in the function owner's context).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_admin_user() FROM PUBLIC, anon, authenticated;

-- Add explicit service-role-only policy on otp_codes so the linter sees an explicit policy
-- (table already had RLS enabled with no policies = deny by default; this makes intent explicit).
CREATE POLICY "Service role manages otp codes"
ON public.otp_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);