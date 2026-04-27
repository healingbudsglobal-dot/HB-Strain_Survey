ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS whatsapp_e164 text,
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contacted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS whatsapp_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS whatsapp_status text;

CREATE POLICY "Authenticated users can update lead contact status"
ON public.leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);