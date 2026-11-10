import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  light?: boolean;
  className?: string;
};

/** En-tête commun à toutes les sections : repère, titre, texte et lien éventuel. */
const SectionHeading = ({ eyebrow, title, description, align = "left", action, light = false, className = "" }: Props) => (
  <div className={`mb-10 md:mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 ${align === "center" ? "justify-center text-center" : ""} ${className}`}>
    <div className={align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <span className={`eyebrow ${light ? "eyebrow--light" : ""}`}>{eyebrow}</span>}
      <h2 className="font-heading font-bold mt-3">{title}</h2>
      {description && <p className={`mt-4 text-base md:text-lg leading-relaxed ${light ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{description}</p>}
    </div>
    {action}
  </div>
);

export default SectionHeading;
