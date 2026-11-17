import type { SupabaseClient, User } from "npm:@supabase/supabase-js@2";

/**
 * Vérifie que la requête vient d'un admin connecté avec la double authentification (aal2).
 * Renvoie l'utilisateur, ou null : la fonction doit alors refuser.
 */
export async function requireAdmin(db: SupabaseClient, req: Request): Promise<User | null> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data } = await db.auth.getUser(token);
  const user = data?.user;
  if (!user) return null;
  // Le jeton vient d'être validé par getUser : on peut lire son niveau d'authentification.
  let aal = "";
  try { aal = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).aal ?? ""; } catch { aal = ""; }
  if (aal !== "aal2") return null;
  const { data: role } = await db.from("user_roles").select("id").eq("user_id", user.id).eq("role", "admin").maybeSingle();
  return role ? user : null;
}
