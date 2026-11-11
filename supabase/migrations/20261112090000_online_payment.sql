-- Paiement en ligne (Paystack) et reçus.
-- Les commandes ne sont plus créées depuis le navigateur : seule la fonction serveur
-- « create-order » les enregistre, après avoir recalculé les prix à partir du catalogue.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_reference TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS payment_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_channel TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS receipt_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  ADD COLUMN IF NOT EXISTS delivery_zone TEXT,
  ADD COLUMN IF NOT EXISTS delivery_estimate TEXT,
  ADD COLUMN IF NOT EXISTS receipt_emailed_at TIMESTAMPTZ;

-- Plus aucune écriture directe depuis le navigateur sur les commandes et leurs articles.
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create unpaid orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Journal des notifications Paystack déjà traitées (évite de traiter deux fois le même paiement).
CREATE TABLE IF NOT EXISTS public.payment_events (
  id BIGSERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  reference TEXT NOT NULL,
  event TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload JSONB
);
CREATE INDEX IF NOT EXISTS payment_events_reference_idx ON public.payment_events (reference);
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read payment events" ON public.payment_events
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
