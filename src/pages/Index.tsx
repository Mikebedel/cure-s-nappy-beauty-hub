import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Sparkles, MessageCircleHeart, Star, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, gammePacks, packToProduct } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import HomeVideo from "@/components/HomeVideo";
import SectionHeading from "@/components/SectionHeading";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@/assets/hero-image.jpg";
import gammeComplete from "@/assets/gamme-complete.jpg";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";
import slide4 from "@/assets/slide-4.jpg";
import slide5 from "@/assets/slide-5.jpg";
import slide6 from "@/assets/slide-6.jpg";

const lifestyleSlides = [slide1, slide2, slide3, slide4, slide5, slide6];
const heroSlides = [heroImage, slide1, slide4, slide3, slide6];
const HERO_DELAY = 5000;

const tickerItems = [
  "Soins capillaires naturels",
  "Formulé à Abidjan",
  "Cheveux crépus & bouclés",
  "Le meilleur remède capillaire",
  "Cure's Nappy",
];

const guarantees = [
  { icon: ShieldCheck, title: "Qualité garantie", desc: "Chaque produit est contrôlé avant expédition." },
  { icon: Truck, title: "Livraison Abidjan", desc: "1 500 à 2 000 FCFA selon votre zone." },
  { icon: Sparkles, title: "Commande simple", desc: "Mobile Money, Fineo Pay, WhatsApp." },
  { icon: MessageCircleHeart, title: "Conseils inclus", desc: "Routines personnalisées pour vos cheveux." },
];

const reviews = [
  { name: "郭佩億", text: "C'est magnifique, j'adore le packaging et les gammes complètes" },
  { name: "Prefinal Maima", text: "Je confirme je suis le témoignage vivant de tout vos produits" },
  { name: "Ago Jackie Emmanuelle Niambe", text: "Le duo qui opère des miracles par possible" },
  { name: "Sophie Koffi", text: "Testez et restez y'a rien même ❤️❤️❤️ Cure's NAPPY_Officiel" },
  { name: "Faithfulness De Jésus", text: "Cure's nappy the best ❤️❤️❤️" },
];

