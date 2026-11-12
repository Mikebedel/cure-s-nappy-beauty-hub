import { Fragment, ReactNode } from "react";
import { Link } from "react-router-dom";

/** Liens autorisés : pages du site (« /… ») ou adresses https. */
const safeHref = (url: string) => (/^\/(?!\/)/.test(url) || /^https:\/\//.test(url) ? url : null);

/** Gras (**texte**) et liens ([texte](adresse)). */
const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      if (!href) return <Fragment key={i}>{link[1]}</Fragment>;
      return href.startsWith("/")
        ? <Link key={i} to={href} className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80">{link[1]}</Link>
        : <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80">{link[1]}</a>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });

/**
 * Affiche un texte du dashboard : ligne vide = paragraphe, « ## » = sous-titre,
 * « - » = puce, « 1. » = étape numérotée, « > » = encadré à retenir.
 * variant="article" : mise en page de lecture (titres et encadrés plus grands).
 */
const RichText = ({ text, className = "", paragraphClassName = "", variant = "compact" }: { text: string; className?: string; paragraphClassName?: string; variant?: "compact" | "article" }) => {
  const article = variant === "article";
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let paragraph: string[] = [];
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push(<p key={blocks.length} className={paragraphClassName}>{inline(paragraph.join(" "))}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, i) => <li key={i} className={article ? "pl-1" : ""}>{inline(item)}</li>);
    const spacing = article ? "space-y-2.5" : "space-y-1.5";
    blocks.push(list.ordered
      ? <ol key={blocks.length} className={`list-decimal pl-6 ${spacing} marker:font-semibold marker:text-primary`}>{items}</ol>
      : <ul key={blocks.length} className={`list-disc pl-6 ${spacing} marker:text-primary`}>{items}</ul>);
    list = null;
  };
  const flushQuote = () => {
    if (!quote.length) return;
    blocks.push(
      <aside key={blocks.length} className={`rounded-2xl border-l-4 border-accent bg-accent/10 ${article ? "px-5 py-4 text-[17px]" : "px-4 py-3"} text-foreground`}>
        {inline(quote.join(" "))}
      </aside>,
    );
    quote = [];
  };
  const flushAll = () => { flushParagraph(); flushList(); flushQuote(); };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) { flushAll(); continue; }
    const heading = line.match(/^#{1,3}\s+(.*)$/);
    const bullet = line.match(/^[-•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    const quoted = line.match(/^>\s?(.*)$/);
    if (heading) {
      flushAll();
      blocks.push(article
        ? <h2 key={blocks.length} className="font-heading font-bold text-foreground !text-2xl md:!text-[28px] pt-4">{inline(heading[1])}</h2>
        : <h4 key={blocks.length} className="font-semibold text-foreground">{inline(heading[1])}</h4>);
    } else if (quoted) {
      flushParagraph(); flushList();
      quote.push(quoted[1]);
    } else if (bullet || numbered) {
      flushParagraph(); flushQuote();
      const ordered = !!numbered;
      if (!list || list.ordered !== ordered) { flushList(); list = { ordered, items: [] }; }
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flushList(); flushQuote();
      paragraph.push(line);
    }
  }
  flushAll();
  return <div className={className}>{blocks}</div>;
};

export default RichText;
