import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { gammes, products, productMatchesCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { GammesSection, DuosSection } from "@/components/CollectionSections";

const NosGammes = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 pt-32 pb-12 text-center">
          <div className="flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase text-accent mb-6">
            <span className="h-px w-8 bg-accent" />
            Cure&apos;s Nappy · Nos Gammes
            <span className="h-px w-8 bg-accent" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-4">
            Nos Gammes
          </h1>
          <p className="text-primary-foreground/90 max-w-xl mx-auto">
            Chaque gamme rassemble les soins essentiels pour atteindre un objectif capillaire précis.
            Économisez en commandant la routine complète.
          </p>
        </div>
      </section>

      <GammesSection />
      <DuosSection />

      {/* THEMATIC PRODUCT SECTIONS (ascending price) */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4 py-16 space-y-16">
          <div className="text-center">
            <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Thématiques</div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Soins par <span className="not-italic text-primary">objectif capillaire</span>
            </h2>
          </div>

          {gammes.map((g) => {
            const gProducts = products
              .filter((p) => productMatchesCategory(p, g.id))
              .sort((a, b) => a.price - b.price);
            if (gProducts.length === 0) return null;
            return (
              <div key={g.id}>
                <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
                      {g.name}
                    </h3>

                  </div>
                  <Link
                    to={`/boutique?gamme=${g.id}`}
                    className="text-xs tracking-widest uppercase text-primary hover:text-action inline-flex items-center gap-1 font-semibold"
                  >
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="product-grid">
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
