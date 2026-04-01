import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
      <Link to={`/produit/${product.id}`}>
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-sm">
            {product.gamme === "hydratation" && "💧 Hydratation"}
            {product.gamme === "croissance" && "🌱 Croissance"}
            {product.gamme === "definition" && "✨ Définition"}
            {product.gamme === "reparation" && "🛡️ Réparation"}
            {product.gamme === "eclat" && "☀️ Éclat"}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-heading font-semibold text-base mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.shortDescription}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews} avis)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} FCFA</span>
          <Button
            size="sm"
            className="bg-action text-action-foreground hover:bg-action/90"
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
