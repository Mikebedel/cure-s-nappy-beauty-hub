import { ReactNode } from "react";

/** Bandeau d'en-tête des pages intérieures. */
const PageHero = ({ eyebrow, title, description, children }: { eyebrow?: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) => (
  <section className="px-3 pt-[88px]">
    <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground px-5 py-14 md:py-20 text-center">
      <div aria-hidden="true" className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-deep/50 blur-3xl" />
      <div className="relative max-w-2xl mx-auto">
        {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
        <h1 className="font-heading font-bold mt-3">{title}</h1>
        {description && <p className="mt-4 text-base md:text-lg text-primary-foreground/90 leading-relaxed">{description}</p>}
        {children}
      </div>
    </div>
  </section>
);

export default PageHero;
