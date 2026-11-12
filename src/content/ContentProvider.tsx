import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { SiteContent } from "./types";
import { defaultContent } from "./defaults";
import { resolveImage } from "./images";
import { BackendStatus, clearDraft, loadDraft, loadRemote, mergeContent, saveDraft, saveRemote } from "./store";
import type { Accessory, GammePack, Product } from "@/data/products";
import { packToProduct } from "@/data/products";
import { accessoryItemId } from "../../supabase/functions/_shared/pricing";

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
  save: (next: SiteContent) => Promise<void>;
  resetLocal: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  // Sur l'ordinateur de développement, l'aperçu local s'affiche tout de suite, sans attendre la base.
  const [content, setContent] = useState<SiteContent>(() => {
    const draft = import.meta.env.DEV ? loadDraft() : null;
    return draft ? mergeContent(defaultContent, draft) : defaultContent;
  });
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
      }
    });
    return () => { cancelled = true; };
  }, []);

  const localPreview = import.meta.env.DEV && (status === "offline" || status === "not-set-up");
  const saveTarget: SaveTarget | null = status === "online" ? "remote" : localPreview ? "local" : null;

  const save = useCallback(async (next: SiteContent) => {
    if (saveTarget === "remote") {
      await saveRemote(next);
      setUpdatedAt(new Date().toISOString());
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

  const value = useMemo(() => ({ content, status, saveTarget, localPreview, updatedAt, save, resetLocal }), [content, status, saveTarget, localPreview, updatedAt, save, resetLocal]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
};

/** Le catalogue prêt à afficher : images résolues, prix des duos calculés, articles masqués retirés. */
export const useCatalog = () => {
  const { content } = useContent();
  return useMemo(() => {
    const { catalog } = content;
    const allProducts: Product[] = catalog.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription,
      price: p.price,
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
      price: r.price, image: resolveImage(r.image), benefits: r.benefits, contains: r.contains,
    }));

    const duos: GammePack[] = catalog.duos.map((d) => {
      const items = d.productIds.map((id) => byId.get(id)).filter((p): p is Product => !!p);
      return {
        id: d.id, name: d.name, description: d.description, image: resolveImage(d.image), benefits: [],
        contains: items.map((p) => p.name),
        price: items.reduce((sum, p) => sum + p.price, 0),
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
        price: accessory.price, image: color?.image ?? "", gamme: "accessoire",
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
