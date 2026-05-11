-- Restrict whatsapp_templates SELECT to admins
DROP POLICY IF EXISTS "Anyone reads wa templates" ON public.whatsapp_templates;
CREATE POLICY "Admins read wa templates"
ON public.whatsapp_templates
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Restrict campaigns SELECT to admins (sensitive cols: budget, notes, created_by)
DROP POLICY IF EXISTS "Anyone can read active campaigns" ON public.campaigns;
CREATE POLICY "Admins read campaigns"
ON public.campaigns
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Restrict campaign_variants SELECT to admins
DROP POLICY IF EXISTS "Anyone can read variants" ON public.campaign_variants;
CREATE POLICY "Admins read campaign variants"
ON public.campaign_variants
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));