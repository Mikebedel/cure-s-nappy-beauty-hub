import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Phone, MessageCircle, Printer, Truck, RefreshCw, Download, MapPin, PackageCheck, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/content/ContentProvider";
import { paymentMethodLabels } from "@/content/payment";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_commune: string;
  delivery_address: string;
  delivery_zone: string | null;
  delivery_estimate: string | null;
  delivery_fee: number;
  delivery_fee_confirmed: boolean | null;
  subtotal: number;
  total: number;
  status: string;
  payment_method: string | null;
  payment_status: string | null;
  payment_channel: string | null;
  paid_at: string | null;
  receipt_token: string | null;
  created_at: string;
}

interface OrderItem { product_name: string; product_price: number; quantity: number }

const steps = ["nouvelle", "en_preparation", "expediee", "livree"] as const;
const statusLabel: Record<string, string> = { nouvelle: "Nouvelle", en_preparation: "En préparation", expediee: "Expédiée", livree: "Livrée", annulee: "Annulée" };
const statusColor: Record<string, string> = {
  nouvelle: "bg-blue-100 text-blue-800", en_preparation: "bg-amber-100 text-amber-800", expediee: "bg-purple-100 text-purple-800",
  livree: "bg-green-100 text-green-800", annulee: "bg-red-100 text-red-800",
};
const zoneLabel: Record<string, string> = { abidjan: "Livraison Abidjan", national: "Expédition Côte d'Ivoire", international: "Expédition internationale" };

const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
const when = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const digits = (phone: string) => phone.replace(/\D/g, "");

/** Ce que l'état du paiement veut dire pour l'équipe. */
const payment = (o: Order) => {
  if (o.payment_status === "payee") return { label: `Payée${o.payment_channel ? ` · ${paymentMethodLabels[o.payment_channel as keyof typeof paymentMethodLabels] ?? o.payment_channel}` : ""}`, tone: "bg-green-600 text-white", paid: true };
  if (o.payment_status === "echouee") return { label: "Paiement échoué", tone: "bg-red-100 text-red-800", paid: false };
  if (o.payment_method === "jeko") return { label: "Paiement en attente", tone: "bg-amber-100 text-amber-800", paid: false };
  return { label: "À régler avec le client", tone: "bg-secondary text-foreground", paid: false };
};

/** À traiter : payée, ou à régler avec le client, et pas encore livrée. */
const toHandle = (o: Order) => (o.payment_status === "payee" || o.payment_method !== "jeko") && ["nouvelle", "en_preparation", "expediee"].includes(o.status);

type View = "a_traiter" | "toutes" | (typeof steps)[number] | "annulee";

