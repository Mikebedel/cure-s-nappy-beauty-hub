import { useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { ChevronDown, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { products, gammes, gammePacks, packToProduct } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

const Boutique = () => {
  const [searchParams] = useSearchParams();
  const initialGamme = searchParams.get("gamme");
  const [activeFilter, setActiveFilter] = useState<string>(initialGamme ?? "all");
  const [gammesOpen, setGammesOpen] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddPack = (pack: typeof gammePacks[number]) => {
    addToCart(packToProduct(pack));
    toast.success(`${pack.name} ajouté au panier`);
    navigate("/panier");
  };

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
        <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-10 px-4 pt-28 pb-16 md:pt-32 md:pb-24">
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
                onClick={() => { addToCart(featured); toast.success(`${featured.name} ajouté au panier`); navigate("/panier"); }}
              >
                <ShoppingBag className="h-4 w-4" /> Commande dès maintenant !
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

      {/* CATALOGUE */}
      <section id="catalogue" className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              La collection
            </div>
            <h2 className="font-heading text-4xl md:text-5xl">
              Tous les <span className="not-italic text-primary">soins</span>
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
                    toast.success(`${p.name} ajouté au panier`);
                  }}
                  className="absolute bottom-3 right-3 bg-action text-action-foreground rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-action/90 shadow-lg"
                  aria-label="Ajouter au panier"
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </Link>
              {p.gamme !== "hydratation" && <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                {gammes.find((g) => g.id === p.gamme)?.name ?? "Soin"}
              </div>}
              <Link
                to={`/produit/${p.id}`}
                className="font-heading text-lg leading-tight hover:text-primary transition-colors"
              >
                {p.name}
              </Link>
              <div className="mt-2 text-primary font-semibold">
                {p.price.toLocaleString()} FCFA
              </div>
              <Button
                size="sm"
                onClick={() => {
                  addToCart(p);
                  toast.success(`${p.name} ajouté au panier`);
                }}
                className="mt-3 bg-action text-action-foreground hover:bg-action/90 font-semibold rounded-full"
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
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
                  Nos <span className="not-italic text-primary">gammes</span> complètes
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
                        <p className="text-xs not-italic text-primary/80 mb-4">NB : {pack.note}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <span className="font-heading text-xl text-primary">
                          {pack.price.toLocaleString()} FCFA
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAddPack(pack)}
                          className="bg-action text-action-foreground hover:bg-action/90 rounded-full font-semibold"
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          Ajouter
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
