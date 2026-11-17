import { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from "react";
import { Product } from "@/data/products";
import { useCatalog } from "@/content/ContentProvider";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useCartNavigation } from "@/hooks/use-cart-navigation";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  /** Remet un panier gardé (commande à reprendre après un paiement non abouti). */
  replaceCart: (lines: { id: string; quantity: number }[]) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Notification d'ajout : toute la carte est un bouton qui ouvre le panier (pratique au téléphone). */
const AddedToast = ({ id, product, first }: { id: string | number; product: Product; first: boolean }) => {
  const openCart = useCartNavigation();
  return (
    <button type="button" onClick={() => { toast.dismiss(id); openCart(); }}
      data-testid={first ? "first-add-notice" : "add-notice"}
      aria-label={`${product.name} ajouté au panier. Voir le panier`}
      className={`${first ? "first-add-notice " : ""}flex items-center gap-3 w-full text-left bg-card text-card-foreground border border-primary/30 rounded-2xl p-3 shadow-soft active:scale-[0.98] transition-transform`}>
      <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="font-heading font-bold flex items-center gap-1.5 text-sm"><Check className="w-4 h-4 text-primary shrink-0" />{first ? "Votre premier soin est ajouté" : "Ajouté au panier"}</span>
        <span className="block text-sm text-muted-foreground truncate">{product.name}</span>
      </span>
      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold">Voir le panier<ArrowRight className="w-3.5 h-3.5" /></span>
    </button>
  );
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { findItem } = useCatalog();
  // On ne garde que l'identifiant et la quantité ; nom, prix et image sont toujours relus
  // dans le catalogue actuel, pour qu'une modification du dashboard s'applique aussi au panier.
  const [stored, setStored] = useState<{ id: string; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem("curesnappy-cart");
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.flatMap((entry) => {
        const id = entry?.id ?? entry?.product?.id;
        const quantity = Math.floor(Number(entry?.quantity));
        return typeof id === "string" && quantity > 0 ? [{ id, quantity }] : [];
      });
    } catch { return []; }
  });
  const items = useMemo<CartItem[]>(
    () => stored.flatMap(({ id, quantity }) => {
      const product = findItem(id);
      return product ? [{ product, quantity }] : [];
    }),
    [stored, findItem],
  );
  const firstAddShown = useRef(localStorage.getItem("curesnappy-first-add-seen") === "true" || items.length > 0);

  useEffect(() => {
    localStorage.setItem("curesnappy-cart", JSON.stringify(stored));
    if (firstAddShown.current) localStorage.setItem("curesnappy-first-add-seen", "true");
  }, [stored]);

  const addToCart = (product: Product) => {
    const first = !firstAddShown.current;
    if (first) {
      firstAddShown.current = true;
      localStorage.setItem("curesnappy-first-add-seen", "true");
    }
    toast.custom((id) => <AddedToast id={id} product={product} first={first} />, { duration: first ? 4500 : 3000 });
    setStored((prev) => prev.some((i) => i.id === product.id)
      ? prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...prev, { id: product.id, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setStored((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setStored((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setStored([]);
  const replaceCart = (lines: { id: string; quantity: number }[]) =>
    setStored(lines.filter((l) => typeof l.id === "string" && Number.isInteger(l.quantity) && l.quantity > 0));

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, replaceCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
