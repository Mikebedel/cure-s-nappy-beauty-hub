import { useCallback, useEffect, useState } from "react";
import { Copy, Loader2, RefreshCw, ShieldCheck, ShieldAlert, UserMinus, UserPlus, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTitle, Panel } from "@/admin/fields";
import { useConfirm } from "@/admin/useConfirm";
import ChangePassword from "@/admin/ChangePassword";
import { copyText } from "@/components/ShareSheet";

interface AdminRow { id: string; email: string; createdAt: string; lastSignInAt: string | null; twoFactor: boolean; mustChangePassword: boolean; isMe: boolean }
interface JournalRow { id: string; actor_email: string | null; action: "ajout" | "retrait" | "reactivation"; target_email: string; created_at: string }

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "jamais");
const actionLabel = { ajout: "a ajouté", retrait: "a retiré", reactivation: "a réactivé" } as const;

/** Mot de passe provisoire solide (16 caractères, sans caractères ambigus). */
const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_!";
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

/** Erreur renvoyée par la fonction serveur (message lisible), sinon un message général. */
const errorText = async (error: unknown) => {
  const context = (error as { context?: Response })?.context;
  try { const body = await context?.json(); if (body?.error) return body.error as string; } catch { /* rien */ }
  return "Opération impossible. Vérifiez votre connexion et réessayez.";
};

const AdminTeam = () => {
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [journal, setJournal] = useState<JournalRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generatePassword);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<{ email: string; password: string | null } | null>(null);
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoadError(null);
    const { data, error } = await supabase.functions.invoke("manage-admins", { body: { action: "list" } });
    if (error) { setLoadError(await errorText(error)); return; }
    setAdmins(data.admins); setJournal(data.journal);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(target)) { toast.error("Adresse e-mail invalide."); return; }
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("manage-admins", { body: { action: "add", email: target, password } });
    setBusy(false);
    if (error) { toast.error(await errorText(error)); return; }
    setAdded({ email: target, password: data.reactivated ? null : password });
    setEmail(""); setPassword(generatePassword());
    toast.success(data.reactivated ? "Accès admin réactivé" : "Administrateur ajouté");
    load();
  };

  const remove = async (admin: AdminRow) => {
    const ok = await confirm({
      title: `Retirer ${admin.email} ?`,
      description: "Son accès à l'administration est supprimé tout de suite et son compte est désactivé. Vous pourrez le réactiver plus tard en l'ajoutant à nouveau.",
      confirmLabel: "Retirer", destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.functions.invoke("manage-admins", { body: { action: "remove", userId: admin.id } });
    if (error) { toast.error(await errorText(error)); return; }
    toast.success(`${admin.email} n'est plus administrateur`);
    load();
  };

  const loginUrl = `${window.location.origin}/admin/login`;
  const message = added && added.password
    ? `Bonjour, voici ton accès à l'administration Cure's Nappy :\n${loginUrl}\nE-mail : ${added.email}\nMot de passe provisoire : ${added.password}\nÀ la première connexion, tu choisiras ton mot de passe et tu activeras la double authentification (Google Authenticator).`
    : null;

  return (
    <div className="space-y-4">
      {dialog}
      <PageTitle title="Administrateurs" description="Les personnes qui peuvent se connecter à cette administration. Tout est enregistré directement dans Supabase." />

      <Panel title={`Administrateurs${admins ? ` (${admins.length})` : ""}`} defaultOpen aside={<Button variant="ghost" size="icon" onClick={load} aria-label="Actualiser"><RefreshCw /></Button>}>
        {loadError && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{loadError}</p>}
        {!admins && !loadError && <Loader2 className="animate-spin text-primary" aria-label="Chargement" />}
        <ul className="divide-y divide-border">
          {admins?.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold break-all">{a.email}{a.isMe && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">vous</span>}</p>
                <p className="text-xs text-muted-foreground">Ajouté le {when(a.createdAt)} · dernière connexion : {when(a.lastSignInAt)}</p>
                <p className="mt-1 flex flex-wrap gap-2 text-xs">
                  {a.twoFactor
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-800"><ShieldCheck className="h-3.5 w-3.5" />Double authentification active</span>
                    : <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-900"><ShieldAlert className="h-3.5 w-3.5" />Pas encore connecté (double authentification à activer)</span>}
                  {a.mustChangePassword && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900">Mot de passe provisoire</span>}
                </p>
              </div>
              {!a.isMe && <Button variant="outline" size="sm" className="text-destructive" onClick={() => remove(a)}><UserMinus />Retirer</Button>}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Ajouter un administrateur" defaultOpen>
        <form onSubmit={add} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-sm font-semibold">Son adresse e-mail</label>
            <Input id="admin-email" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom@exemple.com" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-sm font-semibold">Mot de passe provisoire</label>
            <div className="flex gap-2">
              <Input id="admin-password" value={password} onChange={(e) => setPassword(e.target.value)} className="font-mono" autoComplete="off" />
              <Button type="button" variant="outline" onClick={() => setPassword(generatePassword())} aria-label="Générer un autre mot de passe"><Wand2 /></Button>
            </div>
            <p className="text-xs text-muted-foreground">Généré au hasard. La personne le remplace par le sien à sa première connexion. Ignoré si le compte existe déjà (réactivation).</p>
          </div>
          <Button type="submit" disabled={busy || !email.trim() || password.length < 12}>{busy ? <Loader2 className="animate-spin" /> : <UserPlus />}Ajouter</Button>
        </form>
        {message && (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-secondary/60 p-4 text-sm">
            <p className="font-semibold mb-2">À envoyer à {added?.email} (par WhatsApp, en message privé) :</p>
            <pre className="whitespace-pre-wrap break-all font-sans text-muted-foreground">{message}</pre>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => copyText(message)}><Copy />Copier le message</Button>
          </div>
        )}
      </Panel>

      <Panel title="Mon mot de passe">
        <ChangePassword />
      </Panel>

      <Panel title="Journal" description="Qui a ajouté ou retiré qui, et quand">
        {journal.length === 0
          ? <p className="text-sm text-muted-foreground">Aucun changement pour l'instant.</p>
          : <ul className="space-y-1.5 text-sm">{journal.map((j) => <li key={j.id}><span className="text-muted-foreground">{when(j.created_at)} —</span> {j.actor_email ?? "?"} {actionLabel[j.action]} <strong className="break-all">{j.target_email}</strong></li>)}</ul>}
      </Panel>
    </div>
  );
};

export default AdminTeam;
