import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/http.ts";
import { confirmPayment, secretKey } from "../_shared/paystack.ts";

/**
 * Renvoie le reçu d'une commande à partir de son jeton secret (présent dans le lien du reçu).
 * Si le paiement en ligne est encore en attente, revérifie son état auprès de Paystack.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Méthode non autorisée" }, 405);

  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) return json(req, { error: "Reçu introuvable." }, 404);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  let { data: order } = await db.from("orders").select("*").eq("receipt_token", token).maybeSingle();
  if (!order) return json(req, { error: "Reçu introuvable." }, 404);

  if (order.payment_method === "paystack" && order.payment_status !== "payee" && order.payment_reference && secretKey()) {
    if ((await confirmPayment(db, order.payment_reference)) === "paid") {
      order = (await db.from("orders").select("*").eq("id", order.id).single()).data ?? order;
    }
  }

  const { data: items } = await db.from("order_items").select("product_name, product_price, quantity").eq("order_id", order.id);
  return json(req, {
    orderNumber: order.order_number,
    createdAt: order.created_at,
    paidAt: order.paid_at,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    customerEmail: order.customer_email,
    commune: order.delivery_commune,
    address: order.delivery_address,
    deliveryEstimate: order.delivery_estimate,
    items: (items ?? []).map((i) => ({ name: i.product_name, unitPrice: i.product_price, quantity: i.quantity })),
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee,
    total: order.total,
    paymentMethod: order.payment_method,
    paymentChannel: order.payment_channel,
    paymentStatus: order.payment_status,
    status: order.status,
    // Lien pour reprendre un paiement abandonné.
    paymentUrl: order.payment_status === "payee" || order.status === "annulee" ? null : order.payment_url,
  });
});
