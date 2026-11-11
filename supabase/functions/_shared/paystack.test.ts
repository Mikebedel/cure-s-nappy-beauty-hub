// Tests de la sécurité des paiements : npx deno test --allow-env supabase/functions/_shared/paystack.test.ts
import { assertEquals } from "jsr:@std/assert@1";
import { confirmPayment, isSignatureValid } from "./paystack.ts";

Deno.env.set("PAYSTACK_SECRET_KEY", "sk_test_cle_de_test");

const sign = async (body: string, key = "sk_test_cle_de_test") => {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(body))), (b) => b.toString(16).padStart(2, "0")).join("");
};

Deno.test("signature Paystack valide acceptée", async () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: "CN-1" } });
  assertEquals(await isSignatureValid(body, await sign(body)), true);
});

Deno.test("signature absente, fausse clé ou corps modifié refusés", async () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: "CN-1" } });
  assertEquals(await isSignatureValid(body, null), false);
  assertEquals(await isSignatureValid(body, await sign(body, "sk_test_autre")), false);
  assertEquals(await isSignatureValid(body.replace("CN-1", "CN-2"), await sign(body)), false);
});

/** Base de données factice : une commande et l'enregistrement des mises à jour. */
const fakeDb = (order: Record<string, unknown>) => {
  const updates: Record<string, unknown>[] = [];
  const chain = (result: () => unknown) => {
    const q: any = { select: () => q, eq: () => q, neq: () => q, maybeSingle: async () => ({ data: result() }), single: async () => ({ data: result() }), then: (r: any) => r({ data: [] }) };
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

const mockPaystack = (tx: Record<string, unknown>) => {
  globalThis.fetch = (async () => new Response(JSON.stringify({ status: true, data: tx }), { status: 200 })) as typeof fetch;
};

Deno.test("paiement réussi du bon montant : commande marquée payée une seule fois", async () => {
  const order = { id: "o1", total: 23500, payment_status: "en_attente", payment_reference: "CN-1", customer_email: null };
  const db = fakeDb(order);
  mockPaystack({ status: "success", amount: 2350000, currency: "XOF", reference: "CN-1", channel: "mobile_money" });
  assertEquals(await confirmPayment(db, "CN-1"), "paid");
  assertEquals(db.updates.length, 1);
  assertEquals(db.updates[0].payment_status, "payee");
  assertEquals(await confirmPayment(db, "CN-1"), "paid");
  assertEquals(db.updates.length, 1);
});

Deno.test("montant payé différent du total : commande non marquée payée", async () => {
  const db = fakeDb({ id: "o2", total: 23500, payment_status: "en_attente", payment_reference: "CN-2" });
  mockPaystack({ status: "success", amount: 100, currency: "XOF", reference: "CN-2" });
  assertEquals(await confirmPayment(db, "CN-2"), "mismatch");
  assertEquals(db.updates.length, 0);
});

Deno.test("paiement abandonné : commande laissée en attente", async () => {
  const db = fakeDb({ id: "o3", total: 23500, payment_status: "en_attente", payment_reference: "CN-3" });
  mockPaystack({ status: "abandoned", amount: 2350000, currency: "XOF", reference: "CN-3" });
  assertEquals(await confirmPayment(db, "CN-3"), "pending");
  assertEquals(db.updates.length, 0);
});
