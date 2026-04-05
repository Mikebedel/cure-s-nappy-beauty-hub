import { useEffect, useState } from "react";
import { BarChart3, ShoppingCart, Users, Package, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  todaySales: number;
  monthSales: number;
  totalOrders: number;
  newClients: number;
  avgCart: number;
  productsSold: number;
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

const statusLabel: Record<string, string> = {
  nouvelle: "Nouvelle",
  en_preparation: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

const statusColor: Record<string, string> = {
  nouvelle: "bg-blue-100 text-blue-700",
  en_preparation: "bg-amber-100 text-amber-700",
  expediee: "bg-purple-100 text-purple-700",
  livree: "bg-green-100 text-green-700",
  annulee: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0, monthSales: 0, totalOrders: 0, newClients: 0, avgCart: 0, productsSold: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      // Fetch orders
      const { data: orders } = await supabase.from("orders").select("*");
      if (orders) {
        const todayOrders = orders.filter(o => o.created_at.startsWith(today));
        const monthOrders = orders.filter(o => o.created_at >= monthStart);
        const todaySales = todayOrders.reduce((s, o) => s + o.total, 0);
        const monthSales = monthOrders.reduce((s, o) => s + o.total, 0);
        const avgCart = orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;

        setStats(prev => ({
          ...prev,
          todaySales, monthSales,
          totalOrders: orders.length,
          avgCart,
        }));

        setRecentOrders(orders.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5));
      }

      // Fetch customers count
      const { count: clientCount } = await supabase.from("customers").select("*", { count: "exact", head: true });
      setStats(prev => ({ ...prev, newClients: clientCount || 0 }));

      // Fetch order items for top products
      const { data: items } = await supabase.from("order_items").select("*");
      if (items) {
        const productMap: Record<string, { sold: number; revenue: number }> = {};
        items.forEach(item => {
          if (!productMap[item.product_name]) productMap[item.product_name] = { sold: 0, revenue: 0 };
          productMap[item.product_name].sold += item.quantity;
          productMap[item.product_name].revenue += item.product_price * item.quantity;
        });
        const sorted = Object.entries(productMap)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        setTopProducts(sorted);
        setStats(prev => ({ ...prev, productsSold: items.reduce((s, i) => s + i.quantity, 0) }));
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "Ventes du jour", value: `${stats.todaySales.toLocaleString()} FCFA`, icon: DollarSign },
    { label: "Ventes du mois", value: `${stats.monthSales.toLocaleString()} FCFA`, icon: TrendingUp },
    { label: "Commandes", value: stats.totalOrders.toString(), icon: ShoppingCart },
    { label: "Clients", value: stats.newClients.toString(), icon: Users },
    { label: "Panier moyen", value: `${stats.avgCart.toLocaleString()} FCFA`, icon: BarChart3 },
    { label: "Produits vendus", value: stats.productsSold.toString(), icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Produits les plus vendus</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length === 0 && <p className="text-sm text-muted-foreground">Aucune vente pour le moment</p>}
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{p.revenue.toLocaleString()} FCFA</span>
                    <span className="text-xs text-muted-foreground block">{p.sold} vendus</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Commandes récentes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande pour le moment</p>}
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{o.customer_name}</span>
                    <span className="text-xs text-muted-foreground block">{o.order_number}</span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-sm font-semibold">{o.total.toLocaleString()} FCFA</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status] || ""}`}>
                      {statusLabel[o.status] || o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
