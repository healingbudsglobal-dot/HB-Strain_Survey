CREATE TABLE public.email_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  recipient_email text NOT NULL,
  template_name text NOT NULL,
  subject text,
  resend_id text,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX idx_email_send_log_recipient ON public.email_send_log(recipient_email, created_at DESC);
CREATE INDEX idx_email_send_log_created ON public.email_send_log(created_at DESC);
ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read email log" ON public.email_send_log
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Service role inserts email log" ON public.email_send_log
  FOR INSERT TO service_role
  WITH CHECK (true);