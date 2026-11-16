/**
 * Règles d'argent partagées par le tableau de bord et l'écran Clients.
 * Seul l'argent réellement reçu compte comme une vente : c'est ce chiffre qui va en comptabilité.
 */
export interface MoneyOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  total: number;
  status: string;
  payment_method: string | null;
  payment_status: string | null;
  paid_at: string | null;
  created_at: string;
  receipt_token?: string | null;
}

export const MONEY_ORDER_COLUMNS = "id, order_number, customer_name, customer_phone, customer_email, total, status, payment_method, payment_status, paid_at, created_at, receipt_token";

/** Un paiement en ligne non terminé au bout de ce délai est considéré comme abandonné. */
const ABANDON_AFTER_MS = 60 * 60 * 1000;

export type MoneyState = "encaissee" | "en_cours" | "non_conclue";

export const moneyState = (o: MoneyOrder, now = Date.now()): MoneyState => {
  if (o.payment_status === "payee") return "encaissee";
  // « Payer plus tard » : l'argent est reçu à la livraison.
  if (o.payment_method !== "jeko" && o.status === "livree") return "encaissee";
  if (o.status === "annulee" || o.payment_status === "echouee") return "non_conclue";
  if (o.payment_method === "jeko" && now - new Date(o.created_at).getTime() > ABANDON_AFTER_MS) return "non_conclue";
  return "en_cours";
};

export const moneyLabel: Record<MoneyState, { label: string; tone: string }> = {
  encaissee: { label: "Encaissée", tone: "bg-green-100 text-green-800" },
  en_cours: { label: "En cours", tone: "bg-amber-100 text-amber-800" },
  non_conclue: { label: "Vente non conclue", tone: "bg-red-100 text-red-700" },
};

/** Date à laquelle l'argent est entré (paiement en ligne) ou, à défaut, date de la commande. */
export const cashedAt = (o: MoneyOrder) => o.paid_at ?? o.created_at;

export const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;

/** Numéro au format international sans « + » ni espaces, pour wa.me et les SMS. */
export const phoneDigits = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `225${digits}` : digits;
};

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";
