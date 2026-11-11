import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, User, CreditCard, Truck, MessageCircle, ShieldCheck, Clock, Loader2, Building2, Globe2 } from "lucide-react";
import { OTHER, resolveDestination } from "../../supabase/functions/_shared/pricing";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCartNavigation } from "@/hooks/use-cart-navigation";
import { useContent } from "@/content/ContentProvider";

type PaymentChoice = "online" | "later";
type DeliveryMode = "abidjan" | "national" | "international";

/** Lit le message d'erreur renvoyé par une fonction serveur. */
const serverMessage = async (error: unknown): Promise<string | null> => {
  const context = (error as { context?: Response })?.context;
  if (context && typeof context.json === "function") {
    const body = await context.json().catch(() => null);
    if (body?.error) return body.error as string;
  }
  return null;
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { delivery, contact } = useContent().content;
  const { toast } = useToast();
  const navigate = useNavigate();
  const openCart = useCartNavigation();

  const choices: PaymentChoice[] = [...(delivery.onlinePayment ? ["online" as const] : []), ...(delivery.payLater ? ["later" as const] : [])];
  const [payment, setPayment] = useState<PaymentChoice>(choices[0] ?? "later");
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", address: "",
    commune: "", city: "", otherCity: "", country: "", otherCountry: "", foreignCity: "",
  });
  const modes: DeliveryMode[] = ["abidjan", ...(delivery.national.enabled ? ["national" as const] : []), ...(delivery.international.enabled ? ["international" as const] : [])];
  const [mode, setMode] = useState<DeliveryMode>("abidjan");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const destinationInput = mode === "abidjan"
    ? { mode, commune: form.commune }
    : mode === "national"
      ? { mode, city: form.city, otherCity: form.otherCity }
      : { mode, country: form.country, otherCountry: form.otherCountry, city: form.foreignCity };
  // Même calcul que sur le serveur, pour afficher les frais et le délai en direct.
  const resolved = resolveDestination(delivery, destinationInput);
  const destination = "error" in resolved ? null : resolved;
  const feeToConfirm = destination?.fee === null;
  const deliveryFee = destination?.fee ?? 0;
  const grandTotal = totalPrice + deliveryFee;
  // Sans tarif connu, le total n'est pas définitif : on ne peut pas payer en ligne.
  const online = payment === "online" && !feeToConfirm;

  const handleChange = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const abidjanFees = delivery.abidjan.communes.map((c) => c.fee);
  const countries = delivery.international.zones.flatMap((z) => z.countries).sort((a, b) => a.localeCompare(b, "fr"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.address || (online && !form.email)) {
      toast({ title: "Champs manquants", description: online ? "Remplissez tous les champs, e-mail compris : il sert à recevoir votre reçu." : "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    if ("error" in resolved) {
      toast({ title: "Livraison", description: resolved.error, variant: "destructive" });
      return;
    }
    setLoading(true);
    setFailed(null);

    // Le site n'envoie que les articles et les quantités : le serveur recalcule les prix et le total.
    const { data, error } = await supabase.functions.invoke("create-order", {
      body: {
        payment: online ? "online" : "later",
        items: items.map(({ product, quantity }) => ({ id: product.id, quantity })),
        destination: destinationInput,
        customer: { firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email, address: form.address },
      },
    });

    if (error || !data?.receiptToken) {
      const message = (await serverMessage(error)) ?? "Votre commande n’a pas pu être enregistrée. Votre panier est conservé.";
      setFailed(message);
      toast({ title: "Commande non enregistrée", description: message, variant: "destructive" });
      setLoading(false);
      return;
    }

    clearCart();
    if (data.paymentUrl) {
      // Page de paiement sécurisée de Paystack ; elle renvoie ensuite vers le reçu.
      window.location.assign(data.paymentUrl);
      return;
    }
    navigate(`/commande/${data.receiptToken}`);
  };

  // Secours si l'enregistrement échoue : la commande part sur WhatsApp.
  const whatsappOrderUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    [
      "Bonjour Cure's Nappy, je souhaite passer cette commande :",
      ...items.map(({ product, quantity }) => `• ${product.name} × ${quantity} — ${(product.price * quantity).toLocaleString("fr-FR")} FCFA`),
      `Sous-total : ${totalPrice.toLocaleString("fr-FR")} FCFA`,
      destination ? `Livraison ${destination.place} : ${feeToConfirm ? "à confirmer" : `${deliveryFee.toLocaleString("fr-FR")} FCFA`}` : "",
      `Total : ${grandTotal.toLocaleString("fr-FR")} FCFA`,
    ].filter(Boolean).join("\n"),
  )}`;

  if (items.length === 0) {
    return (
      <div className="container mx-auto pt-32 pb-20 text-center">
        <h1 className="font-heading font-bold mb-5">Aucun produit dans votre panier</h1>
        <Button asChild className="bg-action text-action-foreground">
          <Link to="/boutique">Voir la boutique</Link>
        </Button>
      </div>
    );
  }

  const choiceCard = (value: PaymentChoice, title: string, text: string, Icon: typeof CreditCard) => {
    const disabled = value === "online" && feeToConfirm;
    const selected = value === "online" ? online : !online;
    return (
    <button
      key={value}
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => setPayment(value)}
      className={`text-left rounded-2xl border p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${selected ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50 bg-card"}`}
    >
      <span className="flex items-center gap-2 font-semibold"><Icon className="h-5 w-5 text-primary" />{title}</span>
      <span className="block text-sm text-muted-foreground mt-1">{disabled ? "Disponible quand les frais d'expédition sont connus : notre équipe vous les confirme d'abord." : text}</span>
    </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto pt-28 pb-12 px-4">
        <button type="button" onClick={() => openCart()} className="inline-flex items-center min-h-11 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour au panier
        </button>

        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">Finaliser la commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="border-b border-border pb-6">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Informations personnelles
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" required maxLength={60} autoComplete="given-name" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="Votre prénom" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" required maxLength={60} autoComplete="family-name" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Votre nom" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone (WhatsApp) *</Label>
                    <Input id="phone" required maxLength={20} autoComplete="tel" type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+225 07 00 00 00 00" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail{online ? " *" : ""}</Label>
                    <Input id="email" required={online} maxLength={120} autoComplete="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="votre@email.com" />
                    {online && <p className="text-xs text-muted-foreground mt-1">Pour recevoir votre reçu.</p>}
                  </div>
                </div>
              </div>

              <div className="border-b border-border pb-6">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Livraison
                </h2>

                {/* 1. Où livrer */}
                <div role="radiogroup" aria-label="Mode de livraison" className={`grid gap-3 mb-5 ${modes.length === 3 ? "sm:grid-cols-3" : modes.length === 2 ? "sm:grid-cols-2" : ""}`}>
                  {modes.map((value) => {
                    const info = {
                      abidjan: { title: "Livraison à Abidjan", text: abidjanFees.length ? `${Math.min(...abidjanFees).toLocaleString("fr-FR")} à ${Math.max(...abidjanFees).toLocaleString("fr-FR")} FCFA selon la commune` : "Dans le Grand Abidjan", Icon: Truck },
                      national: { title: "Expédition en Côte d'Ivoire", text: "Dans les autres villes du pays", Icon: Building2 },
                      international: { title: "Expédition internationale", text: "Vers l'étranger", Icon: Globe2 },
                    }[value];
                    return (
                      <button key={value} type="button" role="radio" aria-checked={mode === value} onClick={() => setMode(value)}
                        className={`text-left rounded-2xl border p-4 transition-colors ${mode === value ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50 bg-card"}`}>
                        <span className="flex items-center gap-2 font-semibold"><info.Icon className="h-5 w-5 text-primary shrink-0" />{info.title}</span>
                        <span className="block text-sm text-muted-foreground mt-1">{info.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 2. Les champs selon le choix */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {mode === "abidjan" && (
                    <div>
                      <Label htmlFor="commune">Commune *</Label>
                      <Select value={form.commune} onValueChange={(v) => handleChange("commune", v)}>
                        <SelectTrigger id="commune" aria-required="true"><SelectValue placeholder="Choisir une commune" /></SelectTrigger>
                        <SelectContent>
                          {delivery.abidjan.communes.map((c) => (
                            <SelectItem key={c.name} value={c.name}>{c.name} — {c.fee.toLocaleString("fr-FR")} FCFA</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {mode === "national" && (
                    <>
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Select value={form.city} onValueChange={(v) => handleChange("city", v)}>
                          <SelectTrigger id="city" aria-required="true"><SelectValue placeholder="Choisir une ville" /></SelectTrigger>
                          <SelectContent>
                            {delivery.national.cities.map((c) => (
                              <SelectItem key={c.name} value={c.name}>{c.name}{c.fee !== null ? ` — ${c.fee.toLocaleString("fr-FR")} FCFA` : ""}</SelectItem>
                            ))}
                            {delivery.national.allowOther && <SelectItem value={OTHER}>Autre ville…</SelectItem>}
                          </SelectContent>
                        </Select>
                      </div>
                      {form.city === OTHER && (
                        <div>
                          <Label htmlFor="otherCity">Nom de la ville *</Label>
                          <Input id="otherCity" required maxLength={60} value={form.otherCity} onChange={(e) => handleChange("otherCity", e.target.value)} placeholder="Votre ville" />
                        </div>
                      )}
                    </>
                  )}

                  {mode === "international" && (
                    <>
                      <div>
                        <Label htmlFor="country">Pays *</Label>
                        <Select value={form.country} onValueChange={(v) => handleChange("country", v)}>
                          <SelectTrigger id="country" aria-required="true"><SelectValue placeholder="Choisir un pays" /></SelectTrigger>
                          <SelectContent>
                            {countries.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                            {delivery.international.allowOther && <SelectItem value={OTHER}>Autre pays…</SelectItem>}
                          </SelectContent>
                        </Select>
                      </div>
                      {form.country === OTHER && (
                        <div>
                          <Label htmlFor="otherCountry">Nom du pays *</Label>
                          <Input id="otherCountry" required maxLength={60} value={form.otherCountry} onChange={(e) => handleChange("otherCountry", e.target.value)} placeholder="Votre pays" />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="foreignCity">Ville *</Label>
                        <Input id="foreignCity" required maxLength={60} autoComplete="address-level2" value={form.foreignCity} onChange={(e) => handleChange("foreignCity", e.target.value)} placeholder="Votre ville" />
                      </div>
                    </>
                  )}

                  <div className={mode === "abidjan" ? "" : "sm:col-span-2"}>
                    <Label htmlFor="address">{mode === "international" ? "Adresse complète *" : "Adresse précise *"}</Label>
                    <Input id="address" required maxLength={200} autoComplete="street-address" value={form.address} onChange={(e) => handleChange("address", e.target.value)}
                      placeholder={mode === "abidjan" ? "Quartier, rue, repère..." : mode === "national" ? "Quartier, repère, ou gare / agence de transport préférée" : "Rue, numéro, code postal"} />
                  </div>
                </div>

                {/* 3. Frais et délai */}
                {destination && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm bg-primary/10 text-primary p-3 rounded-2xl">
                    <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4" />
                      {feeToConfirm
                        ? <>Frais d'expédition vers {destination.place} : <strong>confirmés par notre équipe sur WhatsApp</strong></>
                        : <>Livraison {destination.place} : <strong>{deliveryFee.toLocaleString("fr-FR")} FCFA</strong></>}
                    </span>
                    {destination.estimate && <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{mode === "abidjan" ? "Livrée" : "Expédiée"} {destination.estimate}</span>}
                  </div>
                )}
              </div>

              {choices.length > 0 && (
                <div className="border-b border-border pb-6">
                  <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Paiement
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {delivery.onlinePayment && choiceCard("online", "Payer maintenant", `${delivery.paymentMethods.join(", ")} ou carte bancaire, sur la page sécurisée de Paystack.`, ShieldCheck)}
                    {delivery.payLater && choiceCard("later", "Payer plus tard", "Votre commande est enregistrée et notre équipe vous contacte sur WhatsApp pour le paiement.", MessageCircle)}
                  </div>
                </div>
              )}
            </div>

            <div className="surface p-6 h-fit lg:sticky lg:top-24">
              <h2 className="font-heading font-semibold text-lg mb-4">Récapitulatif</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{product.name} × {quantity}</span>
                    <span className="shrink-0">{(product.price * quantity).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{totalPrice.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{!destination ? "—" : feeToConfirm ? "À confirmer" : `${deliveryFee.toLocaleString("fr-FR")} FCFA`}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total{feeToConfirm ? <span className="block text-xs font-normal text-muted-foreground">hors expédition</span> : null}</span>
                  <span className="text-primary">{grandTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full mt-6 bg-action text-action-foreground hover:bg-action/90 text-base" size="lg">
                {loading ? <><Loader2 className="animate-spin" />Traitement...</> : online ? <><ShieldCheck />Payer {grandTotal.toLocaleString("fr-FR")} FCFA</> : "Valider la commande"}
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-3">
                {online
                  ? "Vous allez être redirigé vers Paystack. Cure's Nappy ne voit ni ne conserve vos données de carte ou de Mobile Money."
                  : "Vous recevrez un reçu tout de suite ; le paiement se fait ensuite avec notre équipe."}
              </p>
              {failed && (
                <div role="alert" className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
                  <p className="font-semibold mb-1">{failed}</p>
                  <p className="text-muted-foreground mb-3">Vous pouvez réessayer ou nous envoyer la commande directement sur WhatsApp.</p>
                  <Button asChild variant="outline" className="w-full">
                    <a href={whatsappOrderUrl} target="_blank" rel="noopener noreferrer"><MessageCircle /> Commander sur WhatsApp</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
