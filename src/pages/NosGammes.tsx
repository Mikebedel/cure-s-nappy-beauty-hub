import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { gammes, products, productMatchesCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { GammesSection, DuosSection } from "@/components/CollectionSections";

const NosGammes = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="Cure's Nappy" title="Nos Gammes" description="Chaque gamme rassemble les soins essentiels pour atteindre un objectif capillaire précis. Économisez en commandant la routine complète." />

      <GammesSection />
      <DuosSection />

      {/* THEMATIC PRODUCT SECTIONS (ascending price) */}
      <section className="section">
        <div className="container mx-auto space-y-14">
          <SectionHeading align="center" eyebrow="Thématiques" title={<>Soins par <span className="text-primary">objectif capillaire</span></>} className="!mb-0" />

          {gammes.map((g) => {
            const gProducts = products
              .filter((p) => productMatchesCategory(p, g.id))
              .sort((a, b) => a.price - b.price);
            if (gProducts.length === 0) return null;
            return (
              <div key={g.id}>
                <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold">
                      {g.name}
                    </h3>

                  </div>
                  <Link
                    to={`/boutique?gamme=${g.id}`}
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1.5 font-semibold"
                  >
                    Voir tout <ArrowRight className="h-4 w-4" />
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
