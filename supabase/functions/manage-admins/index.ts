import { createClient, type User } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/http.ts";
import { requireAdmin } from "../_shared/admin-auth.ts";

/**
 * Écran « Administrateurs » du dashboard : liste, ajout et retrait des admins.
 * Réservé à un admin avec double authentification. Tout est fait dans Supabase (comptes et rôles) ;
 * la clé de service ne quitte jamais le serveur.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BANNED = "876000h"; // ≈ 100 ans : compte désactivé

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Méthode non autorisée" }, 405);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const actor = await requireAdmin(db, req);
  if (!actor) return json(req, { error: "Accès refusé : reconnectez-vous avec votre code de double authentification." }, 403);

  const body = await req.json().catch(() => ({})) as { action?: string; email?: string; password?: string; userId?: string };
  const log = (action: string, target: string) =>
    db.from("admin_audit_log").insert({ actor_id: actor.id, actor_email: actor.email, action, target_email: target });

  // Tous les comptes (quelques-uns seulement : une page suffit largement).
  const allUsers = async (): Promise<User[]> => (await db.auth.admin.listUsers({ page: 1, perPage: 1000 })).data?.users ?? [];
  const adminIds = async () => new Set(((await db.from("user_roles").select("user_id").eq("role", "admin")).data ?? []).map((r) => r.user_id as string));

  try {
    if (body.action === "list") {
      const [users, ids, journal] = await Promise.all([allUsers(), adminIds(), db.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(50)]);
      const admins = users.filter((u) => ids.has(u.id)).map((u) => ({
        id: u.id,
        email: u.email,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        twoFactor: (u.factors ?? []).some((f) => f.status === "verified"),
        mustChangePassword: !!u.user_metadata?.must_change_password,
        isMe: u.id === actor.id,
      }));
      return json(req, { admins, journal: journal.data ?? [] });
    }

    if (body.action === "add") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      if (!EMAIL.test(email) || email.length > 254) return json(req, { error: "Adresse e-mail invalide." }, 400);
      const existing = (await allUsers()).find((u) => u.email?.toLowerCase() === email);
      let userId: string;
      if (existing) {
        // Compte déjà là (par exemple un admin retiré) : on le réactive.
        await db.auth.admin.updateUserById(existing.id, { ban_duration: "none" });
        userId = existing.id;
      } else {
        if (password.length < 12) return json(req, { error: "Mot de passe provisoire trop court : 12 caractères au minimum." }, 400);
        const { data, error } = await db.auth.admin.createUser({
          email, password, email_confirm: true,
          // Le nouvel admin choisit son propre mot de passe à sa première connexion.
          user_metadata: { must_change_password: true },
        });
        if (error || !data.user) return json(req, { error: `Création impossible : ${error?.message ?? "erreur inconnue"}` }, 400);
        userId = data.user.id;
      }
      const { error: roleError } = await db.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
      if (roleError) return json(req, { error: `Rôle non attribué : ${roleError.message}` }, 500);
      await log(existing ? "reactivation" : "ajout", email);
      return json(req, { ok: true, reactivated: !!existing });
    }

    if (body.action === "remove") {
      const userId = String(body.userId ?? "");
      if (userId === actor.id) return json(req, { error: "Vous ne pouvez pas vous retirer vous-même." }, 400);
      const ids = await adminIds();
      if (!ids.has(userId)) return json(req, { error: "Cet administrateur n'existe plus." }, 404);
      if (ids.size <= 1) return json(req, { error: "Impossible de retirer le dernier administrateur." }, 400);
      const target = (await db.auth.admin.getUserById(userId)).data?.user;
      await db.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      // Compte désactivé : plus de connexion possible, même avec le bon mot de passe.
      await db.auth.admin.updateUserById(userId, { ban_duration: BANNED });
      await log("retrait", target?.email ?? userId);
      return json(req, { ok: true });
    }

    return json(req, { error: "Action inconnue." }, 400);
  } catch (error) {
    console.error("manage-admins", error);
    return json(req, { error: "L'opération n'a pas pu aboutir. Réessayez." }, 500);
  }
});
