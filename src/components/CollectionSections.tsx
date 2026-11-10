import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useState } from "react";
import { ShoppingBag, ChevronDown, Check, MessageCircle } from "lucide-react";
import { gammePacks, duoPacks, accessories, packToProduct, GammePack, Accessory } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const RangeCard = ({ pack }: { pack: GammePack }) => {
  const [expanded, setExpanded] = useState(false);
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  return (
    <article className="product-card flex flex-col min-w-0 bg-card border border-border/80 rounded-3xl overflow-hidden p-2">
      <div className="aspect-square overflow-hidden bg-muted rounded-2xl"><img src={pack.image} alt={pack.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105" /></div>
      <div className="px-2 pt-4 pb-2 sm:px-3 flex flex-col gap-3">
        <h3 className="font-heading font-semibold text-base sm:text-lg leading-6 min-h-12">{pack.name}</h3>
        <p className="text-sm text-muted-foreground leading-6">{pack.description}</p>
        <Button variant="ghost" aria-expanded={expanded} aria-controls={`contains-${pack.id}`} className="justify-between px-0 text-primary whitespace-normal text-left rounded-none hover:bg-transparent hover:text-primary/80" onClick={() => setExpanded(value => !value)}>
          Les {pack.contains.length} soins inclus <ChevronDown className={expanded ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"} />
        </Button>
        <div id={`contains-${pack.id}`} className="range-content" data-open={expanded} aria-hidden={!expanded}>
          <div><ul className="text-sm text-muted-foreground space-y-2 pb-3">{pack.contains.map(item => <li key={item} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{item}</li>)}</ul>{pack.note && <p className="text-sm text-muted-foreground pb-3">{pack.note}</p>}</div>
        </div>
        <p className="font-heading font-bold text-lg text-primary">{pack.price.toLocaleString("fr-FR")} FCFA</p>
        <Button className="w-full" onClick={() => { addToCart(packToProduct(pack)); openCart(); }}><ShoppingBag />Ajouter</Button>
      </div>
    </article>
  );
};

export const GammesSection = () => (
  <section id="gammes" className="section scroll-mt-24 reveal-section">
    <div className="container mx-auto">
      <SectionHeading eyebrow="Routines complètes" title={<>Nos <span className="text-primary">Gammes</span></>} description="Chaque gamme réunit les soins qui vont ensemble pour un objectif capillaire précis." />
      <div className="product-grid items-start">{gammePacks.map(pack => <RangeCard key={pack.id} pack={pack} />)}</div>
    </div>
  </section>
);

export const DuosSection = () => (
  <section id="duos" className="section bg-secondary/60 scroll-mt-24">
    <div className="container mx-auto">
      <SectionHeading eyebrow="Les combos" title={<>Nos Duos <span className="text-primary">et Trio</span></>} description="Des associations de soins pensées pour agir ensemble." />
      <div className="product-grid product-grid--3">
        {duoPacks.map(pack => <RangeCard key={pack.id} pack={pack} />)}
      </div>
    </div>
  </section>
);

const setTools = [
  {
    title: "Brosse à shampoing en silicone",
    points: ["Masse délicatement le cuir chevelu", "Aide à décoller les résidus et impuretés", "Stimule la microcirculation grâce au massage", "Transforme le shampoing en moment de détente, sans abîmer tes ongles"],
  },
  {
    title: "Brosse en paille de blé",
    points: ["Facilite le coiffage", "Répartit uniformément les soins et produits hydratants", "Convient aux cheveux naturels, bouclés, crépus ou défrisés", "Coiffage doux, sans tirer sur les cheveux"],
  },
  {
    title: "Peigne à dents larges",
    points: ["Démêle en douceur les cheveux épais et texturés", "Respecte la forme naturelle des boucles", "Limite les tiraillements et la casse", "Parfait sur cheveux humides ou pendant un masque"],
  },
];

const AccessoryCard = ({ item }: { item: Accessory }) => {
  const [color, setColor] = useState(0);
  const current = item.colors[color];
  return (
    <article className="surface overflow-hidden p-2 md:p-3">
      <div className="grid md:grid-cols-2 gap-2 md:gap-8 items-center">
        <div className="aspect-square overflow-hidden bg-muted rounded-2xl"><img key={current.image} src={current.image} alt={`${item.name} — ${current.name}`} className="w-full h-full object-cover animate-fade-in" /></div>
        <div className="p-4 md:p-6 md:pl-0 flex flex-col gap-5">
          <h3 className="font-heading font-bold text-2xl md:text-3xl leading-tight">{item.name}</h3>
          <p className="text-muted-foreground leading-7">Le set d'accessoires qui change tout dans ta routine capillaire : une brosse à shampoing en silicone, une brosse en paille de blé et un peigne à dents larges, réunis dans un sac Cure's Nappy personnalisé.</p>
          <p className="text-muted-foreground leading-7">Tu prends soin de tes cheveux avec de bons produits, mais utilises-tu aussi les bons outils ? Une belle routine ne s'arrête pas aux soins.</p>
          <div>
            <p className="text-sm font-semibold mb-2">Couleur : {current.name}</p>
            <div className="flex gap-3">
              {item.colors.map((c, i) => (
                <button key={c.name} type="button" aria-label={c.name} aria-pressed={i === color} onClick={() => setColor(i)}
                  className={`h-10 w-10 rounded-full border-2 ring-offset-2 ring-offset-card transition-all hover:scale-110 ${i === color ? "border-card ring-2 ring-primary" : "border-border"}`}
                  style={{ background: c.swatch }} />
              ))}
            </div>
          </div>
          {item.price !== null && <p className="font-heading font-bold text-xl text-primary">{item.price.toLocaleString("fr-FR")} FCFA</p>}
          <Button asChild size="lg" className="w-full sm:w-fit"><a href={`https://wa.me/2250100848479?text=${encodeURIComponent(`Bonjour, je souhaite commander le ${item.name} (couleur ${current.name}).`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle />Commander sur WhatsApp</a></Button>
        </div>
      </div>

      {/* Détail du set : toujours visible, un outil par colonne */}
      <div className="p-4 md:p-6 pt-8 md:pt-10">
        <h4 className="font-heading font-semibold text-lg mb-5">Ce que contient le set</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {setTools.map((tool, index) => (
            <div key={tool.title} className="rounded-2xl bg-secondary/70 p-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading font-bold mb-3">{index + 1}</span>
              <p className="font-heading font-semibold text-foreground mb-3">{tool.title}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tool.points.map(point => <li key={point} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{point}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-muted-foreground leading-7"><span className="font-semibold text-foreground">Pourquoi on l'adore ?</span> Ce set réunit les essentiels pour laver, démêler, coiffer et entretenir tes cheveux. Le petit plus : un joli sac Cure's Nappy pour les ranger, les protéger et les emporter partout.</p>
      </div>
    </article>
  );
};

export const AccessoriesSection = () => (
  <section id="accessoires" className="section scroll-mt-24">
    <div className="container mx-auto">
      <SectionHeading eyebrow="Les bons outils" title="Accessoires" />
      <div className="grid gap-6">{accessories.map(item => <AccessoryCard key={item.id} item={item} />)}</div>
    </div>
  </section>
);
