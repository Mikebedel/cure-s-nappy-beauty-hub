import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { escapeHtml } from "./http.ts";

/**
 * Envoie le reçu par e-mail avec Resend, si RESEND_API_KEY et RECEIPT_FROM_EMAIL sont configurés.
 * Sans ces réglages, rien n'est envoyé : le client garde son reçu en ligne (imprimable, PDF, WhatsApp).
 */
export async function sendReceiptEmail(db: SupabaseClient, order: Record<string, any>) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("RECEIPT_FROM_EMAIL");
  const siteUrl = (Deno.env.get("SITE_URL") ?? "").replace(/\/$/, "");
  if (!apiKey || !from || !order.customer_email || order.receipt_emailed_at) return;

  const { data: items } = await db.from("order_items").select("product_name, product_price, quantity").eq("order_id", order.id);
  const fcfa = (n: number) => `${Number(n).toLocaleString("fr-FR")} FCFA`;
  const rows = (items ?? []).map((i) =>
    `<tr><td style="padding:6px 0">${escapeHtml(i.product_name)} × ${i.quantity}</td><td style="padding:6px 0;text-align:right">${fcfa(i.product_price * i.quantity)}</td></tr>`).join("");
  const link = siteUrl ? `${siteUrl}/commande/${order.receipt_token}` : "";
  const paid = order.payment_status === "payee";

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2319">
    <h2 style="color:#66793a;margin-bottom:4px">Cure's Nappy</h2>
    <p style="font-size:18px;font-weight:bold">${paid ? "Paiement reçu, merci !" : "Commande enregistrée, merci !"}</p>
    <p>Bonjour ${escapeHtml(order.customer_name)}, nous avons bien reçu votre commande <strong>${escapeHtml(order.order_number)}</strong>.
    ${order.delivery_estimate ? `Livraison prévue ${escapeHtml(order.delivery_estimate)} à ${escapeHtml(order.delivery_commune)}.` : ""}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #ddd;border-bottom:1px solid #ddd">${rows}
      <tr><td style="padding:6px 0">Livraison</td><td style="padding:6px 0;text-align:right">${order.delivery_fee_confirmed === false ? "à confirmer" : fcfa(order.delivery_fee)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold">Total ${paid ? "payé" : "à régler"}${order.delivery_fee_confirmed === false ? " (hors expédition)" : ""}</td><td style="padding:8px 0;text-align:right;font-weight:bold">${fcfa(order.total)}</td></tr>
    </table>
    ${link ? `<p><a href="${escapeHtml(link)}" style="display:inline-block;background:#66793a;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Voir et imprimer mon reçu</a></p>` : ""}
    <p style="color:#6a6f60;font-size:13px">Une question ? Répondez à cet e-mail ou écrivez-nous sur WhatsApp.</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [order.customer_email], subject: `Votre reçu Cure's Nappy — ${order.order_number}`, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  await db.from("orders").update({ receipt_emailed_at: new Date().toISOString() }).eq("id", order.id);
}
