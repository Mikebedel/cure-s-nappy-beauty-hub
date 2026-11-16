import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useContent } from "@/content/ContentProvider";
import { iconFor } from "@/content/icons";
import Highlight from "@/content/Highlight";

/** Carte « Pose ta question » (page Conseils et bas des articles) : ouvre WhatsApp avec un message déjà commencé. */
export const AskQuestion = ({ className = "" }: { className?: string }) => {
  const { advice, contact } = useContent().content;
  const ask = advice.ask;
  if (!ask.title) return null;
  return (
    <div className={`rounded-[2rem] bg-primary text-primary-foreground p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8 ${className}`}>
      <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <MessageCircle className="h-7 w-7" strokeWidth={1.8} />
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-xl md:text-2xl font-bold mb-1.5">{ask.title}</h3>
        <p className="text-primary-foreground/85 leading-relaxed">{ask.text}</p>
      </div>
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
        <a href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(ask.message)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle />{ask.label}
        </a>
      </Button>
    </div>
  );
};

/**
 * « Quel est ton problème capillaire ? » : une ligne de cartes compactes, avec flèches et défilement
 * automatique ; chaque carte ouvre l'article complet de la page Conseils.
 */
const HairProblems = () => {
  const { home, advice } = useContent().content;
  const section = home.problems;
  const articles = new Set([...advice.tips, ...advice.advice].map((a) => a.id));
  const items = section.items.filter((item) => articles.has(item.articleId));
  if (!section.visible || items.length === 0) return null;
  const delay = Math.max(1.5, section.delay || 3) * 1000;
  const plugins = section.autoplay ? [Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true })] : [];
  return (
    <section className="reveal-section pt-10 md:pt-14 pb-12 md:pb-16">
      <div className="container mx-auto">
        <Carousel opts={{ loop: true, align: "start" }} plugins={plugins}>
          <div className="flex items-end justify-between gap-4 mb-5 md:mb-6">
            <div className="min-w-0">
              {section.eyebrow && <span className="eyebrow mb-2">{section.eyebrow}</span>}
              <h2 className="font-heading font-bold !text-2xl md:!text-3xl leading-tight"><Highlight title={section.title} highlight={section.highlight} /></h2>
              {section.text && <p className="hidden md:block mt-2 text-muted-foreground max-w-2xl">{section.text}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <CarouselPrevious aria-label="Problèmes précédents" className="relative inset-auto translate-y-0 h-11 w-11 bg-card" />
              <CarouselNext aria-label="Problèmes suivants" className="relative inset-auto translate-y-0 h-11 w-11 bg-card" />
            </div>
          </div>
          <CarouselContent className="-ml-3">
            {items.map((item) => {
              const Icon = iconFor(item.icon);
              return (
                <CarouselItem key={item.id} className="pl-3 basis-[72%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <Link to={`/conseils/${item.articleId}`} title={item.text} className="surface group h-full p-4 flex flex-col gap-3 transition-colors hover:border-primary/40">
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" strokeWidth={1.7} />
                      </span>
                      <span className="font-heading text-base font-semibold leading-snug">{item.title}</span>
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Que faire ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default HairProblems;
