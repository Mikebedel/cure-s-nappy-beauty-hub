import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Loader2, LogOut, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Step =
  | { kind: "loading" }
  | { kind: "enroll"; factorId: string; qr: string; secret: string }
  | { kind: "verify"; factorId: string }
  | { kind: "error"; message: string };

const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 60;

/**
 * Double authentification de l'administration (code à 6 chiffres d'une application :
 * Google Authenticator, Microsoft Authenticator, Authy…).
 * Première connexion : on relie l'application en scannant un QR code. Ensuite : on saisit le code.
 */
const AdminMfa = () => {
  const { refreshAal, signOut, user } = useAuth();
  const [step, setStep] = useState<Step>({ kind: "loading" });
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) { setStep({ kind: "error", message: "Impossible de vérifier la double authentification. Réessayez." }); return; }
      const verified = data.totp.find((f) => f.status === "verified");
      if (verified) { setStep({ kind: "verify", factorId: verified.id }); return; }
      // Aucun appareil relié : on retire les tentatives inachevées puis on en prépare une nouvelle.
      for (const factor of data.all.filter((f) => f.factor_type === "totp" && f.status !== "verified")) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
      const { data: enrolled, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `Cure's Nappy admin ${new Date().toISOString().slice(0, 10)}` });
      if (enrollError || !enrolled) { setStep({ kind: "error", message: "Impossible de préparer la double authentification. Vérifiez qu'elle est activée dans Supabase." }); return; }
      setStep({ kind: "enroll", factorId: enrolled.id, qr: enrolled.totp.qr_code, secret: enrolled.totp.secret });
    })();
  }, []);

  useEffect(() => {
    if (lockedUntil <= Date.now()) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  const locked = lockedUntil > now;
  const remaining = Math.ceil((lockedUntil - now) / 1000);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step.kind !== "enroll" && step.kind !== "verify") return;
    if (locked || !/^\d{6}$/.test(code)) { setMessage("Saisissez les 6 chiffres affichés dans l'application."); return; }
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: step.factorId, code });
    setBusy(false);
    setCode("");
    if (error) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setAttempts(0);
        setLockedUntil(Date.now() + LOCK_SECONDS * 1000);
        setNow(Date.now());
        setMessage(`Trop d'essais. Patientez ${LOCK_SECONDS} secondes.`);
      } else {
        setMessage("Code incorrect ou expiré. Utilisez le code affiché en ce moment.");
      }
      return;
    }
    await refreshAal();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-soft p-6 sm:p-8">
        <ShieldCheck className="h-10 w-10 text-primary mb-3" />
        <h1 className="font-heading text-2xl font-bold mb-1">Double authentification</h1>
        <p className="text-sm text-muted-foreground mb-6">Compte : {user?.email}</p>

        {step.kind === "loading" && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Chargement" /></div>}

        {step.kind === "error" && <p role="alert" className="text-sm text-destructive mb-4">{step.message}</p>}

        {step.kind === "enroll" && (
          <div className="space-y-4 mb-6 text-sm">
            <p className="flex gap-2"><Smartphone className="h-5 w-5 shrink-0 text-primary" />Première connexion : reliez votre téléphone. Installez <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong> ou <strong>Authy</strong>, puis scannez ce code.</p>
            <div className="flex justify-center rounded-2xl bg-white p-4 border border-border">
              <img src={step.qr} alt="QR code à scanner avec l'application d'authentification" className="h-48 w-48" />
            </div>
            <details className="rounded-xl bg-secondary/60 px-4 py-3">
              <summary className="cursor-pointer font-semibold">Impossible de scanner ?</summary>
              <p className="mt-2">Saisissez cette clé dans l'application :</p>
              <code className="mt-1 block break-all font-mono text-xs bg-background rounded-lg p-2 select-all">{step.secret}</code>
            </details>
            <p>Saisissez ensuite le code à 6 chiffres affiché par l'application.</p>
          </div>
        )}

        {(step.kind === "enroll" || step.kind === "verify") && (
          <form onSubmit={submit} className="space-y-4">
            {step.kind === "verify" && <p className="text-sm">Ouvrez votre application d'authentification et saisissez le code à 6 chiffres de Cure's Nappy.</p>}
            <div>
              <label htmlFor="mfa-code" className="block text-sm font-semibold mb-1.5">Code à 6 chiffres</label>
              <Input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} autoFocus
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="text-center text-2xl tracking-[0.5em] font-mono h-14" disabled={locked} />
            </div>
            {message && <p role="alert" className="text-sm text-destructive">{locked ? `Trop d'essais. Patientez ${remaining} s.` : message}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={busy || locked || code.length !== 6}>
              {busy ? <Loader2 className="animate-spin" /> : <ShieldCheck />}{step.kind === "enroll" ? "Activer et continuer" : "Vérifier"}
            </Button>
          </form>
        )}

        <Button variant="ghost" className="w-full mt-3" onClick={() => signOut()}><LogOut />Se déconnecter</Button>
        <p className="text-xs text-muted-foreground mt-4">Téléphone perdu ? Un autre administrateur ou la console Supabase (Authentication → Users) peut retirer l'appareil relié à ce compte.</p>
      </div>
    </div>
  );
};

export default AdminMfa;
