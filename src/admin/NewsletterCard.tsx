import { useConfirm } from "./useConfirm";
import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Mail, Download, Send, Trash2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Subscriber { id: string; email: string; source: string | null; created_at: string; is_active: boolean | null }

// Table ajoutée après la génération des types Supabase : client non typé.
const db = supabase as unknown as SupabaseClient;
const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

/** Inscrites à la newsletter (pied de page et page Contact) : nombre, liste, export, e-mail groupé. */
const NewsletterCard = () => {
  const [list, setList] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    const { data, error: err } = await db.from("newsletter_subscribers").select("id, email, source, created_at, is_active").order("created_at", { ascending: false });
    setError(!!err); setList((data as Subscriber[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const active = (list ?? []).filter((s) => s.is_active !== false);
  const exportCsv = () => {
    const rows = [["E-mail", "Inscrite le", "Provenance"], ...active.map((s) => [s.email, date(s.created_at), s.source === "contact" ? "Page Contact" : "Pied de page"])];
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    Object.assign(document.createElement("a"), { href: url, download: `newsletter-cures-nappy-${new Date().toISOString().slice(0, 10)}.csv` }).click();
    URL.revokeObjectURL(url);
  };
  // Un seul e-mail, toutes les adresses en copie cachée : personne ne voit les adresses des autres.
  const writeAll = () => { window.location.href = `mailto:?bcc=${encodeURIComponent(active.map((s) => s.email).join(","))}&subject=${encodeURIComponent("Cure's Nappy")}`; };
  const { confirm, dialog } = useConfirm();
  const remove = async (s: Subscriber) => {
    if (!(await confirm({ title: `Retirer ${s.email} de la newsletter ?`, confirmLabel: "Retirer", destructive: true }))) return;
    await db.from("newsletter_subscribers").delete().eq("id", s.id);
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg flex items-center gap-2"><Mail className="h-5 w-5" /> Newsletter</CardTitle>
        <Button size="icon" variant="ghost" onClick={load} aria-label="Actualiser la liste"><RefreshCw /></Button>
      </CardHeader>
      {dialog}
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{list === null ? "…" : active.length}</div>
          <div className="text-xs text-muted-foreground">Inscrite{active.length > 1 ? "s" : ""}</div>
        </div>
        {error && <p className="text-sm text-destructive">La liste n'a pas pu être chargée.</p>}
        <div className="grid gap-2">
          <Button variant="outline" onClick={writeAll} disabled={!active.length}><Send />Écrire à toutes (copie cachée)</Button>
          <Button variant="outline" onClick={exportCsv} disabled={!active.length}><Download />Exporter (Excel)</Button>
        </div>
        <ul className="divide-y divide-border max-h-80 overflow-y-auto">
          {active.length === 0 && list !== null && <li className="py-3 text-sm text-muted-foreground">Aucune inscrite pour le moment.</li>}
          {active.map((s) => (
            <li key={s.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium break-all">{s.email}</p>
                <p className="text-xs text-muted-foreground">{date(s.created_at)} · {s.source === "contact" ? "page Contact" : "pied de page"}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(s)} aria-label={`Retirer ${s.email}`}><Trash2 /></Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NewsletterCard;
