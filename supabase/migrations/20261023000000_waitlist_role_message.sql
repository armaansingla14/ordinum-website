-- Optional demo-request context captured by the website form
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS message TEXT;

ALTER TABLE public.waitlist
  ADD CONSTRAINT waitlist_role_length CHECK (role IS NULL OR char_length(role) <= 120),
  ADD CONSTRAINT waitlist_message_length CHECK (message IS NULL OR char_length(message) <= 2000);
