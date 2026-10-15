import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, User, CreditCard, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const communes = [
  { name: "Cocody", zone: "abidjan" },
  { name: "Plateau", zone: "abidjan" },
  { name: "Marcory", zone: "abidjan" },
  { name: "Treichville", zone: "abidjan" },
  { name: "Koumassi", zone: "abidjan" },
  { name: "Adjamé", zone: "abidjan" },
  { name: "Abobo", zone: "abidjan" },
  { name: "Yopougon", zone: "abidjan" },
  { name: "Riviera", zone: "abidjan" },
  { name: "Bingerville", zone: "abidjan" },
  { name: "Songon", zone: "abidjan" },
  { name: "Port-Bouët", zone: "special" },
  { name: "Grand-Bassam", zone: "special" },
  { name: "Anyama", zone: "special" },
  { name: "Gonzagueville", zone: "special" },
];

const paymentMethods = [
  { id: "wave", name: "Wave", icon: "🌊" },
  { id: "orange-money", name: "Orange Money", icon: "🟠" },
  { id: "mtn-momo", name: "MTN MoMo", icon: "🟡" },
  { id: "moov-money", name: "Moov Money", icon: "🔵" },
  { id: "djamo", name: "Djamo", icon: "💳" },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState<{ number: string; total: number } | null>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    commune: "", address: "", paymentMethod: "",
  });
  const [loading, setLoading] = useState(false);

  const selectedCommune = communes.find(c => c.name === form.commune);
  const deliveryFee = selectedCommune ? (selectedCommune.zone === "special" ? 2000 : 1500) : 0;
  const grandTotal = totalPrice + deliveryFee;

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.commune || !form.address || !form.paymentMethod) {
      toast({ title: "Champs manquants", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const customerName = `${form.firstName} ${form.lastName}`;

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: `CN-${Date.now().toString(36).toUpperCase()}`,
          customer_name: customerName,
          customer_phone: form.phone,
          customer_email: form.email || null,
          delivery_commune: form.commune,
          delivery_address: form.address,
          delivery_fee: deliveryFee,
          subtotal: totalPrice,
          total: grandTotal,
          payment_method: form.paymentMethod,
          status: "nouvelle",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(({ product, quantity }) => ({
        order_id: order.id,
        product_name: product.name,
        product_price: product.price,
        quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Upsert customer
      await supabase.from("customers").upsert(
        {
          name: customerName,
          phone: form.phone,
          email: form.email || null,
          total_spent: grandTotal,
          orders_count: 1,
          last_order_at: new Date().toISOString(),
        },
        { onConflict: "phone", ignoreDuplicates: false }
      );

      setConfirmation({ number: order.order_number, total: grandTotal });
      clearCart();
    } catch (error) {
      console.error("Order error:", error);
      toast({ title: "Erreur", description: "Votre commande n’a pas pu être finalisée. Vos articles sont conservés. Veuillez réessayer ou contacter notre équipe.", variant: "destructive" });
    }

    setLoading(false);
  };

  if (confirmation) {
    return (
      <div className="container mx-auto pt-32 pb-16 max-w-2xl">
        <h1 className="font-heading font-bold mb-5">Commande reçue</h1>
        <p className="mb-4">Votre commande {confirmation.number} a été enregistrée pour un montant de <strong>{confirmation.total.toLocaleString("fr-FR")} FCFA</strong>, livraison incluse.</p>
        <p className="text-muted-foreground mb-6">Le paiement n’est pas encore confirmé. Poursuivez sur Fineo Pay pour régler votre commande. Notre équipe vous contactera pour finaliser la livraison.</p>
        <Button asChild className="mb-4"><a href="https://app.fineopay.com/cures_nappy/marie_marcelle/checkout" target="_blank" rel="noopener noreferrer">Payer sur Fineo Pay <CreditCard /></a></Button>
        <Button variant="ghost" className="block" onClick={() => navigate("/")}>Retour à l’accueil</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto pt-32 pb-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-3">Aucun produit dans votre panier</h1>
        <Button asChild className="bg-action text-action-foreground">
          <Link to="/boutique">Voir la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto pt-28 pb-12 px-4">
        <Link to="/panier" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour au panier
        </Link>

        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">Finaliser la commande</h1>

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
                    <Input id="firstName" required autoComplete="given-name" value={form.firstName} onChange={e => handleChange("firstName", e.target.value)} placeholder="Votre prénom" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" required autoComplete="family-name" value={form.lastName} onChange={e => handleChange("lastName", e.target.value)} placeholder="Votre nom" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input id="phone" required autoComplete="tel" type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+225 07 00 00 00" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" autoComplete="email" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="votre@email.com" />
                  </div>
                </div>
              </div>

              <div className="border-b border-border pb-6">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Adresse de livraison
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commune">Commune *</Label>
                    <Select value={form.commune} onValueChange={v => handleChange("commune", v)}>
                      <SelectTrigger id="commune" aria-required="true"><SelectValue placeholder="Choisir une commune" /></SelectTrigger>
                      <SelectContent>
                        {communes.map(c => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name} {c.zone === "special" ? "(zone spéciale)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse précise *</Label>
                    <Input id="address" required autoComplete="street-address" value={form.address} onChange={e => handleChange("address", e.target.value)} placeholder="Quartier, rue, repère..." />
                  </div>
                </div>
                {form.commune && (
                  <div className="mt-4 flex items-center gap-2 text-sm bg-primary/10 text-primary p-3 rounded-md">
                    <Truck className="h-4 w-4" />
                    <span>Livraison {selectedCommune?.zone === "special" ? "zone spéciale" : "Abidjan"} : <strong>{deliveryFee.toLocaleString()} FCFA</strong></span>
                  </div>
                )}
              </div>

              <div className="border-b border-border pb-6">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Mode de paiement
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {paymentMethods.map(pm => (
                    <Button
                      key={pm.id}
                      variant="outline"
                      aria-pressed={form.paymentMethod === pm.id}
                      type="button"
                      onClick={() => handleChange("paymentMethod", pm.id)}
                      className={`h-auto min-h-14 whitespace-normal p-3 rounded-md border text-center transition-colors ${
                        form.paymentMethod === pm.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <CreditCard aria-hidden="true" className="text-primary" />
                      <span className="text-sm font-medium">{pm.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-md p-6 h-fit lg:sticky lg:top-24">
              <h2 className="font-heading font-semibold text-lg mb-4">Récapitulatif</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{product.name} × {quantity}</span>
                    <span className="shrink-0">{(product.price * quantity).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{form.commune ? `${deliveryFee.toLocaleString()} FCFA` : "—"}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{grandTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-action text-action-foreground hover:bg-action/90 text-base"
                size="lg"
              >
                {loading ? "Traitement..." : "Valider la commande"}
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-3">
                Vous serez invité à payer sur Fineo Pay après l’enregistrement. Le paiement sera confirmé séparément.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
