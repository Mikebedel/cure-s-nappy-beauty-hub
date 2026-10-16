import huileExtraPousse from "@/assets/huile-extra-pousse.jpg";
import leaveInConditionner from "@/assets/leave-in-conditionner.jpg";
import huileFortifiante from "@/assets/huile-fortifiante.jpg";
import masqueHydratantProteine from "@/assets/masque-hydratant-proteine.jpg";
import shampoingDouxClarifiant from "@/assets/shampoing-doux-clarifiant.jpg";
import magicalSpray from "@/assets/magical-spray.jpg";
import masqueFortifiant from "@/assets/masque-fortifiant.jpg";
import cremeHydratanteVolume from "@/assets/creme-hydratante-volume.jpg";
import bainDhuile from "@/assets/bain-dhuile.jpg";

import gammeComplete from "@/assets/gamme-complete.jpg";
import gammeSoinProfond from "@/assets/gamme-soin-profond.jpg";
import gammeHydratationIntense from "@/assets/gamme-hydratation-intense.jpg";
import gammeMiniePlus from "@/assets/gamme-minie-plus.jpg";
import gammeMinie from "@/assets/gamme-minie.jpg";
import cremeBouclanteAsset from "@/assets/creme-bouclante.png.asset.json";
import cremeBouclanteOuverteAsset from "@/assets/creme-bouclante-ouverte.png.asset.json";
import duoExtraPousseAsset from "@/assets/duo-extra-pousse.jpg.asset.json";
import duoAntiPelliculaireAsset from "@/assets/duo-anti-pelliculaire.jpg.asset.json";
import trioRamollissantAsset from "@/assets/trio-ramollissant.png.asset.json";
import accessoiresVertAsset from "@/assets/set-accessoires-vert.png.asset.json";
import accessoiresBeigeAsset from "@/assets/set-accessoires-beige.png.asset.json";

export const cremeBouclanteImages = [cremeBouclanteAsset.url, cremeBouclanteOuverteAsset.url];

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
  rating: number;
  reviews: number;
  volume?: string;
  gallery?: string[];
}

export interface GammePack {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  image: string;
  benefits: string[];
  contains: string[];
  note?: string;
}

export const gammes = [
  { id: "hydratation", name: "Hydratation & Nutrition", icon: "💧" },
  { id: "volume", name: "Volume et Longueur", icon: "📏" },
  { id: "fortifiant", name: "Fortifiant & Anti Chute", icon: "🛡️" },
  { id: "soin", name: "Soin Nettoyant & Anti-pelliculaire", icon: "✨" },
  { id: "boucle", name: "Définition de boucle", icon: "🌀" },
];

