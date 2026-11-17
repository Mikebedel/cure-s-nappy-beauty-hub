/**
 * Calcul du prix d'une commande, fait côté serveur à partir du catalogue :
 * le navigateur n'envoie que des identifiants et des quantités, jamais de prix.
 * Ce fichier n'utilise rien de propre à Deno : il est aussi testé par vitest.
 */

export interface PricingCatalog {
  products: { id: string; name: string; price: number; visible: boolean }[];
  ranges: { id: string; name: string; price: number }[];
  duos: { id: string; name: string; productIds: string[] }[];
  accessories?: { id: string; name: string; price: number | null; colors: { name: string }[] }[];
}

/**
 * Promotion réglée dans le dashboard, sur une période (dates incluses, heure d'Abidjan = UTC) et des articles choisis :
 * - « percent » : un pourcentage sur le prix de chaque article (prix barrés) ;
 * - « amount » : une remise fixe sur la commande dès un nombre d'articles achetés (ex. -2 500 FCFA dès 2 produits).
 * La même règle sert au site (affichage) et au serveur (prix facturé).
 */
export interface Promotion {
  enabled: boolean;
  /** Absent dans les promotions enregistrées avant l'ajout de la remise fixe : « percent ». */
  kind?: "percent" | "amount";
  percent: number;
  /** Remise fixe en FCFA (kind « amount »). */
  amount?: number;
  /** Nombre d'articles concernés à acheter pour avoir la remise fixe (quantités comptées). */
  minItems?: number;
  /** AAAA-MM-JJ, premier et dernier jour inclus. */
  startDate: string;
  endDate: string;
  /** « all » : tous les soins ; « selection » : seulement les identifiants de productIds (soins, ou « pack-<id> » pour une gamme ou un duo). */
  scope: "all" | "selection";
  productIds: string[];
  /** Avec « all » : les gammes et les duos sont aussi en promotion. */
  includePacks: boolean;
  includeAccessories: boolean;
  banner: string;
  badge: string;
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;

export const promotionKind = (promo: Promotion) => (promo.kind === "amount" ? "amount" : "percent");
export const promotionMinItems = (promo: Promotion) => promo.minItems ?? 2;

/** La promotion est-elle en cours à cette date ? */
export function promotionActive(promo: Promotion | undefined | null, now: Date = new Date()): boolean {
  if (!promo?.enabled) return false;
  if (promotionKind(promo) === "amount") {
    const amount = promo.amount ?? 0;
    const min = promotionMinItems(promo);
    if (!Number.isInteger(amount) || amount < 5 || amount > 1_000_000) return false;
    if (!Number.isInteger(min) || min < 1 || min > 20) return false;
  } else if (!Number.isInteger(promo.percent) || promo.percent < 1 || promo.percent > 90) return false;
  if (!DAY.test(promo.startDate ?? "") || !DAY.test(promo.endDate ?? "")) return false;
  const today = now.toISOString().slice(0, 10);
  return today >= promo.startDate && today <= promo.endDate;
}

/** Prix réduit, arrondi aux 5 FCFA (plus petite pièce). */
export const discountedPrice = (price: number, percent: number) => Math.max(5, Math.round((price * (100 - percent)) / 100 / 5) * 5);

/** L'article (soin, « pack-<id> » ou « acc-… ») fait-il partie des articles en promotion ? */
export function promotionCovers(promo: Promotion, itemId: string): boolean {
  if (itemId.startsWith("acc-")) return promo.includeAccessories;
  if (promo.scope === "selection") return promo.productIds.includes(itemId);
  if (itemId.startsWith("pack-")) return promo.includePacks;
  return true;
}

/** Pourcentage de réduction d'un article du panier (0 s'il n'est pas concerné ou si la promotion est une remise fixe). */
export function promotionPercent(promo: Promotion | undefined | null, itemId: string, now: Date = new Date()): number {
  if (!promo || !promotionActive(promo, now) || promotionKind(promo) !== "percent") return 0;
  return promotionCovers(promo, itemId) ? promo.percent : 0;
}

/**
 * Remise fixe sur la commande : le montant de la promotion dès que le panier compte assez d'articles concernés
 * (quantités comptées), sans dépasser le prix de ces articles. `missing` : articles qu'il reste à ajouter pour l'avoir.
 */
export function orderDiscount(promo: Promotion | undefined | null, lines: { id: string; quantity: number; lineTotal: number }[], now: Date = new Date()): { discount: number; missing: number } {
  if (!promo || !promotionActive(promo, now) || promotionKind(promo) !== "amount") return { discount: 0, missing: 0 };
  const covered = lines.filter((l) => promotionCovers(promo, l.id));
  const count = covered.reduce((sum, l) => sum + l.quantity, 0);
  const min = promotionMinItems(promo);
  if (count < min) return { discount: 0, missing: min - count };
  return { discount: Math.min(promo.amount ?? 0, covered.reduce((sum, l) => sum + l.lineTotal, 0)), missing: 0 };
}

/** Identifiant panier d'un accessoire dans une couleur : « acc-<accessoire>::<couleur> ». */
export const accessoryItemId = (accessoryId: string, color: string) => `acc-${accessoryId}::${color}`;

export interface PricingDelivery {
  abidjan: { delay: string; communes: { name: string; fee: number }[] };
  national: { enabled: boolean; delay: string; cities: { name: string; fee: number | null }[]; allowOther: boolean };
  international: { enabled: boolean; zones: { name: string; fee: number | null; delay: string; countries: string[] }[]; allowOther: boolean };
}

/** Valeur des listes « Autre ville » / « Autre pays ». */
export const OTHER = "__autre";

/** Ce que le client choisit à la commande. */
export type Destination =
  | { mode: "abidjan"; commune: string }
  | { mode: "national"; city: string; otherCity?: string }
  | { mode: "international"; country: string; otherCountry?: string; city: string };

export interface ResolvedDestination {
  zone: "abidjan" | "national" | "international";
  /** Lieu affiché sur la commande et le reçu (commune, ville ou « ville, pays »). */
  place: string;
  /** Frais de livraison ; null = à confirmer par l'équipe. */
  fee: number | null;
  estimate: string;
}

const cleanText = (v: unknown, max = 60) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "").slice(0, max);

