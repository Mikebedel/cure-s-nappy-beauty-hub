import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_commune: string;
  delivery_address: string;
  delivery_fee: number;
  subtotal: number;
  total: number;
  status: string;
  payment_method: string | null;
  created_at: string;
}

interface OrderItem {
  product_name: string;
  product_price: number;
  quantity: number;
}

const statuses = ["Toutes", "nouvelle", "en_preparation", "expediee", "livree", "annulee"];
const statusLabel: Record<string, string> = {
  nouvelle: "Nouvelle", en_preparation: "En préparation", expediee: "Expédiée",
  livree: "Livrée", annulee: "Annulée",
};
const statusColor: Record<string, string> = {
  nouvelle: "bg-blue-100 text-blue-700", en_preparation: "bg-amber-100 text-amber-700",
  expediee: "bg-purple-100 text-purple-700", livree: "bg-green-100 text-green-700",
  annulee: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!selectedOrder) return;
    const fetchItems = async () => {
      const { data } = await supabase.from("order_items").select("product_name, product_price, quantity").eq("order_id", selectedOrder);
      if (data) setOrderItems(data);
    };
    fetchItems();
  }, [selectedOrder]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de changer le statut", variant: "destructive" });
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast({ title: "Statut mis à jour" });
    }
  };

  const filtered = orders.filter(o =>
    (filter === "Toutes" || o.status === filter) &&
    (o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.order_number.toLowerCase().includes(search.toLowerCase()))
  );

  const detail = orders.find(o => o.id === selectedOrder);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Commandes</h1>
        <p className="text-muted-foreground text-sm">{orders.length} commandes au total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statuses.map(s => <SelectItem key={s} value={s}>{s === "Toutes" ? "Toutes" : statusLabel[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande</p>}
          {filtered.map(o => (
            <Card key={o.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedOrder === o.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedOrder(o.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.order_number} · {new Date(o.created_at).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="font-bold text-sm">{o.total.toLocaleString()} FCFA</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status] || ""}`}>{statusLabel[o.status] || o.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {detail && (
          <Card className="h-fit sticky top-24">
            <CardHeader><CardTitle className="text-lg">Détail {detail.order_number}</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Client</span>
                <p className="font-medium">{detail.customer_name}</p>
                <p className="text-muted-foreground">{detail.customer_phone}</p>
                {detail.customer_email && <p className="text-muted-foreground">{detail.customer_email}</p>}
              </div>
              <div>
                <span className="text-muted-foreground">Livraison</span>
                <p className="font-medium">{detail.delivery_commune} — {detail.delivery_address}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Produits</span>
                {orderItems.map((item, i) => (
                  <p key={i} className="font-medium">{item.product_name} × {item.quantity} — {(item.product_price * item.quantity).toLocaleString()} FCFA</p>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between"><span>Produits</span><span>{detail.subtotal.toLocaleString()} FCFA</span></div>
                <div className="flex justify-between"><span>Livraison</span><span>{detail.delivery_fee.toLocaleString()} FCFA</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>{detail.total.toLocaleString()} FCFA</span></div>
              </div>
              <div>
                <span className="text-muted-foreground">Paiement</span>
                <p className="font-medium">{detail.payment_method || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Changer le statut</span>
                <Select defaultValue={detail.status} onValueChange={(v) => updateStatus(detail.id, v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.filter(s => s !== "Toutes").map(s => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
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
