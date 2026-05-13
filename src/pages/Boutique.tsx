import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { products, gammes, gammePacks } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const Boutique = () => {
  const [searchParams] = useSearchParams();
  const initialGamme = searchParams.get("gamme");
  const [productsOpen, setProductsOpen] = useState(true);
  const [gammesOpen, setGammesOpen] = useState(true);
  const [openGamme, setOpenGamme] = useState<string | null>(initialGamme);

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Notre Boutique
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">
            Découvrez nos soins capillaires naturels formulés pour sublimer vos cheveux.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-10 space-y-8">
        {/* Tous les produits — menu déroulant par thématique */}
        <Collapsible open={productsOpen} onOpenChange={setProductsOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-6 py-4 hover:bg-primary/90 transition-colors">
            <h2 className="font-heading text-xl md:text-2xl font-bold">Tous les produits</h2>
            <ChevronDown className={`h-5 w-5 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-6 space-y-4">
            {gammes.map((g) => {
              const list = products.filter((p) => p.gamme === g.id);
              if (list.length === 0) return null;
              const isOpen = openGamme === g.id;
              return (
                <Collapsible
                  key={g.id}
                  open={isOpen}
                  onOpenChange={(o) => setOpenGamme(o ? g.id : null)}
                >
                  <CollapsibleTrigger className="w-full flex items-center justify-between bg-secondary border border-border rounded-xl px-5 py-3 hover:border-primary transition-colors">
                    <span className="font-heading font-semibold text-left">
                      {g.icon} {g.name}{" "}
                      <span className="text-xs text-muted-foreground font-normal">({list.length})</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {list.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Toutes les gammes — menu déroulant */}
        <Collapsible open={gammesOpen} onOpenChange={setGammesOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-6 py-4 hover:bg-primary/90 transition-colors">
            <h2 className="font-heading text-xl md:text-2xl font-bold">Toutes les gammes</h2>
            <ChevronDown className={`h-5 w-5 transition-transform ${gammesOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gammePacks.map((pack) => (
                <div
                  key={pack.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img src={pack.image} alt={pack.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading text-lg font-bold mb-1">{pack.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>
                    {pack.contains && (
                      <ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
                        {pack.contains.map((c, i) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                    )}
                    {pack.note && (
                      <p className="text-xs italic text-primary/80 mb-3">NB : {pack.note}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-primary">{pack.price.toLocaleString()} FCFA</span>
                      <Button size="sm" asChild className="bg-action text-action-foreground hover:bg-action/90">
                        <a href="https://wa.me/c/2250100848479" target="_blank" rel="noopener noreferrer">
                          Commander
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Boutique;
