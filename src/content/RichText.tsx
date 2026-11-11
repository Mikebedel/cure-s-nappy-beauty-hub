import { Fragment, ReactNode } from "react";

/** Met en gras les passages entre **deux astérisques**. */
const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  );

/**
 * Affiche un texte du dashboard : ligne vide = paragraphe, « ## » = sous-titre,
 * « - » = puce, « 1. » = étape numérotée.
 */
const RichText = ({ text, className = "", paragraphClassName = "" }: { text: string; className?: string; paragraphClassName?: string }) => {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push(<p key={blocks.length} className={paragraphClassName}>{inline(paragraph.join(" "))}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, i) => <li key={i}>{inline(item)}</li>);
    blocks.push(list.ordered
      ? <ol key={blocks.length} className="list-decimal pl-5 space-y-1">{items}</ol>
      : <ul key={blocks.length} className="list-disc pl-5 space-y-1.5">{items}</ul>);
    list = null;
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^#{1,3}\s+(.*)$/);
    const bullet = line.match(/^[-•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (heading) {
      flushParagraph(); flushList();
      blocks.push(<h4 key={blocks.length} className="font-semibold text-foreground">{inline(heading[1])}</h4>);
    } else if (bullet || numbered) {
      flushParagraph();
      const ordered = !!numbered;
      if (!list || list.ordered !== ordered) { flushList(); list = { ordered, items: [] }; }
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph(); flushList();
  return <div className={className}>{blocks}</div>;
};

export default RichText;
