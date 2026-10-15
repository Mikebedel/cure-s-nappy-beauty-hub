import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";
import wordmark from "@/assets/brand-wordmark.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src={wordmark} alt="Cure’s Nappy" className="w-44 bg-card p-2 rounded-sm mb-4" />
            <p className="text-primary-foreground/90 text-sm max-w-sm">
              Des soins capillaires naturels, formulés à Abidjan pour les cheveux crépus, bouclés et naturels.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/curenappy" target="_blank" rel="noopener noreferrer" aria-label="Cure’s Nappy sur Facebook" className="text-primary-foreground hover:text-accent transition-colors p-2"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">Accueil</Link>
              <Link to="/boutique" className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">Boutique</Link>
              <Link to="/nos-gammes" className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">Nos Gammes</Link>
              <Link to="/conseils" className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">Conseils</Link>
              <Link to="/a-propos" className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">À propos</Link>
              <Link to="/contact" className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/90">
              <p>Abidjan, Côte d'Ivoire</p>
              <a href="tel:+2250100848479">+225 01 00 84 84 79</a>
              <a href="https://wa.me/c/22501008479" target="_blank" rel="noopener noreferrer">Catalogue WhatsApp</a>
              <p>contact@curesnappy.ci</p>
              <p className="not-italic mt-2">"Le meilleur remède pour tous vos bobos capillaires."</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/80">
          © 2026 Cure's Nappy. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
