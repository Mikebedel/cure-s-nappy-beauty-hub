/**
 * Formes des articles telles que les pages les affichent (images déjà résolues).
 * Les données elles-mêmes viennent du contenu du site : voir src/content/ et le dashboard.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  /** Prix avant promotion, quand une promotion s'applique (affiché barré). */
  originalPrice?: number;
  image: string;
  gamme: string;
  categories?: string[];
  benefits: string[];
  ingredients: string[];
  usage: string;
  volume?: string;
  gallery?: string[];
}

export interface GammePack {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  benefits: string[];
  contains: string[];
  note?: string;
  /** Gamme, duo (2 soins) ou trio (3 soins et plus) : sert au repère de la page détail. */
  kind: "gamme" | "duo" | "trio";
  /** Soin du catalogue lié à chaque ligne de `contains` (retrouvé par son nom pour les gammes), null si aucun. */
  containsIds: (string | null)[];
  /** Les mêmes soins, sans doublon. */
  productIds: string[];
  details?: string;
  usage?: string;
}

export interface Accessory {
  id: string;
  name: string;
  price: number | null;
  intro: string;
  hook: string;
  colors: { name: string; swatch: string; image: string }[];
  tools: { title: string; points: string[] }[];
  why: string;
}

export const formatPrice = (amount: number) => `${amount.toLocaleString("fr-FR")} FCFA`;

/** Adresse de la page détail d'une gamme, d'un duo ou d'un trio. */
export const packPath = (pack: Pick<GammePack, "id">) => `/gamme/${pack.id}`;

export const packToProduct = (pack: GammePack): Product => ({
  id: `pack-${pack.id}`,
  name: pack.name,
  description: pack.description,
  shortDescription: pack.description,
  price: pack.price,
  originalPrice: pack.originalPrice,
  image: pack.image,
  gamme: "pack",
  benefits: pack.benefits,
  ingredients: [],
  usage: "",
});

export const productMatchesCategory = (product: Product, category: string) =>
  product.gamme === category || product.categories?.includes(category) === true;
