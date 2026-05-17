import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Lightbulb, ShieldAlert, AlertTriangle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

type Item = {
  icon: any;
  title: string;
  intro: string;
  body: React.ReactNode;
};

const astuces: Item[] = [
  {
    icon: Sparkles,
    title: "Stimuler la pousse des cheveux crépus",
    intro: "Le guide complet Cure's Nappy pour relancer la croissance.",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          La pousse ne dépend pas uniquement des produits, mais aussi des gestes quotidiens.
          Le massage du cuir chevelu est l'étape clé d'une routine réussie.
        </p>
        <div>
          <h4 className="font-semibold text-foreground mb-1">🔥 Le problème</h4>
          <ul className="space-y-1">
            <li>❌ Stagnation — Plus de prise de longueur</li>
            <li>❌ Cassure — Pointes fragiles</li>
            <li>❌ Rétention — La longueur ne se maintient pas</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">💆🏾‍♀️ La solution</h4>
          <p>Massage circulaire 5 à 10 min, 3-4 fois par semaine avec l'Huile Extra Pousse.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">📋 Routine 3 étapes</h4>
          <ol className="space-y-1">
            <li>1. Appliquez quelques gouttes d'Huile Extra Pousse</li>
            <li>2. Massez en mouvements circulaires (5-10 min)</li>
            <li>3. Répétez 3-4 fois par semaine</li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    icon: Lightbulb,
    title: "Hydratation longue durée",
    intro: "Le secret pour des cheveux toujours souples.",
    body: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>Méthode LOC (Liquide → Huile → Crème) appliquée chaque semaine :</p>
        <ul className="space-y-1">
          <li>• <strong>L</strong> — Magical Spray sur cheveux humides</li>
          <li>• <strong>O</strong> — Huile 2 en 1 pour sceller l'hydratation</li>
          <li>• <strong>C</strong> — Crème Hydratante & Volume + pour la nutrition</li>
        </ul>
        <p>Rafraîchir au Magical Spray tous les 2-3 jours.</p>
      </div>
    ),
  },
];

const conseils: Item[] = [
  {
    icon: ShieldAlert,
    title: "Comment éviter la chute des cheveux",
    intro: "Stress, alimentation, coiffures serrées : agissez maintenant.",
    body: (
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Évitez tresses et tissages trop serrés</li>
        <li>• Massez avec l'Huile Extra Pousse 3-4 fois par semaine</li>
        <li>• Alimentation riche en protéines, fer, biotine, zinc</li>
        <li>• Cures régulières avec le Masque Fortifiant</li>
        <li>• Limitez la chaleur (sèche-cheveux, lisseur)</li>
      </ul>
    ),
  },
  {
    icon: Sparkles,
    title: "Comment éviter les pellicules",
    intro: "Déséquilibre, sébum, champignon : les bons réflexes.",
    body: (
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Shampoing Doux & Clarifiant 1 fois par semaine</li>
        <li>• Évitez l'eau trop chaude</li>
        <li>• Massez délicatement pendant le shampoing</li>
        <li>• Hydratez régulièrement avec le Magical Spray</li>
        <li>• Évitez sulfates et silicones agressifs</li>
      </ul>
    ),
  },
  {
    icon: AlertTriangle,
    title: "Les défrisants : danger pour la santé",
    intro: "Les études scientifiques tirent la sonnette d'alarme.",
    body: (
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Risque accru de cancer (utérus, sein)</li>
        <li>• Brûlures du cuir chevelu, alopécie cicatricielle</li>
        <li>• Affaiblissement durable de la fibre</li>
        <li>• Perturbations endocriniennes</li>
        <li>• Préférez les soins naturels Cure's Nappy</li>
      </ul>
    ),
  },
  {
    icon: Lightbulb,
    title: "Les maladies du cuir chevelu",
    intro: "Les reconnaître pour mieux les traiter.",
    body: (
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• <strong>Alopécie de traction</strong> — Coiffures tirées</li>
        <li>• <strong>Dermatite séborrhéique</strong> — Pellicules grasses + démangeaisons</li>
        <li>• <strong>Pelade</strong> — Perte par plaques</li>
        <li>• <strong>Trichorrexie noueuse</strong> — Cheveux qui se cassent en nœuds</li>
        <li>• <strong>Folliculite</strong> — Inflammation des follicules</li>
      </ul>
    ),
  },
];

const ItemCard = ({ item }: { item: Item }) => {
  const Icon = item.icon;
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-left bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all group flex flex-col h-full">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
          </div>
          <h3 className="font-heading text-lg font-bold mb-2 leading-tight">{item.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.intro}</p>
          <span className="mt-auto text-xs uppercase tracking-wider font-semibold text-action">
            Lire l'article →
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="font-heading text-xl md:text-2xl text-left">
              {item.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">{item.intro}</DialogDescription>
        </DialogHeader>
        <div className="pt-2">{item.body}</div>
      </DialogContent>
    </Dialog>
  );
};

const Conseils = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 text-center">
        <div className="container mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-3">
            Astuces & <em className="italic text-accent">Conseils</em>
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto italic">
            "Le meilleur remède pour tous vos bobos capillaires."
          </p>
        </div>
      </section>

      {/* ASTUCES */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Astuces
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {astuces.map((item, i) => (
            <ItemCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* CONSEILS */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8 flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
          <Lightbulb className="h-4 w-4" /> Conseils
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {conseils.map((item, i) => (
            <ItemCard key={i} item={item} />
          ))}
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <Button asChild size="lg" className="w-full bg-action text-white hover:bg-action/90 rounded-full font-semibold">
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
