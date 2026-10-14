import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useState } from "react";
import { ShoppingBag, Plus } from "lucide-react";
import { gammePacks, packToProduct, products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const GammesSection = () => {
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  return (
    <section id="gammes" className="bg-secondary/50 border-y border-border scroll-mt-24">
      <div className="container mx-auto px-4 py-12">
        <h2 className="font-heading text-3xl font-bold mb-7">Nos Gammes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {gammePacks.map(pack => (
            <article key={pack.id} className="flex flex-col min-w-0 bg-card border border-border rounded-md overflow-hidden">
              <div className="aspect-square overflow-hidden bg-muted"><img src={pack.image} alt={pack.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" /></div>
              <div className="p-3 flex flex-col flex-1 gap-3">
                <h3 className="font-heading font-bold text-sm leading-5 min-h-10">{pack.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 min-h-12">{pack.description}</p>
                <details className="text-xs text-muted-foreground"><summary className="cursor-pointer text-primary">Les {pack.contains.length} soins inclus</summary><ul className="mt-2 space-y-1">{pack.contains.map(item => <li key={item}>{item}</li>)}</ul>{pack.note && <p className="mt-2">{pack.note}</p>}</details>
                <p className="font-bold text-primary mt-auto">{pack.price.toLocaleString("fr-FR")} FCFA</p>
                <Button size="sm" className="w-full bg-action text-action-foreground hover:bg-action/90" onClick={() => { addToCart(packToProduct(pack)); openCart(); }}><ShoppingBag />Ajouter</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

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
      <div className="grid md:grid-cols-[1fr_1fr_0.8fr] gap-6 items-center max-w-4xl">
        {[{ product: first, value: firstId, set: setFirstId, other: secondId }, { product: second, value: secondId, set: setSecondId, other: firstId }].map((slot, index) => (
          <div key={index} className="min-w-0">
            <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden mb-3"><img src={slot.product.image} alt={slot.product.name} className="w-full h-full object-contain" loading="lazy" /></div>
            <Select value={slot.value} onValueChange={slot.set}><SelectTrigger aria-label={`Soin ${index + 1} du duo`}><SelectValue /></SelectTrigger><SelectContent>{products.filter(product => product.id !== slot.other).map(product => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}</SelectContent></Select>
          </div>
        ))}
        <div className="space-y-4">
          <Plus className="text-primary h-5 w-5" />
          <h3 className="font-heading text-xl font-bold">Votre duo sur mesure</h3>
          <p className="text-sm text-muted-foreground">Deux soins au choix, au prix de chaque produit.</p>
          <p className="text-xl font-bold text-primary">{(first.price + second.price).toLocaleString("fr-FR")} FCFA</p>
          <Button className="bg-action text-action-foreground hover:bg-action/90" onClick={() => { addToCart(first); addToCart(second); openCart(); }}><ShoppingBag />Ajouter le duo</Button>
        </div>
      </div>
    </section>
  );
};