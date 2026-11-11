import { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from "react";
import { Product } from "@/data/products";
import { useCatalog } from "@/content/ContentProvider";
import { Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

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
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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
    if (!firstAddShown.current) {
      firstAddShown.current = true;
      localStorage.setItem("curesnappy-first-add-seen", "true");
      toast.custom(() => (
        <div role="status" data-testid="first-add-notice" className="first-add-notice flex items-center gap-4 w-full bg-card text-card-foreground border border-primary/30 rounded-2xl p-4 shadow-soft">
          <img src={product.image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
          <div className="min-w-0"><p className="font-heading font-bold flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Votre premier soin est ajouté</p><p className="text-sm text-muted-foreground">{product.name}</p></div>
          <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
        </div>
      ), { duration: 4500 });
    } else {
      toast.success(`${product.name} ajouté au panier`, { duration: 2400 });
    }
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

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
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
