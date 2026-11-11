import {
  ShieldCheck, Truck, Sparkles, MessageCircleHeart, Eye, Target, Heart, Leaf, Users, Award,
  Lightbulb, ShieldAlert, AlertTriangle, Droplets, Star, Gift, Clock, Package, Smile, Flower2,
  type LucideIcon,
} from "lucide-react";

/** Icônes proposées dans le dashboard (clé enregistrée → icône affichée). */
export const icons: Record<string, { label: string; icon: LucideIcon }> = {
  shield: { label: "Bouclier", icon: ShieldCheck },
  truck: { label: "Livraison", icon: Truck },
  sparkles: { label: "Étincelles", icon: Sparkles },
  chat: { label: "Conseil", icon: MessageCircleHeart },
  eye: { label: "Vision", icon: Eye },
  target: { label: "Cible", icon: Target },
  heart: { label: "Cœur", icon: Heart },
  leaf: { label: "Feuille", icon: Leaf },
  users: { label: "Communauté", icon: Users },
  award: { label: "Qualité", icon: Award },
  lightbulb: { label: "Idée", icon: Lightbulb },
  "shield-alert": { label: "Prévention", icon: ShieldAlert },
  alert: { label: "Attention", icon: AlertTriangle },
  drop: { label: "Goutte", icon: Droplets },
  star: { label: "Étoile", icon: Star },
  gift: { label: "Cadeau", icon: Gift },
  clock: { label: "Horloge", icon: Clock },
  package: { label: "Colis", icon: Package },
  smile: { label: "Sourire", icon: Smile },
  flower: { label: "Fleur", icon: Flower2 },
};

export const iconFor = (key: string): LucideIcon => icons[key]?.icon ?? Sparkles;
