import { createClient } from "npm:@supabase/supabase-js@2";
import { confirmPayment, isSignatureValid } from "../_shared/jeko.ts";

/**
 * Adresse appelée par Jèko à chaque paiement terminé.
 * À renseigner dans le Dashboard Jèko → Paramètres → API & Webhooks :
 *   https://<projet>.supabase.co/functions/v1/jeko-webhook
 * Déployée sans vérification de compte (voir supabase/config.toml) : c'est la signature Jèko qui l'authentifie.
 */
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const raw = await req.text();
  if (!(await isSignatureValid(raw, req.headers.get("Jeko-Signature")))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { transactionType?: string; status?: string; transactionDetails?: { reference?: string } };
  try { event = JSON.parse(raw); } catch { return new Response("Bad request", { status: 400 }); }

  const eventName = req.headers.get("Jeko-Event") ?? "inconnu";
  const reference = event.transactionDetails?.reference;
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  if (reference) {
    await db.from("payment_events").insert({ provider: "jeko", reference, event: eventName, payload: event });
  }

  // Le contenu de la notification n'est pas cru sur parole : confirmPayment redemande l'état à Jèko.
  if (eventName === "TRANSACTION_COMPLETED" && event.transactionType === "payment" && reference) {
    const result = await confirmPayment(db, reference);
    if (result === "pending") return new Response("Retry later", { status: 503 });
  }
  return new Response("ok", { status: 200 });
});
