import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gammes, products, gammePacks, packToProduct } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

const gammeDescriptions: Record<string, string> = {
  hydratation: "Crèmes, masques, huiles & sprays riches en karité et aloe vera pour une hydratation profonde.",
  volume: "Huiles et soins concentrés en biotine et ricin pour stimuler la pousse et le volume.",
  fortifiant: "Soins fortifiants à base de poudres africaines pour renforcer et prévenir la chute.",
  soin: "Shampoings doux pour nettoyer en douceur et traiter pellicules & démangeaisons.",
  boucle: "Crèmes coiffantes pour définir et sublimer les boucles naturelles.",
};

const NosGammes = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddPack = (pack: typeof gammePacks[number]) => {
    addToCart(packToProduct(pack));
    toast.success(`${pack.name} ajouté au panier`);
    navigate("/panier");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase text-accent mb-6">
            <span className="h-px w-8 bg-accent" />
            Cure&apos;s Nappy · Nos Gammes
            <span className="h-px w-8 bg-accent" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-4">
            Des rituels <span className="italic text-accent">complets</span>
          </h1>
          <p className="text-primary-foreground/75 max-w-xl mx-auto">
            Chaque gamme rassemble les soins essentiels pour atteindre un objectif capillaire précis.
            Économisez en commandant la routine complète.
          </p>
        </div>
      </section>

      {/* GAMMES PACKS — grid like products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Coffrets</div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Nos <span className="italic text-primary">gammes complètes</span>
            </h2>
          </div>
          <div className="text-sm text-muted-foreground">{gammePacks.length} coffrets</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gammePacks.map((pack) => (
            <article
              key={pack.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col"
            >
              <div className="aspect-[4/5] overflow-hidden bg-secondary relative">
                <img
                  src={pack.image}
                  alt={pack.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
                  Coffret
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading text-lg font-bold mb-1">{pack.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{pack.description}</p>
                {pack.contains && (
                  <ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
                    {pack.contains.slice(0, 4).map((c, i) => (
                      <li key={i}>— {c}</li>
                    ))}
                    {pack.contains.length > 4 && (
                      <li className="italic">+ {pack.contains.length - 4} autres soins</li>
                    )}
                  </ul>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border gap-2">
                  <span className="text-xl font-bold text-primary">
                    {pack.price.toLocaleString()} FCFA
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddPack(pack)}
                    className="bg-action text-white hover:bg-action/90 font-semibold rounded-full"
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* THEMATIC PRODUCT SECTIONS (ascending price) */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4 py-16 space-y-16">
          <div className="text-center">
            <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Thématiques</div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Soins par <span className="italic text-primary">objectif capillaire</span>
            </h2>
          </div>

          {gammes.map((g) => {
            const gProducts = products
              .filter((p) => p.gamme === g.id)
              .sort((a, b) => a.price - b.price);
            if (gProducts.length === 0) return null;
            return (
              <div key={g.id}>
                <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
                      <span className="text-3xl">{g.icon}</span> {g.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                      {gammeDescriptions[g.id]}
                    </p>
                  </div>
                  <Link
                    to={`/boutique?gamme=${g.id}`}
                    className="text-xs tracking-widest uppercase text-primary hover:text-action inline-flex items-center gap-1 font-semibold"
                  >
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {gProducts.map((p) => (
                    <ProductCard key={p.id} product={p} hideBadge />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default NosGammes;
