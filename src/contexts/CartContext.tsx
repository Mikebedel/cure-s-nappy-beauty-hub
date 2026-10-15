import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Product } from "@/data/products";
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
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("curesnappy-cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });
  const firstAddShown = useRef(localStorage.getItem("curesnappy-first-add-seen") === "true" || items.length > 0);

  useEffect(() => {
    localStorage.setItem("curesnappy-cart", JSON.stringify(items));
    if (firstAddShown.current) localStorage.setItem("curesnappy-first-add-seen", "true");
  }, [items]);

  const addToCart = (product: Product) => {
    if (!firstAddShown.current) {
      firstAddShown.current = true;
      localStorage.setItem("curesnappy-first-add-seen", "true");
      toast.custom(() => (
        <div role="status" data-testid="first-add-notice" className="first-add-notice flex items-center gap-4 w-full bg-card text-card-foreground border border-primary/30 rounded-md p-4 shadow-sm">
          <img src={product.image} alt="" className="w-14 h-14 rounded-sm object-cover shrink-0" />
          <div className="min-w-0"><p className="font-heading font-bold flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Votre premier soin est ajouté</p><p className="text-sm text-muted-foreground">{product.name}</p></div>
          <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
        </div>
      ), { duration: 4500 });
    } else {
      toast.success(`${product.name} ajouté au panier`, { duration: 2400 });
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

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
