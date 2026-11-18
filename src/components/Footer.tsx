import { Link, useLocation } from "react-router-dom";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Facebook, Instagram, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import type { ComponentType } from "react";

/** Logo TikTok (absent de la bibliothèque d'icônes), dessiné à la même taille que les autres. */
const TikTok = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.38-2.48V9.66a5.73 5.73 0 0 0-.78-.05A5.69 5.69 0 0 0 4.17 15.3 5.69 5.69 0 0 0 9.86 21a5.69 5.69 0 0 0 5.69-5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
  </svg>
);

/** N'affiche que des adresses web sûres (https), saisies dans le dashboard. */
const safeLink = (url: string) => (/^https:\/\/[^\s"'<>]+$/i.test(url.trim()) ? url.trim() : "");
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
  // La page Contact affiche déjà l'inscription à la newsletter.
  const onContact = useLocation().pathname === "/contact";
  return (
    <footer className="px-3 pb-3 pt-8">
      {!onContact && <NewsletterSignup className="container mx-auto mb-3" />}
      <div className="rounded-[2rem] bg-deep text-deep-foreground">
        <div className="container mx-auto py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="sm:col-span-2">
              <img src={wordmark} alt="Cure’s Nappy" className="w-44 mb-5 brightness-0 invert" />
              <p className="text-deep-foreground/80 max-w-sm leading-relaxed">{footer.tagline}</p>
              <p className="mt-4 font-heading text-lg text-accent">{footer.quote}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {([
                  ["Facebook", contact.facebookUrl, Facebook],
                  ["Instagram", contact.instagramUrl, Instagram],
                  ["TikTok", contact.tiktokUrl, TikTok],
                ] as [string, string, ComponentType<{ className?: string }>][]).map(([name, url, Icon]) => safeLink(url) && (
                  <a key={name} href={safeLink(url)} target="_blank" rel="noopener noreferrer" aria-label={`Cure’s Nappy sur ${name}`} title={name} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-deep-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"><Icon className="h-5 w-5" /></a>
                ))}
              </div>
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