/** Diaporama du haut de page : les photos défilent seules, avec flèches et repères. */
const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % heroSlides.length), HERO_DELAY);
    return () => clearTimeout(timer);
  }, [index, paused]);

  const go = (step: number) => setIndex((current) => (current + step + heroSlides.length) % heroSlides.length);

  return (
    <div
      className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-deep shadow-lift"
      role="group"
      aria-roledescription="diaporama"
      aria-label="Photos Cure's Nappy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heroSlides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? `Cure's Nappy — photo ${i + 1} sur ${heroSlides.length}` : ""}
          aria-hidden={i !== index}
          data-active={i === index}
          loading={i === 0 ? "eager" : "lazy"}
          className="hero-slide"
        />
      ))}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep/70 to-transparent" />

      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-background/20 backdrop-blur-md px-3 py-2.5">
          {heroSlides.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`relative h-1.5 overflow-hidden rounded-full bg-background/50 transition-all duration-300 ${i === index ? "w-8" : "w-1.5 hover:bg-background"}`}
            >
              {i === index && <span className="hero-dot-fill absolute inset-0 rounded-full bg-background" style={{ animationDuration: `${HERO_DELAY}ms`, animationPlayState: paused ? "paused" : "running" }} />}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Photo précédente" onClick={() => go(-1)} className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" aria-label="Photo suivante" onClick={() => go(1)} className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  const featured = products.slice(0, 4);
  const selection = products.slice(4, 8);
  // gammePacks est trié par prix : on cible les gammes par identifiant, pas par position.
  const heroPack = gammePacks.find((pack) => pack.id === "gamme-complete-supreme") ?? gammePacks[gammePacks.length - 1];
  const luxePack = gammePacks.find((pack) => pack.id === "gamme-soin-profond") ?? gammePacks[0];

  const seeAll = (
    <Button asChild variant="outline">
      <Link to="/boutique">Voir toute la boutique <ArrowRight /></Link>
    </Button>
  );

  return (
    <div className="bg-background">
      {/* ============ HAUT DE PAGE : TEXTE + PHOTOS QUI DÉFILENT ============ */}
      <section className="container mx-auto pt-28 md:pt-32 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-x-16 gap-y-8 lg:gap-y-10">
          <div className="lg:self-end">
            <span className="eyebrow">Collection 2026</span>
            <h1 className="font-heading font-extrabold mt-4 mb-6 text-[40px] leading-[1.04] md:text-[64px]">
              Soins capillaires <span className="text-primary">qui révèlent votre nature.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-8">
              Une gamme pensée pour les cheveux crépus, bouclés et naturels. Le meilleur remède pour tous vos bobos capillaires.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/boutique">Découvrir la boutique <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/nos-gammes">Nos gammes</Link>
              </Button>
            </div>
          </div>

          {/* Sur mobile, les photos arrivent juste après le texte ; sur ordinateur, elles occupent la colonne de droite. */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
            <HeroSlider />
          </div>

          <div className="lg:self-start">
            <dl className="grid grid-cols-3 gap-3 max-w-lg">
              {[{ value: "10+", label: "Produits" }, { value: "5", label: "Gammes" }, { value: "ABJ", label: "Livraison" }].map((stat) => (
                <div key={stat.label} className="surface !rounded-2xl px-4 py-4 flex flex-col-reverse">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</dt>
                  <dd className="font-heading text-2xl md:text-3xl font-bold text-primary">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============ BANDEAU DÉFILANT ============ */}
      <section aria-hidden="true" className="bg-primary text-primary-foreground py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, group) => (
            <div key={group} className="flex items-center shrink-0">
              {tickerItems.map((item, i) => (
                <span key={`${group}-${i}`} className="flex items-center mx-8 font-heading font-semibold uppercase tracking-wider text-sm md:text-base">
                  {item}
                  <span className="ml-8 text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ GARANTIES ============ */}
      <section className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {guarantees.map((item) => (
            <div key={item.title} className="surface p-5 md:p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <item.icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <h3 className="font-heading text-base md:text-lg font-semibold mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SOINS DU MOMENT ============ */}
      <section className="reveal-section pb-16 md:pb-24">
        <div className="container mx-auto">
          <SectionHeading eyebrow="La collection" title={<>Nos soins <span className="text-primary">du moment</span></>} action={seeAll} />
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ VIDÉO À GAUCHE, TEXTE À DROITE ============ */}
      <HomeVideo />

      {/* ============ DEUX GAMMES PHARES ============ */}
      <section className="reveal-section section">
        <div className="container mx-auto">
          <SectionHeading align="center" eyebrow="Nos gammes" title={<>Deux rituels, <span className="text-primary">une même signature</span></>} />
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { num: "01", pack: heroPack, label: "Gamme phare", subtitle: "Tous vos besoins", description: "L'ensemble de nos soins pour un résultat capillaire complet." },
              { num: "02", pack: luxePack, label: "Soin profond", subtitle: "Répare & traite", description: "Une routine ciblée pour réparer en profondeur les cheveux abîmés." },
            ].map(({ num, pack, label, subtitle, description }) => (
              <Link
                key={num}
                to="/nos-gammes#gammes"
                className="group relative overflow-hidden rounded-[2rem] bg-deep text-deep-foreground aspect-[4/5] md:aspect-[5/6] shadow-soft"
              >
                <img src={pack.image} alt={pack.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/45 to-transparent" />
                <div className="relative h-full flex flex-col justify-between p-6 md:p-9">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-background/90 text-foreground text-xs font-bold uppercase tracking-wider px-3 py-1.5">{label}</span>
                    <span className="font-heading text-4xl md:text-5xl font-bold text-accent">{num}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">{subtitle}</p>
                    <h3 className="font-heading text-2xl md:text-4xl font-bold mb-3 leading-tight">{pack.name}</h3>
                    <p className="text-deep-foreground/85 max-w-sm mb-5">{description}</p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold group-hover:gap-3 transition-all">
                      Explorer <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LA MARQUE (image + texte) ============ */}
      <section className="container mx-auto pb-16 md:pb-24 reveal-section">
        <div className="surface overflow-hidden grid md:grid-cols-2 p-2 md:p-3 gap-2">
          <div className="relative overflow-hidden rounded-2xl min-h-[320px] md:min-h-[480px]">
            <img src={gammeComplete} alt="L'art du soin capillaire" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="flex items-center p-6 md:p-12">
            <div className="max-w-md">
              <span className="eyebrow">La marque</span>
              <h2 className="font-heading font-bold mt-3 mb-5">
                L'élégance <span className="text-primary">au quotidien</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                Des formulations soignées, des actifs naturels sélectionnés avec exigence. Un rituel capillaire qui vous ressemble.
              </p>
              <p className="font-heading text-lg font-semibold text-primary mb-8">
                « Le meilleur remède pour tous vos bobos capillaires. »
              </p>
              <Button asChild size="lg">
                <Link to="/boutique">Commander maintenant <ArrowRight /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ À NE PAS MANQUER ============ */}
      <section className="reveal-section section bg-secondary/60">
        <div className="container mx-auto">
          <SectionHeading eyebrow="Sélection" title={<>À ne pas <span className="text-primary">manquer</span></>} action={seeAll} />
          <div className="product-grid">
            {selection.map((p) => (
              <ProductCard key={p.id} product={p} hideBadge />
            ))}
          </div>
        </div>
      </section>

      {/* ============ COFFRET : GAMME SUPRÊME ============ */}
      <section className="container mx-auto section reveal-section">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] items-center">
          <div aria-hidden="true" className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative p-7 md:p-14">
            <span className="eyebrow eyebrow--light">Le coffret complet</span>
            <h2 className="font-heading font-bold mt-3 mb-4">La Gamme Suprême</h2>
            <p className="text-primary-foreground/90 text-lg leading-relaxed max-w-lg mb-6">
              Tout votre rituel capillaire complet. Hydratation, nutrition, croissance et définition réunis.
            </p>
            <p className="font-heading text-3xl md:text-4xl font-bold text-accent mb-1">{heroPack.price.toLocaleString("fr-FR")} FCFA</p>
            <p className="text-primary-foreground/80 mb-7">{heroPack.contains.length} soins inclus</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => { addToCart(packToProduct(heroPack)); openCart(); }} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <ShoppingBag /> Ajouter au panier
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/nos-gammes#gammes">Voir le détail</Link>
              </Button>
            </div>
          </div>
          <div className="relative p-3 md:p-4 md:pl-0">
            <img src={heroPack.image} alt={heroPack.name} loading="lazy" className="w-full aspect-square object-cover rounded-[1.5rem]" />
          </div>
        </div>
      </section>

      {/* ============ NOTRE COMMUNAUTÉ ============ */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto">
          <SectionHeading align="center" eyebrow="L'univers" title={<>Notre <span className="text-primary">communauté</span></>} />
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
          >
            <CarouselContent>
              {lifestyleSlides.map((src, i) => (
                <CarouselItem key={i} className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-secondary group">
                    <img
                      src={src}
                      alt={`Cure's Nappy — moment ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* ============ RETOURS CLIENTS ============ */}
      <section className="reveal-section section bg-secondary/60">
        <div className="container mx-auto">
          <SectionHeading align="center" eyebrow="La Cure’s Nappy Family" title={<>Retours <span className="text-primary">clients</span></>} />
        </div>
        <div className="reviews-marquee overflow-hidden" aria-label="Commentaires de nos clientes">
          <div className="reviews-track flex w-max">
            {[0, 1].map(copy => (
              <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-stretch gap-5 pr-5">
                {reviews.map(review => (
                  <figure key={review.name} className="surface w-72 md:w-80 flex flex-col p-6">
                    <div className="flex gap-0.5 text-accent mb-3" aria-label="5 étoiles sur 5">
                      {[...Array(5)].map((_, star) => <Star key={star} className="h-4 w-4 fill-current" />)}
                    </div>
                    <blockquote className="leading-relaxed mb-5">« {review.text} »</blockquote>
                    <figcaption className="mt-auto flex items-center gap-3">
                      <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold">{review.name.charAt(0)}</span>
                      <span className="text-sm font-bold">{review.name}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NÉE À ABIDJAN + CONSEILS ============ */}
      <section className="container mx-auto section reveal-section">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-[2rem] bg-deep text-deep-foreground p-7 md:p-12 flex flex-col">
            <span className="eyebrow eyebrow--light">La marque</span>
            <h2 className="font-heading font-bold mt-3 mb-5 text-3xl md:text-4xl">
              Née à Abidjan, <span className="text-accent">portée partout.</span>
            </h2>
            <p className="text-deep-foreground/85 leading-relaxed mb-8">
              Cure's Nappy est née d'une conviction simple : chaque femme africaine mérite des soins
              capillaires naturels, efficaces et pensés pour elle. Des formules qui célèbrent la beauté
              de nos textures, du cuir chevelu jusqu'aux pointes.
            </p>
            <Button asChild size="lg" className="mt-auto w-fit bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/a-propos">Notre histoire <ArrowRight /></Link>
            </Button>
          </div>
          <div className="surface !rounded-[2rem] p-7 md:p-12 flex flex-col">
            <span className="eyebrow">Le journal Cure’s Nappy</span>
            <h2 className="font-heading font-bold mt-3 mb-5 text-3xl md:text-4xl">
              Conseils <span className="text-primary">capillaires</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Massage du cuir chevelu, gestes de soin et routines pour vos cheveux naturels.
            </p>
            <Button asChild size="lg" className="mt-auto w-fit">
              <Link to="/conseils">Astuces et conseils <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
