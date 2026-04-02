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
import gammeSemiComplete from "@/assets/gamme-semi-complete.jpg";
import gammeHydratante from "@/assets/gamme-hydratante.jpg";
import gammeNourrissante from "@/assets/gamme-nourrissante.jpg";
import gammeMiniePlus from "@/assets/gamme-minie-plus.jpg";
import gammeMinie from "@/assets/gamme-minie.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  gamme: string;
  benefits: string[];
  ingredients: string[];
  usage: string;
  rating: number;
  reviews: number;
  volume?: string;
}

export interface GammePack {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  benefits: string[];
}

export const gammes = [
  { id: "hydratation", name: "Hydratation & Volume", icon: "💧" },
  { id: "croissance", name: "Croissance & Pousse", icon: "🌱" },
  { id: "fortifiant", name: "Fortifiant & Force", icon: "🛡️" },
  { id: "soin", name: "Soin & Nettoyage", icon: "✨" },
  { id: "quotidien", name: "Routine Quotidienne", icon: "☀️" },
];

export const gammePacks: GammePack[] = [
  {
    id: "gamme-complete",
    name: "Gamme Complète",
    description: "Lutte contre tous vos problèmes capillaires - Définition des boucles",
    price: 56000,
    image: gammeComplete,
    benefits: ["Tous les produits inclus", "Définition des boucles", "Solution complète"],
  },
  {
    id: "gamme-semi-complete",
    name: "Gamme Semi-Complète",
    description: "Lutte contre tous vos problèmes capillaires",
    price: 49000,
    image: gammeSemiComplete,
    benefits: ["Soin complet", "Anti-problèmes capillaires", "Résultats durables"],
  },
  {
    id: "gamme-hydratante",
    name: "Gamme Hydratante",
    description: "Hydratation & Nutrition renforcées pour cheveux très secs / Abîmés",
    price: 26000,
    image: gammeHydratante,
    benefits: ["Hydratation intense", "Nutrition renforcée", "Cheveux secs & abîmés"],
  },
  {
    id: "gamme-nourrissante",
    name: "Gamme Fortifiante & Nourrissante",
    description: "Nourrit - Répare - Fortifie - Protège - Redonne de l'éclat - Améliore la santé capillaire - Lutte contre la casse",
    price: 16000,
    image: gammeNourrissante,
    benefits: ["Nourrit & Répare", "Fortifie & Protège", "Anti-casse"],
  },
  {
    id: "gamme-minie-plus",
    name: "Gamme Minie+",
    description: "Hydratation - Pousse extra - Lavage doux & Nettoyant - Traitement anti-pelliculaire & démangeaisons - Anti-chutes",
    price: 26500,
    image: gammeMiniePlus,
    benefits: ["Hydratation & Pousse", "Anti-pelliculaire", "Anti-chutes"],
  },
  {
    id: "gamme-minie",
    name: "Gamme Minie Débutante",
    description: "Hydratation - Pousse - Lavage doux & Nettoyant",
    price: 21000,
    image: gammeMinie,
    benefits: ["Hydratation", "Pousse", "Lavage doux"],
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Huile Extra Pousse",
    description: "Une huile concentrée qui stimule la croissance capillaire et renforce les racines. Formulée avec des ingrédients naturels adaptés à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Active la pousse rapide des cheveux - Lutte contre les alopécies - Tonifie les racines",
    price: 6500,
    image: huileExtraPousse,
    gamme: "croissance",
    volume: "100ml",
    benefits: ["Active la pousse rapide", "Lutte contre les alopécies", "Tonifie les racines", "Prévient la chute"],
    ingredients: ["Huile de ricin", "Huile de romarin", "Biotine", "Huile de menthe poivrée"],
    usage: "Appliquer directement sur le cuir chevelu. Masser 5 minutes. Utiliser 3 fois par semaine.",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "2",
    name: "Leave-in Conditionner",
    description: "Après-shampooing sans rinçage qui démêle, hydrate et protège les cheveux au quotidien. Adapté à tous types de cheveux : naturels, bouclés et défrisés. Testé et approuvé.",
    shortDescription: "Hydrate (effet durable) - Protège - Répare - Révitalise - Coiffe",
    price: 5000,
    image: leaveInConditionner,
    gamme: "quotidien",
    volume: "100ml",
    benefits: ["Hydratation durable", "Protège & Répare", "Révitalise", "Coiffe facilement"],
    ingredients: ["Eau de coco", "Aloe vera", "Provitamine B5", "Extrait de bambou"],
    usage: "Appliquer sur cheveux humides après le shampooing. Ne pas rincer. Démêler avec un peigne à dents larges.",
    rating: 4.8,
    reviews: 178,
  },
  {
    id: "3",
    name: "Huile Fortifiante",
    description: "Une huile nourrissante qui fortifie la fibre capillaire et prévient la casse. Adaptée à tous types de cheveux : naturels, bouclés et défrisés. Booste 2x plus l'efficacité du masque fortifiant.",
    shortDescription: "Booste 2x plus l'efficacité du masque fortifiant",
    price: 4000,
    image: huileFortifiante,
    gamme: "fortifiant",
    volume: "100ml",
    benefits: ["Fortifie la fibre", "Anti-casse", "Booste le masque fortifiant", "Brillance naturelle"],
    ingredients: ["Huile de baobab", "Huile de moringa", "Kératine végétale", "Vitamine E"],
    usage: "Appliquer quelques gouttes sur les longueurs et pointes. Utiliser comme scellant après la crème.",
    rating: 4.7,
    reviews: 145,
  },
  {
    id: "4",
    name: "Masque Hydratant & Protéiné",
    description: "Un masque profond qui combine hydratation et protéines pour restaurer les cheveux abîmés. Adapté à tous types de cheveux. Résultats visibles dès la première utilisation.",
    shortDescription: "Hydrate - Nourrit 2x plus - Sublime les cheveux",
    price: 5000,
    image: masqueHydratantProteine,
    gamme: "hydratation",
    benefits: ["Hydrate en profondeur", "Nourrit 2x plus", "Sublime les cheveux", "Douceur extrême"],
    ingredients: ["Protéine de soie", "Beurre de karité", "Huile d'avocat", "Kératine végétale"],
    usage: "Appliquer généreusement sur cheveux lavés. Laisser poser 30 minutes sous un bonnet. Rincer.",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "5",
    name: "Shampoing Doux & Clarifiant",
    description: "Un shampooing nettoyant ultra-doux qui clarifie le cuir chevelu tout en respectant la fibre capillaire. Adapté à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Nettoie efficacement - Apaise - Élimine les pellicules",
    price: 6000,
    image: shampoingDouxClarifiant,
    gamme: "soin",
    volume: "250ml",
    benefits: ["Nettoie efficacement", "Apaise le cuir chevelu", "Élimine les pellicules", "Préserve l'hydratation"],
    ingredients: ["Extrait de moringa", "Hibiscus", "Protéine de soie", "Eau de rose"],
    usage: "Appliquer sur cheveux mouillés, masser le cuir chevelu délicatement. Rincer abondamment.",
    rating: 4.8,
    reviews: 127,
  },
  {
    id: "6",
    name: "Magical Spray",
    description: "Un spray magique multi-usage qui hydrate, démêle et apporte brillance instantanée. Adapté à tous types de cheveux. Parfait pour rafraîchir votre coiffure au quotidien.",
    shortDescription: "Hydrate instantanément les cheveux au quotidien",
    price: 5000,
    image: magicalSpray,
    gamme: "quotidien",
    volume: "250ml",
    benefits: ["Hydratation instantanée", "Démêlage rapide", "Brillance", "Rafraîchit la coiffure"],
    ingredients: ["Eau de rose", "Aloe vera", "Glycérine végétale", "Huile d'argan"],
    usage: "Vaporiser sur cheveux secs ou humides. Peut être réappliqué dans la journée.",
    rating: 4.7,
    reviews: 112,
  },
  {
    id: "7",
    name: "Masque Fortifiant",
    description: "Un masque 100% naturel à base de poudres africaines qui fortifie et épaissit les cheveux. Adapté à tous types de cheveux. Le meilleur remède pour tous vos bobos capillaires.",
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
    id: "8",
    name: "Crème Hydratante & Volume+",
    description: "Une crème riche qui hydrate en profondeur tout en apportant du volume aux cheveux. Adaptée à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Scelle l'hydratation - Ramollit - Donne du volume",
    price: 5500,
    image: cremeHydratanteVolume,
    gamme: "hydratation",
    benefits: ["Scelle l'hydratation", "Ramollit les cheveux", "Donne du volume", "Protection"],
    ingredients: ["Beurre de karité", "Huile de coco", "Aloe vera", "Vitamine E"],
    usage: "Appliquer sur cheveux humides, mèche par mèche. Sceller avec une huile légère.",
    rating: 4.8,
    reviews: 167,
  },
  {
    id: "9",
    name: "Bain d'Huile",
    description: "Un bain d'huile nourrissant qui pénètre en profondeur pour revitaliser les cheveux secs et abîmés. Adapté à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Nourrit en profondeur - Renforce l'hydratation - Protège des agressions extérieures",
    price: 5500,
    image: bainDhuile,
    gamme: "soin",
    volume: "100ml",
    benefits: ["Nourrit en profondeur", "Renforce l'hydratation", "Protège des agressions", "Douceur soyeuse"],
    ingredients: ["Huile de coco", "Huile d'olive", "Huile de jojoba", "Vitamine E"],
    usage: "Appliquer généreusement sur les longueurs et pointes. Laisser poser 1h minimum ou toute la nuit. Laver ensuite.",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "10",
    name: "Crème Bouclante",
    description: "Une crème coiffante qui définit parfaitement les boucles de vos cheveux. Adaptée à tous types de cheveux bouclés et naturels pour des boucles sublimes et bien dessinées.",
    shortDescription: "Définit parfaitement les boucles de vos cheveux",
    price: 8500,
    image: cremeHydratanteVolume,
    gamme: "hydratation",
    benefits: ["Définition des boucles", "Tenue longue durée", "Anti-frisottis", "Brillance naturelle"],
    ingredients: ["Beurre de karité", "Huile de coco", "Aloe vera", "Glycérine végétale"],
    usage: "Appliquer sur cheveux humides, mèche par mèche, en froissant les boucles vers le haut.",
    rating: 4.8,
    reviews: 74,
  },
];
