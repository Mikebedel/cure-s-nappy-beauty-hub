import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, TrendingUp, Users, Package } from "lucide-react";

const reports = [
  { title: "Rapport des ventes", desc: "Ventes par jour, semaine et mois", icon: TrendingUp, color: "text-green-600" },
  { title: "Rapport clients", desc: "Analyse de la base clients et segmentation", icon: Users, color: "text-blue-600" },
  { title: "Rapport produits", desc: "Performance des produits et gammes", icon: Package, color: "text-purple-600" },
  { title: "Rapport marketing", desc: "ROI des campagnes et sources de trafic", icon: FileSpreadsheet, color: "text-amber-600" },
];

const AdminReports = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Rapports</h1>
      <p className="text-muted-foreground text-sm">Exporter les données en Excel ou CSV</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      {reports.map(r => (
        <Card key={r.title}>
          <CardContent className="p-6">
            <r.icon className={`h-8 w-8 ${r.color} mb-3`} />
            <h3 className="font-semibold mb-1">{r.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> Excel</Button>
              <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> CSV</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminReports;
