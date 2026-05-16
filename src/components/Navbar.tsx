import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Accueil", to: "/", icon: Home },
    { label: "Boutique", to: "/boutique" },
    { label: "Nos Gammes", to: "/nos-gammes" },
    { label: "Conseils", to: "/conseils" },
    { label: "À propos", to: "/a-propos" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link
          to="/"
          className={`font-heading text-xl md:text-2xl font-bold transition-colors ${
            scrolled ? "text-primary" : "text-primary-foreground drop-shadow"
          }`}
        >
          Cure's <em className="text-accent not-italic">Nappy</em>
        </Link>

        {/* Desktop pill nav */}
        <div className="hidden lg:flex items-center gap-1 bg-background/90 backdrop-blur-md border border-border rounded-full px-2 py-1.5 shadow-sm">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
                  active
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/panier"
            className="relative h-11 w-11 rounded-full bg-background/90 backdrop-blur-md border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold border-2 border-background">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden h-11 w-11 rounded-full bg-background/90 backdrop-blur-md border border-border flex items-center justify-center shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden container mx-auto mt-3">
          <div className="bg-background/95 backdrop-blur-md border border-border rounded-2xl p-3 shadow-lg flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:bg-secondary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
