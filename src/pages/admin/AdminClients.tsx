import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Users, UserCheck, UserX, Crown, MessageCircle, MessageSquare, Mail, Download, Send, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { MONEY_ORDER_COLUMNS, MoneyOrder, fcfa, firstName, moneyState, phoneDigits } from "@/admin/orderMoney";

type Segment = "fidele" | "client" | "prospect" | "inactif";

interface Client {
  phone: string;
  name: string;
  email: string | null;
  purchases: number;
  spent: number;
  lost: number;
  lastOrder: MoneyOrder;
  lastPurchaseAt: string | null;
  segment: Segment;
}

const segmentInfo: Record<Segment, { label: string; tone: string; hint: string }> = {
  fidele: { label: "Fidèle", tone: "bg-green-100 text-green-800", hint: "2 achats ou plus" },
  client: { label: "Client", tone: "bg-blue-100 text-blue-700", hint: "1 achat" },
  prospect: { label: "Vente non conclue", tone: "bg-red-100 text-red-700", hint: "A commandé sans payer" },
  inactif: { label: "Inactif", tone: "bg-gray-100 text-gray-700", hint: "Rien depuis 3 mois" },
};

const INACTIVE_AFTER_MS = 90 * 24 * 3600 * 1000;

/** Modèles de message : {prenom} et {commande} sont remplacés pour chaque cliente. */
const templates = [
  { id: "relance", label: "Relance vente non conclue", text: "Bonjour {prenom}, ici Cure's Nappy. Votre commande {commande} n'a pas été finalisée. Souhaitez-vous qu'on vous aide à la terminer ? Nous pouvons aussi vous la réserver." },
  { id: "merci", label: "Remerciement", text: "Bonjour {prenom}, merci pour votre confiance ! Comment se passe votre routine avec les soins Cure's Nappy ? Nous sommes là si vous avez une question." },
  { id: "nouveaute", label: "Nouveauté / promotion", text: "Bonjour {prenom}, Cure's Nappy a une nouveauté pour vos cheveux ! Découvrez-la sur notre boutique : " },
  { id: "libre", label: "Message libre", text: "Bonjour {prenom}, " },
];

/** Regroupe les commandes par numéro de téléphone : une ligne par cliente. */
const buildClients = (orders: MoneyOrder[]): Client[] => {
  const byPhone = new Map<string, MoneyOrder[]>();
  orders.forEach((o) => byPhone.set(phoneDigits(o.customer_phone), [...(byPhone.get(phoneDigits(o.customer_phone)) ?? []), o]));
  const now = Date.now();
  return [...byPhone.values()].map((list) => {
    const sorted = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));
    const paid = sorted.filter((o) => moneyState(o) === "encaissee");
    const lastPurchaseAt = paid[0]?.paid_at ?? paid[0]?.created_at ?? null;
    // Seules les tentatives faites après le dernier achat restent à relancer (les autres ont abouti ensuite).
    const lost = sorted.filter((o) => moneyState(o) === "non_conclue" && (!paid[0] || o.created_at > paid[0].created_at));
    const segment: Segment = paid.length === 0 ? "prospect"
      : lastPurchaseAt && now - new Date(lastPurchaseAt).getTime() > INACTIVE_AFTER_MS ? "inactif"
      : paid.length >= 2 ? "fidele" : "client";
    return {
      phone: sorted[0].customer_phone,
      name: sorted[0].customer_name,
      email: sorted.find((o) => o.customer_email)?.customer_email ?? null,
      purchases: paid.length,
      spent: paid.reduce((s, o) => s + o.total, 0),
      lost: lost.length,
      lastOrder: lost[0] ?? sorted[0],
      lastPurchaseAt,
      segment,
    };
  }).sort((a, b) => b.spent - a.spent || b.lastOrder.created_at.localeCompare(a.lastOrder.created_at));
};

const personalize = (text: string, c: Client) => text.replace(/\{prenom\}/g, firstName(c.name)).replace(/\{commande\}/g, c.lastOrder.order_number);
const links = (c: Client, text: string) => {
  const message = personalize(text, c);
  return {
    whatsapp: `https://wa.me/${phoneDigits(c.phone)}?text=${encodeURIComponent(message)}`,
    sms: `sms:+${phoneDigits(c.phone)}?&body=${encodeURIComponent(message)}`,
    email: c.email ? `mailto:${c.email}?subject=${encodeURIComponent("Cure's Nappy")}&body=${encodeURIComponent(message)}` : null,
  };
};

