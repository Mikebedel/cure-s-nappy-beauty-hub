import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gammes, products, gammePacks } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const gammeDescriptions: Record<string, { description: string; objectif: string }> = {
  hydratation: {
    description: "Des crèmes, masques, huiles et sprays riches en beurre de karité et aloe vera pour hydrater intensément et nourrir vos cheveux en profondeur.",
    objectif: "Apporter et maintenir l'hydratation et la nutrition des cheveux crépus et bouclés, même dans les climats chauds et humides.",
  },
  volume: {
    description: "Des huiles concentrées en biotine, huile de ricin et extraits naturels pour stimuler la pousse et apporter du volume aux cheveux.",
    objectif: "Accélérer la croissance capillaire, apporter du volume et de la longueur à vos cheveux.",
  },
  fortifiant: {
    description: "Des soins fortifiants à base de poudres naturelles et d'huiles africaines pour renforcer la fibre capillaire, prévenir la casse et lutter contre la chute.",
    objectif: "Fortifier et épaissir les cheveux fragilisés, lutter contre la chute pour une chevelure plus résistante.",
  },
  soin: {
    description: "Des shampooings doux et nettoyants pour nettoyer en douceur tout en éliminant les pellicules et apaisant les démangeaisons.",
    objectif: "Nettoyer et revitaliser les cheveux sans les agresser, traiter les problèmes de pellicules et de cuir chevelu.",
  },
  boucle: {
    description: "Des crèmes coiffantes spécialement conçues pour définir et sublimer les boucles naturelles de vos cheveux.",
    objectif: "Définir parfaitement vos boucles avec une tenue longue durée et un effet anti-frisottis.",
  },
};

const NosGammes = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Nos Gammes
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">
            Des gammes complètes pour répondre à chaque besoin de vos cheveux naturels.
          </p>
        </div>
      </section>

      {/* Gamme Packs */}
      <section className="container mx-auto py-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-3">
          Nos packs gammes
        </h2>
        <p className="text-muted-foreground text-center max-w-lg mx-auto mb-10">
          Économisez en choisissant une gamme complète adaptée à vos besoins capillaires.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gammePacks.map((pack) => (
            <div
              key={pack.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={pack.image}
                  alt={pack.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold mb-1">{pack.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{pack.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pack.benefits.map((b, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {b}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{pack.price.toLocaleString()} FCFA</span>
                  <Button size="sm" className="bg-action text-action-foreground hover:bg-action/90">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Commander
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gammes par catégorie */}
      <div className="container mx-auto py-12 space-y-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-3">
          Nos catégories de produits
        </h2>
        {gammes.map((g, i) => {
          const gammeProducts = products.filter((p) => p.gamme === g.id);
          const info = gammeDescriptions[g.id];
          const isEven = i % 2 === 0;

          return (
            <section key={g.id} className={`rounded-2xl p-8 md:p-12 ${isEven ? "bg-secondary" : "bg-card border border-border"}`}>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className={isEven ? "" : "md:order-2"}>
                  <span className="text-4xl">{g.icon}</span>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mt-3 mb-2">{g.name}</h3>
                  {info && (
                    <>
                      <p className="text-muted-foreground mb-4">{info.description}</p>
                      <div className="bg-primary/5 rounded-lg p-4 mb-6">
                        <p className="text-sm font-semibold text-primary mb-1">🎯 Objectif capillaire</p>
                        <p className="text-sm text-muted-foreground">{info.objectif}</p>
                      </div>
                    </>
                  )}
                  <Button asChild className="bg-action text-action-foreground hover:bg-action/90">
                    <Link to={`/boutique?gamme=${g.id}`}>
                      Voir les produits
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className={isEven ? "" : "md:order-1"}>
                  <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-primary">
                    Produits de la gamme
                  </h4>
                  <div className="space-y-3">
                    {gammeProducts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/produit/${p.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-primary/5 transition-colors group"
                      >
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">{p.name}</span>
                        <span className="text-sm font-semibold text-primary">{p.price.toLocaleString()} FCFA</span>
                      </Link>
                    ))}
                    {gammeProducts.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">Bientôt disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default NosGammes;
