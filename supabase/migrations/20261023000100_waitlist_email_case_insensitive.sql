-- Make waitlist email uniqueness case-insensitive.
-- The old site trimmed emails but did not lowercase them, so 'Foo@x.com' and 'foo@x.com'
-- could both be inserted. The new form lowercases; this index makes the database agree,
-- so a case-variant duplicate raises 23505 ("already on our list").
--
-- Non-destructive: if case-duplicates already exist, this migration stops and asks for a
-- manual decision instead of deleting signups.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.waitlist GROUP BY lower(trim(email)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'waitlist has case-duplicate emails; resolve them manually, then re-run this migration';
  END IF;
END $$;

UPDATE public.waitlist
SET email = lower(trim(email))
WHERE email <> lower(trim(email));

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_lower_key ON public.waitlist (lower(email));
