import { Link } from "react-router-dom";
import { Facebook, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import wordmark from "@/assets/brand-wordmark.png";
import { useContent } from "@/content/ContentProvider";

const links = [
  { label: "Accueil", to: "/" },
  { label: "Boutique", to: "/boutique" },
  { label: "Nos Gammes", to: "/nos-gammes" },
  { label: "Conseils", to: "/conseils" },
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  const { contact, footer } = useContent().content;
  return (
    <footer className="px-3 pb-3 pt-8">
      <div className="rounded-[2rem] bg-deep text-deep-foreground">
        <div className="container mx-auto py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="sm:col-span-2">
              <img src={wordmark} alt="Cure’s Nappy" className="w-44 bg-background px-3 py-2 rounded-xl mb-5" />
              <p className="text-deep-foreground/80 max-w-sm leading-relaxed">{footer.tagline}</p>
              <p className="mt-4 font-heading text-lg text-accent">{footer.quote}</p>
              <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Cure’s Nappy sur Facebook" className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-deep-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-[0.18em] text-accent">Navigation</h4>
              <div className="flex flex-col gap-2.5">
                {links.map(link => (
                  <Link key={link.to} to={link.to} className="text-deep-foreground/80 hover:text-accent transition-colors w-fit">{link.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-[0.18em] text-accent">Contact</h4>
              <div className="flex flex-col gap-3 text-deep-foreground/80">
                <p className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-accent" />{contact.address}</p>
                <a href={`tel:+${contact.whatsapp}`} className="flex items-center gap-2.5 hover:text-accent transition-colors w-fit"><Phone className="h-4 w-4 shrink-0 text-accent" />{contact.phoneDisplay}</a>
                <a href={contact.whatsappCatalogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-accent transition-colors w-fit"><MessageCircle className="h-4 w-4 shrink-0 text-accent" />Catalogue WhatsApp</a>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 hover:text-accent transition-colors w-fit"><Mail className="h-4 w-4 shrink-0 text-accent" />{contact.email}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-deep-foreground/15 mt-10 pt-6 text-sm text-deep-foreground/60">
            © 2026 Cure's Nappy. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
