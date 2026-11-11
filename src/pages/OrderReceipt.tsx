import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Clock, Printer, MessageCircle, Share2, Loader2, CreditCard, AlertCircle, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/content/ContentProvider";
import wordmark from "@/assets/brand-wordmark.png";

interface Receipt {
  orderNumber: string;
  createdAt: string;
  paidAt: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  commune: string;
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
const channelLabel: Record<string, string> = { mobile_money: "Mobile Money", card: "Carte bancaire", bank: "Banque", apple_pay: "Apple Pay" };

/** Page de confirmation et reçu d'une commande, à l'adresse /commande/<jeton secret>. */
const OrderReceipt = () => {
  const { token = "" } = useParams();
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

  // Retour de Paystack : le paiement peut mettre quelques secondes à être confirmé.
  const waiting = receipt?.paymentMethod === "paystack" && receipt.paymentStatus !== "payee" && receipt.status !== "annulee";
  useEffect(() => {
    if (!waiting || checks >= 15) return;
    const timer = setTimeout(() => { setChecks((c) => c + 1); load(); }, 4000);
    return () => clearTimeout(timer);
  }, [waiting, checks, load]);

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
              {receipt.deliveryEstimate && <> Elle sera livrée <strong>{receipt.deliveryEstimate}</strong> à {receipt.commune}.</>} Nous vous contacterons sur WhatsApp avant la livraison.
            </p>
          </>
        ) : waiting ? (
          <>
            <Clock className="h-10 w-10 mb-3 text-accent" />
            <h1 className="font-heading font-bold !text-3xl md:!text-4xl mb-2">Paiement en attente</h1>
            <p className="text-muted-foreground text-lg mb-4">
              {checks < 15 ? "Nous vérifions votre paiement auprès de Paystack…" : "Nous n’avons pas encore reçu la confirmation de votre paiement."} Si vous n’avez pas terminé le paiement, vous pouvez le reprendre.
            </p>
            <div className="flex flex-wrap gap-3">
              {receipt.paymentUrl && <Button asChild size="lg"><a href={receipt.paymentUrl}><CreditCard />Reprendre le paiement</a></Button>}
              <Button size="lg" variant="outline" onClick={() => { setChecks(0); load(); }}><Loader2 className={checks < 15 ? "animate-spin" : ""} />Vérifier à nouveau</Button>
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
              Votre commande <strong className="text-foreground">{receipt.orderNumber}</strong> est bien reçue. Notre équipe vous contacte sur WhatsApp pour le paiement
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
      <article className="receipt bg-card border border-border rounded-3xl p-6 md:p-10" aria-label="Reçu de commande">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5 mb-5">
          <div>
            <img src={wordmark} alt="Cure's Nappy" className="w-40 mb-2" />
            <p className="text-sm text-muted-foreground">{contact.address} · {contact.phoneDisplay}</p>
          </div>
          <div className="text-right">
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
            {receipt.customerEmail && <p>{receipt.customerEmail}</p>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Livraison</p>
            <p className="font-semibold">{receipt.commune}</p>
            <p>{receipt.address}</p>
            {receipt.deliveryEstimate && <p className="text-muted-foreground">Prévue {receipt.deliveryEstimate}</p>}
          </div>
        </div>

        <table className="w-full text-sm mb-5">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 font-bold">Article</th>
              <th className="py-2 font-bold text-center">Qté</th>
              <th className="py-2 font-bold text-right">Prix</th>
              <th className="py-2 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, i) => (
              <tr key={`${item.name}-${i}`} className="border-b border-border/60">
                <td className="py-2.5 pr-2">{item.name}</td>
                <td className="py-2.5 text-center">{item.quantity}</td>
                <td className="py-2.5 text-right whitespace-nowrap">{fcfa(item.unitPrice)}</td>
                <td className="py-2.5 text-right whitespace-nowrap">{fcfa(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{fcfa(receipt.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{fcfa(receipt.deliveryFee)}</span></div>
          <div className="flex justify-between border-t border-border pt-2 font-bold text-lg"><span>Total</span><span className="text-primary">{fcfa(receipt.total)}</span></div>
        </div>

        <div className="mt-6 rounded-2xl bg-secondary/70 p-4 text-sm">
          <p><strong>Statut du paiement :</strong> {paid ? `Payé${receipt.paidAt ? ` le ${date(receipt.paidAt)}` : ""}` : receipt.status === "annulee" ? "Annulé" : "En attente"}</p>
          {receipt.paymentMethod === "paystack" && <p><strong>Moyen :</strong> Paiement en ligne Paystack{receipt.paymentChannel ? ` (${channelLabel[receipt.paymentChannel] ?? receipt.paymentChannel})` : ""}</p>}
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
