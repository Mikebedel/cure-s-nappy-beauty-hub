-- 1. Numéro de commande : « CN-AAAAMMJJ-XXXXXX » (6 caractères au hasard au lieu de 4 chiffres).
--    Avec 4 chiffres, deux commandes du même jour pouvaient tomber sur le même numéro : la 2e était refusée.
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE candidate text;
BEGIN
  LOOP
    candidate := 'CN-' || to_char(now() AT TIME ZONE 'UTC', 'YYYYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = candidate);
  END LOOP;
  NEW.order_number := candidate;
  RETURN NEW;
END;
$$;

-- 2. Avis : le site n'en recueille pas. On ferme l'ajout public (sinon n'importe qui pouvait remplir la table),
--    et on borne les textes pour le jour où le formulaire existera.
DROP POLICY IF EXISTS "Anyone can submit reviews for moderation" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_text_lengths;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_text_lengths
  CHECK (length(customer_name) <= 80 AND (comment IS NULL OR length(comment) <= 2000) AND (admin_reply IS NULL OR length(admin_reply) <= 2000));

-- 3. Codes promo (ancienne table, plus utilisée) : la liste n'est plus lisible par les visiteurs.
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'promo_codes' AND cmd = 'SELECT' AND qual NOT LIKE '%has_role%' LOOP
    EXECUTE format('DROP POLICY %I ON public.promo_codes', p.policyname);
  END LOOP;
END $$;
