import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const Panier = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-3">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Découvrez nos produits et commencez votre routine capillaire.</p>
        <Button asChild className="bg-action text-action-foreground hover:bg-action/90">
          <Link to="/boutique">Voir la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <Link to="/boutique" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Continuer les achats
        </Link>

        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">Votre panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 bg-card border border-border rounded-lg p-4">
                <div className="h-20 w-20 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/produit/${product.id}`} className="font-heading font-semibold text-sm hover:text-primary line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-primary font-bold mt-1">{product.price.toLocaleString()} FCFA</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="ml-auto text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
            <h2 className="font-heading font-semibold text-lg mb-4">Résumé</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{totalPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-primary font-medium">Gratuite à Abidjan</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{totalPrice.toLocaleString()} FCFA</span>
              </div>
            </div>
            <Button asChild className="w-full bg-action text-action-foreground hover:bg-action/90 text-base" size="lg">
              <Link to="/checkout">Passer la commande</Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Mobile Money · Paiement à la livraison
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panier;