export const gammePacks: GammePack[] = [
  {
    id: "gamme-complete-supreme",
    name: "Gamme Complète Suprême",
    description: "Permet d'atteindre tous vos objectifs capillaires & met fin à tous vos problèmes de cheveux.",
    longDescription: "La gamme ultime qui combine l'ensemble de nos soins pour répondre à 100% des besoins capillaires : hydratation, nutrition, croissance, fortification, anti-chute et définition.",
    price: 61000,
    image: gammeComplete,
    benefits: ["Tous les produits inclus", "Solution complète", "Tous problèmes capillaires"],
    contains: [
      "Bain d'huile",
      "Shampoing doux & clarifiant",
      "Masque hydratant & protéiné",
      "Masque fortifiant",
      "Leave-in conditioner",
      "Magical Spray",
      "Crème hydratante & volume +",
      "Crème bouclante",
      "Huile Extra Pousse",
      "Huile 2 en 1",
    ],
  },
  {
    id: "gamme-soin-profond",
    name: "Gamme Soin Profond & Réparateur",
    description: "Répare & traite efficacement les cheveux très fragiles, ternes, rêches, abîmés et très cassants. Redonne vie et éclat à vos cheveux.",
    price: 27000,
    image: gammeSoinProfond,
    benefits: ["Répare en profondeur", "Anti-casse", "Redonne éclat"],
    contains: [
      "Shampoing doux & clarifiant",
      "Masque hydratant & protéiné",
      "Masque fortifiant",
      "Leave-in conditioner",
      "Huile 2 en 1",
    ],
  },
  {
    id: "gamme-hydratation-intense",
    name: "Gamme Hydratation Intense",
    description: "Hydrate profondément et durablement pour des cheveux très souples, faciles à démêler et brillants.",
    note: "Parfaite pour cheveux très secs, abîmés et difficiles à peigner.",
    price: 38500,
    image: gammeHydratationIntense,
    benefits: ["Hydratation intense", "Démêlage facile", "Brillance"],
    contains: [
      "Bain d'huile",
      "Shampoing doux",
      "Masque hydratant",
      "Leave-in",
      "Spray",
      "Crème hydratante",
      "Huile 2 en 1",
    ],
  },
  {
    id: "gamme-minie-plus",
    name: "Gamme Minie+",
    description: "Complète et renforce l'action de la Gamme Minie en stimulant la croissance rapide, stoppant la casse, les irritations du cuir chevelu et facilitant la circulation sanguine.",
    note: "Idéale pour celles qui veulent un plus au soin de base.",
    price: 33500,
    image: gammeMiniePlus,
    benefits: ["Croissance rapide", "Anti-casse", "Anti-irritations"],
    contains: [
      "Shampoing doux & clarifiant",
      "Leave-in conditioner",
      "Magical Spray",
      "Crème hydratante & volume+",
      "Huile Extra Pousse",
      "Huile 2 en 1",
    ],
  },
  {
    id: "gamme-minie",
    name: "Gamme Minie",
    description: "Conçue pour une routine capillaire de base, simple et efficace, facilitant le coiffage au quotidien.",
    note: "Idéale pour débuter une routine capillaire et corriger les problèmes de base.",
    price: 22000,
    image: gammeMinie,
    benefits: ["Routine simple", "Coiffage facile", "Pour débuter"],
    contains: [
      "Shampoing doux & clarifiant",
      "Leave-in conditioner",
      "Magical Spray",
      "Crème hydratante & volume+",
    ],
  },
];

gammePacks.sort((a, b) => a.price - b.price);

const priceOf = (name: string) => products.find(p => p.name === name)?.price ?? 0;

export const duoPacks: GammePack[] = [
  { id: "duo-extra-pousse", name: "Duo Extra Pousse", description: "Le combo parfait pour avoir des cheveux longs et volumineux en quelques semaines.", image: duoExtraPousseAsset.url, benefits: [], contains: ["Crème Hydratante & Volume+", "Huile Extra Pousse"], price: 0 },
  { id: "duo-anti-pelliculaire", name: "Duo Anti-pelliculaire", description: "Le combo parfait pour dire adieu aux pellicules et démangeaisons en un seul geste.", image: duoAntiPelliculaireAsset.url, benefits: [], contains: ["Shampoing Doux & Clarifiant", "Huile Extra Pousse"], price: 0 },
  { id: "trio-ramollissant-anti-chutes", name: "Trio Ramollissant & Anti-chutes", description: "Le trio parfait pour des cheveux souples, faciles à coiffer et sans casse.", image: trioRamollissantAsset.url, benefits: [], contains: ["Huile 2 en 1", "Crème Hydratante & Volume+", "Magical Spray"], price: 0 },
];

export interface Accessory {
  id: string;
  name: string;
  price: number | null;
  colors: { name: string; swatch: string; image: string }[];
}

export const accessories: Accessory[] = [
  {
    id: "set-peignes-brosses",
    name: "Set de peignes & brosses Cure's Nappy",
    price: null,
    colors: [
      { name: "Vert", swatch: "hsl(100 25% 55%)", image: accessoiresVertAsset.url },
      { name: "Beige", swatch: "hsl(35 15% 70%)", image: accessoiresBeigeAsset.url },
    ],
  },
];

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
  rating: 5,
  reviews: 0,
});

