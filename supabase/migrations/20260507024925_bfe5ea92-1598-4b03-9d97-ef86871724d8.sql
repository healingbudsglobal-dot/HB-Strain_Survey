-- Server-side OTP storage. Codes are stored hashed and consumed once.
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS otp_codes_email_created_idx
  ON public.otp_codes (email, created_at DESC);

ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies: only the service role (edge functions) can access.

-- Validation trigger (avoid CHECK on now())
CREATE OR REPLACE FUNCTION public.otp_codes_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'expires_at must be in the future';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS otp_codes_validate_trg ON public.otp_codes;
CREATE TRIGGER otp_codes_validate_trg
BEFORE INSERT ON public.otp_codes
FOR EACH ROW EXECUTE FUNCTION public.otp_codes_validate();

-- Rotate the admin password to a strong random value generated at runtime.
-- Plaintext is never written to this migration; admin must use password reset.
DO $do$
DECLARE
  random_pw text := encode(gen_random_bytes(24), 'base64');
BEGIN
  UPDATE auth.users
  SET encrypted_password = crypt(random_pw, gen_salt('bf')),
      updated_at = now()
  WHERE email = 'healingbudsglobal@gmail.com';
END $do$;