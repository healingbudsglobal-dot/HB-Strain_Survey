-- Survey submissions log: every submission + Make.com webhook status
CREATE TABLE public.survey_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Identity
  email TEXT NOT NULL,
  name TEXT,

  -- All 15 survey answers (structured)
  survey_answers JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Match result
  matched_strain TEXT,
  compatibility TEXT,

  -- Full payload sent to webhook (for replay/debug)
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Webhook delivery tracking
  webhook_url TEXT NOT NULL DEFAULT 'https://hook.eu1.make.com/70z505ty60nkksvtl6l6r1yzj4cs58tb',
  webhook_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (webhook_status IN ('pending','success','failed')),
  webhook_status_code INTEGER,
  webhook_response TEXT,
  webhook_error TEXT,
  webhook_attempts INTEGER NOT NULL DEFAULT 0,
  webhook_last_attempt_at TIMESTAMPTZ,

  source TEXT DEFAULT 'healing-buds-biomap'
);

-- Indexes for admin querying
CREATE INDEX idx_survey_submissions_created_at ON public.survey_submissions (created_at DESC);
CREATE INDEX idx_survey_submissions_email ON public.survey_submissions (email);
CREATE INDEX idx_survey_submissions_status ON public.survey_submissions (webhook_status);

-- updated_at trigger (reuse pattern)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_survey_submissions_updated_at
BEFORE UPDATE ON public.survey_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.survey_submissions ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) can read all submissions
CREATE POLICY "Authenticated users can read survey submissions"
ON public.survey_submissions
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users (admins) can update webhook status (e.g. retry)
CREATE POLICY "Authenticated users can update survey submissions"
ON public.survey_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Service role (edge functions) inserts submissions
CREATE POLICY "Service role can insert survey submissions"
ON public.survey_submissions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Service role can update webhook status after delivery
CREATE POLICY "Service role can update survey submissions"
ON public.survey_submissions
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);