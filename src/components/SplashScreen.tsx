import { useEffect, useState } from "react";
import logo from "@/assets/logo.jpg";

const SplashScreen = () => {
  // Affiché une seule fois par visite, jamais dans l'administration.
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem("curesnappy-splash-seen") === "true" || location.pathname.startsWith("/admin");
    } catch { return false; }
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (hidden) return;
    try { sessionStorage.setItem("curesnappy-splash-seen", "true"); } catch { /* stockage indisponible */ }
    const t1 = setTimeout(() => setFadeOut(true), 1100);
    const t2 = setTimeout(() => setHidden(true), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={logo}
            alt="Cure's Nappy"
            className="h-32 w-32 md:h-40 md:w-40 object-contain animate-pulse"
          />
        </div>
        <div className="h-1 w-40 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loader_1.1s_ease-in-out_forwards]" />
        </div>
      </div>
      <style>{`
        @keyframes loader {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
