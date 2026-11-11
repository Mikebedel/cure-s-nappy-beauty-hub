import { createClient } from "npm:@supabase/supabase-js@2";
import { confirmPayment, isSignatureValid } from "../_shared/paystack.ts";

/**
 * Adresse appelée par Paystack à chaque événement de paiement.
 * À renseigner dans Paystack → Settings → API Keys & Webhooks :
 *   https://<projet>.supabase.co/functions/v1/paystack-webhook
 * Cette fonction doit être déployée sans vérification JWT (voir supabase/config.toml) :
 * c'est la signature Paystack qui l'authentifie.
 */
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const raw = await req.text();
  if (!(await isSignatureValid(raw, req.headers.get("x-paystack-signature")))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try { event = JSON.parse(raw); } catch { return new Response("Bad request", { status: 400 }); }

  const reference = event.data?.reference;
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  if (reference) {
    await db.from("payment_events").insert({ provider: "paystack", reference, event: event.event ?? "inconnu", payload: event });
  }

  if (event.event === "charge.success" && reference) {
    const result = await confirmPayment(db, reference);
    if (result === "pending") return new Response("Retry later", { status: 503 });
  }
  // 200 : Paystack arrête de renvoyer l'événement.
  return new Response("ok", { status: 200 });
});
