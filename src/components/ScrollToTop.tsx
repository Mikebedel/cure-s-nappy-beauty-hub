import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (pathname === "/panier") return;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: typeof state?.restoreScroll === "number" ? state.restoreScroll : 0, left: 0, behavior: "instant" as ScrollBehavior });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, state]);
  return null;
};

export default ScrollToTop;
