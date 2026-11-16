import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ShoppingCart, Users, Package, TrendingUp, Wallet, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MONEY_ORDER_COLUMNS, MoneyOrder, cashedAt, fcfa, moneyLabel, moneyState } from "@/admin/orderMoney";

interface Stats {
  todayCashed: number;
  monthCashed: number;
  salesCount: number;
  lostCount: number;
  lostAmount: number;
  pendingCount: number;
  buyers: number;
  avgCart: number;
  productsSold: number;
}

interface TopProduct { name: string; sold: number; revenue: number }

const empty: Stats = { todayCashed: 0, monthCashed: 0, salesCount: 0, lostCount: 0, lostAmount: 0, pendingCount: 0, buyers: 0, avgCart: 0, productsSold: 0 };

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>(empty);
  const [recentOrders, setRecentOrders] = useState<MoneyOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [{ data }, { data: items }] = await Promise.all([
        supabase.from("orders").select(MONEY_ORDER_COLUMNS).order("created_at", { ascending: false }),
        supabase.from("order_items").select("order_id, product_name, product_price, quantity"),
      ]);
      const orders = (data ?? []) as unknown as MoneyOrder[];
      // Seules les commandes encaissées comptent comme des ventes.
      const sales = orders.filter((o) => moneyState(o) === "encaissee");
      const lost = orders.filter((o) => moneyState(o) === "non_conclue");
      const sum = (list: MoneyOrder[]) => list.reduce((s, o) => s + o.total, 0);
      const salesIds = new Set(sales.map((o) => o.id));
      const soldItems = (items ?? []).filter((i) => salesIds.has(i.order_id));

      const productMap: Record<string, TopProduct> = {};
      soldItems.forEach((i) => {
        const p = (productMap[i.product_name] ??= { name: i.product_name, sold: 0, revenue: 0 });
        p.sold += i.quantity;
        p.revenue += i.product_price * i.quantity;
      });

      setStats({
        todayCashed: sum(sales.filter((o) => cashedAt(o).startsWith(today))),
        monthCashed: sum(sales.filter((o) => cashedAt(o) >= monthStart)),
        salesCount: sales.length,
        lostCount: lost.length,
        lostAmount: sum(lost),
        pendingCount: orders.length - sales.length - lost.length,
        buyers: new Set(sales.map((o) => o.customer_phone)).size,
        avgCart: sales.length ? Math.round(sum(sales) / sales.length) : 0,
        productsSold: soldItems.reduce((s, i) => s + i.quantity, 0),
      });
      setTopProducts(Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5));
      setRecentOrders(orders.slice(0, 6));
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Encaissé aujourd'hui", value: fcfa(stats.todayCashed), icon: Wallet, hint: "Argent réellement reçu" },
    { label: "Encaissé ce mois", value: fcfa(stats.monthCashed), icon: TrendingUp, hint: "Argent réellement reçu" },
    { label: "Ventes conclues", value: stats.salesCount.toString(), icon: ShoppingCart, hint: stats.pendingCount ? `${stats.pendingCount} commande(s) en cours` : "Commandes payées" },
    { label: "Ventes non conclues", value: stats.lostCount.toString(), icon: XCircle, hint: stats.lostCount ? `${fcfa(stats.lostAmount)} non encaissés : à relancer` : "Aucune pour le moment", link: "/admin/clients?segment=prospect" },
    { label: "Clients acheteurs", value: stats.buyers.toString(), icon: Users, hint: "Au moins un achat payé" },
    { label: "Panier moyen", value: fcfa(stats.avgCart), icon: BarChart3, hint: "Sur les ventes conclues" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble de votre activité. Les montants ne comptent que l'argent réellement encaissé.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => {
          const body = (
            <Card className={`h-full ${s.link ? "hover:border-primary/50 transition-colors" : ""}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-4 w-4 shrink-0 ${s.label === "Ventes non conclues" ? "text-destructive" : "text-primary"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{s.hint}{s.link && stats.lostCount > 0 && <ArrowRight className="inline h-3 w-3 ml-1" />}</p>
              </CardContent>
            </Card>
          );
          return s.link && stats.lostCount > 0 ? <Link key={s.label} to={s.link}>{body}</Link> : <div key={s.label}>{body}</div>;
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Produits les plus vendus</CardTitle>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Package className="h-3.5 w-3.5" />{stats.productsSold} vendu(s)</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length === 0 && <p className="text-sm text-muted-foreground">Aucune vente conclue pour le moment</p>}
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                    <span className="text-sm font-medium truncate">{p.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold">{fcfa(p.revenue)}</span>
                    <span className="text-xs text-muted-foreground block">{p.sold} vendu(s)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Commandes récentes</CardTitle>
            <Link to="/admin/commandes" className="text-xs text-primary font-semibold hover:underline">Tout voir</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande pour le moment</p>}
              {recentOrders.map((o) => {
                const state = moneyLabel[moneyState(o)];
                return (
                  <div key={o.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-sm font-medium block truncate">{o.customer_name}</span>
                      <span className="text-xs text-muted-foreground block">{o.order_number}</span>
                    </div>
                    <div className="text-right flex items-center gap-2 shrink-0">
                      <span className={`text-sm font-semibold ${moneyState(o) === "non_conclue" ? "text-muted-foreground line-through" : ""}`}>{fcfa(o.total)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${state.tone}`}>{state.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
