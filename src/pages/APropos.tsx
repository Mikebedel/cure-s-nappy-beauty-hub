import { Heart, Target, Eye, Leaf, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";

const APropos = () => {
  return (
    <div className="min-h-screen">
      <PageHero eyebrow="La marque" title="À propos" description="Découvrez l'histoire et la vision de Cure's Nappy." />

      {/* Histoire */}
      <section className="section">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="eyebrow">Notre histoire</span>
          <h2 className="font-heading font-bold mt-3 mb-6">Née à Abidjan, pour vous</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Cure's Nappy est née d'un constat simple : les femmes africaines méritent des produits capillaires 
            conçus spécifiquement pour leurs cheveux et leur environnement. Trop longtemps, les produits 
            disponibles sur le marché n'étaient pas adaptés aux cheveux crépus ni au climat tropical.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Fondée à Abidjan, notre marque s'est donnée pour mission de créer des soins naturels, efficaces 
            et accessibles qui célèbrent la beauté des cheveux naturels. Chaque formule est pensée pour 
            répondre aux défis spécifiques du climat africain : humidité, chaleur et pollution.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section bg-secondary/60">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="surface text-center p-8">
              <Eye className="h-7 w-7 text-primary mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-xl font-bold mb-3">Notre Vision</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Devenir la marque de référence en soins capillaires naturels en Afrique de l'Ouest, 
                en valorisant la beauté des cheveux crépus et bouclés.
              </p>
            </div>
            <div className="surface text-center p-8">
              <Target className="h-7 w-7 text-accent mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-xl font-bold mb-3">Notre Mission</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Aider les femmes à aimer et prendre soin de leurs cheveux naturels grâce à des produits 
                simples, efficaces et adaptés à leur quotidien.
              </p>
            </div>
            <div className="surface text-center p-8">
              <Heart className="h-7 w-7 text-action mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-xl font-bold mb-3">Nos Valeurs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Authenticité, naturalité, accessibilité et célébration de la beauté africaine 
                sous toutes ses formes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="section">
        <div className="container mx-auto text-center">
          <span className="eyebrow">Nos engagements</span>
          <h2 className="font-heading font-bold mt-3 mb-10">Ce qui nous différencie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Leaf, title: "Ingrédients naturels", desc: "Karité, baobab, moringa... Nous privilégions les richesses du continent africain." },
              { icon: Users, title: "Pour nos cheveux", desc: "Chaque formule est testée et approuvée par des femmes aux cheveux crépus et bouclés." },
              { icon: Award, title: "Qualité premium", desc: "Des standards élevés de fabrication pour des résultats visibles dès la première utilisation." },
            ].map((item, i) => (
              <div key={i} className="surface p-7">
                <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto pb-8">
        <div className="rounded-[2rem] bg-primary text-primary-foreground text-center px-6 py-14 md:py-16">
          <h2 className="font-heading font-bold mb-6">
            Prête à révéler la force de vos cheveux ?
          </h2>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/boutique">Découvrir nos produits</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default APropos;
