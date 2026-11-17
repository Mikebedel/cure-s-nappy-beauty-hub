import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { SiteContent } from "./types";
import { defaultContent } from "./defaults";
import { resolveImage } from "./images";
import { BackendStatus, clearDraft, loadCache, loadDraft, loadRemote, mergeContent, saveCache, saveDraft, saveRemote } from "./store";
import type { Accessory, GammePack, Product } from "@/data/products";
import { packToProduct } from "@/data/products";
import { accessoryItemId, discountedPrice, promotionActive, promotionPercent } from "../../supabase/functions/_shared/pricing";

/** « remote » : la base en ligne ; « local » : l'aperçu enregistré dans ce navigateur. */
export type SaveTarget = "remote" | "local";

interface ContentContextType {
  content: SiteContent;
  status: BackendStatus;
  /** Où le dashboard enregistre ; null tant que la base n'a pas répondu, ou si rien n'est possible. */
  saveTarget: SaveTarget | null;
  /** Vrai quand le site tourne sur l'ordinateur de développement et que la base est injoignable. */
  localPreview: boolean;
  updatedAt: string | null;
  /** Vrai dès que le contenu affiché est le vrai : reçu de la base, ou gardé de la visite précédente. */
  ready: boolean;
  save: (next: SiteContent) => Promise<void>;
  resetLocal: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  // Sur l'ordinateur de développement, l'aperçu local s'affiche tout de suite, sans attendre la base.
  // Sinon, le dernier contenu reçu lors d'une visite précédente, en attendant la base.
  const [initial] = useState(() => {
    const draft = import.meta.env.DEV ? loadDraft() : null;
    if (draft) return { content: mergeContent(defaultContent, draft), ready: true };
    const cached = loadCache();
    return cached ? { content: mergeContent(defaultContent, cached), ready: true } : { content: defaultContent, ready: false };
  });
  const [content, setContent] = useState<SiteContent>(initial.content);
  const [ready, setReady] = useState(initial.ready);
  const [status, setStatus] = useState<BackendStatus>("checking");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadRemote().then((remote) => {
      if (cancelled) return;
      setStatus(remote.status);
      if (remote.status === "online" && remote.data) {
        setContent(mergeContent(defaultContent, remote.data));
        setUpdatedAt(remote.updatedAt);
        saveCache(remote.data, remote.updatedAt);
      }
      // Base jointe (même vide) ou vraiment injoignable après plusieurs essais : on affiche ce qu'on a.
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  const localPreview = import.meta.env.DEV && (status === "offline" || status === "not-set-up");
  const saveTarget: SaveTarget | null = status === "online" ? "remote" : localPreview ? "local" : null;

  const save = useCallback(async (next: SiteContent) => {
    if (saveTarget === "remote") {
      await saveRemote(next);
      const now = new Date().toISOString();
      setUpdatedAt(now);
      saveCache(next, now);
    } else if (saveTarget === "local") {
      saveDraft(next);
    } else {
      throw new Error("La base de données est injoignable : impossible d'enregistrer pour le moment.");
    }
    setContent(next);
  }, [saveTarget]);

  const resetLocal = useCallback(() => {
    clearDraft();
    setContent(defaultContent);
  }, []);

  const value = useMemo(() => ({ content, status, saveTarget, localPreview, updatedAt, ready, save, resetLocal }), [content, status, saveTarget, localPreview, updatedAt, ready, save, resetLocal]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
};

const STOP_WORDS = new Set(["de", "d", "du", "des", "la", "le", "les", "et", "en", "a"]);
const words = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z0-9]+/).filter((w) => w && !STOP_WORDS.has(w));

/**
 * Retrouve les soins du catalogue nommés dans la liste « Soins inclus » d'une gamme
 * (« Leave-in » → Leave-in Conditionner, « Spray » → Magical Spray) : le produit qui partage le plus de mots.
 */
const matchProducts = (names: string[], products: Product[]): (string | null)[] =>
  names.map((name) => {
    const wanted = words(name);
    let best: { id: string; score: number } | null = null;
    for (const p of products) {
      const have = new Set(words(p.name));
      const score = wanted.filter((w) => have.has(w) || [...have].some((h) => h.length > 4 && w.length > 4 && (h.startsWith(w.slice(0, 6)) || w.startsWith(h.slice(0, 6))))).length;
      if (score > 0 && (!best || score > best.score)) best = { id: p.id, score };
    }
    return best?.id ?? null;
  });

/** Soin lié à chaque ligne « inclus » (null si introuvable ou masqué), et la liste sans doublon. */
const packProducts = (containsIds: (string | null)[]) => ({
  containsIds,
  productIds: [...new Set(containsIds.filter((id): id is string => !!id))],
});

/** Le catalogue prêt à afficher : images résolues, prix des duos calculés, articles masqués retirés. */
export const useCatalog = () => {
  const { content } = useContent();
  return useMemo(() => {
    const { catalog, promotion } = content;
    // Promotion en cours : même règle que le serveur, prix d'origine gardé pour l'afficher barré.
    const now = new Date();
    const promo = (itemId: string, price: number) => {
      const percent = promotionPercent(promotion, itemId, now);
      return percent > 0 ? { price: discountedPrice(price, percent), originalPrice: price } : { price };
    };
    const allProducts: Product[] = catalog.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription,
      ...promo(p.id, p.price),
      image: resolveImage(p.image),
      gamme: p.category,
      categories: [p.category, ...p.extraCategories],
      benefits: p.benefits,
      ingredients: p.ingredients,
      usage: p.usage,
      volume: p.volume || undefined,
      gallery: p.gallery.length ? p.gallery.map(resolveImage) : undefined,
    }));
    const hidden = new Set(catalog.products.filter((p) => !p.visible).map((p) => p.id));
    const products = allProducts.filter((p) => !hidden.has(p.id));
    const byId = new Map(allProducts.map((p) => [p.id, p]));

