import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";
import { products, gammes, productMatchesCategory } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { GammesSection, DuosSection } from "@/components/CollectionSections";
import ProductCard from "@/components/ProductCard";

const Boutique = () => {
  const [searchParams] = useSearchParams();
  const initialGamme = searchParams.get("gamme");
  const [activeFilter, setActiveFilter] = useState<string>(initialGamme ?? "all");
  const { addToCart } = useCart();
  const openCart = useCartNavigation();

  const filtered = useMemo(
    () => (activeFilter === "all" ? products : products.filter((p) => productMatchesCategory(p, activeFilter))),
    [activeFilter],
  );

  const featured = products.find((product) => product.id === "8") ?? products[0]; // Huile Extra Pousse — "Pièce du moment"

  return (
    <div className="min-h-screen bg-background">
      {/* HERO — éditorial sombre type Axelle Sanogo */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary-foreground)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)/0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-10 items-start px-4 pt-28 pb-16 md:pt-32 md:pb-24">
          {/* Texte */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-accent mb-6">
              <span className="h-px w-8 bg-accent" />
              Cure&apos;s Nappy · Boutique principale · Soins capillaires d&apos;exception
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-4">
              Huile Extra Pousse
            </h1>
            <p className="text-lg text-accent mb-4">
              Tu rêves de cheveux plus longs, plus denses et plus forts ?
            </p>
            <p className="text-primary-foreground/80 mb-5 leading-relaxed">
              L’Huile Extra Pousse Cure’s Nappy est conçue pour stimuler naturellement la pousse rapide et aider tes cheveux à révéler tout leur potentiel.
            </p>
            <p className="text-primary-foreground/80 mb-3">Grâce à sa composition riche en huiles végétales puissantes, elle :</p>
            <ul className="space-y-2 mb-6 text-primary-foreground/80">
              {[
                "Stimule la circulation sanguine du cuir chevelu",
                "Nourrit profondément le bulbe capillaire",
                "Aide à réduire la chute et la casse",
                "Favorise une pousse saine, rapide et régulière",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-2"><Check className="h-4 w-4 shrink-0 mt-1 text-accent" />{benefit}</li>
              ))}
            </ul>
            <div className="border-y border-primary-foreground/20 py-5 mb-6">
              <p className="font-semibold text-accent mb-2">Le vrai secret ? La régularité + le massage du cuir chevelu.</p>
              <p className="text-primary-foreground/80 leading-relaxed">Quelques minutes de massage permettent de mieux activer la circulation et d’optimiser l’action de l’huile.</p>
            </div>
            <h2 className="text-xl font-bold mb-3">Comment l’utiliser ?</h2>
            <ul className="list-disc pl-5 space-y-2 text-primary-foreground/80 mb-7">
              <li>Applique quelques gouttes directement sur le cuir chevelu et la devanture.</li>
              <li>Masse délicatement pendant 3 à 5 minutes pour stimuler la circulation sanguine.</li>
              <li>À utiliser quotidiennement ou tous les 2 jours par semaine pour de meilleurs résultats.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-action text-action-foreground hover:bg-action/90 px-7"
                onClick={() => { addToCart(featured); openCart(); }}
              >
                <ShoppingBag className="h-4 w-4" /> Commande dès maintenant !
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-md px-7 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/contact">Nous contacter <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>

          </div>

          {/* Pièce du moment */}
          <div className="relative md:self-start md:sticky md:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-primary-foreground/10">
              <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-primary/85 backdrop-blur-sm border border-accent/40 p-5 rounded-sm">
                <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-2">
                  Pièce du moment
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="font-heading text-2xl leading-tight">{featured.name}</div>
                    <div className="text-accent font-semibold mt-1">
                      {featured.price.toLocaleString()} FCFA
                    </div>
                  </div>
                  <Link
                    to={`/produit/${featured.id}`}
                    className="text-xs tracking-widest uppercase text-primary-foreground/80 hover:text-accent inline-flex items-center gap-1"
                  >
                    Explorer <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Collections" className="container mx-auto flex flex-wrap gap-3 px-4 pt-8">
        {[{ id: "catalogue", label: "Tous les soins" }, { id: "gammes", label: "Nos Gammes" }, { id: "duos", label: "Nos Duos" }].map(section => <Button key={section.id} asChild variant="outline"><a href={`#${section.id}`}>{section.label}</a></Button>)}
      </nav>

      {/* CATALOGUE */}
      <section id="catalogue" className="container mx-auto px-4 py-10 scroll-mt-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              La collection
            </div>
            <h2 className="font-heading text-3xl font-bold">
              Tous les <span className="not-italic text-primary">soins</span>
            </h2>
          </div>
          <div className="text-sm text-muted-foreground">{filtered.length} pièces</div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-6">
          <FilterChip active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>
            Toutes les catégories
          </FilterChip>
          {gammes.map((g) => (
            <FilterChip
              key={g.id}
              active={activeFilter === g.id}
              onClick={() => setActiveFilter(g.id)}
            >
              {g.name}
            </FilterChip>
          ))}
        </div>

        <div className="product-grid">{filtered.map(product => <div key={product.id} data-product-id={product.id}><ProductCard product={product} hideBadge /></div>)}</div>
      </section>

      <GammesSection />
      <DuosSection />
    </div>
  );
};

const FilterChip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Button
    variant="outline"
    aria-pressed={active}
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase border transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-transparent border-border text-foreground/70 hover:border-primary hover:text-primary"
    }`}
  >
    {children}
  </Button>
);

export default Boutique;
