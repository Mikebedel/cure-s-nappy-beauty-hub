import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag, ChevronLeft, ChevronRight, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packToProduct } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import HomeVideo from "@/components/HomeVideo";
import SectionHeading from "@/components/SectionHeading";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCatalog, useContent } from "@/content/ContentProvider";
import { resolveImage } from "@/content/images";
import { iconFor } from "@/content/icons";
import Highlight from "@/content/Highlight";
import RichText from "@/content/RichText";

const HERO_DELAY = 5000;

/** Le dernier mot du titre change tout seul. */
const RotatingWord = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % words.length), 2400);
    return () => clearInterval(timer);
  }, [words.length]);
  if (!words.length) return null;
  return (
    <span aria-hidden="true" className="block overflow-hidden pb-[0.12em] text-accent">
      <span key={index} className="hero-word inline-block">{words[index % words.length]}.</span>
    </span>
  );
};

/** Diaporama du haut de page : les photos défilent seules, avec flèches et repères. */
const HeroSlider = ({ slides }: { slides: string[] }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % count), HERO_DELAY);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  if (!count) return null;
  const shown = index % count;
  const go = (step: number) => setIndex((current) => (current + step + count) % count);

  return (
    <div
      className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-deep shadow-lift"
      role="group"
      aria-roledescription="diaporama"
      aria-label="Photos Cure's Nappy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={i === shown ? `Cure's Nappy — photo ${i + 1} sur ${count}` : ""}
          aria-hidden={i !== shown}
          data-active={i === shown}
          loading={i === 0 ? "eager" : "lazy"}
          className="hero-slide"
        />
      ))}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep/70 to-transparent" />

      {count > 1 && (
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-background/20 backdrop-blur-md px-3 py-2.5">
            {slides.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                aria-label={`Afficher la photo ${i + 1}`}
                aria-current={i === shown}
                onClick={() => setIndex(i)}
                className={`relative h-1.5 overflow-hidden rounded-full bg-background/50 transition-all duration-300 ${i === shown ? "w-8" : "w-1.5 hover:bg-background"}`}
              >
                {i === shown && <span className="hero-dot-fill absolute inset-0 rounded-full bg-background" style={{ animationDuration: `${HERO_DELAY}ms`, animationPlayState: paused ? "paused" : "running" }} />}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Photo précédente" onClick={() => go(-1)} className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" aria-label="Photo suivante" onClick={() => go(1)} className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const { addToCart } = useCart();
  const openCart = useCartNavigation();
  const { content } = useContent();
  const { productById, rangeById } = useCatalog();
  const home = content.home;

  const featured = home.featured.productIds.map(productById).filter((p) => !!p);
  const curlCream = home.spotlight.visible ? productById(home.spotlight.productId) : undefined;
  const boxSet = home.boxSet.visible ? rangeById(home.boxSet.rangeId) : undefined;
  const rituals = home.rituals.cards.flatMap((card, i) => {
    const pack = rangeById(card.rangeId);
    return pack ? [{ ...card, pack, num: String(i + 1).padStart(2, "0") }] : [];
  });
  const flash = home.flashNews;
  const heroTitle = [home.hero.line1, home.hero.line2, home.hero.rotatingWords[0] ? `${home.hero.rotatingWords[0]}.` : ""].filter(Boolean).join(" ");

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
            <h1 aria-label={heroTitle} className="font-heading font-extrabold mb-6 text-[40px] leading-[1.04] md:text-[64px]">
              {home.hero.line1 && <span aria-hidden="true" className="block">{home.hero.line1}</span>}
              {home.hero.line2 && <span aria-hidden="true" className="block text-primary">{home.hero.line2}</span>}
              <RotatingWord words={home.hero.rotatingWords} />
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-8">{home.hero.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/boutique">{home.hero.primaryCta} <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/nos-gammes">{home.hero.secondaryCta}</Link>
              </Button>
            </div>
          </div>

          {/* Sur mobile, les photos arrivent juste après le texte ; sur ordinateur, elles occupent la colonne de droite. */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
            <HeroSlider slides={home.hero.slides.map(resolveImage).filter(Boolean)} />
          </div>

          {home.hero.stats.length > 0 && (
            <div className="lg:self-start">
              <dl className="grid grid-cols-3 gap-3 max-w-lg">
                {home.hero.stats.map((stat) => (
                  <div key={stat.label} className="surface !rounded-2xl px-4 py-4 flex flex-col-reverse">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</dt>
                    <dd className="font-heading text-2xl md:text-3xl font-bold text-primary">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      {/* ============ BANDEAU DÉFILANT ============ */}
      {home.ticker.length > 0 && (
        <section aria-hidden="true" className="bg-primary text-primary-foreground py-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(4)].map((_, group) => (
              <div key={group} className="flex items-center shrink-0">
                {home.ticker.map((item, i) => (
                  <span key={`${group}-${i}`} className="flex items-center mx-8 font-heading font-semibold uppercase tracking-wider text-sm md:text-base">
                    {item}
                    <span className="ml-8 text-accent">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ GARANTIES ============ */}
      {home.guarantees.length > 0 && (
        <section className="container mx-auto py-12 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {home.guarantees.map((item) => {
              const Icon = iconFor(item.icon);
              return (
                <div key={item.title} className="surface p-5 md:p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-heading text-base md:text-lg font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ SOINS DU MOMENT ============ */}
      {featured.length > 0 && (
        <section className="reveal-section pb-16 md:pb-24">
          <div className="container mx-auto">
            <SectionHeading eyebrow={home.featured.eyebrow} title={<Highlight title={home.featured.title} highlight={home.featured.highlight} />} action={seeAll} />
            <div className="product-grid">
              {featured.map((p) => p && <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ============ VIDÉO À GAUCHE, TEXTE À DROITE ============ */}
      <HomeVideo />

      {/* ============ DEUX GAMMES PHARES ============ */}
      {rituals.length > 0 && (
        <section className="reveal-section section">
          <div className="container mx-auto">
            <SectionHeading align="center" eyebrow={home.rituals.eyebrow} title={<Highlight title={home.rituals.title} highlight={home.rituals.highlight} />} />
            <div className="grid md:grid-cols-2 gap-5">
              {rituals.map(({ num, pack, label, subtitle, description }) => (
                <Link
                  key={num}
                  to="/nos-gammes#gammes"
                  className="group relative overflow-hidden rounded-[2rem] bg-deep text-deep-foreground aspect-[4/5] md:aspect-[5/6] shadow-soft"
                >
                  <img src={pack.image} alt={pack.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/45 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between p-6 md:p-9">
                    <div className="flex items-start justify-between">
                      {label ? <span className="rounded-full bg-background/90 text-foreground text-xs font-bold uppercase tracking-wider px-3 py-1.5">{label}</span> : <span />}
                      <span className="font-heading text-4xl md:text-5xl font-bold text-accent">{num}</span>
                    </div>
                    <div>
                      {subtitle && <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">{subtitle}</p>}
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
      )}

      {/* ============ SOIN VEDETTE ============ */}
      {curlCream && (
        <section className="container mx-auto pb-16 md:pb-24 reveal-section">
          <div className="surface overflow-hidden grid md:grid-cols-2 p-2 md:p-3 gap-2">
            <div className="relative overflow-hidden rounded-2xl min-h-[340px] md:min-h-[520px] bg-muted group">
              <img src={curlCream.gallery?.[0] ?? curlCream.image} alt={curlCream.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              {home.spotlight.badge && <span className="absolute top-4 left-4 rounded-full bg-accent text-accent-foreground px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-soft">{home.spotlight.badge}</span>}
              {curlCream.gallery?.[1] && (
                <img src={curlCream.gallery[1]} alt={`${curlCream.name}, autre vue`} loading="lazy" className="absolute bottom-4 right-4 w-28 md:w-40 aspect-square object-cover rounded-2xl ring-4 ring-card shadow-lift" />
              )}
            </div>
            <div className="flex items-center p-6 md:p-12">
              <div className="max-w-md">
                {home.spotlight.eyebrow && <span className="eyebrow">{home.spotlight.eyebrow}</span>}
                <h2 className="font-heading font-bold mt-3 mb-5">
                  {curlCream.name} {home.spotlight.highlight && <span className="block text-primary">{home.spotlight.highlight}</span>}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{curlCream.description}</p>
                {curlCream.benefits.length > 0 && (
                  <ul className="grid grid-cols-2 gap-2.5 mb-7">
                    {curlCream.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 rounded-2xl bg-secondary/70 px-3.5 py-3 text-sm font-medium">
                        <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{benefit}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="font-heading text-3xl font-bold text-primary mb-6">{curlCream.price.toLocaleString("fr-FR")} FCFA</p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" onClick={() => { addToCart(curlCream); openCart(); }}>
                    <ShoppingBag /> Ajouter au panier
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to={`/produit/${curlCream.id}`}>Voir le soin <ArrowRight /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ FLASH NEWS : promotion, communiqué ou nouveauté ============ */}
      {flash.visible && (
        <section className="container mx-auto reveal-section">
          <div className={`relative overflow-hidden rounded-[2rem] bg-deep text-deep-foreground grid items-center ${flash.image ? "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]" : ""}`}>
            <div aria-hidden="true" className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            {flash.image && (
              <div className="relative p-3 md:p-4 md:pr-0">
                <img src={resolveImage(flash.image)} alt={flash.title} loading="lazy" className="w-full aspect-square object-cover rounded-[1.5rem]" />
              </div>
            )}
            <div className="relative p-7 md:p-14">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-sm font-bold uppercase tracking-wider">
                  <Zap className="h-4 w-4 fill-current" /> Flash News
                </span>
                {flash.badge && (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    <span className="relative flex h-2.5 w-2.5"><span className="flash-pulse absolute inline-flex h-full w-full rounded-full bg-accent" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" /></span>
                    {flash.badge}
                  </span>
                )}
              </div>
              <h2 className="font-heading font-bold mb-4">{flash.title}</h2>
              {flash.text && <p className="text-deep-foreground/85 text-lg leading-relaxed max-w-lg mb-6">{flash.text}</p>}
              {flash.highlight && <p className="font-heading text-2xl md:text-3xl font-bold text-accent mb-7">{flash.highlight}</p>}
              <div className="flex flex-wrap gap-3">
                {flash.ctaLabel && (
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to={flash.ctaLink || "/boutique"}>{flash.ctaLabel} <ArrowRight /></Link>
                  </Button>
                )}
                {flash.secondaryLabel && (
                  <Button asChild size="lg" variant="outline" className="bg-deep-foreground/10 border-deep-foreground/40 text-deep-foreground hover:bg-deep-foreground hover:text-deep">
                    <Link to={flash.secondaryLink || "/boutique"}>{flash.secondaryLabel}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ COFFRET ============ */}
      {boxSet && (
        <section className="container mx-auto section reveal-section">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] items-center">
            <div aria-hidden="true" className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative p-7 md:p-14">
              {home.boxSet.eyebrow && <span className="eyebrow eyebrow--light">{home.boxSet.eyebrow}</span>}
              <h2 className="font-heading font-bold mt-3 mb-4">{home.boxSet.title || boxSet.name}</h2>
              <p className="text-primary-foreground/90 text-lg leading-relaxed max-w-lg mb-6">{home.boxSet.text}</p>
              <p className="font-heading text-3xl md:text-4xl font-bold text-accent mb-1">{boxSet.price.toLocaleString("fr-FR")} FCFA</p>
              <p className="text-primary-foreground/80 mb-7">{boxSet.contains.length} soins inclus</p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => { addToCart(packToProduct(boxSet)); openCart(); }} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <ShoppingBag /> Ajouter au panier
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/nos-gammes#gammes">Voir le détail</Link>
                </Button>
              </div>
            </div>
            <div className="relative p-3 md:p-4 md:pl-0">
              <img src={boxSet.image} alt={boxSet.name} loading="lazy" className="w-full aspect-square object-cover rounded-[1.5rem]" />
            </div>
          </div>
        </section>
      )}

      {/* ============ NOTRE COMMUNAUTÉ ============ */}
      {home.community.images.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto">
            <SectionHeading align="center" eyebrow={home.community.eyebrow} title={<Highlight title={home.community.title} highlight={home.community.highlight} />} />
            <Carousel
              opts={{ loop: true, align: "start" }}
              plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
            >
              <CarouselContent>
                {home.community.images.map((ref, i) => (
                  <CarouselItem key={`${ref}-${i}`} className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-secondary group">
                      <img
                        src={resolveImage(ref)}
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
      )}

      {/* ============ RETOURS CLIENTS ============ */}
      {home.reviews.items.length > 0 && (
        <section className="reveal-section section bg-secondary/60">
          <div className="container mx-auto">
            <SectionHeading align="center" eyebrow={home.reviews.eyebrow} title={<Highlight title={home.reviews.title} highlight={home.reviews.highlight} />} />
          </div>
          <div className="reviews-marquee overflow-hidden" aria-label="Commentaires de nos clientes">
            <div className="reviews-track flex w-max">
              {[0, 1].map(copy => (
                <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-stretch gap-5 pr-5">
                  {home.reviews.items.map((review, i) => (
                    <figure key={`${review.name}-${i}`} className="surface w-72 md:w-80 flex flex-col p-6">
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
      )}

      {/* ============ NOTRE RAISON D'ÊTRE + CONSEILS ============ */}
      <section className="container mx-auto section reveal-section">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-[2rem] bg-deep text-deep-foreground p-7 md:p-12 flex flex-col">
            <span className="eyebrow eyebrow--light">{home.mission.eyebrow}</span>
            <h2 className="font-heading font-bold mt-3 mb-5 text-3xl md:text-4xl">
              <Highlight title={home.mission.title} highlight={home.mission.highlight} className="text-accent" />
            </h2>
            <RichText text={home.mission.body} className="space-y-4 text-deep-foreground/85 leading-relaxed mb-8" />
            <Button asChild size="lg" className="mt-auto w-fit bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/a-propos">{home.mission.ctaLabel} <ArrowRight /></Link>
            </Button>
          </div>
          <div className="surface !rounded-[2rem] p-7 md:p-12 flex flex-col">
            <span className="eyebrow">{home.journal.eyebrow}</span>
            <h2 className="font-heading font-bold mt-3 mb-5 text-3xl md:text-4xl">
              <Highlight title={home.journal.title} highlight={home.journal.highlight} />
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{home.journal.text}</p>
            <Button asChild size="lg" className="mt-auto w-fit">
              <Link to="/conseils">{home.journal.ctaLabel} <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