    const ranges: GammePack[] = catalog.ranges.map((r) => ({
      id: r.id, name: r.name, description: r.description, note: r.note || undefined,
      ...promo(`pack-${r.id}`, r.price), image: resolveImage(r.image), benefits: r.benefits ?? [], contains: r.contains,
      kind: "gamme" as const, ...packProducts(matchProducts(r.contains, products)), details: r.details || undefined, usage: r.usage || undefined,
    }));

    const duos: GammePack[] = catalog.duos.map((d) => {
      const items = d.productIds.map((id) => byId.get(id)).filter((p): p is Product => !!p);
      return {
        id: d.id, name: d.name, description: d.description, image: resolveImage(d.image), benefits: d.benefits ?? [],
        contains: items.map((p) => p.name),
        kind: items.length >= 3 ? "trio" as const : "duo" as const, ...packProducts(items.map((p) => (hidden.has(p.id) ? null : p.id))),
        details: d.details || undefined, usage: d.usage || undefined,
        // Le duo vaut la somme des prix d'origine de ses soins ; la promotion s'applique ensuite sur ce total.
        ...promo(`pack-${d.id}`, d.productIds.reduce((sum, id) => sum + (catalog.products.find((p) => p.id === id)?.price ?? 0), 0)),
      };
    });

    const accessories: Accessory[] = catalog.accessories.map((a) => ({
      ...a,
      colors: a.colors.map((c) => ({ ...c, image: resolveImage(c.image) })),
    }));

    /** L'accessoire dans une couleur, sous la forme d'un article de panier (null s'il n'a pas de prix). */
    const accessoryProduct = (accessory: Accessory, colorIndex: number): Product | null => {
      if (accessory.price === null) return null;
      const color = accessory.colors[colorIndex];
      const many = accessory.colors.length > 1;
      return {
        id: accessoryItemId(accessory.id, color?.name ?? ""),
        name: many && color ? `${accessory.name} — ${color.name}` : accessory.name,
        description: accessory.intro, shortDescription: accessory.intro,
        ...promo(accessoryItemId(accessory.id, color?.name ?? ""), accessory.price), image: color?.image ?? "", gamme: "accessoire",
        benefits: [], ingredients: [], usage: "",
      };
    };

    /** Retrouve un article du panier (soin, gamme, duo ou accessoire) à partir de son identifiant. */
    const findItem = (id: string): Product | undefined => {
      const product = byId.get(id);
      if (product) return product;
      if (id.startsWith("acc-")) {
        const [accessoryId, color = ""] = id.slice(4).split("::");
        const accessory = accessories.find((a) => a.id === accessoryId);
        if (!accessory) return undefined;
        const index = Math.max(0, accessory.colors.findIndex((c) => c.name === color));
        if (accessory.colors.length > 1 && accessory.colors[index]?.name !== color) return undefined;
        return accessoryProduct(accessory, index) ?? undefined;
      }
      const pack = [...ranges, ...duos].find((p) => `pack-${p.id}` === id);
      return pack ? packToProduct(pack) : undefined;
    };

    return {
      promotion: promotionActive(promotion, now) ? promotion : null,
      categories: catalog.categories,
      products,
      productById: (id: string) => byId.get(id),
      ranges,
      rangeById: (id: string) => ranges.find((r) => r.id === id),
      duos,
      accessories,
      accessoryProduct,
      findItem,
    };
  }, [content]);
};
