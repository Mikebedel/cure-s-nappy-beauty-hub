import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, UserCheck } from "lucide-react";

const mockClients = [
  { id: "1", name: "Aminata Koné", phone: "+225 07 01 02 03", email: "aminata@mail.com", orders: 5, totalSpent: 125000, lastOrder: "2026-04-03", segment: "Fidèle" },
  { id: "2", name: "Fatou Diallo", phone: "+225 05 04 05 06", email: "fatou@mail.com", orders: 3, totalSpent: 78000, lastOrder: "2026-04-02", segment: "Fidèle" },
  { id: "3", name: "Marie Aké", phone: "+225 01 07 08 09", email: "marie@mail.com", orders: 1, totalSpent: 18500, lastOrder: "2026-04-01", segment: "Nouveau" },
  { id: "4", name: "Awa Bamba", phone: "+225 07 10 11 12", email: "", orders: 1, totalSpent: 12000, lastOrder: "2026-03-15", segment: "Nouveau" },
  { id: "5", name: "Cécile Touré", phone: "+225 01 13 14 15", email: "cecile@mail.com", orders: 8, totalSpent: 230000, lastOrder: "2026-03-28", segment: "Fidèle" },
];

const segmentColor: Record<string, string> = {
  "Nouveau": "bg-blue-100 text-blue-700",
  "Fidèle": "bg-green-100 text-green-700",
  "Inactif": "bg-gray-100 text-gray-700",
};

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const filtered = mockClients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground text-sm">Base de données clients</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-8 w-8 text-primary" /><div><div className="text-xl font-bold">{mockClients.length}</div><div className="text-xs text-muted-foreground">Total clients</div></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><UserPlus className="h-8 w-8 text-blue-500" /><div><div className="text-xl font-bold">2</div><div className="text-xs text-muted-foreground">Nouveaux</div></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><UserCheck className="h-8 w-8 text-green-500" /><div><div className="text-xl font-bold">3</div><div className="text-xs text-muted-foreground">Fidèles</div></div></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.phone} {c.email && `· ${c.email}`}</div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-sm font-bold">{c.totalSpent.toLocaleString()} FCFA</div>
                  <div className="text-xs text-muted-foreground">{c.orders} commandes</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${segmentColor[c.segment]}`}>{c.segment}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminClients;
