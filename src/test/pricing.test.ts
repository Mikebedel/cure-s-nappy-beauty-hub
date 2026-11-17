import { describe, expect, it } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { priceOrder, checkCustomer, promotionActive, promotionPercent, discountedPrice, orderDiscount, type Promotion } from "../../supabase/functions/_shared/pricing";
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

  it("accessoire : prix du dashboard, couleur vérifiée, refusé sans prix", () => {
    const withPrice = { ...catalog, accessories: catalog.accessories.map((x) => ({ ...x, price: 12000 })) };
    expect(priceOrder(withPrice, delivery, [{ id: "acc-set-peignes-brosses::Vert", quantity: 2 }], abidjan("Cocody")))
      .toMatchObject({ ok: true, subtotal: 24000, lines: [{ name: "Set de peignes & brosses Cure's Nappy — Vert" }] });
    expect(priceOrder(withPrice, delivery, [{ id: "acc-set-peignes-brosses::Rose", quantity: 1 }], abidjan("Cocody")).ok).toBe(false);
    expect(priceOrder(catalog, delivery, [{ id: "acc-set-peignes-brosses::Vert", quantity: 1 }], abidjan("Cocody")).ok).toBe(false);
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

describe("promotion", () => {
  const promo: Promotion = { ...defaultContent.promotion, enabled: true, percent: 20, startDate: "2026-12-01", endDate: "2026-12-07" };
  const during = new Date("2026-12-04T10:00:00Z");
  const huile = catalog.products.find((p) => p.id === "8")!;

  it("ne s'applique que pendant la période, dates incluses", () => {
    expect(promotionActive(promo, new Date("2026-11-30T23:59:00Z"))).toBe(false);
    expect(promotionActive(promo, new Date("2026-12-01T00:00:00Z"))).toBe(true);
    expect(promotionActive(promo, new Date("2026-12-07T23:59:00Z"))).toBe(true);
    expect(promotionActive(promo, new Date("2026-12-08T00:00:00Z"))).toBe(false);
    expect(promotionActive({ ...promo, enabled: false }, during)).toBe(false);
    expect(promotionActive({ ...promo, startDate: "" }, during)).toBe(false);
    expect(promotionActive({ ...promo, percent: 95 }, during)).toBe(false);
  });

  it("le serveur facture le prix réduit, arrondi aux 5 FCFA", () => {
    const result = priceOrder(catalog, delivery, [{ id: "8", quantity: 2 }], abidjan("Cocody"), promo, during);
    if (!result.ok) throw new Error(result.error);
    expect(result.lines[0].unitPrice).toBe(discountedPrice(huile.price, 20));
    expect(result.lines[0].unitPrice % 5).toBe(0);
    expect(result.subtotal).toBe(discountedPrice(huile.price, 20) * 2);
    const after = priceOrder(catalog, delivery, [{ id: "8", quantity: 1 }], abidjan("Cocody"), promo, new Date("2026-12-09T10:00:00Z"));
    if (!after.ok) throw new Error(after.error);
    expect(after.lines[0].unitPrice).toBe(huile.price);
  });

  it("respecte les articles concernés : gammes, sélection, accessoires", () => {
    expect(promotionPercent(promo, "pack-gamme-minie", during)).toBe(20);
    expect(promotionPercent({ ...promo, includePacks: false }, "pack-gamme-minie", during)).toBe(0);
    expect(promotionPercent(promo, "acc-set-peignes-brosses::Vert", during)).toBe(0);
    expect(promotionPercent({ ...promo, includeAccessories: true }, "acc-set-peignes-brosses::Vert", during)).toBe(20);
    const selection: Promotion = { ...promo, scope: "selection", productIds: ["8"] };
    expect(promotionPercent(selection, "8", during)).toBe(20);
    expect(promotionPercent(selection, "1", during)).toBe(0);
  });

  it("aucune réduction sans promotion enregistrée", () => {
    const result = priceOrder(catalog, delivery, [{ id: "8", quantity: 1 }], abidjan("Cocody"), null, during);
    if (!result.ok) throw new Error(result.error);
    expect(result.lines[0].unitPrice).toBe(huile.price);
  });
});

describe("remise fixe dès plusieurs produits", () => {
  // -2 500 FCFA dès 2 produits, du 20 au 27 décembre 2026.
  const promo: Promotion = { ...defaultContent.promotion, enabled: true, kind: "amount", amount: 2500, minItems: 2, startDate: "2026-12-20", endDate: "2026-12-27" };
  const during = new Date("2026-12-22T10:00:00Z");
  const huile = catalog.products.find((p) => p.id === "8")!;

  it("rien avec un seul produit ; le panier sait combien il en manque", () => {
    const result = priceOrder(catalog, delivery, [{ id: "8", quantity: 1 }], abidjan("Cocody"), promo, during);
    if (!result.ok) throw new Error(result.error);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(huile.price + 1500);
    expect(orderDiscount(promo, [{ id: "8", quantity: 1, lineTotal: huile.price }], during)).toEqual({ discount: 0, missing: 1 });
  });

  it("-2 500 FCFA une seule fois dès 2 produits (quantités comptées), prix unitaires inchangés", () => {
    const two = priceOrder(catalog, delivery, [{ id: "8", quantity: 2 }], abidjan("Cocody"), promo, during);
    if (!two.ok) throw new Error(two.error);
    expect(two.lines[0].unitPrice).toBe(huile.price);
    expect(two.discount).toBe(2500);
    expect(two.total).toBe(huile.price * 2 - 2500 + 1500);
    const many = priceOrder(catalog, delivery, [{ id: "8", quantity: 3 }, { id: "pack-gamme-minie", quantity: 1 }], abidjan("Cocody"), promo, during);
    if (!many.ok) throw new Error(many.error);
    expect(many.discount).toBe(2500);
    expect(promotionPercent(promo, "8", during)).toBe(0);
  });

  it("seulement du 20 au 27 décembre inclus", () => {
    for (const [date, expected] of [["2026-12-19T23:59:00Z", 0], ["2026-12-20T00:00:00Z", 2500], ["2026-12-27T23:59:00Z", 2500], ["2026-12-28T00:00:00Z", 0]] as const) {
      const result = priceOrder(catalog, delivery, [{ id: "8", quantity: 2 }], abidjan("Cocody"), promo, new Date(date));
      if (!result.ok) throw new Error(result.error);
      expect(result.discount).toBe(expected);
    }
  });

  it("ne compte que les articles concernés, et une promotion enregistrée sans type reste un pourcentage", () => {
    const soinsSeuls: Promotion = { ...promo, includePacks: false };
    expect(orderDiscount(soinsSeuls, [{ id: "8", quantity: 1, lineTotal: 6500 }, { id: "pack-gamme-minie", quantity: 1, lineTotal: 22000 }], during)).toEqual({ discount: 0, missing: 1 });
    const ancienne = { ...promo, kind: undefined, percent: 20 } as Promotion;
    expect(orderDiscount(ancienne, [{ id: "8", quantity: 2, lineTotal: 13000 }], during).discount).toBe(0);
    expect(promotionPercent(ancienne, "8", during)).toBe(20);
  });
});
