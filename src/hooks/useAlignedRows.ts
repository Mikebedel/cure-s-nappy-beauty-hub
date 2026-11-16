import { useLayoutEffect, useRef } from "react";

/**
 * Aligne, ligne par ligne, les blocs marqués data-align="<nom>" des cartes d'une grille :
 * chaque bloc prend la hauteur du plus grand bloc du même nom sur la même ligne visuelle.
 * Les prix et boutons se retrouvent ainsi au même niveau, sans étirer les cartes voisines
 * quand l'une d'elles s'ouvre (seuls les titres et descriptions sont égalisés).
 */
export const useAlignedRows = <T extends HTMLElement>(names: string[], deps: unknown[] = []) => {
  const ref = useRef<T>(null);
  const key = names.join(",");
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    let frame = 0;
    let lastWidth = -1;
    const align = () => {
      const cards = Array.from(grid.children) as HTMLElement[];
      for (const name of key.split(",")) {
        const blocks = cards.map((card) => card.querySelector<HTMLElement>(`[data-align="${name}"]`));
        blocks.forEach((block) => block && (block.style.minHeight = ""));
        const rows = new Map<number, HTMLElement[]>();
        blocks.forEach((block, index) => {
          if (!block) return;
          const top = Math.round(cards[index].offsetTop);
          rows.set(top, [...(rows.get(top) ?? []), block]);
        });
        rows.forEach((row) => {
          if (row.length < 2) return;
          const height = Math.max(...row.map((block) => block.getBoundingClientRect().height));
          row.forEach((block) => (block.style.minHeight = `${height}px`));
        });
      }
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(align); };
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (width !== lastWidth) { lastWidth = width; schedule(); }
    });
    observer.observe(grid);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps]);
  return ref;
};
