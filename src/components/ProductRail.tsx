import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

/**
 * Une seule ligne de produits, à la même largeur de cartes que les gammes
 * (5 visibles sur ordinateur, 3 sur tablette, 2 sur téléphone). Les produits en plus
 * se découvrent en faisant glisser la ligne, ou avec les flèches.
 */
const ProductRail = ({ products, label }: { products: Product[]; label: string }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => setEdges({ start: rail.scrollLeft <= 4, end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4 });
    update();
    rail.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => { rail.removeEventListener("scroll", update); observer.disconnect(); };
  }, [products]);

  const move = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || "0") : rail.clientWidth;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const scrollable = !(edges.start && edges.end);
  return (
    <div className="relative">
      <div ref={railRef} className="product-rail" role="list" aria-label={label}>
        {products.map((p) => (
          <div key={p.id} role="listitem" className="product-rail__item">
            <ProductCard product={p} hideBadge />
          </div>
        ))}
      </div>
      {scrollable && (
        <>
          <button type="button" onClick={() => move(-1)} disabled={edges.start} aria-label={`Produits précédents : ${label}`}
            className="product-rail__arrow left-0 -translate-x-1/3">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => move(1)} disabled={edges.end} aria-label={`Produits suivants : ${label}`}
            className="product-rail__arrow right-0 translate-x-1/3">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductRail;
