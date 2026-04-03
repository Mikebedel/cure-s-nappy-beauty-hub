import { BarChart3, ShoppingCart, Users, Package, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Ventes du jour", value: "45 000 FCFA", icon: DollarSign, change: "+12%" },
  { label: "Ventes du mois", value: "1 250 000 FCFA", icon: TrendingUp, change: "+8%" },
  { label: "Commandes", value: "34", icon: ShoppingCart, change: "+5" },
  { label: "Nouveaux clients", value: "12", icon: Users, change: "+3" },
  { label: "Panier moyen", value: "18 500 FCFA", icon: BarChart3, change: "+2%" },
  { label: "Produits vendus", value: "89", icon: Package, change: "" },
];

const topProducts = [
  { name: "Huile Extra Pousse", sold: 23, revenue: "149 500 FCFA" },
  { name: "Magical Spray", sold: 18, revenue: "90 000 FCFA" },
  { name: "Crème Hydratante & Volume+", sold: 15, revenue: "82 500 FCFA" },
  { name: "Shampoing Doux & Clarifiant", sold: 12, revenue: "72 000 FCFA" },
  { name: "Masque Fortifiant", sold: 11, revenue: "55 000 FCFA" },
];

const recentOrders = [
  { id: "CN-A1B2C", client: "Aminata K.", total: "23 000 FCFA", status: "Nouvelle", date: "Aujourd'hui" },
  { id: "CN-D3E4F", client: "Fatou D.", total: "16 500 FCFA", status: "En préparation", date: "Aujourd'hui" },
  { id: "CN-G5H6I", client: "Marie A.", total: "49 000 FCFA", status: "Expédiée", date: "Hier" },
  { id: "CN-J7K8L", client: "Awa B.", total: "11 000 FCFA", status: "Livrée", date: "Hier" },
];

const statusColor: Record<string, string> = {
  "Nouvelle": "bg-blue-100 text-blue-700",
  "En préparation": "bg-amber-100 text-amber-700",
  "Expédiée": "bg-purple-100 text-purple-700",
  "Livrée": "bg-green-100 text-green-700",
  "Annulée": "bg-red-100 text-red-700",
};

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Tableau de bord</h1>
      <p className="text-muted-foreground text-sm">Vue d'ensemble de votre activité</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(s => (
        <Card key={s.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            <s.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{s.value}</div>
            {s.change && <p className="text-xs text-green-600 mt-1">{s.change}</p>}
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Top products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produits les plus vendus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                  <span className="text-sm font-medium">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{p.revenue}</span>
                  <span className="text-xs text-muted-foreground block">{p.sold} vendus</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{o.client}</span>
                  <span className="text-xs text-muted-foreground block">{o.id} · {o.date}</span>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-sm font-semibold">{o.total}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminDashboard;
