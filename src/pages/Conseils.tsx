import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { ArticleContent } from "@/content/types";
import { useContent } from "@/content/ContentProvider";
import { iconFor } from "@/content/icons";
import RichText from "@/content/RichText";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import PageHero from "@/components/PageHero";

const ItemCard = ({ item }: { item: ArticleContent }) => {
  const Icon = iconFor(item.icon);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="product-card text-left bg-card border border-border/80 rounded-3xl p-6 md:p-7 group flex flex-col h-full">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5"><Icon className="h-6 w-6" strokeWidth={1.6} /></span>
          <h3 className="font-heading text-lg font-bold mb-2 leading-tight">{item.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.intro}</p>
          <span className="mt-auto text-sm font-semibold text-primary group-hover:underline">
            Lire l'article →
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
            <DialogTitle className="font-heading text-xl md:text-2xl text-left">
              {item.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">{item.intro}</DialogDescription>
        </DialogHeader>
        <RichText text={item.body} className="pt-2 space-y-4 text-sm text-muted-foreground" />
      </DialogContent>
    </Dialog>
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
