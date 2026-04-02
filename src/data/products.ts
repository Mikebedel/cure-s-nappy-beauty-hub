import huileExtraPousse from "@/assets/huile-extra-pousse.jpg";
import leaveInConditionner from "@/assets/leave-in-conditionner.jpg";
import huileFortifiante from "@/assets/huile-fortifiante.jpg";
import masqueHydratantProteine from "@/assets/masque-hydratant-proteine.jpg";
import shampoingDouxClarifiant from "@/assets/shampoing-doux-clarifiant.jpg";
import magicalSpray from "@/assets/magical-spray.jpg";
import masqueFortifiant from "@/assets/masque-fortifiant.jpg";
import cremeHydratanteVolume from "@/assets/creme-hydratante-volume.jpg";
import bainDhuile from "@/assets/bain-dhuile.jpg";

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

export const gammes = [
  { id: "hydratation", name: "Hydratation & Volume", icon: "💧" },
  { id: "croissance", name: "Croissance & Pousse", icon: "🌱" },
  { id: "fortifiant", name: "Fortifiant & Force", icon: "🛡️" },
  { id: "soin", name: "Soin & Nettoyage", icon: "✨" },
  { id: "quotidien", name: "Routine Quotidienne", icon: "☀️" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Huile Extra Pousse",
    description: "Une huile concentrée qui stimule la croissance capillaire et renforce les racines. Formulée avec des ingrédients naturels adaptés à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Stimule la pousse et renforce les racines",
    price: 5000,
    image: huileExtraPousse,
    gamme: "croissance",
    volume: "100ml",
    benefits: ["Stimule la pousse", "Renforce les racines", "Nourrit le cuir chevelu", "Prévient la chute"],
    ingredients: ["Huile de ricin", "Huile de romarin", "Biotine", "Huile de menthe poivrée"],
    usage: "Appliquer directement sur le cuir chevelu. Masser 5 minutes. Utiliser 3 fois par semaine.",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "2",
    name: "Leave-in Conditionner",
    description: "Après-shampooing sans rinçage qui démêle, hydrate et protège les cheveux au quotidien. Adapté à tous types de cheveux : naturels, bouclés et défrisés. Testé et approuvé.",
    shortDescription: "Après-shampooing sans rinçage démêlant",
    price: 4500,
    image: leaveInConditionner,
    gamme: "quotidien",
    volume: "100ml",
    benefits: ["Démêlage facile", "Hydratation quotidienne", "Protection", "Légèreté"],
    ingredients: ["Eau de coco", "Aloe vera", "Provitamine B5", "Extrait de bambou"],
    usage: "Appliquer sur cheveux humides après le shampooing. Ne pas rincer. Démêler avec un peigne à dents larges.",
    rating: 4.8,
    reviews: 178,
  },
  {
    id: "3",
    name: "Huile Fortifiante",
    description: "Une huile nourrissante qui fortifie la fibre capillaire et prévient la casse. Adaptée à tous types de cheveux : naturels, bouclés et défrisés. Le meilleur remède pour vos bobos capillaires.",
    shortDescription: "Fortifie et nourrit en profondeur",
    price: 4500,
    image: huileFortifiante,
    gamme: "fortifiant",
    volume: "100ml",
    benefits: ["Fortifie la fibre", "Anti-casse", "Nourrit en profondeur", "Brillance naturelle"],
    ingredients: ["Huile de baobab", "Huile de moringa", "Kératine végétale", "Vitamine E"],
    usage: "Appliquer quelques gouttes sur les longueurs et pointes. Utiliser comme scellant après la crème.",
    rating: 4.7,
    reviews: 145,
  },
  {
    id: "4",
    name: "Masque Hydratant et Protéiné",
    description: "Un masque profond qui combine hydratation et protéines pour restaurer les cheveux abîmés. Adapté à tous types de cheveux. Résultats visibles dès la première utilisation.",
    shortDescription: "Hydratation et protéines en un soin",
    price: 6500,
    image: masqueHydratantProteine,
    gamme: "hydratation",
    benefits: ["Hydratation profonde", "Apport en protéines", "Réparation", "Douceur extrême"],
    ingredients: ["Protéine de soie", "Beurre de karité", "Huile d'avocat", "Kératine végétale"],
    usage: "Appliquer généreusement sur cheveux lavés. Laisser poser 30 minutes sous un bonnet. Rincer.",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "5",
    name: "Shampoing Doux et Clarifiant",
    description: "Un shampooing nettoyant ultra-doux qui clarifie le cuir chevelu tout en respectant la fibre capillaire. Adapté à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Nettoyage doux et clarifiant",
    price: 5500,
    image: shampoingDouxClarifiant,
    gamme: "soin",
    volume: "250ml",
    benefits: ["Nettoyage en douceur", "Clarifie le cuir chevelu", "Préserve l'hydratation", "Apaise le cuir chevelu"],
    ingredients: ["Extrait de moringa", "Hibiscus", "Protéine de soie", "Eau de rose"],
    usage: "Appliquer sur cheveux mouillés, masser le cuir chevelu délicatement. Rincer abondamment.",
    rating: 4.8,
    reviews: 127,
  },
  {
    id: "6",
    name: "Magical Spray",
    description: "Un spray magique multi-usage qui hydrate, démêle et apporte brillance instantanée. Adapté à tous types de cheveux. Parfait pour rafraîchir votre coiffure au quotidien.",
    shortDescription: "Spray magique multi-usage",
    price: 4000,
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
    shortDescription: "Masque naturel fortifiant aux poudres",
    price: 5000,
    image: masqueFortifiant,
    gamme: "fortifiant",
    benefits: ["Fortification intense", "Épaisseur", "100% naturel", "Anti-chute"],
    ingredients: ["Henné neutre", "Poudre de fenugrec", "Argile", "Beurre de karité"],
    usage: "Mélanger la poudre avec de l'eau tiède. Appliquer sur cheveux humides. Laisser poser 45 minutes. Rincer.",
    rating: 4.9,
    reviews: 98,
  },
  {
    id: "8",
    name: "Crème Hydratante et Volume+",
    description: "Une crème riche qui hydrate en profondeur tout en apportant du volume aux cheveux. Adaptée à tous types de cheveux : naturels, bouclés et défrisés. Le meilleur remède pour vos cheveux.",
    shortDescription: "Hydratation et volume en une crème",
    price: 5500,
    image: cremeHydratanteVolume,
    gamme: "hydratation",
    benefits: ["Hydratation 72h", "Volume naturel", "Définition", "Protection"],
    ingredients: ["Beurre de karité", "Huile de coco", "Aloe vera", "Vitamine E"],
    usage: "Appliquer sur cheveux humides, mèche par mèche. Sceller avec une huile légère.",
    rating: 4.8,
    reviews: 167,
  },
  {
    id: "9",
    name: "Bain d'Huile",
    description: "Un bain d'huile nourrissant qui pénètre en profondeur pour revitaliser les cheveux secs et abîmés. Adapté à tous types de cheveux : naturels, bouclés et défrisés.",
    shortDescription: "Bain nourrissant revitalisant",
    price: 4000,
    image: bainDhuile,
    gamme: "soin",
    volume: "100ml",
    benefits: ["Nutrition intense", "Revitalise", "Scelle l'hydratation", "Douceur soyeuse"],
    ingredients: ["Huile de coco", "Huile d'olive", "Huile de jojoba", "Vitamine E"],
    usage: "Appliquer généreusement sur les longueurs et pointes. Laisser poser 1h minimum ou toute la nuit. Laver ensuite.",
    rating: 4.6,
    reviews: 89,
  },
];
