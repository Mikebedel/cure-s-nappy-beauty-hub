import { promotionKind, promotionMinItems, type Promotion } from "../../supabase/functions/_shared/pricing";

const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;

/** Résumé court de la promotion, pour le bandeau sur téléphone et le dashboard : « -20 % » ou « -2 500 FCFA dès 2 produits ». */
export const promotionShort = (promo: Promotion) =>
  promotionKind(promo) === "amount"
    ? `-${fcfa(promo.amount ?? 0)} dès ${promotionMinItems(promo)} produit${promotionMinItems(promo) > 1 ? "s" : ""}`
    : `-${promo.percent} %`;
