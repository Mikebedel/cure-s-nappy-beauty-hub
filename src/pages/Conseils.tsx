import { Link } from "react-router-dom";
import { ShoppingBag, Clock, ArrowRight } from "lucide-react";
import type { ArticleContent } from "@/content/types";
import { useContent } from "@/content/ContentProvider";
import { iconFor } from "@/content/icons";
import { resolveImage } from "@/content/images";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";

/** Carte d'article : mène à la page complète de l'article. */
const ItemCard = ({ item }: { item: ArticleContent }) => {
  const Icon = iconFor(item.icon);
  const minutes = Math.max(1, Math.round(item.body.split(/\s+/).filter(Boolean).length / 200));
  const cover = resolveImage(item.image);
  return (
    <Link to={`/conseils/${item.id}`} className="product-card text-left bg-card border border-border/80 rounded-3xl overflow-hidden group flex flex-col h-full">
      {cover && <img src={cover} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 mb-5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-6 w-6" strokeWidth={1.6} /></span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{minutes} min</span>
        </div>
        <h3 className="font-heading text-lg font-bold mb-2 leading-tight">{item.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.intro}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Lire l'article <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></span>
      </div>
    </Link>
  );
};

const Conseils = () => {
  const page = useContent().content.advice;
  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow={page.eyebrow} title={<>{page.title} <span className="text-accent">{page.highlight}</span></>} description={page.description} />

      {page.tips.length > 0 && (
        <section className="container mx-auto pt-16 md:pt-20 pb-12">
          <h2 className="font-heading font-bold mb-8 text-3xl md:text-4xl">{page.tipsTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.tips.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      <section className={`container mx-auto pb-16 md:pb-20 ${page.tips.length ? "" : "pt-16 md:pt-20"}`}>
        {page.advice.length > 0 && <>
          <h2 className="font-heading font-bold mb-8 text-3xl md:text-4xl">{page.adviceTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.advice.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </>}

        <div className="mt-12 max-w-md mx-auto">
          <Button asChild size="lg" className="w-full h-12">
            <Link to="/boutique">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Voir la boutique
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Conseils;
