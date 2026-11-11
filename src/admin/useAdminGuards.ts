import { useEffect } from "react";

/** Les pages d'administration ne doivent jamais apparaître dans Google. */
export const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, []);
};

const IDLE_MINUTES = 30;

/** Déconnexion automatique après 30 minutes sans activité dans l'administration. */
export const useIdleSignOut = (enabled: boolean, onIdle: () => void) => {
  useEffect(() => {
    if (!enabled) return;
    let timer = setTimeout(onIdle, IDLE_MINUTES * 60 * 1000);
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(onIdle, IDLE_MINUTES * 60 * 1000);
    };
    const events = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled, onIdle]);
};
