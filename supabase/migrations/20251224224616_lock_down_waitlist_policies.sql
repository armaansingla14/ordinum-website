-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Service role can read waitlist" ON public.waitlist;

-- Add explicit policies to prevent UPDATE and DELETE
CREATE POLICY "Prevent waitlist updates"
ON public.waitlist
FOR UPDATE
TO public
USING (false);

CREATE POLICY "Prevent waitlist deletes"
ON public.waitlist
FOR DELETE
TO public
USING (false);