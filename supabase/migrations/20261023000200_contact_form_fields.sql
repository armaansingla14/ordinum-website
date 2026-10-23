-- Contact form: three optional context fields (founder-approved 2026-10-23).
--
-- Additive and backward compatible:
--   * nullable columns with no default, so existing rows keep NULL and no row is rewritten;
--   * existing INSERTs that omit these columns keep working unchanged;
--   * RLS is unchanged: the existing "Anyone can submit to waitlist" INSERT policy covers
--     every column, and the UPDATE/DELETE deny policies and the absence of a SELECT policy
--     still apply. Table-level grants already cover new columns; no GRANT is needed.
--
-- Allowed values for technology_category / request_type are enforced in the app
-- (lib/schema.ts, from lib/content.ts) so the option lists can change without a migration.
-- The database only bounds length, matching the app limits.

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS technology_category TEXT,
  ADD COLUMN IF NOT EXISTS request_type TEXT,
  ADD COLUMN IF NOT EXISTS hardest_failure TEXT;

-- Length checks. Guarded so the migration can be re-run safely.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'waitlist_technology_category_length' AND conrelid = 'public.waitlist'::regclass
  ) THEN
    ALTER TABLE public.waitlist
      ADD CONSTRAINT waitlist_technology_category_length
      CHECK (technology_category IS NULL OR char_length(technology_category) <= 80);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'waitlist_request_type_length' AND conrelid = 'public.waitlist'::regclass
  ) THEN
    ALTER TABLE public.waitlist
      ADD CONSTRAINT waitlist_request_type_length
      CHECK (request_type IS NULL OR char_length(request_type) <= 60);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'waitlist_hardest_failure_length' AND conrelid = 'public.waitlist'::regclass
  ) THEN
    ALTER TABLE public.waitlist
      ADD CONSTRAINT waitlist_hardest_failure_length
      CHECK (hardest_failure IS NULL OR char_length(hardest_failure) <= 2000);
  END IF;
END $$;

COMMENT ON COLUMN public.waitlist.technology_category IS 'Optional. Contact form technology category (value list in lib/content.ts TECHNOLOGY_CATEGORIES).';
COMMENT ON COLUMN public.waitlist.request_type IS 'Optional. Contact form request type (value list in lib/content.ts REQUEST_TYPES).';
COMMENT ON COLUMN public.waitlist.hardest_failure IS 'Optional. Free text: the most difficult failure the team deals with.';
