import { useCatalog } from "@/content/ContentProvider";

const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;

/** Prix affiché ; pendant une promotion, l'ancien prix apparaît barré à côté. */
export const Price = ({ price, original, className = "", originalClassName = "text-muted-foreground" }: { price: number; original?: number; className?: string; originalClassName?: string }) => {
  const promo = typeof original === "number" && original > price;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={className}>{fcfa(price)}</span>
      {promo && <s className={`text-[0.72em] font-medium leading-none ${originalClassName}`} aria-label={`au lieu de ${fcfa(original)}`}>{fcfa(original)}</s>}
    </span>
  );
};

/** Pastille « -20 % » d'un article en promotion. */
export const PromoBadge = ({ original, price, className = "" }: { original?: number; price: number; className?: string }) => {
  const { promotion } = useCatalog();
  if (!promotion || typeof original !== "number" || original <= price) return null;
  return <span className={`rounded-full bg-accent text-accent-foreground text-xs font-bold px-3 py-1 shadow-soft ${className}`}>{promotion.badge || `-${promotion.percent} %`}</span>;
};
