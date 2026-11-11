import { describe, expect, it } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { priceOrder, checkCustomer } from "../../supabase/functions/_shared/pricing";
import { defaultContent } from "@/content/defaults";

const catalog = defaultContent.catalog;
const delivery = defaultContent.delivery;

const abidjan = (commune: string) => ({ mode: "abidjan", commune });

describe("priceOrder", () => {
  it("recalcule le total à partir du catalogue, pas de ce qu'envoie le navigateur", () => {
    const result = priceOrder(catalog, delivery, [{ id: "8", quantity: 2, price: 1 }, { id: "pack-gamme-minie", quantity: 1 }], abidjan("Cocody"));
    expect(result).toMatchObject({ ok: true, subtotal: 6500 * 2 + 22000, deliveryFee: 1500, feeConfirmed: true, total: 6500 * 2 + 22000 + 1500 });
  });

  it("applique le prix de chaque commune d'Abidjan", () => {
    const fee = (commune: string) => {
      const r = priceOrder(catalog, delivery, [{ id: "1", quantity: 1 }], abidjan(commune));
      return r.ok ? r.deliveryFee : null;
    };
    expect([fee("Cocody"), fee("Bingerville"), fee("Songon"), fee("Port-Bouët"), fee("Grand-Bassam"), fee("Anyama"), fee("Gonzagueville")])
      .toEqual([1500, 2000, 2000, 2000, 3000, 2000, 2000]);
  });

  it("calcule le prix d'un duo comme la somme de ses produits", () => {
    const result = priceOrder(catalog, delivery, [{ id: "pack-duo-extra-pousse", quantity: 1 }], abidjan("Grand-Bassam"));
    expect(result).toMatchObject({ ok: true, subtotal: 6000 + 6500, deliveryFee: 3000 });
  });

  it("regroupe les lignes d'un même article", () => {
    const result = priceOrder(catalog, delivery, [{ id: "1", quantity: 1 }, { id: "1", quantity: 2 }], abidjan("Plateau"));
    expect(result.ok && result.lines).toEqual([{ id: "1", name: "Bain d'Huile", unitPrice: 5500, quantity: 3, lineTotal: 16500 }]);
  });

  it("expédition vers une ville sans tarif : frais à confirmer, total hors expédition", () => {
    const result = priceOrder(catalog, delivery, [{ id: "1", quantity: 1 }], { mode: "national", city: "Bouaké" });
    expect(result).toMatchObject({ ok: true, deliveryFee: 0, feeConfirmed: false, total: 5500, destination: { zone: "national", place: "Bouaké" } });
  });

  it("expédition vers une ville avec tarif renseigné dans le dashboard", () => {
    const priced = { ...delivery, national: { ...delivery.national, cities: [{ name: "Bouaké", fee: 4000 }] } };
    expect(priceOrder(catalog, priced, [{ id: "1", quantity: 1 }], { mode: "national", city: "Bouaké" })).toMatchObject({ ok: true, deliveryFee: 4000, feeConfirmed: true, total: 9500 });
  });

  it("autre ville et pays étranger : lieu écrit par le client, frais à confirmer", () => {
    expect(priceOrder(catalog, delivery, [{ id: "1", quantity: 1 }], { mode: "national", city: "__autre", otherCity: "Tabou" }))
      .toMatchObject({ ok: true, feeConfirmed: false, destination: { place: "Tabou" } });
    expect(priceOrder(catalog, delivery, [{ id: "1", quantity: 1 }], { mode: "international", country: "France", city: "Lyon" }))
      .toMatchObject({ ok: true, feeConfirmed: false, destination: { zone: "international", place: "Lyon, France" } });
  });

  it.each([
    ["panier vide", [], abidjan("Cocody")],
    ["article inconnu", [{ id: "inconnu", quantity: 1 }], abidjan("Cocody")],
    ["quantité négative", [{ id: "1", quantity: -2 }], abidjan("Cocody")],
    ["quantité décimale", [{ id: "1", quantity: 1.5 }], abidjan("Cocody")],
    ["quantité excessive", [{ id: "1", quantity: 21 }], abidjan("Cocody")],
    ["commune inventée", [{ id: "1", quantity: 1 }], abidjan("Paris")],
    ["ville inventée", [{ id: "1", quantity: 1 }], { mode: "national", city: "Atlantis" }],
    ["pays inventé", [{ id: "1", quantity: 1 }], { mode: "international", country: "Wakanda", city: "Birnin" }],
    ["pays sans ville", [{ id: "1", quantity: 1 }], { mode: "international", country: "France", city: "" }],
    ["mode de livraison absent", [{ id: "1", quantity: 1 }], {}],
    ["panier qui n'est pas une liste", "1", abidjan("Cocody")],
  ])("refuse : %s", (_label, lines, destination) => {
    expect(priceOrder(catalog, delivery, lines, destination).ok).toBe(false);
  });

  it("refuse un produit masqué dans le dashboard", () => {
    const hidden = { ...catalog, products: catalog.products.map((p) => (p.id === "1" ? { ...p, visible: false } : p)) };
    expect(priceOrder(hidden, delivery, [{ id: "1", quantity: 1 }], abidjan("Cocody")).ok).toBe(false);
  });

  it("refuse l'expédition quand elle est désactivée dans le dashboard", () => {
    const off = { ...delivery, national: { ...delivery.national, enabled: false } };
    expect(priceOrder(catalog, off, [{ id: "1", quantity: 1 }], { mode: "national", city: "Bouaké" }).ok).toBe(false);
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
