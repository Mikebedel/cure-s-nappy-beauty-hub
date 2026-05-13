import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Droplets, Sun, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, gammes } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@/assets/hero-image.jpg";
import productsShowcase from "@/assets/products-showcase.jpg";
import slide1 from "@/assets/gamme-complete.jpg";
import slide2 from "@/assets/gamme-soin-profond.jpg";
import slide3 from "@/assets/gamme-hydratation-intense.jpg";
import slide4 from "@/assets/gamme-minie-plus.jpg";
import slide5 from "@/assets/gamme-minie.jpg";

const retours = [
  { name: "Aminata K.", text: "Mes cheveux n'ont jamais été aussi hydratés ! La crème hydratante est un miracle.", rating: 5 },
  { name: "Fatou D.", text: "L'Huile Extra Pousse a changé ma vie. Résultats visibles en 3 semaines !", rating: 5 },
  { name: "Marie-Claire A.", text: "Enfin des produits qui comprennent nos cheveux. Qualité premium à Abidjan !", rating: 5 },
  { name: "Sandra B.", text: "La Gamme Minie+ a totalement transformé ma routine. Je recommande à 100%.", rating: 5 },
  { name: "Awa T.", text: "Le Masque Fortifiant est incroyable, mes cheveux ont retrouvé force et éclat.", rating: 5 },
];

const slides = [slide1, slide2, slide3, slide4, slide5];

const Index = () => {
  const popularProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Cheveux naturels" className="w-full h-full object-cover" width={1024} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container mx-auto relative z-10 py-20">
          <div className="max-w-xl">
            <span className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              🌿 Le meilleur remède pour tous vos bobos capillaires
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-card mb-6 leading-tight">
              Révélez la force naturelle de vos cheveux.
            </h1>
            <p className="text-card/80 text-lg mb-8 max-w-md">
              Des soins capillaires formulés pour les cheveux crépus, bouclés et naturels. Adaptés au climat africain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-action text-action-foreground hover:bg-action/90 text-base px-8">
                <Link to="/boutique">
                  Découvrir la boutique
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-light bg-primary-light text-white hover:bg-primary-light/90 text-base">
                <Link to="/nos-gammes">Nos gammes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Slide défilant */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto">
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent>
              {slides.map((src, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-card">
                    <img src={src} alt={`Cure's Nappy ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Brand intro */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre histoire</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">
                La beauté naturelle, notre engagement
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Cure's Nappy est née à Abidjan avec une mission simple : offrir des soins capillaires naturels, 
                efficaces et adaptés aux cheveux crépus et bouclés.
              </p>
              <p className="italic text-primary font-semibold mb-6">
                "Le meilleur remède pour tous vos bobos capillaires."
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-card rounded-lg">
                  <span className="text-2xl font-bold text-primary">10+</span>
                  <p className="text-sm text-muted-foreground">Produits naturels</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg">
                  <span className="text-2xl font-bold text-primary">5</span>
                  <p className="text-sm text-muted-foreground">Gammes spécialisées</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src={productsShowcase} alt="Produits Cure's Nappy" loading="lazy" width={1200} height={800} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Gammes */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Nos gammes</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-10">
            5 gammes pour chaque besoin
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {gammes.map((g) => (
              <Link
                to={`/boutique?gamme=${g.id}`}
                key={g.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="text-3xl block mb-3">{g.icon}</span>
                <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
                  {g.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Best-sellers</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">Produits populaires</h2>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link to="/boutique">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {popularProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild className="bg-action text-action-foreground hover:bg-action/90">
              <Link to="/boutique">Voir toute la boutique</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pourquoi nous choisir</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-10">
            L'excellence du soin naturel
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: "100% Naturel", desc: "Ingrédients naturels et biologiques sélectionnés avec soin" },
              { icon: Droplets, title: "Cheveux crépus", desc: "Formulés spécifiquement pour les textures crépues et bouclées" },
              { icon: Sun, title: "Climat africain", desc: "Adaptés à l'humidité et la chaleur du climat tropical" },
              { icon: Truck, title: "Livraison Abidjan", desc: "Livraison rapide partout à Abidjan et en Côte d'Ivoire" },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-card border border-border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retours clients (anciennement Témoignages) */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Avis vérifiés</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2 text-primary-foreground">
              Retours clients
            </h2>
          </div>
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
            className="max-w-5xl mx-auto"
          >
            <CarouselContent>
              {retours.map((t, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 text-left h-full">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-primary-foreground/90 text-sm mb-4 italic">"{t.text}"</p>
                    <p className="text-accent font-semibold text-sm">{t.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Conseil du moment */}
      <section className="py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Conseil capillaire</span>
          <h2 className="font-heading text-3xl font-bold mt-2 mb-4">Le conseil du moment</h2>
          <div className="bg-card border border-border rounded-2xl p-8 text-left">
            <h3 className="font-heading text-xl font-semibold mb-3">🌿 Stimulez la pousse avec le massage du cuir chevelu</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Quelques gouttes d'Huile Extra Pousse, 5 à 10 minutes de massage circulaire, 3 à 4 fois par semaine. 
              Vous activez la circulation sanguine et nourrissez les follicules pour des cheveux plus forts et plus longs.
            </p>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Link to="/conseils">
                Tous nos conseils
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto text-center max-w-lg">
          <h2 className="font-heading text-3xl font-bold mb-4">Restez connectée</h2>
          <p className="text-muted-foreground mb-6">
            Recevez nos conseils capillaires, offres exclusives et nouveautés directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="bg-action text-action-foreground hover:bg-action/90 px-8">
              S'inscrire
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
