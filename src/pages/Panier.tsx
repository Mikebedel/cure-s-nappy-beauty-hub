import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Panier = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  const location = useLocation();
  const navigate = useNavigate();
  const close = () => navigate(location.state?.cartOrigin ?? "/boutique", { state: { restoreScroll: location.state?.cartScroll ?? 0 } });
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [location.state]);

  return (
    <div className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm pt-24 pb-5 px-3 flex items-start justify-end" onClick={close}>
      <section role="dialog" aria-modal="true" aria-labelledby="cart-title" className="cart-panel bg-background border border-border shadow-xl rounded-lg w-full max-w-md max-h-[calc(100dvh-7rem)] flex flex-col overflow-hidden" onClick={event => event.stopPropagation()}>
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h1 id="cart-title" className="font-heading font-bold text-xl">Votre panier <span className="text-sm text-muted-foreground">({items.length})</span></h1>
          <Button variant="ghost" size="icon" aria-label="Fermer votre panier" onClick={close}><X /></Button>
        </header>
        {items.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
            <p className="font-semibold">Votre panier est vide</p>
            <Button asChild className="bg-action text-action-foreground hover:bg-action/90"><Link to="/boutique">Voir la boutique</Link></Button>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto px-5 divide-y divide-border">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 py-4">
                  <img src={product.image} alt={product.name} className="h-16 w-16 rounded-sm object-cover bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-5">{product.name}</p>
                    <p className="text-sm text-primary font-bold mt-1">{product.price.toLocaleString("fr-FR")} FCFA</p>
                    <div className="flex items-center mt-1 gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Diminuer la quantité de ${product.name}`} onClick={() => updateQuantity(product.id, quantity - 1)}><Minus /></Button>
                      <span className="w-6 text-center text-sm">{quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Augmenter la quantité de ${product.name}`} onClick={() => updateQuantity(product.id, quantity + 1)}><Plus /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto text-muted-foreground" aria-label={`Retirer ${product.name}`} onClick={() => removeFromCart(product.id)}><Trash2 /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <footer className="border-t border-border p-5 space-y-4">
              <div className="flex justify-between font-bold"><span>Sous-total</span><span className="text-primary">{totalPrice.toLocaleString("fr-FR")} FCFA</span></div>
              <p className="text-xs text-muted-foreground">Livraison calculée à l’étape suivante.</p>
              <Button asChild className="w-full bg-action text-action-foreground hover:bg-action/90"><Link to="/checkout">Passer la commande</Link></Button>
              <Button variant="ghost" className="w-full" onClick={close}><ArrowLeft />Continuer les achats</Button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
};

export default Panier;
