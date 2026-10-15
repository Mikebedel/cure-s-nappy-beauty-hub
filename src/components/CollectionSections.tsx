import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useState } from "react";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { gammePacks, packToProduct, products, GammePack } from "@/data/products";
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
      <h2 className="font-heading text-3xl font-bold mb-7">Nos Duos</h2>
      <article className="product-card max-w-sm overflow-hidden rounded-md border border-border bg-card">
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
    </section>
  );
};