/**
 * Tout le contenu modifiable du site, édité depuis le dashboard (/admin).
 * Les images sont des références : « asset:nom-du-fichier » ou une adresse complète.
 * Les textes longs (RichText) acceptent une mise en forme simple :
 *   ligne vide = nouveau paragraphe, « ## Titre », « - puce », « 1. étape », **gras**.
 */
export type RichText = string;
export type ImageRef = string;

/** Un titre de section dont la fin est mise en couleur. */
export interface Heading {
  eyebrow: string;
  title: string;
  highlight: string;
}

export interface ProductContent {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  image: ImageRef;
  gallery: ImageRef[];
  category: string;
  extraCategories: string[];
  volume: string;
  benefits: string[];
  ingredients: string[];
  usage: string;
  visible: boolean;
}

export interface RangeContent {
  id: string;
  name: string;
  description: string;
  note: string;
  price: number;
  image: ImageRef;
  benefits: string[];
  contains: string[];
}

/** Duo ou trio : composé de produits du catalogue, son prix est la somme de leurs prix. */
export interface DuoContent {
  id: string;
  name: string;
  description: string;
  image: ImageRef;
  productIds: string[];
}

export interface AccessoryContent {
  id: string;
  name: string;
  price: number | null;
  intro: string;
  hook: string;
  colors: { name: string; swatch: string; image: ImageRef }[];
  tools: { title: string; points: string[] }[];
  why: string;
}

export interface ArticleContent {
  id: string;
  icon: string;
  title: string;
  intro: string;
  body: RichText;
}

export interface SiteContent {
  version: 1;
  contact: {
    whatsapp: string;
    phoneDisplay: string;
    email: string;
    address: string;
    facebookUrl: string;
    whatsappCatalogUrl: string;
  };
  footer: { tagline: string; quote: string };
  delivery: {
    /** Livraison dans le Grand Abidjan : un prix par commune. */
    abidjan: { delay: string; communes: { name: string; fee: number }[] };
    /** Expédition dans les autres villes de Côte d'Ivoire. Frais vides = à confirmer par l'équipe. */
    national: { enabled: boolean; delay: string; cities: { name: string; fee: number | null }[]; allowOther: boolean };
    /** Expédition à l'étranger, par zone de pays. Frais vides = à confirmer par l'équipe. */
    international: { enabled: boolean; zones: { name: string; fee: number | null; delay: string; countries: string[] }[]; allowOther: boolean };
    /** Moyens proposés pour le paiement en ligne Jèko. */
    onlineMethods: ("wave" | "orange" | "mtn" | "moov" | "djamo")[];
    /** Paiement en ligne (Jèko) proposé à la commande. */
    onlinePayment: boolean;
    /** Commande sans paiement en ligne : l'équipe recontacte le client sur WhatsApp. */
    payLater: boolean;
  };
  catalog: {
    categories: { id: string; name: string }[];
    products: ProductContent[];
    ranges: RangeContent[];
    duos: DuoContent[];
    accessories: AccessoryContent[];
  };
  home: {
    hero: {
      line1: string;
      line2: string;
      rotatingWords: string[];
      description: string;
      primaryCta: string;
      secondaryCta: string;
      stats: { value: string; label: string }[];
      slides: ImageRef[];
    };
    ticker: string[];
    guarantees: { icon: string; title: string; text: string }[];
    featured: Heading & { productIds: string[] };
    video: Heading & { text: string; points: string[] };
    rituals: Heading & { cards: { rangeId: string; label: string; subtitle: string; description: string }[] };
    spotlight: { visible: boolean; productId: string; badge: string; eyebrow: string; highlight: string };
    flashNews: {
      visible: boolean;
      badge: string;
      title: string;
      text: string;
      highlight: string;
      image: ImageRef;
      ctaLabel: string;
      ctaLink: string;
      secondaryLabel: string;
      secondaryLink: string;
    };
    boxSet: { visible: boolean; rangeId: string; eyebrow: string; title: string; text: string };
    community: Heading & { images: ImageRef[] };
    reviews: Heading & { items: { name: string; text: string }[] };
    mission: Heading & { body: RichText; ctaLabel: string };
    journal: Heading & { text: string; ctaLabel: string };
  };
  shop: {
    spotlights: { productId: string; hook: string; intro: string; benefits: string[]; tipTitle: string; tipText: string }[];
    catalogHeading: Heading;
    rangesHeading: Heading & { text: string };
    duosHeading: Heading & { text: string };
    accessoriesHeading: Heading;
  };
  rangesPage: { eyebrow: string; title: string; description: string; themesHeading: Heading };
  advice: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    tipsTitle: string;
    tips: ArticleContent[];
    adviceTitle: string;
    advice: ArticleContent[];
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    story: Heading & { body: RichText };
    pillars: { icon: string; title: string; text: string }[];
    commitments: Heading & { items: { icon: string; title: string; text: string }[] };
    cta: { title: string; label: string };
  };
  contactPage: {
    eyebrow: string;
    title: string;
    description: string;
    infoTitle: string;
    whatsappTitle: string;
    whatsappText: string;
    whatsappLabel: string;
    formTitle: string;
  };
}
