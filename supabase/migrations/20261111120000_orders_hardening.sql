-- Durcissement des commandes : un visiteur peut encore enregistrer une commande,
-- mais plus la déclarer « payée », « expédiée » ou avec une remise, ni avec un total incohérent.
-- (Le paiement en ligne remplacera cette insertion par une fonction serveur qui recalcule les prix.)
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create unpaid orders" ON public.orders
  FOR INSERT WITH CHECK (
    status = 'nouvelle'
    AND COALESCE(payment_status, 'en_attente') = 'en_attente'
    AND COALESCE(discount, 0) = 0
    AND subtotal >= 0
    AND delivery_fee >= 0
    AND total = subtotal + delivery_fee
  );

-- Un article de commande doit avoir une quantité et un prix plausibles.
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (quantity BETWEEN 1 AND 50 AND product_price >= 0);

-- Avis : un visiteur peut en proposer, jamais en publier un directement.
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
CREATE POLICY "Anyone can submit reviews for moderation" ON public.reviews
  FOR INSERT WITH CHECK (is_approved = false);
