import { Link } from "react-router-dom";
import { Sparkles, Lightbulb, ShieldAlert, AlertTriangle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const conseils = [
  {
    icon: ShieldAlert,
    title: "Comment éviter la chute des cheveux",
    intro: "La chute capillaire peut résulter du stress, d'une mauvaise alimentation, de coiffures trop serrées ou d'un cuir chevelu mal entretenu.",
    tips: [
      "Évitez les tresses et tissages trop serrés qui tirent sur les racines",
      "Massez votre cuir chevelu avec l'Huile Extra Pousse 3 à 4 fois par semaine",
      "Adoptez une alimentation riche en protéines, fer, biotine et zinc",
      "Faites des cures régulières avec le Masque Fortifiant à base de poudres africaines",
      "Limitez la chaleur (sèche-cheveux, lisseur) qui fragilise la fibre",
    ],
  },
  {
    icon: Sparkles,
    title: "Comment éviter les pellicules",
    intro: "Les pellicules sont souvent causées par un déséquilibre du cuir chevelu, un excès de sébum ou un champignon.",
    tips: [
      "Lavez vos cheveux 1 fois par semaine avec le Shampoing Doux & Clarifiant",
      "Évitez l'eau trop chaude qui assèche le cuir chevelu",
      "Massez délicatement le cuir chevelu pendant le shampoing",
      "Hydratez régulièrement avec le Magical Spray",
      "Évitez les produits contenant des sulfates et silicones agressifs",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Les défrisants : sources de plusieurs maladies",
    intro: "Les défrisants chimiques (notamment ceux contenant du formaldéhyde et de l'hydroxyde de sodium) sont aujourd'hui pointés du doigt par la science.",
    tips: [
      "Risque accru de cancer de l'utérus et du sein selon plusieurs études récentes",
      "Brûlures du cuir chevelu, alopécie cicatricielle et chute permanente",
      "Affaiblissement durable de la fibre capillaire",
      "Perturbations endocriniennes liées aux produits chimiques",
      "Préférez les soins naturels Cure's Nappy pour préserver vos cheveux et votre santé",
    ],
  },
  {
    icon: Lightbulb,
    title: "Les principales maladies du cuir chevelu",
    intro: "Connaître les maladies capillaires permet de mieux les prévenir et les traiter à temps.",
    tips: [
      "Alopécie de traction : causée par les coiffures tirées",
      "Dermatite séborrhéique : pellicules grasses + démangeaisons",
      "Pelade (alopecia areata) : perte de cheveux par plaques",
      "Trichorrexie noueuse : cheveux qui se cassent en nœuds",
      "Folliculite : inflammation des follicules pileux — consultez un dermatologue en cas de doute",
    ],
  },
];

const Conseils = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Astuces & Conseils
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto italic">
            "Le meilleur remède pour tous vos bobos capillaires."
          </p>
        </div>
      </section>

      {/* Astuce phare */}
      <section className="container mx-auto py-12 max-w-3xl">
        <div className="mb-3 flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Astuce
        </div>
        <article className="bg-card border border-border rounded-2xl p-6 md:p-10 space-y-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            🌿 Comment Stimuler la Pousse des Cheveux Crépus : Le Guide Complet Cure's Nappy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            La pousse des cheveux ne dépend pas seulement des produits que vous appliquez, mais aussi des gestes
            que vous adoptez au quotidien. Découvrez pourquoi le massage du cuir chevelu est l'étape clé d'une
            routine capillaire réussie.
          </p>

          <div>
            <h3 className="font-heading text-xl font-bold mb-3">🔥 Le problème : quand vos cheveux stagnent</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>❌ Stagnation — Ils ne prennent plus de longueur malgré vos soins</li>
              <li>❌ Cassure — Ils se brisent facilement aux pointes et sur les longueurs</li>
              <li>❌ Rétention — La longueur ne se maintient pas dans le temps</li>
            </ul>
            <p className="italic text-primary mt-3">
              "Hydrater ses cheveux, c'est important. Mais stimuler le cuir chevelu pour favoriser la pousse, c'est essentiel."
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-bold mb-3">💆🏾‍♀️ La solution : le massage capillaire</h3>
            <div className="bg-secondary rounded-lg p-4 space-y-2 text-sm">
              <p>🩸 <strong>Circulation sanguine</strong> — Stimulation des vaisseaux du cuir chevelu</p>
              <p>🌱 <strong>Nutrition des racines</strong> — Meilleur apport en oxygène et nutriments aux follicules</p>
              <p>💪 <strong>Force & épaisseur</strong> — Environnement favorable à une pousse saine</p>
              <p>✨ <strong>Santé globale</strong> — Réduction du stress, équilibre du cuir chevelu</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-xl font-bold mb-3">🌿 L'Huile Extra Pousse : votre allié massage</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              L'Huile Extra Pousse Cure's Nappy transforme le massage en un rituel de soin puissant. Formulée
              spécifiquement pour les cheveux crépus, elle pénètre en profondeur pour nourrir, renforcer et
              accélérer la pousse naturelle.
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>✅ Cheveux plus forts et résistants</li>
              <li>✅ Texture plus épaisse et dense</li>
              <li>✅ Brillance naturelle et vitalité retrouvée</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xl font-bold mb-3">📋 Routine pousse Cure's Nappy : 3 étapes simples</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li><strong>1. Appliquez 🧴</strong> — Versez quelques gouttes d'Huile Extra Pousse sur vos doigts.</li>
              <li><strong>2. Massez 💆🏾‍♀️</strong> — Mouvements circulaires doux pendant 5 à 10 minutes.</li>
              <li><strong>3. Répétez 🔄</strong> — 3 à 4 fois par semaine pour des résultats optimaux.</li>
            </ol>
          </div>

          <div>
            <h3 className="font-heading text-xl font-bold mb-3">🌍 Commandez votre routine partout dans le monde</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>🚚 Livraison terrestre — Côte d'Ivoire & zone UEMOA</li>
              <li>📦 Colis express — Afrique & Europe</li>
              <li>✈️ Livraison aérienne — Monde entier</li>
            </ul>
          </div>

          <div className="bg-primary/5 rounded-lg p-5">
            <p className="font-semibold text-primary mb-2">💚 Pourquoi choisir Cure's Nappy ?</p>
            <p className="text-sm text-muted-foreground italic mb-3">
              "Le meilleur remède pour tous vos bobos capillaires."
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>🌱 Formules naturelles adaptées aux cheveux crépus</li>
              <li>💚 Efficacité prouvée par des milliers de clientes satisfaites</li>
              <li>📱 Conseil personnalisé via WhatsApp au +225 01 00 84 84 79</li>
            </ul>
          </div>

          <Button asChild size="lg" className="w-full bg-primary-light hover:bg-primary-light/90 text-white rounded-md">
            <Link to="/boutique">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Voir la boutique
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground text-center">Article rédigé par l'équipe Cure's Nappy — 13 mai 2026</p>
        </article>
      </section>

      {/* Conseils */}
      <section className="container mx-auto pb-16 max-w-3xl">
        <div className="mb-6 flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
          <Lightbulb className="h-4 w-4" /> Conseils
        </div>
        <div className="space-y-6">
          {conseils.map((c, i) => (
            <article key={i} className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-bold">{c.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">{c.intro}</p>
              <ul className="space-y-1.5">
                {c.tips.map((tip, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Button asChild size="lg" className="w-full bg-primary-light hover:bg-primary-light/90 text-white rounded-md">
            <Link to="/boutique">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Voir la boutique
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Conseils;
