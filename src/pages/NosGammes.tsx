import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gammes, products } from "@/data/products";

const gammeDescriptions: Record<string, { description: string; objectif: string }> = {
  hydratation: {
    description: "Des crèmes et masques riches en beurre de karité et aloe vera pour hydrater intensément et apporter du volume à vos cheveux.",
    objectif: "Apporter et maintenir l'hydratation des cheveux crépus et bouclés, même dans les climats chauds et humides.",
  },
  croissance: {
    description: "Des huiles concentrées en biotine, huile de ricin et extraits naturels pour stimuler la pousse et renforcer les racines.",
    objectif: "Accélérer la croissance capillaire, prévenir la chute et fortifier les cheveux de la racine aux pointes.",
  },
  fortifiant: {
    description: "Des soins fortifiants à base de poudres naturelles et d'huiles africaines pour renforcer la fibre capillaire et prévenir la casse.",
    objectif: "Fortifier et épaissir les cheveux fragilisés pour une chevelure plus résistante.",
  },
  soin: {
    description: "Des shampooings doux et bains d'huile pour nettoyer en douceur tout en nourrissant le cuir chevelu et la fibre capillaire.",
    objectif: "Nettoyer et revitaliser les cheveux sans les agresser, en préservant leur hydratation naturelle.",
  },
  quotidien: {
    description: "Des sprays et soins sans rinçage légers pour démêler, hydrater et sublimer vos cheveux au quotidien.",
    objectif: "Simplifier votre routine capillaire avec des produits multi-usage faciles à utiliser chaque jour.",
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
            5 gammes spécialisées pour répondre à chaque besoin de vos cheveux naturels.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 space-y-16">
        {gammes.map((g, i) => {
          const gammeProducts = products.filter((p) => p.gamme === g.id);
          const info = gammeDescriptions[g.id];
          const isEven = i % 2 === 0;

          return (
            <section key={g.id} className={`rounded-2xl p-8 md:p-12 ${isEven ? "bg-secondary" : "bg-card border border-border"}`}>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className={isEven ? "" : "md:order-2"}>
                  <span className="text-4xl">{g.icon}</span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mt-3 mb-2">{g.name}</h2>
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
                  <h3 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-primary">
                    Produits de la gamme
                  </h3>
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