const AdminClients = () => {
  const [params, setParams] = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const segment = (params.get("segment") as Segment | null) ?? null;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [templateId, setTemplateId] = useState(segment === "prospect" ? "relance" : "merci");
  const [message, setMessage] = useState(templates.find((t) => t.id === templateId)!.text);
  const [queue, setQueue] = useState<{ channel: "whatsapp" | "sms"; list: Client[]; index: number } | null>(null);

  useEffect(() => {
    supabase.from("orders").select(MONEY_ORDER_COLUMNS).order("created_at", { ascending: false })
      .then(({ data }) => setClients(buildClients((data ?? []) as unknown as MoneyOrder[])));
  }, []);

  const counts = useMemo(() => {
    const c = { fidele: 0, client: 0, prospect: 0, inactif: 0 } as Record<Segment, number>;
    clients.forEach((x) => c[x.segment]++);
    return c;
  }, [clients]);

  const q = search.trim().toLowerCase();
  const filtered = clients.filter((c) => (!segment || c.segment === segment) && (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email ?? "").toLowerCase().includes(q)));
  const chosen = filtered.filter((c) => selected.has(c.phone));
  const allChosen = filtered.length > 0 && chosen.length === filtered.length;

  const pickTemplate = (id: string) => { setTemplateId(id); setMessage(templates.find((t) => t.id === id)!.text); };
  const setSegment = (s: Segment | null) => { setSelected(new Set()); if (s === "prospect") pickTemplate("relance"); setParams(s ? { segment: s } : {}); };
  const toggle = (phone: string) => setSelected((prev) => { const next = new Set(prev); if (next.has(phone)) next.delete(phone); else next.add(phone); return next; });

  // E-mail groupé : un seul e-mail, destinataires en copie cachée (personne ne voit les adresses des autres).
  const emailGroup = () => {
    const emails = chosen.map((c) => c.email).filter(Boolean) as string[];
    const generic = message.replace(/\{prenom\}/g, "").replace(/\{commande\}/g, "").replace(/\s+,/g, ",");
    window.location.href = `mailto:?bcc=${encodeURIComponent(emails.join(","))}&subject=${encodeURIComponent("Cure's Nappy")}&body=${encodeURIComponent(generic)}`;
  };

  const exportCsv = () => {
    const rows = [["Nom", "Téléphone", "E-mail", "Statut", "Achats payés", "Total payé (FCFA)", "Ventes non conclues"], ...filtered.map((c) => [c.name, c.phone, c.email ?? "", segmentInfo[c.segment].label, String(c.purchases), String(c.spent), String(c.lost)])];
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    Object.assign(document.createElement("a"), { href: url, download: `clients-cures-nappy-${new Date().toISOString().slice(0, 10)}.csv` }).click();
    URL.revokeObjectURL(url);
  };

  const current = queue ? queue.list[queue.index] : null;
  const stat = (label: string, value: number, Icon: typeof Users, tone: string, s: Segment | null) => (
    <button type="button" onClick={() => setSegment(segment === s ? null : s)} className={`text-left rounded-xl border bg-card p-4 flex items-center gap-3 transition-colors ${segment === s ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40"}`}>
      <Icon className={`h-7 w-7 shrink-0 ${tone}`} />
      <span><span className="block text-xl font-bold">{value}</span><span className="block text-xs text-muted-foreground">{label}</span></span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground text-sm">Toutes les personnes qui ont passé commande, avec ce qu'elles ont réellement payé. Relancez-les en un clic.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!filtered.length}><Download />Exporter (Excel)</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {stat("Tous", clients.length, Users, "text-primary", null)}
        {stat("Fidèles", counts.fidele, Crown, "text-amber-500", "fidele")}
        {stat("Clients (1 achat)", counts.client, UserCheck, "text-green-600", "client")}
        {stat("Ventes non conclues", counts.prospect, UserX, "text-red-500", "prospect")}
        {stat("Inactifs (3 mois)", counts.inactif, Users, "text-gray-500", "inactif")}
      </div>

      {/* Message à envoyer */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <Button key={t.id} type="button" size="sm" variant={templateId === t.id ? "default" : "outline"} onClick={() => pickTemplate(t.id)}>{t.label}</Button>
            ))}
          </div>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} aria-label="Message de relance" />
          <p className="text-xs text-muted-foreground">{"{prenom}"} et {"{commande}"} sont remplacés automatiquement pour chaque cliente. Le message s'ouvre dans WhatsApp, SMS ou votre messagerie : vous le relisez avant d'appuyer sur Envoyer.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher : nom, téléphone, e-mail…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
          <Checkbox checked={allChosen} onCheckedChange={(v) => setSelected(v ? new Set(filtered.map((c) => c.phone)) : new Set())} />
          Tout sélectionner
        </label>
      </div>

      {chosen.length > 0 && (
        <div className="sticky top-16 z-20 rounded-2xl border border-primary/40 bg-card p-3 shadow-soft flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold mr-2">{chosen.length} sélectionnée(s)</span>
          <Button size="sm" onClick={() => setQueue({ channel: "whatsapp", list: chosen, index: 0 })}><MessageCircle />Relancer sur WhatsApp</Button>
          <Button size="sm" variant="outline" onClick={() => setQueue({ channel: "sms", list: chosen, index: 0 })}><MessageSquare />Par SMS</Button>
          <Button size="sm" variant="outline" disabled={!chosen.some((c) => c.email)} onClick={emailGroup}><Mail />Par e-mail ({chosen.filter((c) => c.email).length})</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}><X />Annuler</Button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">Aucun client dans cette liste pour le moment.</p>}
        {filtered.map((c) => {
          const l = links(c, message);
          const info = segmentInfo[c.segment];
          return (
            <Card key={c.phone} className={selected.has(c.phone) ? "border-primary" : ""}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Checkbox className="mt-1" checked={selected.has(c.phone)} onCheckedChange={() => toggle(c.phone)} aria-label={`Sélectionner ${c.name}`} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm">{c.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${info.tone}`} title={info.hint}>{info.label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground break-all">{c.phone}{c.email && ` · ${c.email}`}</div>
                    <div className="text-xs mt-1">
                      <strong>{fcfa(c.spent)}</strong> payés · {c.purchases} achat(s)
                      {c.lost > 0 && <span className="text-red-600"> · {c.lost} vente(s) non conclue(s), dernière : {c.lastOrder.order_number}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:shrink-0 pl-7 sm:pl-0">
                  <Button asChild size="sm" className="bg-[#25D366] text-white hover:bg-[#1fb658]"><a href={l.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
                  <Button asChild size="sm" variant="outline"><a href={l.sms}><MessageSquare />SMS</a></Button>
                  {l.email ? <Button asChild size="sm" variant="outline"><a href={l.email}><Mail />E-mail</a></Button>
                    : <Button size="sm" variant="outline" disabled title="Pas d'e-mail renseigné"><Mail />E-mail</Button>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Relance groupée WhatsApp / SMS : une conversation après l'autre. */}
      <Dialog open={!!queue} onOpenChange={(open) => !open && setQueue(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-3xl">
          {queue && current && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">Relance {queue.channel === "whatsapp" ? "WhatsApp" : "SMS"} · {queue.index + 1} / {queue.list.length}</DialogTitle>
                <DialogDescription>WhatsApp et les SMS n'autorisent pas l'envoi automatique en masse : chaque message s'ouvre déjà rempli, vous appuyez sur Envoyer, puis revenez ici pour la suivante.</DialogDescription>
              </DialogHeader>
              <div className="rounded-2xl bg-muted p-3 text-sm">
                <p className="font-semibold">{current.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{current.phone}</p>
                <p className="whitespace-pre-wrap">{personalize(message, current)}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-between">
                <Button asChild className={queue.channel === "whatsapp" ? "bg-[#25D366] text-white hover:bg-[#1fb658]" : ""}>
                  <a href={links(current, message)[queue.channel]} target={queue.channel === "whatsapp" ? "_blank" : undefined} rel="noopener noreferrer"
                    onClick={() => setTimeout(() => setQueue((qq) => qq && (qq.index + 1 < qq.list.length ? { ...qq, index: qq.index + 1 } : qq)), 400)}>
                    <Send />Ouvrir {queue.channel === "whatsapp" ? "WhatsApp" : "les SMS"}
                  </a>
                </Button>
                <div className="flex gap-2">
                  {queue.index + 1 < queue.list.length
                    ? <Button variant="outline" onClick={() => setQueue({ ...queue, index: queue.index + 1 })}>Passer</Button>
                    : <Button variant="outline" onClick={() => setQueue(null)}>Terminer</Button>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClients;
