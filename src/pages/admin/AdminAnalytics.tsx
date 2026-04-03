import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Monitor, MapPin, Instagram, Facebook } from "lucide-react";

const trafficSources = [
  { name: "Instagram", value: "42%", icon: Instagram, color: "text-pink-500" },
  { name: "Facebook", value: "25%", icon: Facebook, color: "text-blue-600" },
  { name: "WhatsApp", value: "18%", icon: MapPin, color: "text-green-500" },
  { name: "Google", value: "10%", icon: Monitor, color: "text-red-500" },
  { name: "TikTok", value: "5%", icon: Smartphone, color: "text-foreground" },
];

const topCities = [
  { name: "Cocody", orders: 45, pct: "32%" },
  { name: "Yopougon", orders: 28, pct: "20%" },
  { name: "Marcory", orders: 22, pct: "16%" },
  { name: "Plateau", orders: 15, pct: "11%" },
  { name: "Abobo", orders: 12, pct: "9%" },
];

const behavioralData = [
  { label: "Taux de conversion", value: "3.2%", desc: "Visiteurs → Acheteurs" },
  { label: "Taux d'abandon panier", value: "68%", desc: "Paniers non finalisés" },
  { label: "Fréquence d'achat", value: "1.8x/mois", desc: "Moyenne par client" },
  { label: "Appareils mobiles", value: "87%", desc: "Du trafic total" },
];

const AdminAnalytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Analytics</h1>
      <p className="text-muted-foreground text-sm">Données clients et comportement</p>
    </div>

    {/* Behavioral */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {behavioralData.map(d => (
        <Card key={d.label}>
          <CardContent className="p-4">
            <div className="text-xl font-bold">{d.value}</div>
            <div className="text-sm font-medium">{d.label}</div>
            <div className="text-xs text-muted-foreground">{d.desc}</div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Traffic sources */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Sources de trafic</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {trafficSources.map(s => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-sm font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: s.value }} />
                </div>
                <span className="text-sm font-bold w-10 text-right">{s.value}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top cities */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Top communes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {topCities.map((c, i) => (
            <div key={c.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                <span className="text-sm font-medium">{c.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">{c.orders} commandes</span>
                <span className="text-xs text-muted-foreground block">{c.pct}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminAnalytics;
