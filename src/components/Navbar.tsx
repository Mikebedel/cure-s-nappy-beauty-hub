import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import wordmark from "@/assets/brand-wordmark.png";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const returnPage = useRef({ path: "/boutique", scroll: 0 });
  const cartOpen = location.pathname === "/panier";

  useEffect(() => {
    if (location.pathname !== "/panier") {
      returnPage.current = { path: location.pathname + location.search + location.hash, scroll: 0 };
    }
  }, [location.pathname, location.search, location.hash]);

  const toggleCart = () => {
    setIsOpen(false);
    if (cartOpen) {
      navigate(location.state?.cartOrigin ?? returnPage.current.path, { state: { restoreScroll: location.state?.cartScroll ?? returnPage.current.scroll } });
    } else {
      returnPage.current = { path: location.pathname + location.search + location.hash, scroll: window.scrollY };
      navigate("/panier", { state: { backgroundLocation: location, cartOrigin: returnPage.current.path, cartScroll: returnPage.current.scroll } });
    }
  };

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

  // Animated indicator
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const activeIdx = navLinks.findIndex((l) => l.to === location.pathname);

  useLayoutEffect(() => {
    const idx = hoverIdx ?? activeIdx;
    const el = itemRefs.current[idx];
    const list = listRef.current;
    if (el && list) {
      const rect = el.getBoundingClientRect();
      const parentRect = list.getBoundingClientRect();
      setIndicator({
        left: rect.left - parentRect.left,
        width: rect.width,
        opacity: idx === -1 ? 0 : 1,
      });
    } else {
      setIndicator((s) => ({ ...s, opacity: 0 }));
    }
  }, [hoverIdx, activeIdx, location.pathname]);

  return (
    <nav aria-label="Navigation principale" className="fixed top-0 left-0 right-0 z-50 px-3 pt-3">
      <div className={`mx-auto max-w-[1240px] flex items-center justify-between gap-2 rounded-full border bg-background/85 backdrop-blur-xl pl-4 pr-2 transition-all duration-300 ${scrolled ? "py-1.5 border-border shadow-lift" : "py-2 border-border/60 shadow-soft"}`}>
        <Link
          to="/"
          className="flex items-center gap-2 transition-colors"
        >
          <img
            src={logo}
            alt=""
            className="h-9 w-9 object-contain shrink-0 rounded-full"
          />
          <img src={wordmark} alt="Cure's Nappy" className="w-28 sm:w-32 md:w-36 h-auto object-contain" />
        </Link>

        {/* Desktop pill nav with animated indicator */}
        <div
          ref={listRef}
          className="hidden lg:flex items-center gap-1 relative"
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Animated highlight */}
          <span
            className="absolute top-0 bottom-0 rounded-full bg-primary transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />
          {navLinks.map((link, i) => {
            const active = activeIdx === i;
            const hovered = hoverIdx === i;
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.to}
                aria-current={active ? "page" : undefined}
                ref={(el) => (itemRefs.current[i] = el)}
                onMouseEnter={() => setHoverIdx(i)}
                className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  hoverIdx === null ? (active ? "text-primary-foreground" : "text-foreground/75") : hovered ? "text-primary-foreground" : "text-foreground/75"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="relative inline-flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            aria-label={cartOpen ? "Fermer le panier" : "Ouvrir le panier"}
            title={cartOpen ? "Fermer le panier" : "Ouvrir le panier"}
            aria-expanded={cartOpen}
            className="relative h-11 w-11 text-foreground hover:text-primary hover:bg-secondary"
          >
            <ShoppingBag className="!size-5" />
          </Button>
            {totalItems > 0 && (
              <span key={totalItems} className="first-add-notice pointer-events-none absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[11px] leading-none font-bold flex items-center justify-center ring-2 ring-background" aria-label={`${totalItems} article${totalItems > 1 ? "s" : ""} dans le panier`}>
                {totalItems}
              </span>
            )}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-11 w-11 hover:bg-secondary hover:text-foreground text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="!size-5" /> : <Menu className="!size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden mx-auto max-w-[1240px] mt-2">
          <div className="bg-background/95 backdrop-blur-xl border border-border rounded-3xl p-3 shadow-lift flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary"
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
