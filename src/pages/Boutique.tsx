import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productMatchesCategory } from "@/data/products";
import { useCatalog, useContent } from "@/content/ContentProvider";
import Highlight from "@/content/Highlight";
import { Button } from "@/components/ui/button";
import { GammesSection, DuosSection, AccessoriesSection } from "@/components/CollectionSections";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import BoutiqueSpotlight from "@/components/BoutiqueSpotlight";

const Boutique = () => {
  const { products, categories: gammes } = useCatalog();
  const heading = useContent().content.shop.catalogHeading;
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

  const filtered = useMemo(
    () => (activeFilter === "all" ? products : products.filter((p) => productMatchesCategory(p, activeFilter))),
    [activeFilter, products],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* HAUT DE PAGE : 3 soins à l'affiche qui défilent */}
      <BoutiqueSpotlight />

      <nav aria-label="Collections" className="container mx-auto flex flex-wrap gap-2 pt-8">
        {[{ id: "catalogue", label: "Tous les soins" }, { id: "gammes", label: "Nos Gammes" }, { id: "duos", label: "Nos Duos et Trio" }, { id: "accessoires", label: "Accessoires" }].map(section => <Button key={section.id} asChild variant="outline" className="rounded-full bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary"><a href={`#${section.id}`}>{section.label}</a></Button>)}
      </nav>

      {/* CATALOGUE */}
      <section id="catalogue" className="container mx-auto pt-12 pb-16 md:pb-24 scroll-mt-24">
        <SectionHeading eyebrow={heading.eyebrow} title={<Highlight title={heading.title} highlight={heading.highlight} />} className="!mb-8"
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
