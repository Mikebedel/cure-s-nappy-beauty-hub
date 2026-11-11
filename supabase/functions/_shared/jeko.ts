import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { sendReceiptEmail } from "./email.ts";

/** Paiement en ligne Jèko (Wave, Orange Money, MTN, Moov, Djamo). Documentation : https://developer.jeko.africa */
const API = "https://api.jeko.africa/partner_api";

export const JEKO_METHODS = ["wave", "orange", "mtn", "moov", "djamo"] as const;
export type JekoMethod = (typeof JEKO_METHODS)[number];

const env = (name: string) => Deno.env.get(name) ?? "";
/** Vrai quand les clés Jèko sont configurées sur le serveur. */
export const jekoConfigured = () => !!(env("JEKO_API_KEY") && env("JEKO_API_KEY_ID") && env("JEKO_STORE_ID"));

const headers = () => ({
  "X-API-KEY": env("JEKO_API_KEY"),
  "X-API-KEY-ID": env("JEKO_API_KEY_ID"),
  "Content-Type": "application/json",
});

/** Crée la demande de paiement ; Jèko renvoie l'adresse où envoyer la cliente. Montants en centimes (× 100). */
export async function createPaymentRequest(params: { amount: number; reference: string; method: JekoMethod; successUrl: string; errorUrl: string }) {
  const res = await fetch(`${API}/payment_requests`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      storeId: env("JEKO_STORE_ID"),
      amountCents: params.amount * 100,
      currency: "XOF",
      reference: params.reference,
      paymentDetails: { type: "redirect", data: { paymentMethod: params.method, successUrl: params.successUrl, errorUrl: params.errorUrl } },
    }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.id || !body?.redirectUrl) {
    throw new Error(`Jèko a refusé la demande de paiement (${res.status}) ${body?.id ?? body?.message ?? ""}`);
  }
  return { id: body.id as string, redirectUrl: body.redirectUrl as string };
}

/** Demande à Jèko l'état réel d'une demande de paiement : on ne se fie jamais au navigateur. */
export async function fetchPaymentRequest(id: string) {
  const res = await fetch(`${API}/payment_requests/${encodeURIComponent(id)}`, { headers: headers() });
  if (!res.ok) return null;
  return await res.json().catch(() => null) as {
    id: string; status: string; reference?: string; amountCents?: number; currency?: string; paymentMethod?: string;
    transaction?: { amount?: number | { amount?: number; currency?: string }; executedAt?: string; status?: string };
  } | null;
}

/** Signature Jèko : HMAC-SHA256 du corps brut avec le secret du webhook, en hexadécimal, comparée en temps constant. */
export async function isSignatureValid(rawBody: string, signature: string | null) {
  const secret = env("JEKO_WEBHOOK_SECRET");
  if (!signature || !secret) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  const expected = Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
  const received = signature.trim().toLowerCase();
  if (expected.length !== received.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ received.charCodeAt(i);
  return diff === 0;
}

/** Le montant payé correspond-il au total de la commande ? (centimes demandés, ou montant de la transaction). */
const amountMatches = (pr: NonNullable<Awaited<ReturnType<typeof fetchPaymentRequest>>>, total: number) => {
  if (typeof pr.amountCents === "number") return pr.amountCents === total * 100;
  const tx = pr.transaction?.amount;
  const value = typeof tx === "number" ? tx : tx?.amount;
  return value === total || value === total * 100;
};

/**
 * Vérifie un paiement auprès de Jèko et, s'il est réussi et du bon montant,
 * marque la commande payée (une seule fois) puis envoie le reçu par e-mail.
 */
export async function confirmPayment(db: SupabaseClient, reference: string): Promise<"paid" | "pending" | "failed" | "mismatch" | "unknown"> {
  const { data: order } = await db.from("orders").select("*").eq("payment_reference", reference).maybeSingle();
  if (!order || !order.payment_provider_id) return "unknown";
  if (order.payment_status === "payee") return "paid";

  const pr = await fetchPaymentRequest(order.payment_provider_id);
  if (!pr) return "pending";
  if (pr.status === "error") {
    await db.from("orders").update({ payment_status: "echouee" }).eq("id", order.id).eq("payment_status", "en_attente");
    return "failed";
  }
  if (pr.status !== "success") return "pending";
  if ((pr.currency && pr.currency !== "XOF") || (pr.reference && pr.reference !== reference) || !amountMatches(pr, order.total)) {
    console.error("Paiement Jèko incohérent", { reference, amountCents: pr.amountCents, expected: order.total * 100 });
    return "mismatch";
  }

  // La condition payment_status <> 'payee' garantit qu'un paiement n'est traité qu'une fois.
  const { data: updated } = await db.from("orders")
    .update({ payment_status: "payee", paid_at: pr.transaction?.executedAt ? new Date(pr.transaction.executedAt.replace(" ", "T") + "Z").toISOString() : new Date().toISOString(), payment_channel: pr.paymentMethod ?? order.payment_channel })
    .eq("id", order.id).neq("payment_status", "payee")
    .select("*").maybeSingle();

  if (updated) await sendReceiptEmail(db, updated).catch((e) => console.error("Envoi du reçu impossible", e));
  return "paid";
}
