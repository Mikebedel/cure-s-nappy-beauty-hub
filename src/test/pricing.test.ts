import { describe, expect, it } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { priceOrder, checkCustomer } from "../../supabase/functions/_shared/pricing";
import { defaultContent } from "@/content/defaults";

const catalog = defaultContent.catalog;
const delivery = defaultContent.delivery;

describe("priceOrder", () => {
  it("recalcule le total à partir du catalogue, pas de ce qu'envoie le navigateur", () => {
    const result = priceOrder(catalog, delivery, [{ id: "8", quantity: 2, price: 1 }, { id: "pack-gamme-minie", quantity: 1 }], "Cocody");
    expect(result).toMatchObject({ ok: true, subtotal: 6500 * 2 + 22000, deliveryFee: 1500, total: 6500 * 2 + 22000 + 1500, zone: "standard" });
  });

  it("calcule le prix d'un duo comme la somme de ses produits", () => {
    const result = priceOrder(catalog, delivery, [{ id: "pack-duo-extra-pousse", quantity: 1 }], "Grand-Bassam");
    expect(result).toMatchObject({ ok: true, subtotal: 6000 + 6500, deliveryFee: 2000, zone: "special", estimate: delivery.specialDelay });
  });

  it("regroupe les lignes d'un même article", () => {
    const result = priceOrder(catalog, delivery, [{ id: "1", quantity: 1 }, { id: "1", quantity: 2 }], "Plateau");
    expect(result.ok && result.lines).toEqual([{ id: "1", name: "Bain d'Huile", unitPrice: 5500, quantity: 3, lineTotal: 16500 }]);
  });

  it.each([
    ["panier vide", [], "Cocody"],
    ["article inconnu", [{ id: "inconnu", quantity: 1 }], "Cocody"],
    ["quantité négative", [{ id: "1", quantity: -2 }], "Cocody"],
    ["quantité décimale", [{ id: "1", quantity: 1.5 }], "Cocody"],
    ["quantité excessive", [{ id: "1", quantity: 21 }], "Cocody"],
    ["commune inventée", [{ id: "1", quantity: 1 }], "Paris"],
    ["panier qui n'est pas une liste", "1", "Cocody"],
  ])("refuse : %s", (_label, lines, commune) => {
    expect(priceOrder(catalog, delivery, lines, commune).ok).toBe(false);
  });

  it("refuse un produit masqué dans le dashboard", () => {
    const hidden = { ...catalog, products: catalog.products.map((p) => (p.id === "1" ? { ...p, visible: false } : p)) };
    expect(priceOrder(hidden, delivery, [{ id: "1", quantity: 1 }], "Cocody").ok).toBe(false);
  });
});

describe("checkCustomer", () => {
  const ok = { firstName: "Awa", lastName: "Koné", phone: "+225 07 00 00 00 00", address: "Cocody, rue des Jardins", email: "" };
  it("accepte des coordonnées correctes", () => expect(checkCustomer(ok, false)).toBeNull());
  it("exige un e-mail pour payer en ligne", () => expect(checkCustomer(ok, true)).not.toBeNull());
  it("refuse un téléphone invalide", () => expect(checkCustomer({ ...ok, phone: "abc" }, false)).not.toBeNull());
  it("refuse un e-mail invalide", () => expect(checkCustomer({ ...ok, email: "pas-un-email" }, false)).not.toBeNull());
});

/**
 * Le serveur a besoin du catalogue d'origine tant que rien n'a été enregistré depuis le dashboard.
 * Ce test vérifie que sa copie est à jour ; pour la régénérer : UPDATE_SERVER_DEFAULTS=1 npx vitest run
 */
describe("copie serveur du catalogue d'origine", () => {
  it("correspond à src/content/defaults.ts", () => {
    const file = resolve(__dirname, "../../supabase/functions/_shared/default-content.json");
    const expected = JSON.stringify({ catalog, delivery }, null, 2) + "\n";
    if (process.env.UPDATE_SERVER_DEFAULTS) writeFileSync(file, expected);
    expect(readFileSync(file, "utf8")).toBe(expected);
  });
});