export const products: Product[] = [
  {
    id: "1",
    name: "Bain d'Huile",
    description: "Un bain d'huile nourrissant qui pénètre en profondeur pour revitaliser les cheveux secs et abîmés. Adapté à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Nourrit en profondeur - Renforce l'hydratation - Protège des agressions extérieures",
    price: 5500,
    image: bainDhuile,
    gamme: "hydratation",
    volume: "100ml",
    benefits: ["Nourrit en profondeur", "Renforce l'hydratation", "Protège des agressions", "Douceur soyeuse"],
    ingredients: ["Huile de coco", "Huile d'olive", "Huile de jojoba", "Vitamine E"],
    usage: "Appliquer généreusement sur les longueurs et pointes. Laisser poser 1h minimum ou toute la nuit. Laver ensuite.",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "2",
    name: "Shampoing Doux & Clarifiant",
    description: "Un shampooing nettoyant ultra-doux qui clarifie le cuir chevelu tout en respectant la fibre capillaire. Adapté à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Nettoie efficacement - Apaise - Élimine les pellicules",
    price: 6000,
    image: shampoingDouxClarifiant,
    gamme: "hydratation",
    categories: ["hydratation", "soin"],
    volume: "250ml",
    benefits: ["Nettoie efficacement", "Apaise le cuir chevelu", "Élimine les pellicules", "Préserve l'hydratation"],
    ingredients: ["Extrait de moringa", "Hibiscus", "Protéine de soie", "Eau de rose"],
    usage: "Appliquer sur cheveux mouillés, masser le cuir chevelu délicatement. Rincer abondamment.",
    rating: 4.8,
    reviews: 127,
  },
  {
    id: "3",
    name: "Leave-in Conditionner",
    description: "Après-shampooing sans rinçage qui démêle, hydrate et protège les cheveux au quotidien. Adapté à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Hydrate (effet durable) - Protège - Répare - Révitalise - Coiffe",
    price: 5000,
    image: leaveInConditionner,
    gamme: "hydratation",
    volume: "100ml",
    benefits: ["Hydratation durable", "Protège & Répare", "Révitalise", "Coiffe facilement"],
    ingredients: ["Eau de coco", "Aloe vera", "Provitamine B5", "Extrait de bambou"],
    usage: "Appliquer sur cheveux humides après le shampooing. Ne pas rincer.",
    rating: 4.8,
    reviews: 178,
  },
  {
    id: "4",
    name: "Huile 2 en 1",
    description: "Une huile fortifiante & scellante qui fortifie la fibre capillaire et prévient la casse. Adaptée à tous types de cheveux.",
    shortDescription: "Fortifie - Scelle l'hydratation - Anti-casse",
    price: 5000,
    image: huileFortifiante,
    gamme: "hydratation",
    categories: ["hydratation", "fortifiant"],
    volume: "100ml",
    benefits: ["Fortifie la fibre", "Anti-casse", "Scelle l'hydratation", "Brillance naturelle"],
    ingredients: ["Huile de baobab", "Huile de moringa", "Kératine végétale", "Vitamine E"],
    usage: "Appliquer quelques gouttes sur les longueurs et pointes. Utiliser comme scellant après la crème.",
    rating: 4.7,
    reviews: 145,
  },
  {
    id: "5",
    name: "Magical Spray",
    description: "Un spray multi-usage qui hydrate, démêle et apporte brillance instantanée. Parfait pour rafraîchir votre coiffure au quotidien.",
    shortDescription: "Hydrate instantanément les cheveux au quotidien",
    price: 5000,
    image: magicalSpray,
    gamme: "hydratation",
    volume: "250ml",
    benefits: ["Hydratation instantanée", "Démêlage rapide", "Brillance", "Rafraîchit la coiffure"],
    ingredients: ["Eau de rose", "Aloe vera", "Glycérine végétale", "Huile d'argan"],
    usage: "Vaporiser sur cheveux secs ou humides. Peut être réappliqué dans la journée.",
    rating: 4.7,
    reviews: 112,
  },
  {
    id: "7",
    name: "Masque Hydratant & Protéiné",
    description: "Un masque profond qui combine hydratation et protéines pour restaurer les cheveux abîmés. Résultats visibles dès la première utilisation.",
    shortDescription: "Hydrate - Nourrit 2x plus - Sublime les cheveux",
    price: 6000,
    image: masqueHydratantProteine,
    gamme: "hydratation",
    benefits: ["Hydrate en profondeur", "Nourrit 2x plus", "Sublime les cheveux", "Douceur extrême"],
    ingredients: ["Protéine de soie", "Beurre de karité", "Huile d'avocat", "Kératine végétale"],
    usage: "Appliquer généreusement sur cheveux lavés. Laisser poser 30 minutes sous un bonnet. Rincer.",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "8",
    name: "Huile Extra Pousse",
    description: "Une huile concentrée qui stimule la croissance capillaire et renforce les racines. Formulée avec des ingrédients naturels.",
    shortDescription: "Active la pousse rapide - Lutte contre les alopécies - Tonifie les racines",
    price: 6500,
    image: huileExtraPousse,
    gamme: "volume",
    volume: "100ml",
    benefits: ["Active la pousse rapide", "Lutte contre les alopécies", "Tonifie les racines", "Prévient la chute"],
    ingredients: ["Huile de ricin", "Huile de romarin", "Biotine", "Huile de menthe poivrée"],
    usage: "Appliquer directement sur le cuir chevelu. Masser 5 minutes. Utiliser 3 fois par semaine.",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "9",
    name: "Crème Hydratante & Volume+",
    description: "Une crème riche qui hydrate en profondeur tout en apportant du volume aux cheveux.",
    shortDescription: "Scelle l'hydratation - Ramollit - Donne du volume",
    price: 6000,
    image: cremeHydratanteVolume,
    gamme: "volume",
    categories: ["hydratation", "volume"],
    benefits: ["Scelle l'hydratation", "Ramollit les cheveux", "Donne du volume", "Protection"],
    ingredients: ["Beurre de karité", "Huile de coco", "Aloe vera", "Vitamine E"],
    usage: "Appliquer sur cheveux humides, mèche par mèche. Sceller avec une huile légère.",
    rating: 4.8,
    reviews: 167,
  },
  {
    id: "10",
    name: "Masque Fortifiant",
    description: "Un masque 100% naturel à base de poudres africaines qui fortifie et épaissit les cheveux.",
    shortDescription: "Fortifie - Anti-chutes - Donne du volume & l'éclat",
    price: 5000,
    image: masqueFortifiant,
    gamme: "fortifiant",
    benefits: ["Fortifie intensément", "Anti-chutes", "Donne du volume", "Redonne l'éclat"],
    ingredients: ["Henné neutre", "Poudre de fenugrec", "Argile", "Beurre de karité"],
    usage: "Mélanger la poudre avec de l'eau tiède. Appliquer sur cheveux humides. Laisser poser 45 minutes. Rincer.",
    rating: 4.9,
    reviews: 98,
  },
  {
    id: "13",
    name: "Crème Bouclante",
    description: "Une crème coiffante qui définit parfaitement les boucles de vos cheveux. Pour des boucles sublimes et bien dessinées.",
    shortDescription: "Définit parfaitement les boucles de vos cheveux",
    price: 8500,
    image: cremeBouclanteAsset.url,
    gallery: [cremeBouclanteAsset.url, cremeBouclanteOuverteAsset.url],
    gamme: "boucle",
    benefits: ["Définition des boucles", "Tenue longue durée", "Anti-frisottis", "Brillance naturelle"],
    ingredients: ["Beurre de karité", "Huile de coco", "Aloe vera", "Glycérine végétale"],
    usage: "Appliquer sur cheveux humides, mèche par mèche, en froissant les boucles vers le haut.",
    rating: 4.8,
    reviews: 74,
  },
];

export const productMatchesCategory = (product: Product, category: string) =>
  product.gamme === category || product.categories?.includes(category) === true;

duoPacks.forEach(pack => { pack.price = pack.contains.reduce((sum, name) => sum + priceOf(name), 0); });
