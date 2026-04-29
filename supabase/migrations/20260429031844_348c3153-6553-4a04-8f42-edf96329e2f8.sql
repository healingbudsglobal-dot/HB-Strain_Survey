-- 1. Add status column to leads (3-stage pipeline)
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS pipeline_status text NOT NULL DEFAULT 'new';

-- Backfill from existing contacted boolean
UPDATE public.leads
SET pipeline_status = CASE
  WHEN contacted = true THEN 'contacted'
  ELSE 'new'
END
WHERE pipeline_status = 'new';

-- 2. Nurture sequences
CREATE TABLE IF NOT EXISTS public.nurture_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_event text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nurture_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage nurture sequences"
  ON public.nurture_sequences FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role reads sequences"
  ON public.nurture_sequences FOR SELECT
  TO service_role
  USING (true);

CREATE TRIGGER nurture_sequences_updated_at
  BEFORE UPDATE ON public.nurture_sequences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Lead sequence state (which leads in which sequences)
CREATE TABLE IF NOT EXISTS public.lead_sequence_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL,
  sequence_id uuid NOT NULL REFERENCES public.nurture_sequences(id) ON DELETE CASCADE,
  current_step integer NOT NULL DEFAULT 0,
  next_run_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  last_error text,
  UNIQUE (lead_id, sequence_id)
);

ALTER TABLE public.lead_sequence_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lead sequence state"
  ON public.lead_sequence_state FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages sequence state"
  ON public.lead_sequence_state FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_lead_sequence_state_due
  ON public.lead_sequence_state (next_run_at)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_lead_sequence_state_lead
  ON public.lead_sequence_state (lead_id);

-- 4. Performance indexes for lead_events (timeline lookups)
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_created
  ON public.lead_events (lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_events_type_created
  ON public.lead_events (event_type, created_at DESC);

-- 5. Seed default sequence (inactive — admin activates when ready)
INSERT INTO public.nurture_sequences (name, description, trigger_event, is_active, steps)
VALUES (
  'Post-Survey Follow-up',
  'Default 3-step nurture for new leads who completed the Bio-Map survey.',
  'survey_completed',
  false,
  '[
    {
      "channel": "whatsapp",
      "template_key": "default",
      "delay_minutes": 0,
      "skip_if": ["purchased", "status_customer"]
    },
    {
      "channel": "email",
      "template_key": "results_followup",
      "delay_minutes": 60,
      "skip_if": ["email_opened", "purchased"]
    },
    {
      "channel": "whatsapp",
      "template_key": "checkin",
      "delay_minutes": 4320,
      "skip_if": ["purchased", "status_customer"]
    }
  ]'::jsonb
)
ON CONFLICT DO NOTHING;