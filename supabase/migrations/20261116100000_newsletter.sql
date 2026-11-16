-- Inscriptions à la newsletter (pied de page et page Contact).
-- Tout le monde peut s'inscrire ; seuls les admins (avec double authentification) lisent, exportent ou suppriment.
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL CHECK (length(email) <= 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  first_name TEXT CHECK (first_name IS NULL OR length(first_name) <= 60),
  source TEXT NOT NULL DEFAULT 'footer' CHECK (source IN ('footer', 'contact')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Une adresse ne s'inscrit qu'une fois, quelle que soit la casse.
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_key ON public.newsletter_subscribers (lower(email));

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to the newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete newsletter subscribers" ON public.newsletter_subscribers
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
