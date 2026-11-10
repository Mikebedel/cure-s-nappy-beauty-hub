import { accessories } from "@/data/products";

/**
 * Flash News : l'annonce mise en avant sur la page d'accueil
 * (promotion, communiqué, nouveauté). Modifiez ce bloc pour la changer ;
 * passez `active` à false pour masquer la section.
 */
export const flashNews = {
  active: true,
  badge: "Nouveauté",
  title: "Le set de peignes & brosses est arrivé",
  text: "Une brosse à shampoing en silicone, une brosse en paille de blé et un peigne à dents larges, réunis dans un sac Cure's Nappy. Disponible en vert et en beige.",
  highlight: "Commande sur WhatsApp",
  image: accessories[0].colors[0].image,
  imageAlt: "Set de peignes et brosses Cure's Nappy",
  cta: { label: "Découvrir le set", to: "/boutique#accessoires" },
  secondaryCta: { label: "Voir la boutique", to: "/boutique" },
};
