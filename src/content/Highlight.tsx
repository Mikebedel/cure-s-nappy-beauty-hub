/** Titre dont la fin est mise en couleur (champs « titre » + « fin colorée » du dashboard). */
const Highlight = ({ title, highlight, className = "text-primary" }: { title: string; highlight?: string; className?: string }) => (
  <>
    {title}
    {highlight ? <>{title ? " " : ""}<span className={className}>{highlight}</span></> : null}
  </>
);

export default Highlight;
