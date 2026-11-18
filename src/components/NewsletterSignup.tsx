import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/content/ContentProvider";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
type State = "idle" | "sending" | "done" | "already" | "error";

/**
 * Inscription à la newsletter : une bande discrète et allongée (au-dessus du pied de page, et sur la page Contact).
 * L'adresse est enregistrée dans la table newsletter_subscribers ; seuls les admins peuvent lire la liste.
 */
const NewsletterSignup = ({ source = "footer", className = "" }: { source?: "footer" | "contact"; className?: string }) => {
  const n = useContent().content.footer.newsletter;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [invalid, setInvalid] = useState(false);
  if (!n.visible) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value) || value.length > 254) { setInvalid(true); return; }
    setInvalid(false); setState("sending");
    // Table ajoutée après la génération des types Supabase : client non typé pour cet appel.
    const { error } = await (supabase as unknown as SupabaseClient).from("newsletter_subscribers").insert({ email: value, source });
    if (!error) { setState("done"); setEmail(""); return; }
    setState(error.code === "23505" ? "already" : "error");
  };

  const message = state === "done" ? n.success : state === "already" ? n.already : state === "error" ? "L'inscription n'a pas pu aboutir. Réessaie dans un instant." : "";
  return (
    <div className={`motif relative [--motif-opacity:0.06] rounded-[1.75rem] border border-border bg-card px-4 py-4 sm:px-5 sm:py-5 md:px-8 md:py-6 flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-8 ${className}`}>
      <div className="flex items-start gap-4 min-w-0 lg:flex-1">
        <span className="hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Mail className="h-5 w-5" strokeWidth={1.7} /></span>
        <div className="min-w-0">
          <h3 className="font-heading font-semibold text-base sm:text-lg leading-snug flex items-center gap-2"><Mail className="sm:hidden h-4 w-4 text-primary" />{n.title}</h3>
          <p className="text-sm text-muted-foreground leading-snug sm:leading-relaxed">{n.text}</p>
        </div>
      </div>
      <div className="lg:w-[440px] shrink-0">
        {state === "done" || state === "already" ? (
          <p role="status" className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"><Check className="h-4 w-4 shrink-0" />{message}</p>
        ) : (
          <form onSubmit={submit} className="flex flex-row gap-2" noValidate>
            <label htmlFor={`newsletter-${source}`} className="sr-only">{n.placeholder}</label>
            <Input id={`newsletter-${source}`} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setInvalid(false); }}
              placeholder={n.placeholder} aria-invalid={invalid} className={`flex-1 min-w-0 ${invalid ? "border-destructive" : ""}`} />
            <Button type="submit" disabled={state === "sending"} className="shrink-0 px-4 sm:px-5">
              {state === "sending" ? <Loader2 className="animate-spin" /> : null}{n.button}
            </Button>
          </form>
        )}
        <p className={`mt-2 text-xs ${invalid || state === "error" ? "text-destructive" : "text-muted-foreground"}`} role={invalid || state === "error" ? "alert" : undefined}>
          {invalid ? "Vérifie ton adresse e-mail." : state === "error" ? message : n.privacy}
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
