/**
 * Calcul du prix d'une commande, fait côté serveur à partir du catalogue :
 * le navigateur n'envoie que des identifiants et des quantités, jamais de prix.
 * Ce fichier n'utilise rien de propre à Deno : il est aussi testé par vitest.
 */

export interface PricingCatalog {
  products: { id: string; name: string; price: number; visible: boolean }[];
  ranges: { id: string; name: string; price: number }[];
  duos: { id: string; name: string; productIds: string[] }[];
}

export interface PricingDelivery {
  standardFee: number;
  specialFee: number;
  communes: { name: string; special: boolean }[];
  standardDelay: string;
  specialDelay: string;
}

export interface CartLine { id: string; quantity: number }

export interface PricedLine { id: string; name: string; unitPrice: number; quantity: number; lineTotal: number }

export type PricingResult =
  | { ok: true; lines: PricedLine[]; subtotal: number; deliveryFee: number; total: number; zone: "standard" | "special"; estimate: string }
  | { ok: false; error: string };

export const MAX_LINES = 30;
export const MAX_QUANTITY = 20;

const isWholePositive = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0;

export function priceOrder(catalog: PricingCatalog, delivery: PricingDelivery, rawLines: unknown, communeName: unknown): PricingResult {
  if (!Array.isArray(rawLines) || rawLines.length === 0) return { ok: false, error: "Le panier est vide." };
  if (rawLines.length > MAX_LINES) return { ok: false, error: "Trop d'articles différents dans le panier." };

  // Regroupe les lignes d'un même article.
  const quantities = new Map<string, number>();
  for (const line of rawLines) {
    const id = (line as CartLine)?.id;
    const quantity = (line as CartLine)?.quantity;
    if (typeof id !== "string" || id.length > 80 || !isWholePositive(quantity)) return { ok: false, error: "Panier invalide." };
    quantities.set(id, (quantities.get(id) ?? 0) + quantity);
  }

  const products = new Map(catalog.products.map((p) => [p.id, p]));
  const lines: PricedLine[] = [];
  for (const [id, quantity] of quantities) {
    if (quantity > MAX_QUANTITY) return { ok: false, error: `Quantité trop élevée (${MAX_QUANTITY} au maximum par article).` };
    let name: string | undefined;
    let unitPrice: number | undefined;
    if (id.startsWith("pack-")) {
      const packId = id.slice(5);
      const range = catalog.ranges.find((r) => r.id === packId);
      const duo = catalog.duos.find((d) => d.id === packId);
      if (range) { name = range.name; unitPrice = range.price; }
      else if (duo) {
        const items = duo.productIds.map((pid) => products.get(pid));
        if (items.length > 0 && items.every((p) => p && p.visible)) {
          name = duo.name;
          unitPrice = items.reduce((sum, p) => sum + p!.price, 0);
        }
      }
    } else {
      const product = products.get(id);
      if (product && product.visible) { name = product.name; unitPrice = product.price; }
    }
    if (!name || !isWholePositive(unitPrice)) return { ok: false, error: "Un article du panier n'est plus disponible. Retirez-le puis réessayez." };
    lines.push({ id, name, unitPrice, quantity, lineTotal: unitPrice * quantity });
  }

  const commune = delivery.communes.find((c) => c.name === communeName);
  if (!commune) return { ok: false, error: "Commune de livraison inconnue." };
  const zone = commune.special ? "special" : "standard";
  const deliveryFee = commune.special ? delivery.specialFee : delivery.standardFee;
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  return {
    ok: true,
    lines,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    zone,
    estimate: commune.special ? delivery.specialDelay : delivery.standardDelay,
  };
}

/** Contrôle des coordonnées saisies par le client. Renvoie un message d'erreur, ou null si tout est correct. */
export function checkCustomer(c: Record<string, unknown>, requireEmail: boolean): string | null {
  const text = (v: unknown, min: number, max: number) => typeof v === "string" && v.trim().length >= min && v.trim().length <= max;
  if (!text(c.firstName, 1, 60) || !text(c.lastName, 1, 60)) return "Indiquez votre prénom et votre nom.";
  const phone = typeof c.phone === "string" ? c.phone.replace(/[\s.\-()]/g, "") : "";
  if (!/^\+?\d{8,15}$/.test(phone)) return "Numéro de téléphone invalide.";
  if (!text(c.address, 3, 200)) return "Indiquez une adresse de livraison précise.";
  const email = typeof c.email === "string" ? c.email.trim() : "";
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))) return "Adresse e-mail invalide.";
  if (requireEmail && !email) return "Une adresse e-mail est nécessaire pour payer en ligne et recevoir votre reçu.";
  return null;
}
