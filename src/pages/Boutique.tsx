import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";
import { products, gammes, productMatchesCategory } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { GammesSection, DuosSection, AccessoriesSection } from "@/components/CollectionSections";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

const Boutique = () => {
  const [searchParams] = useSearchParams();
  const requestedGamme = searchParams.get("gamme");
  const linkedGamme = gammes.some((g) => g.id === requestedGamme) ? requestedGamme : null;
  const [activeFilter, setActiveFilter] = useState<string>(linkedGamme ?? "all");

  // Un lien « Voir tout » d'une catégorie arrive directement sur le catalogue filtré.
  useEffect(() => {
    if (!linkedGamme) return;
    setActiveFilter(linkedGamme);
    const timer = setTimeout(() => {
      if (window.scrollY < 40) document.getElementById("catalogue")?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    }, 120);
    return () => clearTimeout(timer);
  }, [linkedGamme]);
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
      <section className="px-3 pt-[88px]">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary-foreground)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)/0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-10 lg:gap-16 items-start py-12 md:py-20">
          {/* Texte */}
          <div className="flex flex-col justify-center">
            <span className="eyebrow eyebrow--light mb-4">Le soin du moment</span>
            <h1 className="font-heading font-bold leading-tight mb-4">
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
            <div className="rounded-2xl bg-primary-foreground/10 p-5 mb-6">
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
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-7"
                onClick={() => { addToCart(featured); openCart(); }}
              >
                <ShoppingBag className="h-4 w-4" /> Commande dès maintenant !
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 bg-primary-foreground/10 border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/contact">Nous contacter <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>

          </div>

          {/* Pièce du moment */}
          <div className="relative md:self-start md:sticky md:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] shadow-lift">
              <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-deep/80 backdrop-blur-md p-5 rounded-2xl">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-2">
                  Soin du moment
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="font-heading text-2xl leading-tight">{featured.name}</div>
                    <div className="text-accent font-semibold mt-1">
                      {featured.price.toLocaleString("fr-FR")} FCFA
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
      </div>
      </section>

      <nav aria-label="Collections" className="container mx-auto flex flex-wrap gap-2 pt-8">
        {[{ id: "catalogue", label: "Tous les soins" }, { id: "gammes", label: "Nos Gammes" }, { id: "duos", label: "Nos Duos et Trio" }, { id: "accessoires", label: "Accessoires" }].map(section => <Button key={section.id} asChild variant="outline" className="rounded-full bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary"><a href={`#${section.id}`}>{section.label}</a></Button>)}
      </nav>

      {/* CATALOGUE */}
      <section id="catalogue" className="container mx-auto pt-12 pb-16 md:pb-24 scroll-mt-24">
        <SectionHeading eyebrow="La collection" title={<>Tous les <span className="text-primary">soins</span></>} className="!mb-8"
          action={<div className="text-sm text-muted-foreground" aria-live="polite">{filtered.length} soin{filtered.length > 1 ? "s" : ""}</div>} />

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-8">
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
      <AccessoriesSection />
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
    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground"
        : "bg-card border-border text-foreground/80 hover:bg-card hover:border-primary hover:text-primary"
    }`}
  >
    {children}
  </Button>
);

export default Boutique;
