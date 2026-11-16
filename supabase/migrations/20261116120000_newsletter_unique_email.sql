-- Une adresse ne s'inscrit qu'une fois, quelle que soit la casse (Awa@… = awa@…).
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_lower_key ON public.newsletter_subscribers (lower(email));
