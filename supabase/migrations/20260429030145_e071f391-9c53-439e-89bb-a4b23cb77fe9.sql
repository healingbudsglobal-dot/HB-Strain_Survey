-- handle_new_admin_user only runs from the auth.users trigger; revoke direct calls
REVOKE EXECUTE ON FUNCTION public.handle_new_admin_user() FROM PUBLIC, anon, authenticated;

-- has_role MUST stay callable by authenticated for RLS policies to work.
-- Revoke from anon since unauthenticated users have no roles.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
