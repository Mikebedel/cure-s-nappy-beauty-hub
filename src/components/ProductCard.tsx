import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
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
    <div className="product-card group min-w-0 bg-card rounded-3xl overflow-hidden border border-border/80 flex flex-col h-full p-2">
      <Link to={`/produit/${product.id}`} className="block">
        <div className="aspect-square bg-muted relative overflow-hidden rounded-2xl">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {!hideBadge && gammeLabels[product.gamme] && (
            <span className="absolute top-3 left-3 bg-background/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full">
              {gammeLabels[product.gamme]}
            </span>
          )}
          {product.volume && (
            <span className="absolute bottom-3 right-3 bg-background/90 backdrop-blur text-foreground/80 text-xs font-medium px-2.5 py-1 rounded-full">
              {product.volume}
            </span>
          )}
        </div>
      </Link>
      <div className="px-2 pt-4 pb-2 sm:px-3 flex flex-col flex-1">
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-heading font-semibold text-base sm:text-lg leading-6 min-h-12 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm leading-6 text-muted-foreground mb-4 line-clamp-2 min-h-12">{product.shortDescription}</p>
        <div className="flex flex-col items-stretch mt-auto gap-3">
          <span className="font-heading text-lg font-bold text-primary">{product.price.toLocaleString("fr-FR")} FCFA</span>
          <Button
            size="sm"
            className="bg-action text-action-foreground hover:bg-action/90 font-semibold"
            onClick={() => addToCart(product)}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingBag />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
