import { BookOpen, Droplets, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

const articles = [
  {
    icon: Droplets,
    title: "Comment hydrater les cheveux crépus",
    content: "L'hydratation est la base de toute routine capillaire pour cheveux crépus. La méthode LOC (Liquid, Oil, Cream) est idéale : commencez par vaporiser de l'eau ou un leave-in à base d'eau sur vos cheveux, puis scellez avec une huile légère comme l'huile de jojoba, et terminez avec une crème hydratante au beurre de karité. Répétez tous les 2-3 jours pour maintenir l'hydratation.",
    tips: ["Utiliser un vaporisateur d'eau + aloe vera", "Hydrater sur cheveux humides, jamais secs", "Dormir avec un bonnet en satin"],
  },
  {
    icon: BookOpen,
    title: "Routine cheveux naturels : le guide complet",
    content: "Une routine simple et efficace se compose de 4 étapes : le lavage (1 fois par semaine avec un shampooing doux sans sulfate), le soin profond (masque 30 min sous bonnet), l'hydratation (leave-in + crème) et le scellage (huile ou beurre). Adaptez la fréquence à votre type de cheveux et au climat.",
    tips: ["Faire un pré-poo avant le shampooing", "Démêler uniquement sur cheveux mouillés et avec un soin", "Protéger vos cheveux la nuit"],
  },
  {
    icon: AlertTriangle,
    title: "5 erreurs à éviter avec les cheveux crépus",
    content: "Les erreurs les plus courantes sont : utiliser des produits contenant des sulfates et silicones agressifs, négliger l'hydratation, peigner les cheveux secs, appliquer trop de chaleur, et ne pas protéger les cheveux la nuit. Ces habitudes fragilisent la fibre capillaire et causent la casse.",
    tips: ["Lire les étiquettes de vos produits", "Limiter l'utilisation du sèche-cheveux", "Faire des coiffures protectrices régulièrement"],
  },
  {
    icon: TrendingUp,
    title: "Conseils pour accélérer la pousse des cheveux",
    content: "La pousse des cheveux dépend de plusieurs facteurs : une alimentation riche en biotine et zinc, un cuir chevelu sain (massages réguliers à l'huile de ricin), une hydratation constante, et la réduction de la manipulation excessive. Les coiffures protectrices comme les twists et les tresses permettent de retenir la longueur.",
    tips: ["Masser le cuir chevelu 5 min chaque soir", "Couper les pointes fourchues tous les 3 mois", "Boire suffisamment d'eau"],
  },
  {
    icon: Sparkles,
    title: "Comment définir ses boucles naturellement",
    content: "Pour de belles boucles définies, appliquez un gel définisseur sur cheveux bien hydratés et mouillés, section par section. Utilisez la technique du finger coiling ou du shingling pour plus de définition. Laissez sécher à l'air libre ou au diffuseur à basse température. Cassez le gel une fois sec pour un fini souple.",
    tips: ["Ne pas toucher les cheveux pendant le séchage", "Utiliser un gel sans alcool", "Appliquer sur petites sections pour plus de définition"],
  },
];

const Conseils = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Conseils Capillaires
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">
            Guides et astuces pour prendre soin de vos cheveux naturels au quotidien.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 max-w-3xl space-y-8">
        {articles.map((article, i) => (
          <article key={i} className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <article.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-bold">{article.title}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-5">{article.content}</p>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm font-semibold text-primary mb-2">💡 Nos astuces</p>
              <ul className="space-y-1">
                {article.tips.map((tip, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Conseils;
