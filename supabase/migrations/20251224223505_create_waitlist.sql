-- Create waitlist table for early access signups
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit to waitlist"
  ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

-- Only service role can read (you view in Cloud dashboard)
CREATE POLICY "Service role can read waitlist"
  ON public.waitlist
  FOR SELECT
  TO service_role
  USING (true);