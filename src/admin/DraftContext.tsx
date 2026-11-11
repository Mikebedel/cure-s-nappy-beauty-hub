import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";
import type { SiteContent } from "@/content/types";
import { defaultContent } from "@/content/defaults";
import { useContent } from "@/content/ContentProvider";

interface DraftContextType {
  draft: SiteContent;
  /** Modifie le brouillon : la fonction reçoit une copie qu'elle peut changer directement. */
  update: (change: (draft: SiteContent) => void) => void;
  dirty: boolean;
  saving: boolean;
  save: () => Promise<void>;
  discard: () => void;
  /** Remet une partie du contenu comme à l'origine (dans le brouillon, à enregistrer ensuite). */
  restoreDefault: <K extends keyof SiteContent>(key: K) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

/** Brouillon commun à tous les écrans du dashboard : on modifie, puis on enregistre en une fois. */
export const DraftProvider = ({ children }: { children: ReactNode }) => {
  const { content, save: persist } = useContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Quand le contenu publié arrive (ou change ailleurs), on repart de lui si rien n'est en cours.
  useEffect(() => { if (!dirty) setDraft(content); }, [content, dirty]);

  // Prévient avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = useCallback((change: (draft: SiteContent) => void) => {
    setDraft((previous) => {
      const next = structuredClone(previous);
      change(next);
      return next;
    });
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await persist(draft);
      setDirty(false);
      toast.success("Modifications enregistrées");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }, [draft, persist]);

  const discard = useCallback(() => { setDraft(content); setDirty(false); }, [content]);

  const restoreDefault = useCallback(<K extends keyof SiteContent>(key: K) => {
    update((next) => { next[key] = structuredClone(defaultContent[key]); });
  }, [update]);

  const value = useMemo(() => ({ draft, update, dirty, saving, save, discard, restoreDefault }), [draft, update, dirty, saving, save, discard, restoreDefault]);
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
};

export const useDraft = () => {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within DraftProvider");
  return ctx;
};
