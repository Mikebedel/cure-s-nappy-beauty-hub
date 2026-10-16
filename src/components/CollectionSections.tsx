import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useState } from "react";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { gammePacks, duoPacks, accessories, packToProduct, products, GammePack, Accessory } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RangeCard = ({ pack }: { pack: GammePack }) => {
  const [expanded, setExpanded] = useState(false);
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  return (
    <article className="product-card flex flex-col min-w-0 bg-card border border-border rounded-md overflow-hidden">
      <div className="aspect-square overflow-hidden bg-muted"><img src={pack.image} alt={pack.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.02]" /></div>
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-heading font-bold text-base leading-6 min-h-12">{pack.name}</h3>
        <p className="text-[15px] text-muted-foreground leading-6">{pack.description}</p>
        <Button variant="ghost" aria-expanded={expanded} aria-controls={`contains-${pack.id}`} className="justify-between px-0 text-primary whitespace-normal text-left" onClick={() => setExpanded(value => !value)}>
          Les {pack.contains.length} soins inclus <ChevronDown className={expanded ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"} />
        </Button>
        <div id={`contains-${pack.id}`} className="range-content" data-open={expanded} aria-hidden={!expanded}>
          <div><ul className="text-[15px] text-muted-foreground space-y-2 pb-3">{pack.contains.map(item => <li key={item}>{item}</li>)}</ul>{pack.note && <p className="text-sm text-muted-foreground pb-3">{pack.note}</p>}</div>
        </div>
        <p className="font-bold text-lg text-primary">{pack.price.toLocaleString("fr-FR")} FCFA</p>
        <Button className="w-full" onClick={() => { addToCart(packToProduct(pack)); openCart(); }}><ShoppingBag />Ajouter</Button>
      </div>
    </article>
  );
};

export const GammesSection = () => (
  <section id="gammes" className="bg-secondary/50 border-y border-border scroll-mt-24 reveal-section">
    <div className="container mx-auto px-4 py-12">
      <h2 className="font-heading font-bold mb-7">Nos Gammes</h2>
      <div className="product-grid items-start">{gammePacks.map(pack => <RangeCard key={pack.id} pack={pack} />)}</div>
    </div>
  </section>
);

export const DuosSection = () => {
  const [firstId, setFirstId] = useState("8");
  const [secondId, setSecondId] = useState("9");
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  const first = products.find(product => product.id === firstId);
  const second = products.find(product => product.id === secondId);
  if (!first || !second) return null;
  return (
    <section id="duos" className="container mx-auto px-4 py-12 scroll-mt-24">
      <h2 className="font-heading text-3xl font-bold mb-7">Nos Duos et Trio</h2>
      <div className="product-grid items-start">
      {duoPacks.map(pack => <RangeCard key={pack.id} pack={pack} />)}
      <article className="product-card flex flex-col min-w-0 overflow-hidden rounded-md border border-border bg-card">
        <div className="aspect-square grid grid-cols-2 bg-muted">
          {[first, second].map(product => <img key={product.id} src={product.image} alt={product.name} className="w-full h-full min-w-0 object-contain" loading="lazy" />)}
        </div>
        <div className="p-4 flex flex-col gap-4">
          <h3 className="font-heading text-base font-bold">Votre duo sur mesure</h3>
          <p className="text-[15px] text-muted-foreground">Deux soins au choix, au prix de chaque produit.</p>
          {[{ value: firstId, set: setFirstId, other: secondId }, { value: secondId, set: setSecondId, other: firstId }].map((slot, index) => (
            <Select key={index} value={slot.value} onValueChange={slot.set}><SelectTrigger aria-label={`Soin ${index + 1} du duo`} className="h-auto min-h-11 text-left [&>span]:whitespace-normal"><SelectValue /></SelectTrigger><SelectContent>{products.filter(product => product.id !== slot.other).map(product => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}</SelectContent></Select>
          ))}
          <p className="text-lg font-bold text-primary">{(first.price + second.price).toLocaleString("fr-FR")} FCFA</p>
          <Button className="w-full" onClick={() => { addToCart(first); addToCart(second); openCart(); }}><ShoppingBag />Ajouter le duo</Button>
        </div>
      </article>
      </div>
    </section>
  );
};

const AccessoryCard = ({ item }: { item: Accessory }) => {
  const [color, setColor] = useState(0);
  const [open, setOpen] = useState(false);
  const current = item.colors[color];
  return (
    <article className="product-card flex flex-col min-w-0 bg-card border border-border rounded-md overflow-hidden md:col-span-2">
      <div className="grid md:grid-cols-2">
        <div className="aspect-square overflow-hidden bg-muted"><img key={current.image} src={current.image} alt={`${item.name} — ${current.name}`} className="w-full h-full object-cover animate-fade-in" /></div>
        <div className="p-5 flex flex-col gap-4">
          <h3 className="font-heading font-bold text-lg">{item.name}</h3>
          <p className="text-[15px] text-muted-foreground leading-6">Le set d'accessoires qui change tout dans ta routine capillaire : une brosse à shampoing en silicone, une brosse en paille de blé et un peigne à dents larges, réunis dans un sac Cure's Nappy personnalisé.</p>
          <div>
            <p className="text-sm font-semibold mb-2">Couleur : {current.name}</p>
            <div className="flex gap-3">
              {item.colors.map((c, i) => (
                <button key={c.name} type="button" aria-label={c.name} aria-pressed={i === color} onClick={() => setColor(i)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${i === color ? "border-foreground" : "border-border"}`}
                  style={{ background: c.swatch }} />
              ))}
            </div>
          </div>
          <Button variant="ghost" aria-expanded={open} className="justify-between px-0 text-primary" onClick={() => setOpen(v => !v)}>
            Voir le détail du set <ChevronDown className={open ? "rotate-180 transition-transform" : "transition-transform"} />
          </Button>
          <div className="range-content" data-open={open} aria-hidden={!open}>
            <div className="text-[15px] text-muted-foreground space-y-3 pb-3">
              <p>Tu prends soin de tes cheveux avec de bons produits, mais utilises-tu aussi les bons outils ? Une belle routine ne s'arrête pas aux soins.</p>
              <p className="font-semibold text-foreground">1. Brosse à shampoing en silicone</p>
              <ul className="list-disc pl-5 space-y-1"><li>Masse délicatement le cuir chevelu</li><li>Aide à décoller les résidus et impuretés</li><li>Stimule la microcirculation grâce au massage</li><li>Transforme le shampoing en moment de détente, sans abîmer tes ongles</li></ul>
              <p className="font-semibold text-foreground">2. Brosse en paille de blé</p>
              <ul className="list-disc pl-5 space-y-1"><li>Facilite le coiffage</li><li>Répartit uniformément les soins et produits hydratants</li><li>Convient aux cheveux naturels, bouclés, crépus ou défrisés</li><li>Coiffage doux, sans tirer sur les cheveux</li></ul>
              <p className="font-semibold text-foreground">3. Peigne à dents larges</p>
              <ul className="list-disc pl-5 space-y-1"><li>Démêle en douceur les cheveux épais et texturés</li><li>Respecte la forme naturelle des boucles</li><li>Limite les tiraillements et la casse</li><li>Parfait sur cheveux humides ou pendant un masque</li></ul>
              <p><span className="font-semibold text-foreground">Pourquoi on l'adore ?</span> Ce set réunit les essentiels pour laver, démêler, coiffer et entretenir tes cheveux. Le petit plus : un joli sac Cure's Nappy pour les ranger, les protéger et les emporter partout.</p>
            </div>
          </div>
          {item.price !== null && <p className="font-bold text-lg text-primary">{item.price.toLocaleString("fr-FR")} FCFA</p>}
          <Button asChild className="w-full mt-auto"><a href={`https://wa.me/2250100848479?text=${encodeURIComponent(`Bonjour, je souhaite commander le ${item.name} (couleur ${current.name}).`)}`} target="_blank" rel="noopener noreferrer"><ShoppingBag />Commander sur WhatsApp</a></Button>
        </div>
      </div>
    </article>
  );
};

export const AccessoriesSection = () => (
  <section id="accessoires" className="bg-secondary/50 border-t border-border scroll-mt-24">
    <div className="container mx-auto px-4 py-12">
      <h2 className="font-heading text-3xl font-bold mb-7">Accessoires</h2>
      <div className="grid gap-6">{accessories.map(item => <AccessoryCard key={item.id} item={item} />)}</div>
    </div>
  </section>
);