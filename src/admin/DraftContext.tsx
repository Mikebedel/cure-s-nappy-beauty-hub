import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";
import type { SiteContent } from "@/content/types";
import { defaultContent } from "@/content/defaults";
import { mergeContent } from "@/content/store";
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

/**
 * Modifications pas encore enregistrées, gardées dans le navigateur : un rechargement de la page
 * (mise à jour du site, fermeture par erreur, téléphone qui coupe l'onglet) ne les fait plus disparaître.
 */
const UNSAVED_KEY = "curesnappy-admin-unsaved";
const readUnsaved = (): SiteContent | null => {
  try {
    const raw = localStorage.getItem(UNSAVED_KEY);
    return raw ? (JSON.parse(raw).draft as SiteContent) : null;
  } catch { return null; }
};
const writeUnsaved = (draft: SiteContent) => {
  try { localStorage.setItem(UNSAVED_KEY, JSON.stringify({ draft, at: new Date().toISOString() })); } catch { /* stockage plein ou bloqué */ }
};
const clearUnsaved = () => { try { localStorage.removeItem(UNSAVED_KEY); } catch { /* rien */ } };

/** Brouillon commun à tous les écrans du dashboard : on modifie, puis on enregistre en une fois. */
export const DraftProvider = ({ children }: { children: ReactNode }) => {
  const { content, save: persist } = useContent();
  const [restored] = useState(readUnsaved);
  const [draft, setDraft] = useState<SiteContent>(() => (restored ? mergeContent(defaultContent, restored) : content));
  const [dirty, setDirty] = useState(!!restored);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restored) toast.info("Vos modifications non enregistrées ont été retrouvées. Cliquez sur « Enregistrer » pour les publier, ou « Annuler » pour les abandonner.", { duration: 10000 });
  }, [restored]);

  // Chaque modification non enregistrée est gardée dans le navigateur jusqu'à « Enregistrer » ou « Annuler ».
  useEffect(() => { if (dirty) writeUnsaved(draft); }, [draft, dirty]);

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
      clearUnsaved();
      toast.success("Modifications enregistrées");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }, [draft, persist]);

  const discard = useCallback(() => { setDraft(content); setDirty(false); clearUnsaved(); }, [content]);

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
