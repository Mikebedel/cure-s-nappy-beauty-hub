/** Moyens de paiement en ligne proposés par Jèko, avec leur nom affiché. */
export const paymentMethodLabels = {
  wave: "Wave",
  orange: "Orange Money",
  mtn: "MTN MoMo",
  moov: "Moov Money",
  djamo: "Djamo",
} as const;

export type OnlineMethod = keyof typeof paymentMethodLabels;
