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
  image: string;
  benefits: string[];
  contains: string[];
  note?: string;
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

export const packToProduct = (pack: GammePack): Product => ({
  id: `pack-${pack.id}`,
  name: pack.name,
  description: pack.description,
  shortDescription: pack.description,
  price: pack.price,
  image: pack.image,
  gamme: "pack",
  benefits: pack.benefits,
  ingredients: [],
  usage: "",
});

export const productMatchesCategory = (product: Product, category: string) =>
  product.gamme === category || product.categories?.includes(category) === true;
