import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, Printer, MessageCircle, Share2, Loader2, CreditCard, AlertCircle, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/content/ContentProvider";
import wordmark from "@/assets/brand-wordmark.png";
import { paymentMethodLabels } from "@/content/payment";

interface Receipt {
  orderNumber: string;
  createdAt: string;
  paidAt: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  place: string;
  zone: string | null;
  deliveryFeeConfirmed: boolean;
  address: string;
  deliveryEstimate: string | null;
  items: { name: string; unitPrice: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string | null;
  paymentChannel: string | null;
  paymentStatus: string;
  status: string;
  paymentUrl: string | null;
}

const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
const date = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
const channelLabel: Record<string, string> = { ...paymentMethodLabels, jeko: "Compte Jèko" };

/** Page de confirmation et reçu d'une commande, à l'adresse /commande/<jeton secret>. */
const OrderReceipt = () => {
  const { token = "" } = useParams();
  const [search] = useSearchParams();
  const returnedWithError = search.get("paiement") === "echec";
  const awaitingPhone = search.get("attente") === "telephone";
  // MTN / Moov : on laisse jusqu'à 3 minutes pour valider sur le téléphone.
  const maxChecks = awaitingPhone ? 45 : 15;
  const { contact } = useContent().content;
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState(false);
  const [checks, setChecks] = useState(0);

  const load = useCallback(async () => {
    const { data, error: fnError } = await supabase.functions.invoke("order-receipt", { body: { token } });
    if (fnError || !data?.orderNumber) { setError(true); return; }
    setReceipt(data as Receipt);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // Retour de Jèko : le paiement peut mettre quelques secondes à être confirmé.
  const waiting = receipt?.paymentMethod === "jeko" && receipt.paymentStatus === "en_attente" && receipt.status !== "annulee";
  const failed = receipt?.paymentMethod === "jeko" && receipt.paymentStatus === "echouee";
  useEffect(() => {
    if (!waiting || checks >= maxChecks) return;
    const timer = setTimeout(() => { setChecks((c) => c + 1); load(); }, 4000);
    return () => clearTimeout(timer);
  }, [waiting, checks, load, maxChecks]);

  if (error) {
    return (
      <div className="container mx-auto pt-36 pb-24 max-w-xl text-center">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h1 className="font-heading font-bold mb-3 !text-3xl">Reçu introuvable</h1>
        <p className="text-muted-foreground mb-6">Ce lien de commande n’est pas valide, ou le service est momentanément indisponible. Écrivez-nous sur WhatsApp avec votre numéro de commande.</p>
        <Button asChild><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle />Écrire sur WhatsApp</a></Button>
      </div>
    );
  }

  if (!receipt) {
    return <div className="container mx-auto pt-40 pb-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Chargement du reçu" /></div>;
  }

  const paid = receipt.paymentStatus === "payee";
  const link = window.location.href;
  const shareText = `Mon reçu Cure's Nappy — commande ${receipt.orderNumber} (${fcfa(receipt.total)}) : ${link}`;
  const teamText = `Bonjour Cure's Nappy, je vous écris au sujet de ma commande ${receipt.orderNumber}.`;

  return (
    <div className="container mx-auto pt-28 pb-16 max-w-3xl receipt-page">
      {/* Message de confirmation */}
      <div className={`no-print rounded-[2rem] p-6 md:p-8 mb-6 ${paid ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
        {paid ? (
          <>
            <CheckCircle2 className="h-10 w-10 mb-3 text-accent" />
            <h1 className="font-heading font-bold !text-3xl md:!text-4xl mb-2">Paiement reçu, merci {receipt.customerName.split(" ")[0]} !</h1>
            <p className="text-primary-foreground/90 text-lg">
              Nous avons bien reçu votre commande <strong>{receipt.orderNumber}</strong>.
              {receipt.deliveryEstimate && <> Elle sera {receipt.zone === "abidjan" ? "livrée" : "expédiée"} <strong>{receipt.deliveryEstimate}</strong> {receipt.zone === "abidjan" ? "à" : "vers"} {receipt.place}.</>} Nous vous contacterons sur WhatsApp avant la livraison.
            </p>
          </>
        ) : waiting ? (
          <>
            <Clock className="h-10 w-10 mb-3 text-accent" />
            <h1 className="font-heading font-bold !text-3xl md:!text-4xl mb-2">{awaitingPhone ? "Validez le paiement sur votre téléphone" : "Paiement en attente"}</h1>
            <p className="text-muted-foreground text-lg mb-4">
              {returnedWithError ? "Le paiement ne semble pas avoir abouti." : awaitingPhone && checks < maxChecks ? "Une demande de paiement vient d’être envoyée sur votre téléphone. Validez-la avec votre code secret Mobile Money : cette page se met à jour toute seule." : checks < maxChecks ? "Nous vérifions votre paiement auprès de Jèko…" : "Nous n’avons pas encore reçu la confirmation de votre paiement."}{receipt.paymentUrl ? " Si vous n’avez pas terminé le paiement, vous pouvez le reprendre." : ""}
            </p>
            <div className="flex flex-wrap gap-3">
              {receipt.paymentUrl && <Button asChild size="lg"><a href={receipt.paymentUrl}><CreditCard />Reprendre le paiement</a></Button>}
              <Button size="lg" variant="outline" onClick={() => { setChecks(0); load(); }}><Loader2 className={checks < maxChecks ? "animate-spin" : ""} />Vérifier à nouveau</Button>
            </div>
          </>
        ) : failed ? (
          <>
            <AlertCircle className="h-10 w-10 mb-3 text-destructive" />
            <h1 className="font-heading font-bold !text-3xl md:!text-4xl mb-2">Paiement non abouti</h1>
            <p className="text-muted-foreground text-lg mb-4">Aucun montant n’a été débité pour cette commande. Vous pouvez repasser commande ou nous écrire sur WhatsApp, nous vous aidons à finaliser.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/boutique">Repasser commande</Link></Button>
              <Button asChild size="lg" variant="outline"><a href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Bonjour, mon paiement pour la commande ${receipt.orderNumber} n'a pas abouti.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle />Écrire sur WhatsApp</a></Button>
            </div>
          </>
        ) : receipt.status === "annulee" ? (
          <>
            <AlertCircle className="h-10 w-10 mb-3 text-destructive" />
            <h1 className="font-heading font-bold !text-3xl md:!text-4xl mb-2">Commande annulée</h1>
            <p className="text-muted-foreground text-lg">Cette commande n’a pas abouti. Vous pouvez repasser commande depuis la boutique ou nous écrire sur WhatsApp.</p>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-10 w-10 mb-3 text-primary" />
            <h1 className="font-heading font-bold !text-3xl md:!text-4xl mb-2">Commande enregistrée, merci !</h1>
            <p className="text-muted-foreground text-lg">
              Votre commande <strong className="text-foreground">{receipt.orderNumber}</strong> est bien reçue. Notre équipe vous contacte sur WhatsApp pour {receipt.deliveryFeeConfirmed ? "le paiement" : "vous confirmer les frais d'expédition et le paiement"}
              {receipt.deliveryEstimate && <>, puis la livraison <strong className="text-foreground">{receipt.deliveryEstimate}</strong></>}.
            </p>
          </>
        )}
      </div>

      {/* Actions sur le reçu */}
      <div className="no-print flex flex-wrap gap-2 mb-6">
        <Button variant="outline" onClick={() => window.print()}><Printer />Imprimer ou enregistrer en PDF</Button>
        <Button variant="outline" asChild><a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"><Share2 />Envoyer sur WhatsApp</a></Button>
        <Button variant="outline" asChild><a href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(teamText)}`} target="_blank" rel="noopener noreferrer"><MessageCircle />Contacter Cure's Nappy</a></Button>
        <Button variant="ghost" onClick={() => navigator.clipboard?.writeText(link).then(() => toast.success("Lien du reçu copié"), () => toast.error("Copie impossible"))}><Link2 />Copier le lien</Button>
      </div>

      {/* Le reçu (c'est la seule partie imprimée) */}
      <article className="receipt bg-card border border-border rounded-3xl p-5 sm:p-6 md:p-10 overflow-hidden" aria-label="Reçu de commande">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5 mb-5">
          <div>
            <img src={wordmark} alt="Cure's Nappy" className="w-40 mb-2" />
            <p className="text-sm text-muted-foreground">{contact.address} · {contact.phoneDisplay}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-heading text-xl font-bold">{paid ? "REÇU DE PAIEMENT" : "BON DE COMMANDE"}</p>
            <p className="text-sm font-semibold">{receipt.orderNumber}</p>
            <p className="text-sm text-muted-foreground">{date(receipt.createdAt)}</p>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 gap-5 mb-6 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Client</p>
            <p className="font-semibold">{receipt.customerName}</p>
            <p>{receipt.customerPhone}</p>
            {receipt.customerEmail && <p className="break-all">{receipt.customerEmail}</p>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{receipt.zone === "abidjan" || !receipt.zone ? "Livraison" : receipt.zone === "national" ? "Expédition Côte d'Ivoire" : "Expédition internationale"}</p>
            <p className="font-semibold">{receipt.place}</p>
            <p>{receipt.address}</p>
            {receipt.deliveryEstimate && <p className="text-muted-foreground">Prévue {receipt.deliveryEstimate}</p>}
          </div>
        </div>

        <table className="w-full text-sm mb-5">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 font-bold">Article</th>
              <th className="py-2 px-2 font-bold text-center">Qté</th>
              <th className="py-2 font-bold text-right hidden sm:table-cell">Prix</th>
              <th className="py-2 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, i) => (
              <tr key={`${item.name}-${i}`} className="border-b border-border/60">
                <td className="py-2.5 pr-2">{item.name}<span className="block text-xs text-muted-foreground sm:hidden">{fcfa(item.unitPrice)} l’unité</span></td>
                <td className="py-2.5 px-2 text-center">{item.quantity}</td>
                <td className="py-2.5 text-right whitespace-nowrap hidden sm:table-cell">{fcfa(item.unitPrice)}</td>
                <td className="py-2.5 text-right whitespace-nowrap">{fcfa(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{fcfa(receipt.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{receipt.deliveryFeeConfirmed ? fcfa(receipt.deliveryFee) : "À confirmer"}</span></div>
          <div className="flex justify-between border-t border-border pt-2 font-bold text-lg"><span>Total{!receipt.deliveryFeeConfirmed && <span className="block text-xs font-normal text-muted-foreground">hors expédition</span>}</span><span className="text-primary">{fcfa(receipt.total)}</span></div>
        </div>

        <div className="mt-6 rounded-2xl bg-secondary/70 p-4 text-sm">
          <p><strong>Statut du paiement :</strong> {paid ? `Payé${receipt.paidAt ? ` le ${date(receipt.paidAt)}` : ""}` : failed ? "Non abouti" : receipt.status === "annulee" ? "Annulé" : "En attente"}</p>
          {receipt.paymentMethod === "jeko" && <p><strong>Moyen :</strong> Paiement en ligne Jèko{receipt.paymentChannel ? ` (${channelLabel[receipt.paymentChannel] ?? receipt.paymentChannel})` : ""}</p>}
          {receipt.paymentMethod === "a_regler" && <p><strong>Moyen :</strong> À régler avec notre équipe</p>}
        </div>

        <footer className="mt-6 text-center text-xs text-muted-foreground">
          Merci pour votre confiance ! Une question : WhatsApp {contact.phoneDisplay} · {contact.email}
        </footer>
      </article>

      <div className="no-print mt-8 text-center">
        <Button asChild variant="ghost"><Link to="/boutique">Retour à la boutique</Link></Button>
      </div>
    </div>
  );
};

export default OrderReceipt;
