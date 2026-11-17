import { useEffect, useState } from "react";
import logo from "@/assets/logo.jpg";
import { useContent } from "@/content/ContentProvider";

const SplashScreen = () => {
  // Affiché une seule fois par visite, jamais dans l'administration.
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem("curesnappy-splash-seen") === "true" || location.pathname.startsWith("/admin");
    } catch { return false; }
  });
  const [fadeOut, setFadeOut] = useState(false);
  const [minDone, setMinDone] = useState(false);
  const [maxDone, setMaxDone] = useState(false);
  // Le vrai contenu (prix, textes, photos) : on ne montre pas le contenu d'origine du code à la place.
  const { ready } = useContent();

  useEffect(() => {
    if (hidden) return;
    try { sessionStorage.setItem("curesnappy-splash-seen", "true"); } catch { /* stockage indisponible */ }
    const t1 = setTimeout(() => setMinDone(true), 1100);
    // Au plus 12 s d'attente : sur une connexion très lente, le contenu se met à jour dès qu'il arrive.
    const t2 = setTimeout(() => setMaxDone(true), 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hidden || fadeOut || !minDone || !(ready || maxDone)) return;
    setFadeOut(true);
    const t = setTimeout(() => setHidden(true), 600);
    return () => clearTimeout(t);
  }, [hidden, fadeOut, minDone, ready, maxDone]);

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
          <div className={`h-full bg-primary ${minDone && !ready ? "w-full animate-pulse" : "animate-[loader_1.1s_ease-in-out_forwards]"}`} />
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
