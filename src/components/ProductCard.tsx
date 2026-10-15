import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const gammeLabels: Record<string, string> = {
  volume: "Volume",
  fortifiant: "Fortifiant",
  soin: "Soin",
  boucle: "Boucle",
};

const ProductCard = ({ product, hideBadge = false }: { product: Product; hideBadge?: boolean }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card group min-w-0 bg-card rounded-md overflow-hidden border border-border flex flex-col h-full">
      <Link to={`/produit/${product.id}`}>
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
          {!hideBadge && gammeLabels[product.gamme] && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-sm">
              {gammeLabels[product.gamme]}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-heading font-semibold text-base leading-6 min-h-12 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[15px] leading-6 text-muted-foreground mb-3 line-clamp-2 min-h-12">{product.shortDescription}</p>
        <div className="hidden">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews} avis)</span>
        </div>
        <div className="flex flex-col items-stretch mt-auto gap-3">
          <span className="text-lg font-bold text-primary">{product.price.toLocaleString("fr-FR")} FCFA</span>
          <Button
            size="sm"
            className="bg-action text-action-foreground hover:bg-action/90 font-semibold"
            onClick={() => addToCart(product)}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
