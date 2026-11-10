import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash, state } = useLocation();
  useEffect(() => {
    if (pathname === "/panier") return;
    const frame = requestAnimationFrame(() => {
      const instant = "instant" as ScrollBehavior;
      if (typeof state?.restoreScroll === "number") {
        window.scrollTo({ top: state.restoreScroll, left: 0, behavior: instant });
        return;
      }
      // Lien vers une section (#gammes, #duos…) : on y va directement.
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) target.scrollIntoView({ behavior: instant });
      else window.scrollTo({ top: 0, left: 0, behavior: instant });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, state]);
  return null;
};

export default ScrollToTop;
