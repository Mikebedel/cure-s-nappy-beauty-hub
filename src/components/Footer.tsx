import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-heading text-2xl font-bold mb-3">Cure's Nappy</h3>
            <p className="text-primary-foreground/70 text-sm max-w-sm">
              Des soins capillaires naturels, formulés à Abidjan pour les cheveux crépus, bouclés et naturels.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Accueil</Link>
              <Link to="/boutique" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Boutique</Link>
              <Link to="/nos-gammes" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Nos Gammes</Link>
              <Link to="/conseils" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Conseils</Link>
              <Link to="/a-propos" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">À propos</Link>
              <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <p>Abidjan, Côte d'Ivoire</p>
              <p>+225 07 00 00 00 00</p>
              <p>contact@curesnappy.ci</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/50">
          © 2026 Cure's Nappy. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
