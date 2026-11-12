import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, BookOpen, ExternalLink, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useCatalog, useContent } from "@/content/ContentProvider";
import { iconFor } from "@/content/icons";
import { resolveImage } from "@/content/images";
import RichText from "@/content/RichText";
import NotFound from "./NotFound";

/** Temps de lecture estimé (200 mots par minute). */
const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
const host = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; } };

/** Article complet d'Astuces & Conseils, à l'adresse /conseils/<id>. */
const ArticlePage = () => {
  const { id = "" } = useParams();
  const page = useContent().content.advice;
  const { productById } = useCatalog();
  const all = [...page.tips.map((a) => ({ ...a, kind: page.tipsTitle })), ...page.advice.map((a) => ({ ...a, kind: page.adviceTitle }))];
  const index = all.findIndex((a) => a.id === id);
  const article = all[index];
  if (!article) return <NotFound />;

  const Icon = iconFor(article.icon);
  const references = article.references ?? [];
  const products = (article.productIds ?? []).map(productById).filter((p) => !!p);
  const others = all.filter((a) => a.id !== id).slice(0, 3);
  const cover = resolveImage(article.image);

  return (
    <article className="pb-16">
      {/* En-tête */}
      <header className="px-3 pt-[88px]">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground px-5 py-12 md:py-16">
          <div aria-hidden="true" className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative max-w-3xl mx-auto">
            <Link to="/conseils" className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/85 hover:text-primary-foreground mb-6 min-h-11"><ArrowLeft className="h-4 w-4" />Tous les conseils</Link>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1.5 font-semibold"><Icon className="h-4 w-4" />{article.kind}</span>
              <span className="inline-flex items-center gap-1.5 text-primary-foreground/85"><Clock className="h-4 w-4" />{readingTime(article.body)} min de lecture</span>
            </div>
            <h1 className="font-heading font-bold">{article.title}</h1>
            <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 leading-relaxed">{article.intro}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto">
        {cover && <img src={cover} alt="" className="mx-auto mt-8 w-full max-w-3xl aspect-[16/9] object-cover rounded-3xl" />}

        {/* Texte */}
        <RichText text={article.body} variant="article"
          className="mx-auto max-w-3xl mt-10 space-y-5 text-[17px] md:text-lg leading-[1.8] text-foreground/90" />

        <p className="mx-auto max-w-3xl mt-10 flex gap-3 rounded-2xl bg-secondary/70 p-5 text-sm text-muted-foreground">
          <Stethoscope className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          Ces conseils sont donnés à titre d'information et ne remplacent pas l'avis d'un médecin ou d'un dermatologue. En cas de perte de cheveux importante, de douleur, de plaies ou de démangeaisons qui durent, consultez.
        </p>

        {/* Sources */}
        {references.length > 0 && (
          <section className="mx-auto max-w-3xl mt-10" aria-labelledby="sources">
            <h2 id="sources" className="font-heading font-bold !text-2xl mb-4 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />Sources et pour aller plus loin</h2>
            <ol className="space-y-2.5 list-decimal pl-6 marker:text-muted-foreground">
              {references.map((ref, i) => (
                <li key={`${ref.url}-${i}`}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-1.5 hover:text-primary">
                    <span className="underline underline-offset-2 decoration-border group-hover:decoration-primary">{ref.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 mt-1.5 shrink-0 text-muted-foreground" />
                  </a>
                  <span className="block text-xs text-muted-foreground">{host(ref.url)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Soins conseillés */}
        {products.length > 0 && (
          <section className="mt-16" aria-labelledby="soins">
            <h2 id="soins" className="font-heading font-bold mb-8 text-center">Les soins Cure's Nappy <span className="text-primary">pour aller plus loin</span></h2>
            <div className="product-grid max-w-5xl mx-auto">{products.map((p) => p && <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}

        {/* À lire aussi */}
        {others.length > 0 && (
          <section className="mt-16" aria-labelledby="aussi">
            <h2 id="aussi" className="font-heading font-bold mb-8 !text-3xl">À lire aussi</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {others.map((a) => {
                const OtherIcon = iconFor(a.icon);
                return (
                  <Link key={a.id} to={`/conseils/${a.id}`} className="product-card group flex flex-col bg-card border border-border/80 rounded-3xl p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4"><OtherIcon className="h-5 w-5" /></span>
                    <h3 className="font-heading text-lg font-bold mb-2 leading-tight">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{a.intro}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Lire l'article <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-14 flex justify-center">
          <Button asChild size="lg"><Link to="/boutique">Voir la boutique <ArrowRight /></Link></Button>
        </div>
      </div>
    </article>
  );
};

export default ArticlePage;
