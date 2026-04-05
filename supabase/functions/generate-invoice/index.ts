import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order_id);

    const orderItems = items || [];

    // Generate HTML invoice
    const itemRows = orderItems
      .map(
        (item: any) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.product_name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${item.product_price.toLocaleString()} FCFA</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${(item.product_price * item.quantity).toLocaleString()} FCFA</td>
      </tr>`
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Helvetica', sans-serif; margin:0; padding:40px; color:#333; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; }
  .brand { font-size:24px; font-weight:bold; color:#4a7c59; }
  .invoice-title { font-size:28px; font-weight:bold; color:#333; margin-bottom:5px; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:30px; margin-bottom:30px; }
  .info-box h3 { font-size:12px; text-transform:uppercase; color:#888; margin-bottom:5px; }
  table { width:100%; border-collapse:collapse; margin-bottom:30px; }
  th { background:#4a7c59; color:#fff; padding:10px 8px; text-align:left; font-size:13px; }
  th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align:right; }
  .totals { text-align:right; }
  .totals .row { display:flex; justify-content:flex-end; gap:30px; margin-bottom:5px; }
  .totals .total { font-size:18px; font-weight:bold; color:#4a7c59; }
  .footer { margin-top:40px; text-align:center; color:#888; font-size:12px; border-top:1px solid #eee; padding-top:20px; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Cure's Nappy</div>
      <div style="font-size:12px;color:#888;">Soins capillaires naturels</div>
      <div style="font-size:12px;color:#888;">Abidjan, Côte d'Ivoire</div>
    </div>
    <div style="text-align:right;">
      <div class="invoice-title">FACTURE</div>
      <div style="font-size:14px;color:#666;">${order.order_number}</div>
      <div style="font-size:12px;color:#888;">${new Date(order.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h3>Client</h3>
      <p style="margin:0;font-weight:bold;">${order.customer_name}</p>
      <p style="margin:2px 0;">${order.customer_phone}</p>
      ${order.customer_email ? `<p style="margin:2px 0;">${order.customer_email}</p>` : ""}
    </div>
    <div class="info-box">
      <h3>Livraison</h3>
      <p style="margin:0;">${order.delivery_commune}</p>
      <p style="margin:2px 0;">${order.delivery_address}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produit</th>
        <th style="text-align:center;">Qté</th>
        <th style="text-align:right;">Prix unitaire</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Sous-total:</span><span>${order.subtotal.toLocaleString()} FCFA</span></div>
    <div class="row"><span>Livraison:</span><span>${order.delivery_fee.toLocaleString()} FCFA</span></div>
    ${order.discount ? `<div class="row"><span>Réduction:</span><span>-${order.discount.toLocaleString()} FCFA</span></div>` : ""}
    <div class="row total"><span>TOTAL:</span><span>${order.total.toLocaleString()} FCFA</span></div>
  </div>

  <div style="margin-top:30px;padding:15px;background:#f8f8f8;border-radius:8px;font-size:13px;">
    <strong>Mode de paiement:</strong> ${order.payment_method || "—"}<br>
    <strong>Statut:</strong> ${order.payment_status === "payee" ? "Payée" : "En attente"}
  </div>

  <div class="footer">
    <p>Merci pour votre commande chez Cure's Nappy !</p>
    <p>Pour toute question, contactez-nous via WhatsApp.</p>
    <p>Cure's Nappy — Révélez la force naturelle de vos cheveux.</p>
  </div>
</body>
</html>`;

    return new Response(JSON.stringify({ html, order_number: order.order_number }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
