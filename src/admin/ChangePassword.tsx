import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Choix d'un nouveau mot de passe : obligatoire à la première connexion d'un admin ajouté, possible à tout moment ensuite. */
const ChangePassword = ({ required = false, onDone }: { required?: boolean; onDone?: () => void }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const tooShort = password.length > 0 && password.length < 12;
  const mismatch = confirm.length > 0 && confirm !== password;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 12 || password !== confirm) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password, data: { must_change_password: false } });
    setSaving(false);
    if (error) { toast.error(`Mot de passe non changé : ${error.message}`); return; }
    toast.success("Mot de passe enregistré");
    setPassword(""); setConfirm("");
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {required && <p className="text-sm text-muted-foreground">Vous vous connectez avec un mot de passe provisoire. Choisissez le vôtre : personne d'autre ne doit le connaître.</p>}
      <div className="space-y-1.5">
        <label htmlFor="new-password" className="block text-sm font-semibold">Nouveau mot de passe</label>
        <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className={`text-xs ${tooShort ? "text-destructive" : "text-muted-foreground"}`}>12 caractères au minimum. Une phrase facile à retenir marche très bien.</p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="block text-sm font-semibold">Confirmer</label>
        <Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {mismatch && <p className="text-xs text-destructive">Les deux mots de passe sont différents.</p>}
      </div>
      <Button type="submit" disabled={saving || password.length < 12 || password !== confirm}>{saving ? <Loader2 className="animate-spin" /> : <KeyRound />}Enregistrer le mot de passe</Button>
    </form>
  );
};

export default ChangePassword;
