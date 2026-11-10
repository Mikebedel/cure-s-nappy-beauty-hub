import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { products, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { Button } from "@/components/ui/button";

type Spotlight = {
  productId: string;
  hook: string;
  intro: string;
  benefitsIntro: string;
  benefits: string[];
  tip: { title: string; text: string };
  usage: string[];
};

/** Les 3 soins qui défilent en haut de la boutique. */
const spotlights: Spotlight[] = [
  {
    productId: "8",
    hook: "Tu rêves de cheveux plus longs, plus denses et plus forts ?",
    intro: "L’Huile Extra Pousse Cure’s Nappy est conçue pour stimuler naturellement la pousse rapide et aider tes cheveux à révéler tout leur potentiel.",
    benefitsIntro: "Grâce à sa composition riche en huiles végétales puissantes, elle :",
    benefits: [
      "Stimule la circulation sanguine du cuir chevelu",
      "Nourrit profondément le bulbe capillaire",
      "Aide à réduire la chute et la casse",
      "Favorise une pousse saine, rapide et régulière",
    ],
    tip: { title: "Le vrai secret ? La régularité + le massage du cuir chevelu.", text: "Quelques minutes de massage permettent de mieux activer la circulation et d’optimiser l’action de l’huile." },
    usage: [
      "Applique quelques gouttes directement sur le cuir chevelu et la devanture.",
      "Masse délicatement pendant 3 à 5 minutes pour stimuler la circulation sanguine.",
      "À utiliser quotidiennement ou tous les 2 jours pour de meilleurs résultats.",
    ],
  },
  {
    productId: "13",
    hook: "Tu rêves de boucles bien dessinées qui tiennent toute la journée ?",
    intro: "La Crème Bouclante Cure’s Nappy est une crème coiffante qui définit parfaitement tes boucles, pour des boucles sublimes et bien dessinées.",
    benefitsIntro: "Enrichie en beurre de karité, huile de coco et aloe vera, elle :",
    benefits: [
      "Définit les boucles",
      "Assure une tenue longue durée",
      "Limite les frisottis",
      "Apporte une brillance naturelle",
    ],
    tip: { title: "Le vrai secret ? Des cheveux humides et des petites mèches.", text: "Appliquée mèche par mèche sur cheveux humides, la crème se répartit mieux et chaque boucle se forme plus nettement." },
    usage: [
      "Applique la crème sur cheveux humides, mèche par mèche.",
      "Froisse les boucles vers le haut pour les dessiner.",
      "Laisse sécher sans manipuler pour garder la définition.",
    ],
  },
  {
    productId: "7",
    hook: "Tes cheveux sont secs, ternes ou abîmés ?",
    intro: "Le Masque Hydratant & Protéiné combine hydratation et protéines pour restaurer les cheveux abîmés, avec des résultats visibles dès la première utilisation.",
    benefitsIntro: "Avec sa protéine de soie, son beurre de karité et son huile d’avocat, il :",
    benefits: [
      "Hydrate en profondeur",
      "Nourrit 2 fois plus",
      "Sublime les cheveux",
      "Laisse une douceur extrême",
    ],
    tip: { title: "Le vrai secret ? La chaleur du bonnet.", text: "Laisser poser le masque sous un bonnet aide les soins à mieux pénétrer la fibre capillaire." },
    usage: [
      "Applique généreusement sur cheveux lavés.",
      "Laisse poser 30 minutes sous un bonnet.",
      "Rince abondamment.",
    ],
  },
];

const DELAY = 8000;

const Slide = ({ spotlight, product, active }: { spotlight: Spotlight; product: Product; active: boolean }) => {
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  return (
    // Toutes les diapositives occupent la même case : la hauteur reste stable d'un produit à l'autre.
    <div
      aria-hidden={!active}
      className={`[grid-area:1/1] grid md:grid-cols-2 gap-10 lg:gap-16 items-center transition-[opacity,visibility,transform] duration-700 ease-out ${active ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-3"}`}
    >
      <div className="flex flex-col">
        <span className="eyebrow eyebrow--light mb-4">Le soin du moment</span>
        <h1 className="font-heading font-bold leading-tight mb-4">{product.name}</h1>
        <p className="text-lg text-accent mb-4">{spotlight.hook}</p>
        <p className="text-primary-foreground/85 mb-5 leading-relaxed">{spotlight.intro}</p>
        <p className="text-primary-foreground/85 mb-3">{spotlight.benefitsIntro}</p>
        <ul className="space-y-2 mb-6 text-primary-foreground/85">
          {spotlight.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2"><Check className="h-4 w-4 shrink-0 mt-1 text-accent" />{benefit}</li>
          ))}
        </ul>
        <div className="rounded-2xl bg-primary-foreground/10 p-5 mb-6">
          <p className="font-semibold text-accent mb-2">{spotlight.tip.title}</p>
          <p className="text-primary-foreground/85 leading-relaxed">{spotlight.tip.text}</p>
        </div>
        <h2 className="text-xl font-bold mb-3">Comment l’utiliser ?</h2>
        <ul className="list-disc pl-5 space-y-2 text-primary-foreground/85 mb-7">
          {spotlight.usage.map((step) => <li key={step}>{step}</li>)}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { addToCart(product); openCart(); }}>
            <ShoppingBag /> Commande dès maintenant !
          </Button>
          <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link to={`/produit/${product.id}`}>Voir le soin <ArrowRight /></Link>
          </Button>
        </div>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] shadow-lift bg-muted">
        <img src={product.image} alt={product.name} loading={active ? "eager" : "lazy"} className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${active ? "scale-100" : "scale-105"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 bg-deep/80 backdrop-blur-md p-5 rounded-2xl">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-2">Soin du moment</div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="font-heading text-2xl leading-tight">{product.name}</div>
              <div className="text-accent font-semibold mt-1">{product.price.toLocaleString("fr-FR")} FCFA</div>
            </div>
            {product.volume && <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-sm">{product.volume}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Haut de la boutique : 3 soins à l'affiche qui défilent. */
const BoutiqueSpotlight = () => {
  const items = spotlights.flatMap((spotlight) => {
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
        <div className="container mx-auto relative z-10 pt-12 pb-8 md:pt-20 md:pb-10">
          <div className="grid">
            {items.map(({ spotlight, product }, i) => (
              <Slide key={product.id} spotlight={spotlight} product={product} active={i === index} />
            ))}
          </div>

          {/* Navigation entre les 3 soins */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6">
            <div className="flex flex-wrap gap-2">
              {items.map(({ product }, i) => (
                <button
                  key={product.id}
                  type="button"
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-colors ${i === index ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"}`}
                >
                  {product.name}
                  {i === index && (
                    <span key={`${index}-${paused}`} aria-hidden="true" className="hero-dot-fill absolute left-0 bottom-0 h-0.5 w-full bg-accent" style={{ animationDuration: `${DELAY}ms`, animationPlayState: paused ? "paused" : "running" }} />
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