/** Bon de livraison imprimable, à remettre (ou envoyer) au livreur. */
const printSlip = (o: Order, items: OrderItem[], shop: { name: string; phone: string }) => {
  const toCollect = o.payment_status === "payee" ? 0 : o.total;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bon de livraison ${esc(o.order_number)}</title>
<style>body{font:14px/1.5 Arial,sans-serif;color:#111;margin:24px}h1{font-size:20px;margin:0 0 4px}.muted{color:#555}.box{border:2px solid #111;border-radius:10px;padding:12px 14px;margin:14px 0}
table{width:100%;border-collapse:collapse;margin-top:8px}td,th{border-bottom:1px solid #ccc;padding:6px 4px;text-align:left}th:last-child,td:last-child{text-align:right}
.big{font-size:22px;font-weight:bold}.sign{margin-top:40px;display:flex;gap:40px}.sign div{flex:1;border-top:1px solid #111;padding-top:4px}</style></head><body>
<h1>BON DE LIVRAISON — ${esc(o.order_number)}</h1><div class="muted">${esc(shop.name)} · ${esc(shop.phone)} · commandé le ${esc(when(o.created_at))}</div>
<div class="box"><div class="muted">Client</div><div class="big">${esc(o.customer_name)}</div><div class="big">${esc(o.customer_phone)}</div></div>
<div class="box"><div class="muted">${esc(zoneLabel[o.delivery_zone ?? "abidjan"] ?? "Livraison")}</div><div class="big">${esc(o.delivery_commune)}</div><div>${esc(o.delivery_address)}</div></div>
<table><thead><tr><th>Article</th><th>Qté</th></tr></thead><tbody>${items.map((i) => `<tr><td>${esc(i.product_name)}</td><td>${i.quantity}</td></tr>`).join("")}</tbody></table>
<div class="box"><div class="muted">${toCollect ? "MONTANT À ENCAISSER AUPRÈS DU CLIENT" : "DÉJÀ PAYÉ EN LIGNE — RIEN À ENCAISSER"}</div><div class="big">${toCollect ? esc(fcfa(toCollect)) : "0 FCFA"}</div></div>
<div class="sign"><div>Signature du livreur</div><div>Signature du client</div></div>
<script>window.onload=()=>{window.print()}</script></body></html>`;
  const win = window.open("", "_blank", "width=720,height=900");
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  return true;
};

const AdminOrders = () => {
  const { contact } = useContent().content;
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<View>("a_traiter");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
    setFailed(!!error);
    if (data) setOrders(data as unknown as Order[]);
    setLoading(false);
  }, []);

  // Les nouvelles commandes apparaissent toutes seules (toutes les 30 secondes).
  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!selectedId) return;
    setItems([]);
    supabase.from("order_items").select("product_name, product_price, quantity").eq("order_id", selectedId)
      .then(({ data }) => setItems((data as OrderItem[]) ?? []));
  }, [selectedId]);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de changer le statut.", variant: "destructive" });
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    toast({ title: `Commande ${statusLabel[status]?.toLowerCase() ?? status}` });
  };

  const counts = useMemo(() => ({
    a_traiter: orders.filter(toHandle).length,
    nouvelle: orders.filter((o) => o.status === "nouvelle").length,
  }), [orders]);

  const filtered = orders.filter((o) => {
    const inView = view === "toutes" ? true : view === "a_traiter" ? toHandle(o) : o.status === view;
    const q = search.trim().toLowerCase();
    const inSearch = !q || [o.customer_name, o.order_number, o.customer_phone, o.delivery_commune].some((v) => v?.toLowerCase().includes(q));
    return inView && inSearch;
  });

  const detail = orders.find((o) => o.id === selectedId);

  /** Liste des commandes affichées, à ouvrir dans un tableur. */
  const exportCsv = () => {
    const header = ["Numéro", "Date", "Client", "Téléphone", "Zone", "Lieu", "Adresse", "Total", "Paiement", "Statut"];
    const rows = filtered.map((o) => [o.order_number, when(o.created_at), o.customer_name, o.customer_phone, zoneLabel[o.delivery_zone ?? ""] ?? "", o.delivery_commune, o.delivery_address, o.total, payment(o).label, statusLabel[o.status] ?? o.status]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const courierText = (o: Order) => [
    `Livraison ${o.order_number}`,
    `Client : ${o.customer_name} — ${o.customer_phone}`,
    `Lieu : ${o.delivery_commune}`,
    `Adresse : ${o.delivery_address}`,
    ...items.map((i) => `• ${i.product_name} × ${i.quantity}`),
    o.payment_status === "payee" ? "Déjà payé : rien à encaisser." : `À encaisser : ${fcfa(o.total)}`,
  ].join("\n");

  const views: { id: View; label: string }[] = [
    { id: "a_traiter", label: `À traiter (${counts.a_traiter})` },
    { id: "nouvelle", label: `Nouvelles (${counts.nouvelle})` },
    { id: "en_preparation", label: "En préparation" },
    { id: "expediee", label: "Expédiées" },
    { id: "livree", label: "Livrées" },
    { id: "annulee", label: "Annulées" },
    { id: "toutes", label: "Toutes" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Commandes</h1>
          <p className="text-muted-foreground text-sm">{orders.length} commande{orders.length > 1 ? "s" : ""} · mise à jour automatique toutes les 30 secondes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setLoading(true); load(); }}><RefreshCw className={loading ? "animate-spin" : ""} />Actualiser</Button>
          <Button variant="outline" onClick={exportCsv} disabled={!filtered.length}><Download />Exporter</Button>
        </div>
      </div>

      {failed && <p role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">Les commandes n'ont pas pu être chargées : la base de données est injoignable ou la session a expiré.</p>}

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer les commandes">
        {views.map((v) => (
          <button key={v.id} type="button" role="tab" aria-selected={view === v.id} onClick={() => setView(v.id)}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors ${view === v.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/60"}`}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher : nom, numéro de commande, téléphone, commune…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-5 items-start">
        <div className="space-y-2.5">
          {!loading && filtered.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">Aucune commande ici.</p>}
          {filtered.map((o) => {
            const pay = payment(o);
            return (
              <button key={o.id} type="button" onClick={() => setSelectedId(o.id)}
                className={`w-full text-left rounded-2xl border bg-card p-4 transition-shadow hover:shadow-soft ${selectedId === o.id ? "ring-2 ring-primary border-primary" : "border-border"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{o.order_number} · {when(o.created_at)}</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{o.delivery_commune}</span></p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <p className="font-bold">{fcfa(o.total)}</p>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${pay.tone}`}>{pay.label}</span>
                  </div>
                </div>
                <span className={`mt-2 inline-block text-xs px-2.5 py-0.5 rounded-full ${statusColor[o.status] ?? "bg-secondary"}`}>{statusLabel[o.status] ?? o.status}</span>
              </button>
            );
          })}
        </div>

        {detail ? (() => {
          const pay = payment(detail);
          const stepIndex = steps.indexOf(detail.status as (typeof steps)[number]);
          const next = stepIndex >= 0 && stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null;
          return (
            <section className="bg-card border border-border rounded-3xl p-5 space-y-5 lg:sticky lg:top-24" aria-label={`Commande ${detail.order_number}`}>
              <header className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-heading text-xl font-bold">{detail.order_number}</h2>
                  <p className="text-xs text-muted-foreground">Commandée le {when(detail.created_at)}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pay.tone}`}>{pay.label}</span>
              </header>

              {/* Avancement */}
              <ol className="flex items-center gap-1" aria-label="Avancement">
                {steps.map((s, i) => (
                  <li key={s} className={`flex-1 rounded-full px-2 py-1 text-center text-[11px] font-semibold ${detail.status === "annulee" ? "bg-secondary text-muted-foreground" : i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{statusLabel[s]}</li>
                ))}
              </ol>

              <div className="space-y-1 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Client</p>
                <p className="font-semibold text-base">{detail.customer_name}</p>
                <p>{detail.customer_phone}</p>
                {detail.customer_email && <p className="text-muted-foreground break-all">{detail.customer_email}</p>}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild size="sm" variant="outline"><a href={`tel:+${digits(detail.customer_phone)}`}><Phone />Appeler</a></Button>
                  <Button asChild size="sm" variant="outline"><a href={`https://wa.me/${digits(detail.customer_phone)}?text=${encodeURIComponent(`Bonjour ${detail.customer_name.split(" ")[0]}, ici Cure's Nappy au sujet de votre commande ${detail.order_number}.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{zoneLabel[detail.delivery_zone ?? "abidjan"] ?? "Livraison"}</p>
                <p className="font-semibold">{detail.delivery_commune}</p>
                <p>{detail.delivery_address}</p>
                {detail.delivery_estimate && <p className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Annoncé au client : {detail.delivery_estimate}</p>}
              </div>

              <div className="text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Articles</p>
                <ul className="divide-y divide-border">
                  {items.map((item, i) => (
                    <li key={i} className="flex justify-between gap-3 py-1.5"><span>{item.product_name} × {item.quantity}</span><span className="shrink-0">{fcfa(item.product_price * item.quantity)}</span></li>
                  ))}
                </ul>
                <div className="border-t border-border mt-2 pt-2 space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Produits</span><span>{fcfa(detail.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{detail.delivery_fee_confirmed === false ? "À confirmer" : fcfa(detail.delivery_fee)}</span></div>
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span>{fcfa(detail.total)}</span></div>
                </div>
                <p className={`mt-3 rounded-xl px-3 py-2 font-semibold ${pay.paid ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}>
                  {pay.paid ? `Payée en ligne${detail.paid_at ? ` le ${when(detail.paid_at)}` : ""} : rien à encaisser à la livraison.` : `À encaisser : ${fcfa(detail.total)}${detail.delivery_fee_confirmed === false ? " + frais d'expédition à convenir" : ""}.`}
                </p>
              </div>

              {/* Pour le livreur */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => { if (!printSlip(detail, items, { name: "Cure's Nappy", phone: contact.phoneDisplay })) toast({ title: "Fenêtre bloquée", description: "Autorisez les fenêtres pour ce site afin d'imprimer le bon.", variant: "destructive" }); }} disabled={!items.length}>
                  <Printer />Bon de livraison
                </Button>
                <Button asChild variant="outline"><a href={`https://wa.me/?text=${encodeURIComponent(courierText(detail))}`} target="_blank" rel="noopener noreferrer"><Truck />Envoyer au livreur</a></Button>
                {detail.receipt_token && <Button asChild variant="ghost"><a href={`/commande/${detail.receipt_token}`} target="_blank" rel="noopener noreferrer"><ExternalLink />Reçu client</a></Button>}
              </div>

              {/* Statut */}
              <div className="space-y-2 border-t border-border pt-4">
                {next && detail.status !== "annulee" && (
                  <Button className="w-full" size="lg" onClick={() => updateStatus(detail.id, next)}>
                    {next === "livree" ? <CheckCircle2 /> : next === "expediee" ? <Truck /> : <PackageCheck />}
                    Passer à « {statusLabel[next]} »
                  </Button>
                )}
                <Select value={detail.status} onValueChange={(v) => updateStatus(detail.id, v)}>
                  <SelectTrigger aria-label="Changer le statut"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[...steps, "annulee"].map((s) => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </section>
          );
        })() : (
          <p className="hidden lg:block text-sm text-muted-foreground text-center py-16 border border-dashed border-border rounded-3xl">Cliquez sur une commande pour voir le détail, imprimer le bon de livraison ou l'envoyer au livreur.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
