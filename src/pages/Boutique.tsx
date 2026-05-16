import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronDown, ShoppingBag, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { products, gammes, gammePacks } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Boutique = () => {
  const [searchParams] = useSearchParams();
  const initialGamme = searchParams.get("gamme");
  const [activeFilter, setActiveFilter] = useState<string>(initialGamme ?? "all");
  const [gammesOpen, setGammesOpen] = useState(false);
  const { addToCart } = useCart();

  const filtered = useMemo(
    () => (activeFilter === "all" ? products : products.filter((p) => p.gamme === activeFilter)),
    [activeFilter],
  );

  const featured = products[7]; // Huile Extra Pousse — "Pièce du moment"

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
        <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-10 px-4 py-16 md:py-24">
          {/* Texte */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-accent mb-6">
              <span className="h-px w-8 bg-accent" />
              Cure&apos;s Nappy · Boutique principale · Soins capillaires d&apos;exception
            </div>
            <h1 className="font-heading text-5xl md:text-7xl leading-[1.05] mb-4">
              Plus qu&apos;un soin,
              <br />
              <span className="italic text-accent">un rituel.</span>
            </h1>
            <p className="text-primary-foreground/75 max-w-md mb-8">
              Des formules pensées pour les cheveux afro, bouclés, défrisés et naturels.
              Efficacité, ingrédients nobles, résultats visibles.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-7"
                asChild
              >
                <a href="#catalogue">Découvrir la collection</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/contact">Nous contacter <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-8">
              <div>
                <div className="font-heading text-3xl">{products.length}</div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/60 mt-1">
                  Soins disponibles
                </div>
              </div>
              <div>
                <div className="font-heading text-3xl flex items-center gap-1">
                  ABJ <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/60 mt-1">
                  Livraison Abidjan
                </div>
              </div>
              <div>
                <div className="font-heading text-3xl flex items-center gap-1">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/60 mt-1">
                  Qualité certifiée
                </div>
              </div>
            </div>
          </div>

          {/* Pièce du moment */}
          <div className="relative">
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

      {/* CATALOGUE */}
      <section id="catalogue" className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              La collection
            </div>
            <h2 className="font-heading text-4xl md:text-5xl">
              Tous les <span className="italic text-primary">soins</span>
            </h2>
          </div>
          <div className="text-sm text-muted-foreground">{filtered.length} pièces</div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-border pb-6">
          <FilterChip active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>
            Toutes les catégories
          </FilterChip>
          {gammes.map((g) => (
            <FilterChip
              key={g.id}
              active={activeFilter === g.id}
              onClick={() => setActiveFilter(g.id)}
            >
              {g.icon} {g.name}
            </FilterChip>
          ))}
        </div>

        {/* Grille éditoriale */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((p) => (
            <article key={p.id} className="group flex flex-col">
              <Link to={`/produit/${p.id}`} className="block relative overflow-hidden bg-secondary aspect-[4/5] mb-4">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(p);
                  }}
                  className="absolute bottom-3 right-3 bg-primary text-primary-foreground rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground"
                  aria-label="Ajouter au panier"
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </Link>
              <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                {gammes.find((g) => g.id === p.gamme)?.name ?? "Soin"}
              </div>
              <Link
                to={`/produit/${p.id}`}
                className="font-heading text-lg leading-tight hover:text-primary transition-colors"
              >
                {p.name}
              </Link>
              <div className="mt-2 text-primary font-semibold">
                {p.price.toLocaleString()} FCFA
              </div>
              <Link
                to={`/produit/${p.id}`}
                className="mt-3 text-[11px] tracking-[0.2em] uppercase text-foreground/70 hover:text-primary inline-flex items-center gap-1"
              >
                Voir le détail <ArrowRight className="h-3 w-3" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Gammes — menu déroulant éditorial */}
      <section className="bg-secondary/60 border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <Collapsible open={gammesOpen} onOpenChange={setGammesOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between group">
              <div className="text-left">
                <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
                  Coffrets
                </div>
                <h2 className="font-heading text-3xl md:text-4xl">
                  Nos <span className="italic text-primary">gammes</span> complètes
                </h2>
              </div>
              <ChevronDown
                className={`h-6 w-6 text-primary transition-transform ${gammesOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gammePacks.map((pack) => (
                  <article
                    key={pack.id}
                    className="bg-card border border-border overflow-hidden flex flex-col group hover:border-primary transition-colors"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-secondary">
                      <img
                        src={pack.image}
                        alt={pack.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-heading text-xl mb-2">{pack.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{pack.description}</p>
                      {pack.contains && (
                        <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                          {pack.contains.map((c, i) => (
                            <li key={i}>— {c}</li>
                          ))}
                        </ul>
                      )}
                      {pack.note && (
                        <p className="text-xs italic text-primary/80 mb-4">NB : {pack.note}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <span className="font-heading text-xl text-primary">
                          {pack.price.toLocaleString()} FCFA
                        </span>
                        <Button
                          size="sm"
                          asChild
                          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
                        >
                          <a
                            href="https://wa.me/c/2250100848479"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Commander
                          </a>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>
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
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase border transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-transparent border-border text-foreground/70 hover:border-primary hover:text-primary"
    }`}
  >
    {children}
  </button>
);

export default Boutique;
