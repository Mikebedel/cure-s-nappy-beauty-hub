import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, gammePacks } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@/assets/hero-image.jpg";
import gammeComplete from "@/assets/gamme-complete.jpg";
import gammeSoinProfond from "@/assets/gamme-soin-profond.jpg";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";
import slide4 from "@/assets/slide-4.jpg";
import slide5 from "@/assets/slide-5.jpg";
import slide6 from "@/assets/slide-6.jpg";

const lifestyleSlides = [slide1, slide2, slide3, slide4, slide5, slide6];

const tickerItems = [
  "Soins capillaires naturels",
  "Formulé à Abidjan",
  "Cheveux crépus & bouclés",
  "Le meilleur remède capillaire",
  "Cure's Nappy",
];

const Index = () => {
  const featured = products.slice(0, 4);
  const selection = products.slice(4, 8);
  const heroPack = gammePacks[0];
  const luxePack = gammePacks[1] ?? gammePacks[0];

  return (
    <div className="bg-background">
      {/* ============ HERO CINEMATOGRAPHIQUE ============ */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Cure's Nappy — soins capillaires naturels"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto relative z-10 pb-20 pt-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-accent" />
              <span className="text-accent uppercase tracking-[0.3em] text-xs font-semibold">
                Collection 2026
              </span>
            </div>
            <h1 className="font-heading text-primary-foreground leading-[0.95] mb-8">
              <span className="block text-5xl md:text-7xl font-bold">Soins capillaires</span>
              <span className="block text-4xl md:text-6xl italic text-accent font-medium mt-2">
                qui révèlent votre nature.
              </span>
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
              Une gamme pensée pour les cheveux crépus, bouclés et naturels.
              <br className="hidden md:block" />
              Le meilleur remède pour tous vos bobos capillaires.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 text-sm font-semibold uppercase tracking-wider">
                <Link to="/boutique">Découvrir la boutique</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-sm font-semibold uppercase tracking-wider border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/nos-gammes">Nos gammes</Link>
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mt-16 pt-8 border-t border-primary-foreground/15">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">10+</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">Produits</div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">5</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">Gammes</div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-accent">ABJ</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">Livraison</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE TICKER ============ */}
      <section className="bg-foreground text-background py-5 overflow-hidden border-y border-foreground">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, group) => (
            <div key={group} className="flex items-center shrink-0">
              {tickerItems.map((item, i) => (
                <span key={`${group}-${i}`} className="flex items-center mx-8 font-heading italic text-xl md:text-2xl">
                  {item}
                  <span className="ml-8 text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ LIFESTYLE SLIDER ============ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">L'univers</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3">
              Notre <em className="italic text-accent font-medium">communauté</em>
            </h2>
          </div>
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
          >
            <CarouselContent>
              {lifestyleSlides.map((src, i) => (
                <CarouselItem key={i} className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-secondary group">
                    <img
                      src={src}
                      alt={`Cure's Nappy — moment ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">La collection</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 leading-tight">
                Nos soins <em className="italic text-accent font-medium">du moment</em>
              </h2>
            </div>
            <Link to="/boutique" className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              Voir tout
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ L'ÉLÉGANCE AU QUOTIDIEN (split image + text) ============ */}
      <section className="bg-secondary">
        <div className="grid md:grid-cols-2 min-h-[80vh]">
          <div className="relative overflow-hidden order-2 md:order-1 min-h-[60vh]">
            <img src={gammeComplete} alt="L'art du soin capillaire" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="flex items-center order-1 md:order-2 p-10 md:p-20">
            <div className="max-w-md">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">La marque</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-6 leading-tight">
                L'élégance <em className="italic text-primary font-medium">au quotidien</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Des formulations soignées, des actifs naturels sélectionnés avec exigence. Un rituel capillaire qui vous ressemble.
              </p>
              <p className="italic text-primary font-medium mb-8">
                « Le meilleur remède pour tous vos bobos capillaires. »
              </p>
              <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-6 uppercase tracking-wider text-xs font-semibold">
                <Link to="/boutique">Commander maintenant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DEUX GAMMES PHARES ============ */}
      <section className="py-24">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Nos gammes</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 leading-tight">
              Deux rituels, <em className="italic text-accent font-medium">une même signature</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", pack: heroPack, label: "Gamme phare", subtitle: "Tous vos besoins", description: "L'ensemble de nos soins pour un résultat capillaire complet.", to: "/nos-gammes" },
              { num: "02", pack: luxePack, label: "Soin profond", subtitle: "Répare & traite", description: "Une routine ciblée pour réparer en profondeur les cheveux abîmés.", to: "/nos-gammes" },
            ].map(({ num, pack, label, subtitle, description, to }) => (
              <Link
                key={num}
                to={to}
                className="group relative overflow-hidden rounded-3xl bg-primary text-primary-foreground aspect-[4/5] md:aspect-[5/6]"
              >
                <img src={pack.image} alt={pack.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
                <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
                  <div className="flex items-start justify-between">
                    <span className="font-heading text-5xl md:text-6xl font-bold text-accent">{num}</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-primary-foreground/70 mt-3">{label}</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{subtitle}</p>
                    <h3 className="font-heading text-3xl md:text-4xl font-bold mb-3 leading-tight">{pack.name}</h3>
                    <p className="text-primary-foreground/80 text-sm max-w-sm mb-6">{description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border-b border-accent pb-1 group-hover:gap-3 transition-all">
                      Explorer <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ À NE PAS MANQUER ============ */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Sélection</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 leading-tight">
                À ne pas <em className="italic text-accent font-medium">manquer</em>
              </h2>
            </div>
            <Link to="/boutique" className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              Voir tout
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {selection.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ NÉE À ABIDJAN ============ */}
      <section className="py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="font-heading text-7xl md:text-8xl italic text-accent block leading-none mb-4">CN</span>
          <span className="text-xs uppercase tracking-[0.3em] text-primary-foreground/60">La marque</span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold mt-4 mb-8 leading-tight">
            Née à Abidjan, <em className="italic text-accent font-medium">portée partout.</em>
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Cure's Nappy est née d'une conviction simple : chaque femme africaine mérite des soins
            capillaires naturels, efficaces et pensés pour elle. Des formules qui célèbrent la beauté
            de nos textures, du cuir chevelu jusqu'aux pointes.
          </p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 uppercase tracking-wider text-xs font-semibold">
            <Link to="/a-propos">Notre histoire</Link>
          </Button>
        </div>
      </section>

      {/* ============ RETOURS CLIENTS ============ */}
      <section className="py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Avis vérifiés</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 leading-tight">
              Retours <em className="italic text-accent font-medium">clientes</em>
            </h2>
          </div>
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[Autoplay({ delay: 4500, stopOnInteraction: false })]}
            className="max-w-6xl mx-auto"
          >
            <CarouselContent>
              {[
                { name: "Aminata K.", text: "Mes cheveux n'ont jamais été aussi hydratés. La Crème Hydratante est un miracle." },
                { name: "Fatou D.", text: "L'Huile Extra Pousse a changé ma vie. Résultats visibles en 3 semaines." },
                { name: "Marie-Claire A.", text: "Enfin des produits qui comprennent nos cheveux. Qualité premium à Abidjan." },
                { name: "Sandra B.", text: "La Gamme Suprême a totalement transformé ma routine. Je recommande." },
                { name: "Awa T.", text: "Le Masque Fortifiant est incroyable, mes cheveux ont retrouvé force et éclat." },
              ].map((t, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="border border-border rounded-2xl p-8 h-full bg-card">
                    <p className="font-heading text-2xl italic text-foreground leading-snug mb-6">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-px w-8 bg-accent" />
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">{t.name}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* ============ BANNIÈRE PROMO ============ */}
      <section className="bg-accent text-accent-foreground py-20">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] opacity-70">Offre en cours</span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold mt-3 mb-6 leading-tight">
            La <em className="italic">Gamme Suprême</em> à 61 000 FCFA
          </h2>
          <p className="text-base md:text-lg opacity-80 mb-8 max-w-xl mx-auto">
            Tout votre rituel capillaire complet. Hydratation, nutrition, croissance et définition réunis.
          </p>
          <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-10 py-6 uppercase tracking-wider text-xs font-semibold">
            <Link to="/nos-gammes">En profiter</Link>
          </Button>
        </div>
      </section>

      {/* ============ GARANTIES ============ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { icon: ShieldCheck, title: "Qualité garantie", desc: "Chaque produit est contrôlé avant expédition." },
            { icon: Truck, title: "Livraison Abidjan", desc: "1 500 à 2 000 FCFA selon votre zone." },
            { icon: Sparkles, title: "Commande simple", desc: "Mobile Money, Fineo Pay, WhatsApp." },
            { icon: RotateCcw, title: "Conseils inclus", desc: "Routines personnalisées pour vos cheveux." },
          ].map((f, i) => (
            <div key={i} className="text-center md:text-left">
              <f.icon className="h-7 w-7 text-accent mb-4 mx-auto md:mx-0" strokeWidth={1.5} />
              <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
