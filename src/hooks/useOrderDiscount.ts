import { useCart } from "@/contexts/CartContext";
import { useCatalog } from "@/content/ContentProvider";
import { orderDiscount } from "../../supabase/functions/_shared/pricing";

/**
 * Remise fixe de la promotion en cours sur le panier actuel (même règle que le serveur, qui recalcule tout à la commande).
 * `missing` : nombre d'articles à ajouter pour en profiter ; `amount` : montant de la remise annoncée.
 */
export const useOrderDiscount = () => {
  const { items } = useCart();
  const { promotion } = useCatalog();
  const lines = items.map(({ product, quantity }) => ({ id: product.id, quantity, lineTotal: product.price * quantity }));
  const { discount, missing } = orderDiscount(promotion, lines);
  return { discount, missing, amount: promotion?.kind === "amount" ? promotion.amount ?? 0 : 0 };
};
