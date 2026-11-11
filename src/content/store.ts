import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { SiteContent } from "./types";

// La table site_content n'est pas encore dans les types générés : on passe par un client non typé.
const db = supabase as unknown as SupabaseClient;

const TABLE = "site_content";
const ROW_ID = "main";
const BUCKET = "site-images";
const DRAFT_KEY = "curesnappy-content-draft";

export type BackendStatus = "checking" | "online" | "offline" | "not-set-up";

const isNetworkError = (message = "") => /fetch|network|load failed|timeout|ENOTFOUND|ERR_/i.test(message);
const isMissingTable = (code = "", message = "") => code === "PGRST205" || code === "42P01" || /does not exist|could not find the table/i.test(message);

const withTimeout = <T,>(promise: PromiseLike<T>, ms: number) =>
  Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

/** Lit le contenu enregistré dans la base. */
export const loadRemote = async (): Promise<{ status: BackendStatus; data: Partial<SiteContent> | null; updatedAt: string | null }> => {
  try {
    const { data, error } = await withTimeout(db.from(TABLE).select("data, updated_at").eq("id", ROW_ID).maybeSingle(), 4000);
    if (error) {
      if (isMissingTable(error.code, error.message)) return { status: "not-set-up", data: null, updatedAt: null };
      if (isNetworkError(error.message)) return { status: "offline", data: null, updatedAt: null };
      return { status: "online", data: null, updatedAt: null };
    }
    return { status: "online", data: (data?.data as Partial<SiteContent>) ?? null, updatedAt: data?.updated_at ?? null };
  } catch {
    return { status: "offline", data: null, updatedAt: null };
  }
};

export const saveRemote = async (content: SiteContent) => {
  const { error } = await db.from(TABLE).upsert({ id: ROW_ID, data: content, updated_at: new Date().toISOString() });
  if (error) throw new Error(isMissingTable(error.code, error.message)
    ? "La table du contenu n'existe pas encore dans la base : appliquez la migration du dossier supabase/migrations."
    : error.message);
};

export const loadDraft = (): Partial<SiteContent> | null => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<SiteContent>) : null;
  } catch {
    return null;
  }
};

export const saveDraft = (content: SiteContent) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
  } catch {
    throw new Error("Le navigateur n'a plus de place pour l'aperçu local (trop d'images envoyées). Retirez quelques images ou activez la base.");
  }
};

export const clearDraft = () => {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* stockage indisponible */ }
};

/** Réduit une image avant de l'envoyer : 1600 px de large au plus, en JPEG. */
const shrink = (file: File, maxSize: number, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Image illisible"))), "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image illisible")); };
    img.src = url;
  });

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(blob); });

/** Envoie une image : dans la base en ligne, ou dans le navigateur en aperçu local. */
export const uploadImage = async (file: File, mode: "remote" | "local"): Promise<string> => {
  if (mode === "local") return blobToDataUrl(await shrink(file, 1000, 0.8));
  const blob = await shrink(file, 1600, 0.86);
  const path = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await db.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw new Error(error.message);
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

/** Fusionne un contenu enregistré avec le contenu d'origine : les champs ajoutés plus tard gardent leur valeur par défaut. */
export const mergeContent = <T,>(base: T, stored: unknown): T => {
  if (stored === undefined || stored === null) return base;
  if (Array.isArray(base)) return (Array.isArray(stored) ? stored : base) as T;
  if (typeof base === "object" && base !== null) {
    if (typeof stored !== "object" || Array.isArray(stored)) return base;
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(base as Record<string, unknown>)) {
      result[key] = mergeContent((base as Record<string, unknown>)[key], (stored as Record<string, unknown>)[key]);
    }
    return result as T;
  }
  return (typeof stored === typeof base ? stored : base) as T;
};
