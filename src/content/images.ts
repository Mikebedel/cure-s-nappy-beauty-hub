/**
 * Bibliothèque des images livrées avec le site.
 * Le contenu enregistre une image soit par sa clé (« asset:huile-extra-pousse »),
 * soit par une adresse complète (image envoyée depuis le dashboard).
 * Passer par une clé évite de stocker des adresses qui changent à chaque mise en ligne.
 */
const bundled = import.meta.glob("/src/assets/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const hosted = import.meta.glob("/src/assets/*.asset.json", { eager: true, import: "default" }) as Record<string, { url: string }>;

const keyOf = (path: string) => path.split("/").pop()!.replace(/\.asset\.json$/, "").replace(/\.(jpe?g|png|webp)$/i, "");

const registry = new Map<string, string>();
for (const [path, url] of Object.entries(bundled)) registry.set(keyOf(path), url);
for (const [path, file] of Object.entries(hosted)) registry.set(keyOf(path), file.url);

const HIDDEN = new Set(["brand-wordmark"]);

export const imageLibrary = [...registry.entries()]
  .filter(([key]) => !HIDDEN.has(key))
  .map(([key, url]) => ({ ref: `asset:${key}`, key, url }))
  .sort((a, b) => a.key.localeCompare(b.key));

export const asset = (key: string) => `asset:${key}`;

export const resolveImage = (ref: string | undefined | null): string => {
  if (!ref) return "";
  if (ref.startsWith("asset:")) return registry.get(ref.slice(6)) ?? "";
  return ref;
};
