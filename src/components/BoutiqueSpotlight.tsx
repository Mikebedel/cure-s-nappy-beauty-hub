import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import type { SiteContent } from "@/content/types";
import { useCatalog, useContent } from "@/content/ContentProvider";
import { useCart } from "@/contexts/CartContext";
import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { Button } from "@/components/ui/button";

type Spotlight = SiteContent["shop"]["spotlights"][number];

const DELAY = 5000;

const Slide = ({ spotlight, product, active }: { spotlight: Spotlight; product: Product; active: boolean }) => {
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  return (
    // Toutes les diapositives occupent la même case : la hauteur reste stable d'un produit à l'autre.
    <div
      aria-hidden={!active}
      className={`[grid-area:1/1] grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] gap-8 lg:gap-14 items-center transition-[opacity,visibility,transform] duration-500 ease-out ${active ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`}
    >
      <div className="flex flex-col">
        <span className="eyebrow eyebrow--light mb-3">Le soin du moment</span>
        <h1 className="font-heading font-bold leading-tight mb-3 !text-3xl md:!text-[44px]">{product.name}</h1>
        <p className="text-lg text-accent mb-3">{spotlight.hook}</p>
        <p className="text-primary-foreground/85 mb-5 leading-relaxed max-w-xl">{spotlight.intro}</p>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-2 mb-5 text-sm md:text-base text-primary-foreground/90 max-w-xl">
          {spotlight.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2"><Check className="h-4 w-4 shrink-0 mt-1 text-accent" />{benefit}</li>
          ))}
        </ul>
        <p className="rounded-2xl bg-primary-foreground/10 px-4 py-3 mb-6 text-sm text-primary-foreground/90 max-w-xl">
          <span className="font-semibold text-accent">{spotlight.tipTitle}</span>{" "}{spotlight.tipText}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { addToCart(product); openCart(); }}>
            <ShoppingBag /> Commander · {product.price.toLocaleString("fr-FR")} FCFA
          </Button>
          <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link to={`/produit/${product.id}`}>Voir le soin <ArrowRight /></Link>
          </Button>
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[240px] md:max-w-[360px] mx-auto md:mr-0 overflow-hidden rounded-[1.5rem] shadow-lift bg-muted">
        <img src={product.image} alt={product.name} loading={active ? "eager" : "lazy"} className={`w-full h-full object-cover transition-transform duration-[1500ms] ease-out ${active ? "scale-100" : "scale-105"}`} />
        {product.volume && <span className="absolute top-3 right-3 rounded-full bg-background/90 text-foreground px-3 py-1 text-sm font-medium">{product.volume}</span>}
      </div>
    </div>
  );
};

/** Haut de la boutique : 3 soins à l'affiche qui défilent. */
const BoutiqueSpotlight = () => {
  const { content } = useContent();
  const { products } = useCatalog();
  const items = content.shop.spotlights.flatMap((spotlight) => {
    const product = products.find((p) => p.id === spotlight.productId);
    return product ? [{ spotlight, product }] : [];
  });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % items.length), DELAY);
    return () => clearTimeout(timer);
  }, [index, paused, items.length]);

  const go = (step: number) => setIndex((current) => (current + step + items.length) % items.length);
  if (!items.length) return null;
  const shown = index % items.length;

  return (
    <section className="px-3 pt-[88px]">
      <div
        className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground"
        role="group"
        aria-roledescription="diaporama"
        aria-label="Nos soins à l'affiche"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary-foreground)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)/0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container mx-auto relative z-10 pt-8 pb-6 md:pt-12 md:pb-8">
          <div className="grid">
            {items.map(({ spotlight, product }, i) => (
              <Slide key={product.id} spotlight={spotlight} product={product} active={i === shown} />
            ))}
          </div>

          {/* Navigation entre les 3 soins */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-primary-foreground/15 pt-5">
            <div className="flex flex-wrap gap-2">
              {items.map(({ product }, i) => (
                <button
                  key={product.id}
                  type="button"
                  aria-current={i === shown}
                  onClick={() => setIndex(i)}
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-colors ${i === shown ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"}`}
                >
                  {product.name}
                  {i === shown && (
                    <span key={`${shown}-${paused}`} aria-hidden="true" className="hero-dot-fill absolute left-0 bottom-0 h-0.5 w-full bg-accent" style={{ animationDuration: `${DELAY}ms`, animationPlayState: paused ? "paused" : "running" }} />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Soin précédent" onClick={() => go(-1)} className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground hover:text-primary transition-colors"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" aria-label="Soin suivant" onClick={() => go(1)} className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground hover:text-primary transition-colors"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoutiqueSpotlight;
