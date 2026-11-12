// Tests de la sécurité des paiements Jèko : npx deno test --allow-env supabase/functions/_shared/jeko.test.ts
import { assertEquals } from "jsr:@std/assert@1";
import { confirmPayment, isSignatureValid } from "./jeko.ts";

Deno.env.set("JEKO_WEBHOOK_SECRET", "secret_de_test");
for (const k of ["JEKO_API_KEY", "JEKO_API_KEY_ID", "JEKO_STORE_ID"]) Deno.env.set(k, "test");

const sign = async (body: string, key = "secret_de_test") => {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(body))), (b) => b.toString(16).padStart(2, "0")).join("");
};

Deno.test("signature Jèko valide acceptée", async () => {
  const body = JSON.stringify({ transactionType: "payment", transactionDetails: { reference: "CN-1" } });
  assertEquals(await isSignatureValid(body, await sign(body)), true);
});

Deno.test("signature absente, fausse clé ou corps modifié refusés", async () => {
  const body = JSON.stringify({ transactionType: "payment", transactionDetails: { reference: "CN-1" } });
  assertEquals(await isSignatureValid(body, null), false);
  assertEquals(await isSignatureValid(body, await sign(body, "autre_secret")), false);
  assertEquals(await isSignatureValid(body.replace("CN-1", "CN-2"), await sign(body)), false);
});

/** Base de données factice : une commande et l'enregistrement des mises à jour. */
const fakeDb = (order: Record<string, unknown>) => {
  const updates: Record<string, unknown>[] = [];
  const chain = (result: () => unknown) => {
    const q: any = { select: () => q, eq: () => q, neq: () => q, maybeSingle: async () => ({ data: result() }), single: async () => ({ data: result() }), then: (r: any) => r({ data: null }) };
    return q;
  };
  return {
    updates,
    from: () => ({
      select: () => chain(() => order),
      update: (values: Record<string, unknown>) => { updates.push(values); Object.assign(order, values); return chain(() => order); },
    }),
  } as any;
};

const mockJeko = (pr: Record<string, unknown>) => {
  globalThis.fetch = (async () => new Response(JSON.stringify(pr), { status: 200 })) as typeof fetch;
};

const order = (id: string) => ({ id, total: 23500, payment_status: "en_attente", payment_reference: id, payment_provider_id: `pr-${id}`, customer_email: null });

Deno.test("paiement réussi du bon montant : commande payée une seule fois", async () => {
  const db = fakeDb(order("CN-1"));
  mockJeko({ id: "pr-CN-1", status: "success", reference: "CN-1", amountCents: 2350000, currency: "XOF", paymentMethod: "wave", transaction: { executedAt: "2026-11-11 10:22:00" } });
  assertEquals(await confirmPayment(db, "CN-1"), "paid");
  assertEquals(db.updates.length, 1);
  assertEquals(db.updates[0].payment_status, "payee");
  assertEquals(db.updates[0].payment_channel, "wave");
  assertEquals(await confirmPayment(db, "CN-1"), "paid");
  assertEquals(db.updates.length, 1);
});

Deno.test("montant différent du total : commande non payée", async () => {
  const db = fakeDb(order("CN-2"));
  mockJeko({ id: "pr-CN-2", status: "success", reference: "CN-2", amountCents: 100, currency: "XOF" });
  assertEquals(await confirmPayment(db, "CN-2"), "mismatch");
  assertEquals(db.updates.length, 0);
});

Deno.test("autre référence que la commande : refusé", async () => {
  const db = fakeDb(order("CN-3"));
  mockJeko({ id: "pr-CN-3", status: "success", reference: "CN-AUTRE", amountCents: 2350000, currency: "XOF" });
  assertEquals(await confirmPayment(db, "CN-3"), "mismatch");
  assertEquals(db.updates.length, 0);
});

Deno.test("paiement en cours : commande laissée en attente", async () => {
  const db = fakeDb(order("CN-4"));
  mockJeko({ id: "pr-CN-4", status: "pending", reference: "CN-4", amountCents: 2350000 });
  assertEquals(await confirmPayment(db, "CN-4"), "pending");
  assertEquals(db.updates.length, 0);
});

Deno.test("paiement en échec : commande marquée échouée, jamais payée", async () => {
  const db = fakeDb(order("CN-5"));
  mockJeko({ id: "pr-CN-5", status: "error", reference: "CN-5" });
  assertEquals(await confirmPayment(db, "CN-5"), "failed");
  assertEquals(db.updates[0].payment_status, "echouee");
});

import { normalizePayerPhone } from "./jeko.ts";

Deno.test("numéro de paiement : formats ivoiriens acceptés, le reste refusé", () => {
  assertEquals(normalizePayerPhone("07 00 00 00 00"), "+2250700000000");
  assertEquals(normalizePayerPhone("+225 05 12 34 56 78"), "+2250512345678");
  assertEquals(normalizePayerPhone("00225 01 23 45 67 89"), "+2250123456789");
  assertEquals(normalizePayerPhone("06 00 00 00 00"), null);
  assertEquals(normalizePayerPhone("+33 6 12 34 56 78"), null);
  assertEquals(normalizePayerPhone("0700"), null);
  assertEquals(normalizePayerPhone(undefined), null);
});
