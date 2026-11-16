import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ShoppingBag, Sparkles } from "lucide-react";
import { Price, PromoBadge } from "@/components/Price";
import { useCatalog } from "@/content/ContentProvider";
import { useCart } from "@/contexts/CartContext";
import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { Button } from "@/components/ui/button";
import ProductRail from "@/components/ProductRail";
import RichText from "@/content/RichText";
import { packPath, packToProduct, Product } from "@/data/products";

const KIND_LABEL = { gamme: "Gamme", duo: "Duo", trio: "Trio" } as const;

/** Page détail d'une gamme, d'un duo ou d'un trio, à l'adresse /gamme/<id>. */
const PackDetail = () => {
  const { id = "" } = useParams();
  const { ranges, duos, productById } = useCatalog();
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  const pack = [...ranges, ...duos].find((p) => p.id === id);

  if (!pack) {
    return (
      <div className="container mx-auto pt-36 pb-24 text-center">
        <h1 className="font-heading font-bold mb-3">Gamme introuvable</h1>
        <p className="text-muted-foreground mb-6">Cette gamme n'existe pas ou n'est plus disponible.</p>
        <Button asChild><Link to="/nos-gammes">Voir nos gammes</Link></Button>
      </div>
    );
  }

  const label = KIND_LABEL[pack.kind];
  const products = pack.productIds.map(productById).filter((p): p is Product => !!p);
  // Chaque soin inclus, avec un lien vers sa fiche quand on le retrouve dans le catalogue.
  const items = pack.contains.map((name, i) => {
    const productId = pack.containsIds[i];
    return { name, product: productId ? productById(productId) : undefined, key: `${name}-${i}` };
  });
  const others = [...(pack.kind === "gamme" ? ranges : duos)].filter((p) => p.id !== pack.id);
  const item = packToProduct(pack);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto pt-28 pb-8">
        <Link to="/nos-gammes" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 min-h-11">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux gammes
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 mb-16">
          {/* Photo */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="relative aspect-square bg-muted rounded-[2rem] overflow-hidden shadow-soft">
              <img src={pack.image} alt={pack.name} className="w-full h-full object-cover" />
              <PromoBadge price={pack.price} original={pack.originalPrice} className="absolute top-4 right-4" />
            </div>
          </div>

          {/* Infos */}
          <div className="min-w-0">
            <span className="eyebrow">{label} · {pack.contains.length} soins</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">{pack.name}</h1>
            <p className="mb-4 flex items-center gap-3 flex-wrap">
              <Price price={pack.price} original={pack.originalPrice} className="text-2xl font-bold text-primary" />
              <PromoBadge price={pack.price} original={pack.originalPrice} />
            </p>
            <p className="text-base leading-7 mb-6">{pack.description}</p>

            {pack.benefits.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-6" aria-label="Bienfaits">
                {pack.benefits.map((b) => (
                  <li key={b} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />{b}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button size="lg" className="h-12 flex-1 bg-action text-action-foreground hover:bg-action/90 text-base" onClick={() => addToCart(item)}>
                <ShoppingBag className="mr-2 h-5 w-5" />Ajouter au panier
              </Button>
              <Button size="lg" variant="outline" className="h-12 flex-1 text-base" onClick={() => { addToCart(item); openCart(); }}>
                Commander maintenant
              </Button>
            </div>

            {/* Soins inclus */}
            <div className="border-t border-border pt-6 mb-6">
              <h2 className="font-heading text-lg font-semibold mb-3">Les {pack.contains.length} soins inclus</h2>
              <ul className="space-y-2.5">
                {items.map(({ name, product, key }) => {
                  return (
                    <li key={key} className="flex items-start gap-2.5 text-base">
                      <Check className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                      {product ? (
                        <Link to={`/produit/${product.id}`} className="underline underline-offset-4 decoration-border hover:text-primary hover:decoration-primary">{name}</Link>
                      ) : <span>{name}</span>}
                    </li>
                  );
                })}
              </ul>
              {pack.kind !== "gamme" && (
                <p className="mt-3 text-sm text-muted-foreground">Le prix est la somme des soins inclus.</p>
              )}
              {pack.note && <p className="mt-4 rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">{pack.note}</p>}
            </div>

            {pack.details && (
              <div className="border-t border-border pt-6 mb-6">
                <h2 className="font-heading text-lg font-semibold mb-3">{label === "Gamme" ? "La gamme" : `Le ${label.toLowerCase()}`} en détail</h2>
                <RichText text={pack.details} className="space-y-3 text-base leading-7 text-muted-foreground" />
              </div>
            )}

            {pack.usage && (
              <div className="border-t border-border pt-6">
                <h2 className="font-heading text-lg font-semibold mb-2">Conseils d'utilisation</h2>
                <p className="text-base leading-7 text-muted-foreground whitespace-pre-line">{pack.usage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Les soins un par un */}
        {products.length > 0 && (
          <section className="mb-16" aria-labelledby="soins-inclus">
            <h2 id="soins-inclus" className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center">Les soins <span className="text-primary">un par un</span></h2>
            <ProductRail products={products} label={`Les soins de ${pack.name}`} center />
          </section>
        )}

        {/* Les autres */}
        {others.length > 0 && (
          <section className="mb-16" aria-labelledby="autres">
            <h2 id="autres" className="font-heading text-2xl md:text-3xl font-bold mb-6">
              {pack.kind === "gamme" ? "Les autres gammes" : "Les autres duos et trios"}
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {others.map((o) => (
                <li key={o.id}>
                  <Link to={packPath(o)} className="group block rounded-2xl border border-border/80 bg-card p-2 h-full hover:border-primary/40 transition-colors">
                    <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                      <img src={o.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <p className="px-1.5 pt-2.5 font-heading font-semibold text-sm leading-5 group-hover:text-primary">{o.name}</p>
                    <Price price={o.price} original={o.originalPrice} className="px-1.5 pb-1 text-sm font-bold text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default PackDetail;
