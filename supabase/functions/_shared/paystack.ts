import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { sendReceiptEmail } from "./email.ts";

const API = "https://api.paystack.co";
export const secretKey = () => Deno.env.get("PAYSTACK_SECRET_KEY") ?? "";

/** Ouvre un paiement Paystack. Les montants XOF s'envoient multipliés par 100 (règle Paystack). */
export async function initializePayment(params: { email: string; amount: number; reference: string; callbackUrl: string; metadata: Record<string, unknown> }) {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount * 100,
      currency: "XOF",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.status || !body?.data?.authorization_url) {
    throw new Error(body?.message ?? `Paystack a refusé l'ouverture du paiement (${res.status})`);
  }
  return body.data.authorization_url as string;
}

/** Demande à Paystack l'état réel d'un paiement : on ne se fie jamais à ce que dit le navigateur. */
export async function fetchTransaction(reference: string) {
  const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.status) return null;
  return body.data as { status: string; amount: number; currency: string; reference: string; channel?: string; paid_at?: string };
}

/** Signature HMAC SHA-512 du corps brut, avec la clé secrète, comparée en temps constant. */
export async function isSignatureValid(rawBody: string, signature: string | null) {
  if (!signature || !secretKey()) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secretKey()), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  const expected = Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

/**
 * Vérifie un paiement auprès de Paystack et, s'il est réussi et du bon montant,
 * marque la commande payée (une seule fois) puis envoie le reçu par e-mail.
 */
export async function confirmPayment(db: SupabaseClient, reference: string): Promise<"paid" | "pending" | "mismatch" | "unknown"> {
  const { data: order } = await db.from("orders").select("*").eq("payment_reference", reference).maybeSingle();
  if (!order) return "unknown";
  if (order.payment_status === "payee") return "paid";

  const tx = await fetchTransaction(reference);
  if (!tx || tx.status !== "success") return "pending";
  if (tx.currency !== "XOF" || tx.reference !== reference || tx.amount !== order.total * 100) {
    console.error("Paiement Paystack incohérent", { reference, amount: tx.amount, expected: order.total * 100, currency: tx.currency });
    return "mismatch";
  }

  // La condition payment_status <> 'payee' garantit qu'un paiement n'est traité qu'une fois.
  const { data: updated } = await db.from("orders")
    .update({ payment_status: "payee", paid_at: tx.paid_at ?? new Date().toISOString(), payment_channel: tx.channel ?? null })
    .eq("id", order.id).neq("payment_status", "payee")
    .select("*").maybeSingle();

  if (updated) await sendReceiptEmail(db, updated).catch((e) => console.error("Envoi du reçu impossible", e));
  return "paid";
}
