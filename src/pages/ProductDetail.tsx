import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { products, gammes } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);
  const [imageIndex, setImageIndex] = useState(0);

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
      <div className="container mx-auto pt-28 pb-8">
        <Link to="/boutique" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour à la boutique
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img src={product.gallery?.[imageIndex] ?? product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3 mt-3">
                {product.gallery.map((src, i) => (
                  <button key={src} type="button" onClick={() => setImageIndex(i)} aria-label={`Photo ${i + 1}`} className={`h-20 w-20 rounded-md overflow-hidden border-2 ${i === imageIndex ? "border-primary" : "border-border"}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.gamme !== "hydratation" && <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              {gammes.find((g) => g.id === product.gamme)?.icon} {gammes.find((g) => g.id === product.gamme)?.name}
            </span>}
            <h1 className="font-heading text-2xl md:text-3xl font-bold mt-2 mb-3">{product.name}</h1>
            {product.volume && <p className="text-muted-foreground mb-4">{product.volume}</p>}

            <p className="text-xl font-bold text-primary mb-4">{product.price.toLocaleString("fr-FR")} FCFA</p>
            <p className="text-base leading-7 mb-6">{product.shortDescription}</p>

            <Button
              size="lg"
              className="w-full bg-action text-action-foreground hover:bg-action/90 text-base mb-8"
              onClick={() => addToCart(product)}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Ajouter au panier
            </Button>

            {/* Benefits */}
            <div className="border-t border-border pt-6 mb-6">
              <h2 className="font-heading font-semibold mb-3">Le soin en détail</h2>
              <p className="text-base text-muted-foreground leading-7 mb-6">{product.description}</p>
              <h3 className="font-heading font-semibold mb-3">Bienfaits indiqués par la marque</h3>
              <ul className="space-y-2 list-disc pl-5">
                {product.benefits.map((b) => (
                  <li key={b} className="text-base text-muted-foreground">{b}</li>
                ))}
              </ul>
            </div>

            {/* Usage */}
            <div className="border-t border-border pt-6 mb-6">
              <h3 className="font-heading font-semibold mb-2">Conseils d'utilisation</h3>
              <p className="text-base leading-7 text-muted-foreground">{product.usage}</p>
            </div>

            {/* Ingredients */}
            <div className="border-t border-border pt-6">
              <h3 className="font-heading font-semibold mb-2">Ingrédients</h3>
              <p className="text-base leading-7 text-muted-foreground">{product.ingredients.join(" · ")}</p>
            </div>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="product-grid">
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
