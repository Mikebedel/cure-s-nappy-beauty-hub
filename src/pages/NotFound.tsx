import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="container mx-auto pt-36 pb-24 text-center">
    <p className="font-heading text-6xl font-black text-accent mb-4">404</p>
    <h1 className="font-heading font-bold mb-3">Page introuvable</h1>
    <p className="text-muted-foreground max-w-md mx-auto mb-8">
      La page que vous cherchez n’existe pas ou a été déplacée.
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      <Button asChild size="lg" className="h-12"><Link to="/">Retour à l’accueil</Link></Button>
      <Button asChild size="lg" variant="outline" className="h-12"><Link to="/boutique">Voir la boutique</Link></Button>
    </div>
  </div>
);

export default NotFound;
