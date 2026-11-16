-- La table newsletter_subscribers existait déjà (première migration) : on la complète.
-- Prénom facultatif, provenance de l'inscription, et contrôle du format de l'adresse.
DELETE FROM public.newsletter_subscribers WHERE email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$';

ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'footer';

ALTER TABLE public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_email_format;
ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_email_format
  CHECK (length(email) <= 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
ALTER TABLE public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_first_name_length;
ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_first_name_length
  CHECK (first_name IS NULL OR length(first_name) <= 60);
ALTER TABLE public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_source_values;
ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_source_values
  CHECK (source IN ('footer', 'contact'));

-- Une inscription anonyme ne peut pas se déclarer désactivée ni choisir sa date.
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to the newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to the newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (COALESCE(is_active, true) = true);

NOTIFY pgrst, 'reload schema';
