import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const mockOrders = [
  { id: "CN-A1B2C", client: "Aminata Koné", phone: "+225 07 01 02 03", email: "aminata@mail.com", commune: "Cocody", address: "Riviera 2, près du carrefour", products: ["Huile Extra Pousse", "Magical Spray"], total: 11500, delivery: 1500, grandTotal: 13000, status: "Nouvelle", date: "2026-04-03", payment: "Wave" },
  { id: "CN-D3E4F", client: "Fatou Diallo", phone: "+225 05 04 05 06", email: "fatou@mail.com", commune: "Yopougon", address: "Quartier Millionnaire", products: ["Gamme Complète"], total: 56000, delivery: 1500, grandTotal: 57500, status: "En préparation", date: "2026-04-03", payment: "Orange Money" },
  { id: "CN-G5H6I", client: "Marie Aké", phone: "+225 01 07 08 09", email: "marie@mail.com", commune: "Grand-Bassam", address: "Centre-ville", products: ["Shampoing Doux", "Masque Hydratant", "Crème Volume+"], total: 16500, delivery: 2000, grandTotal: 18500, status: "Expédiée", date: "2026-04-02", payment: "MTN MoMo" },
  { id: "CN-J7K8L", client: "Awa Bamba", phone: "+225 07 10 11 12", email: "", commune: "Marcory", address: "Zone 4C", products: ["Leave-in Conditionner", "Bain d'Huile"], total: 10500, delivery: 1500, grandTotal: 12000, status: "Livrée", date: "2026-04-01", payment: "Wave" },
];

const statuses = ["Toutes", "Nouvelle", "En préparation", "Expédiée", "Livrée", "Annulée"];
const statusColor: Record<string, string> = {
  "Nouvelle": "bg-blue-100 text-blue-700",
  "En préparation": "bg-amber-100 text-amber-700",
  "Expédiée": "bg-purple-100 text-purple-700",
  "Livrée": "bg-green-100 text-green-700",
  "Annulée": "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [filter, setFilter] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filtered = mockOrders.filter(o =>
    (filter === "Toutes" || o.status === filter) &&
    (o.client.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const detail = mockOrders.find(o => o.id === selectedOrder);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Commandes</h1>
        <p className="text-muted-foreground text-sm">Gérer toutes les commandes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par client ou n° commande..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(o => (
            <Card key={o.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedOrder === o.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedOrder(o.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{o.client}</div>
                    <div className="text-xs text-muted-foreground">{o.id} · {o.date}</div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="font-bold text-sm">{o.grandTotal.toLocaleString()} FCFA</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>{o.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {detail && (
          <Card className="h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Détail {detail.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Client</span>
                <p className="font-medium">{detail.client}</p>
                <p className="text-muted-foreground">{detail.phone}</p>
                {detail.email && <p className="text-muted-foreground">{detail.email}</p>}
              </div>
              <div>
                <span className="text-muted-foreground">Livraison</span>
                <p className="font-medium">{detail.commune} — {detail.address}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Produits</span>
                {detail.products.map(p => <p key={p} className="font-medium">{p}</p>)}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between"><span>Produits</span><span>{detail.total.toLocaleString()} FCFA</span></div>
                <div className="flex justify-between"><span>Livraison</span><span>{detail.delivery.toLocaleString()} FCFA</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>{detail.grandTotal.toLocaleString()} FCFA</span></div>
              </div>
              <div>
                <span className="text-muted-foreground">Paiement</span>
                <p className="font-medium">{detail.payment}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Changer le statut</span>
                <Select defaultValue={detail.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.filter(s => s !== "Toutes").map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
