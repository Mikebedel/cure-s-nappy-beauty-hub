import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/http.ts";
import { loadSettings } from "../_shared/content.ts";
import { priceOrder, checkCustomer } from "../_shared/pricing.ts";
import { initializePayment, secretKey } from "../_shared/paystack.ts";
import { sendReceiptEmail } from "../_shared/email.ts";

/**
 * Enregistre une commande. Le navigateur n'envoie que les articles (identifiant + quantité)
 * et les coordonnées : les prix, les frais et le total sont recalculés ici.
 * En paiement en ligne, renvoie l'adresse de la page de paiement Paystack.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Méthode non autorisée" }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json(req, { error: "Requête invalide." }, 400);
    const customer = (body.customer ?? {}) as Record<string, unknown>;
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const settings = await loadSettings(db);

    const online = body.payment === "online";
    const onlineAvailable = settings.delivery.onlinePayment && !!secretKey();
    if (online && !onlineAvailable) return json(req, { error: "Le paiement en ligne n'est pas disponible pour le moment." }, 400);
    if (!online && !settings.delivery.payLater) return json(req, { error: "Merci de choisir le paiement en ligne." }, 400);

    const customerError = checkCustomer(customer, online);
    if (customerError) return json(req, { error: customerError }, 400);

    const priced = priceOrder(settings.catalog, settings.delivery, body.items, body.destination);
    if (!priced.ok) return json(req, { error: priced.error }, 400);
    // Sans tarif connu pour la destination, le total final n'existe pas encore : pas de paiement en ligne.
    if (online && !priced.feeConfirmed) {
      return json(req, { error: "Les frais d'expédition vers cette destination sont confirmés par notre équipe : choisissez « Payer plus tard »." }, 400);
    }

    const phone = String(customer.phone).replace(/[\s.\-()]/g, "");
    // Frein simple aux abus : pas plus de 5 commandes par numéro en 15 minutes.
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await db.from("orders").select("id", { count: "exact", head: true }).eq("customer_phone", phone).gte("created_at", since);
    if ((count ?? 0) >= 5) return json(req, { error: "Trop de commandes en peu de temps. Réessayez dans quelques minutes ou écrivez-nous sur WhatsApp." }, 429);

    const orderNumber = `CN-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const customerName = `${String(customer.firstName).trim()} ${String(customer.lastName).trim()}`;
    const email = typeof customer.email === "string" && customer.email.trim() ? customer.email.trim().toLowerCase() : null;

    const { data: order, error: orderError } = await db.from("orders").insert({
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: phone,
      customer_email: email,
      delivery_commune: priced.destination.place,
      delivery_address: String(customer.address).trim(),
      delivery_zone: priced.destination.zone,
      delivery_estimate: priced.destination.estimate || null,
      delivery_fee: priced.deliveryFee,
      delivery_fee_confirmed: priced.feeConfirmed,
      subtotal: priced.subtotal,
      total: priced.total,
      payment_method: online ? "paystack" : "a_regler",
      payment_status: "en_attente",
      payment_reference: online ? orderNumber : null,
      status: "nouvelle",
    }).select("*").single();
    if (orderError || !order) throw orderError ?? new Error("Commande non enregistrée");

    const { error: itemsError } = await db.from("order_items").insert(priced.lines.map((line) => ({
      order_id: order.id, product_name: line.name, product_price: line.unitPrice, quantity: line.quantity,
    })));
    if (itemsError) {
      await db.from("orders").delete().eq("id", order.id);
      throw itemsError;
    }

    // Fiche client (pour l'onglet Clients du dashboard).
    const { data: existing } = await db.from("customers").select("id, orders_count").eq("phone", phone).maybeSingle();
    if (existing) await db.from("customers").update({ name: customerName, email, orders_count: (existing.orders_count ?? 0) + 1, last_order_at: new Date().toISOString() }).eq("id", existing.id);
    else await db.from("customers").insert({ name: customerName, phone, email, orders_count: 1, total_spent: 0, last_order_at: new Date().toISOString() });

    if (!online) {
      await sendReceiptEmail(db, order).catch((e) => console.error("Envoi du reçu impossible", e));
      return json(req, { orderNumber, receiptToken: order.receipt_token, paymentUrl: null });
    }

    const siteUrl = (Deno.env.get("SITE_URL") ?? req.headers.get("Origin") ?? "").replace(/\/$/, "");
    try {
      const paymentUrl = await initializePayment({
        email: email!,
        amount: priced.total,
        reference: orderNumber,
        callbackUrl: `${siteUrl}/commande/${order.receipt_token}`,
        metadata: { order_number: orderNumber, customer_name: customerName, phone },
      });
      await db.from("orders").update({ payment_url: paymentUrl }).eq("id", order.id);
      return json(req, { orderNumber, receiptToken: order.receipt_token, paymentUrl });
    } catch (error) {
      console.error("Ouverture du paiement impossible", error);
      await db.from("orders").update({ status: "annulee" }).eq("id", order.id);
      return json(req, { error: "Le paiement en ligne n'a pas pu s'ouvrir. Réessayez dans un instant ou choisissez de payer plus tard." }, 502);
    }
  } catch (error) {
    console.error("create-order", error);
    return json(req, { error: "Votre commande n'a pas pu être enregistrée. Réessayez ou écrivez-nous sur WhatsApp." }, 500);
  }
});
