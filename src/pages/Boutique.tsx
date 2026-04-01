import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products, gammes } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const Boutique = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGamme = searchParams.get("gamme") || "all";

  const filtered = activeGamme === "all" 
    ? products 
    : products.filter((p) => p.gamme === activeGamme);

  return (
    <div className="min-h-screen">
      {/* Header */}
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

      <div className="container mx-auto py-10">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button
            onClick={() => setSearchParams({})}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeGamme === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            Tous les produits
          </button>
          {gammes.map((g) => (
            <button
              key={g.id}
              onClick={() => setSearchParams({ gamme: g.id })}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeGamme === g.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary"
              }`}
            >
              {g.icon} {g.name}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boutique;
