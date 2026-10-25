-- Contact form inquiries: append-only table (founder-approved 2026-10-24).
--
-- Why a new table: public.waitlist has a case-insensitive UNIQUE index on email, so a second
-- message from the same person was silently dropped. inquiries allows repeat contact and never
-- drops or rewrites earlier rows. public.waitlist is NOT touched by this migration: its rows,
-- columns, policies and indexes stay exactly as they are; the website simply stops writing to it.
--
-- Access model (the website uses the publishable/anon key from a server action):
--   * RLS on; anon + authenticated may INSERT (WITH CHECK (true)); length limits live in CHECK
--     constraints and the app's zod schema (lib/schema.ts).
--   * No SELECT policy: nobody can read rows through the API. The founders read them in the
--     Supabase dashboard (service role / table owner bypasses RLS).
--   * Explicit UPDATE and DELETE deny policies, mirroring the waitlist lock-down, so the intent
--     is visible even if a permissive policy is added later.
--   * Table privileges are narrowed to INSERT for anon/authenticated (RLS does not cover
--     TRUNCATE, so it is revoked rather than relied on).
--
-- Abuse guard: a BEFORE INSERT trigger refuses a row when 5 or more rows already exist for the
-- same lower(email) within the last hour, raising SQLSTATE 'P0429' with message 'rate_limited'
-- (the server action maps that code to a "try again later" message). It is a per-address limit
-- against accidental or scripted repeats, not a complete anti-spam system: the honeypot and the
-- minimum fill time in the server action do the rest.
--
-- Values allowed for technology_category / request_type are enforced in the app (allowlists in
-- lib/content.ts) so the option lists can change without a migration; the database bounds length.

CREATE TABLE IF NOT EXISTS public.inquiries (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  email               TEXT        NOT NULL,
  company             TEXT,
  working_on          TEXT,
  message             TEXT,
  technology_category TEXT,
  request_type        TEXT,
  source              TEXT        DEFAULT 'website',
  CONSTRAINT inquiries_email_length               CHECK (char_length(email) BETWEEN 1 AND 255),
  CONSTRAINT inquiries_company_length             CHECK (company IS NULL OR char_length(company) <= 120),
  CONSTRAINT inquiries_working_on_length          CHECK (working_on IS NULL OR char_length(working_on) <= 500),
  CONSTRAINT inquiries_message_length             CHECK (message IS NULL OR char_length(message) <= 2000),
  CONSTRAINT inquiries_technology_category_length CHECK (technology_category IS NULL OR char_length(technology_category) <= 80),
  CONSTRAINT inquiries_request_type_length        CHECK (request_type IS NULL OR char_length(request_type) <= 60),
  CONSTRAINT inquiries_source_length              CHECK (source IS NULL OR char_length(source) <= 40)
);

COMMENT ON TABLE public.inquiries IS
  'Contact form submissions from ordinum.org. Append-only from the API (INSERT only via RLS); repeat inquiries from the same email are kept. Retained until the sender asks for deletion.';
COMMENT ON COLUMN public.inquiries.email IS 'Required. Work email as entered (lower-cased by the app). Not unique: repeat inquiries are allowed.';
COMMENT ON COLUMN public.inquiries.working_on IS 'Optional. Free text: "What are you working on?"';
COMMENT ON COLUMN public.inquiries.technology_category IS 'Optional. Value list in lib/content.ts TECHNOLOGY_CATEGORIES.';
COMMENT ON COLUMN public.inquiries.request_type IS 'Optional. Value list in lib/content.ts REQUEST_TYPES.';
COMMENT ON COLUMN public.inquiries.source IS 'Where the inquiry came from; the website form sends ''website''.';

-- Serves the per-email rate-limit lookup (and any manual lookup by sender).
CREATE INDEX IF NOT EXISTS inquiries_email_created_at_idx
  ON public.inquiries (lower(email), created_at);

-- Row-level security ----------------------------------------------------------------------

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Prevent inquiry updates" ON public.inquiries;
CREATE POLICY "Prevent inquiry updates"
  ON public.inquiries
  FOR UPDATE
  TO public
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Prevent inquiry deletes" ON public.inquiries;
CREATE POLICY "Prevent inquiry deletes"
  ON public.inquiries
  FOR DELETE
  TO public
  USING (false);

-- Deliberately no SELECT policy.

-- Privileges: API roles get INSERT only. The website inserts without RETURNING (no .select()),
-- so SELECT is not needed. service_role and the table owner keep their access.
REVOKE ALL ON TABLE public.inquiries FROM anon, authenticated;
GRANT INSERT ON TABLE public.inquiries TO anon, authenticated;

-- Per-email rate limit --------------------------------------------------------------------
--
-- SECURITY DEFINER because the inserting role (anon) cannot SELECT from inquiries (no SELECT
-- policy, no SELECT grant); as the table owner the function can count existing rows. The
-- search_path is pinned so the definer context cannot be hijacked by objects in other schemas.
--
-- created_at is forced to now() so a client cannot backdate rows to escape the one-hour window.
-- A transaction-scoped advisory lock per address serializes concurrent inserts for the same
-- email, so parallel requests cannot all pass the count check at once.

CREATE OR REPLACE FUNCTION public.inquiries_enforce_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent integer;
BEGIN
  NEW.created_at := now();

  PERFORM pg_advisory_xact_lock(hashtext('inquiries:' || lower(NEW.email)));

  SELECT count(*) INTO recent
  FROM public.inquiries
  WHERE lower(email) = lower(NEW.email)
    AND created_at > now() - interval '1 hour';

  IF recent >= 5 THEN
    RAISE EXCEPTION USING ERRCODE = 'P0429', MESSAGE = 'rate_limited';
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.inquiries_enforce_rate_limit() IS
  'BEFORE INSERT trigger on public.inquiries: raises SQLSTATE P0429 (rate_limited) when 5+ rows exist for lower(email) in the last hour. Not callable by API roles.';

-- Not callable directly by anyone but the owner. Triggers still fire: PostgreSQL checks EXECUTE
-- on a trigger function only when the trigger is created, not each time it fires.
REVOKE EXECUTE ON FUNCTION public.inquiries_enforce_rate_limit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.inquiries_enforce_rate_limit() FROM anon, authenticated;

DROP TRIGGER IF EXISTS inquiries_rate_limit ON public.inquiries;
CREATE TRIGGER inquiries_rate_limit
  BEFORE INSERT ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.inquiries_enforce_rate_limit();
