import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

/**
 * Commande en ligne pas encore payée : avant de partir vers Wave, Orange Money, MTN…, le site garde le panier
 * et la fiche. Si le paiement n'aboutit pas, la cliente retrouve tout et choisit un autre moyen de paiement.
 * Rien de secret n'est gardé : seulement les articles, les coordonnées saisies et le jeton du reçu.
 */
export interface CheckoutSnapshot {
  token: string;
  items: { id: string; quantity: number }[];
  form: Record<string, string>;
  mode: string;
  method: string;
  payerPhone: string;
  at: string;
}

const KEY = "curesnappy-pending-checkout";
const PREFILL_KEY = "curesnappy-checkout-prefill";
const MAX_AGE = 3 * 24 * 3600 * 1000;

export const savePendingCheckout = (snapshot: Omit<CheckoutSnapshot, "at">) => {
  try { localStorage.setItem(KEY, JSON.stringify({ ...snapshot, at: new Date().toISOString() })); } catch { /* stockage bloqué */ }
};

export const readPendingCheckout = (): CheckoutSnapshot | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw) as CheckoutSnapshot;
    if (!snapshot?.token || !Array.isArray(snapshot.items) || Date.now() - new Date(snapshot.at).getTime() > MAX_AGE) {
      localStorage.removeItem(KEY);
      return null;
    }
    return snapshot;
  } catch { return null; }
};

export const clearPendingCheckout = (token?: string) => {
  try {
    if (token && readPendingCheckout()?.token !== token) return;
    localStorage.removeItem(KEY);
  } catch { /* rien */ }
};

/** Fiche à préremplir sur la page de commande (lue une seule fois). */
export const takeCheckoutPrefill = (): CheckoutSnapshot | null => {
  try {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    sessionStorage.removeItem(PREFILL_KEY);
    return raw ? (JSON.parse(raw) as CheckoutSnapshot) : null;
  } catch { return null; }
};

/** La commande non payée gardée dans ce navigateur, si elle l'est vraiment (vérifié auprès du serveur), et de quoi la reprendre. */
export const usePendingCheckout = (verify = true) => {
  const { replaceCart } = useCart();
  const navigate = useNavigate();
  const [pending, setPending] = useState<CheckoutSnapshot | null>(() => (verify ? null : readPendingCheckout()));

  useEffect(() => {
    if (!verify) return;
    const snapshot = readPendingCheckout();
    if (!snapshot) return;
    let cancelled = false;
    supabase.functions.invoke("order-receipt", { body: { token: snapshot.token } }).then(({ data }) => {
      if (cancelled || !data) return;
      if (data.paymentStatus === "payee" || data.status !== "nouvelle") clearPendingCheckout(snapshot.token);
      else setPending(snapshot);
    });
    return () => { cancelled = true; };
  }, [verify]);

  const restore = useCallback((snapshot: CheckoutSnapshot | null = pending) => {
    if (!snapshot) return;
    replaceCart(snapshot.items);
    try { sessionStorage.setItem(PREFILL_KEY, JSON.stringify(snapshot)); } catch { /* rien */ }
    navigate("/checkout");
  }, [pending, replaceCart, navigate]);

  return { pending, restore };
};
