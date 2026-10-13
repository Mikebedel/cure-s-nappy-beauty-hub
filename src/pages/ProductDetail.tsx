import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { products, gammes } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Button asChild>
          <Link to="/boutique">Retour à la boutique</Link>
        </Button>
      </div>
    );
  }

  const similar = products.filter((p) => p.gamme === product.gamme && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-6">
        <Link to="/boutique" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour à la boutique
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div>
            {product.gamme !== "hydratation" && <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              {gammes.find((g) => g.id === product.gamme)?.icon} {gammes.find((g) => g.id === product.gamme)?.name}
            </span>}
            <h1 className="font-heading text-2xl md:text-3xl font-bold mt-2 mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
            </div>

            <p className="text-2xl font-bold text-primary mb-6">{product.price.toLocaleString()} FCFA</p>
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            <Button
              size="lg"
              className="w-full bg-action text-action-foreground hover:bg-action/90 text-base mb-8"
              onClick={() => addToCart(product)}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Ajouter au panier
            </Button>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="font-heading font-semibold mb-3">Bienfaits</h3>
              <div className="flex flex-wrap gap-2">
                {product.benefits.map((b) => (
                  <span key={b} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">{b}</span>
                ))}
              </div>
            </div>

            {/* Usage */}
            <div className="mb-6">
              <h3 className="font-heading font-semibold mb-2">Conseils d'utilisation</h3>
              <p className="text-sm text-muted-foreground">{product.usage}</p>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="font-heading font-semibold mb-2">Ingrédients</h3>
              <p className="text-sm text-muted-foreground">{product.ingredients.join(" · ")}</p>
            </div>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