/** Vérifie la destination choisie et donne ses frais et son délai. Même calcul sur le site et sur le serveur. */
export function resolveDestination(delivery: PricingDelivery, raw: unknown): ResolvedDestination | { error: string } {
  const d = (raw ?? {}) as Record<string, unknown>;
  if (d.mode === "abidjan") {
    const commune = delivery.abidjan.communes.find((c) => c.name === d.commune);
    if (!commune) return { error: "Choisissez votre commune." };
    return { zone: "abidjan", place: commune.name, fee: commune.fee, estimate: delivery.abidjan.delay };
  }
  if (d.mode === "national") {
    if (!delivery.national.enabled) return { error: "L'expédition en Côte d'Ivoire n'est pas disponible pour le moment." };
    if (d.city === OTHER && delivery.national.allowOther) {
      const name = cleanText(d.otherCity);
      if (name.length < 2) return { error: "Indiquez votre ville." };
      return { zone: "national", place: name, fee: null, estimate: delivery.national.delay };
    }
    const city = delivery.national.cities.find((c) => c.name === d.city);
    if (!city) return { error: "Choisissez votre ville." };
    return { zone: "national", place: city.name, fee: city.fee, estimate: delivery.national.delay };
  }
  if (d.mode === "international") {
    if (!delivery.international.enabled) return { error: "L'expédition à l'étranger n'est pas disponible pour le moment." };
    const city = cleanText(d.city);
    if (city.length < 2) return { error: "Indiquez votre ville." };
    if (d.country === OTHER && delivery.international.allowOther) {
      const country = cleanText(d.otherCountry);
      if (country.length < 2) return { error: "Indiquez votre pays." };
      return { zone: "international", place: `${city}, ${country}`, fee: null, estimate: "" };
    }
    const zone = delivery.international.zones.find((z) => z.countries.includes(String(d.country)));
    if (!zone) return { error: "Choisissez votre pays." };
    return { zone: "international", place: `${city}, ${d.country}`, fee: zone.fee, estimate: zone.delay };
  }
  return { error: "Choisissez un mode de livraison." };
}

export interface CartLine { id: string; quantity: number }

export interface PricedLine { id: string; name: string; unitPrice: number; quantity: number; lineTotal: number }

export type PricingResult =
  | { ok: true; lines: PricedLine[]; subtotal: number; discount: number; deliveryFee: number; feeConfirmed: boolean; total: number; destination: ResolvedDestination }
  | { ok: false; error: string };

export const MAX_LINES = 30;
export const MAX_QUANTITY = 20;

const isWholePositive = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0;

export function priceOrder(catalog: PricingCatalog, delivery: PricingDelivery, rawLines: unknown, rawDestination: unknown, promotion?: Promotion | null, now: Date = new Date()): PricingResult {
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
    if (id.startsWith("acc-")) {
      const [accessoryId, color = ""] = id.slice(4).split("::");
      const accessory = catalog.accessories?.find((a) => a.id === accessoryId);
      const colorOk = accessory && (accessory.colors.length <= 1 ? true : accessory.colors.some((c) => c.name === color));
      if (accessory && colorOk && typeof accessory.price === "number") {
        name = color && accessory.colors.length > 1 ? `${accessory.name} — ${color}` : accessory.name;
        unitPrice = accessory.price;
      }
    } else if (id.startsWith("pack-")) {
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
    const percent = promotionPercent(promotion, id, now);
    if (percent > 0) unitPrice = discountedPrice(unitPrice, percent);
    lines.push({ id, name, unitPrice, quantity, lineTotal: unitPrice * quantity });
  }

  const destination = resolveDestination(delivery, rawDestination);
  if ("error" in destination) return { ok: false, error: destination.error };
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const { discount } = orderDiscount(promotion, lines, now);
  const deliveryFee = destination.fee ?? 0;
  return { ok: true, lines, subtotal, discount, deliveryFee, feeConfirmed: destination.fee !== null, total: subtotal - discount + deliveryFee, destination };
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
