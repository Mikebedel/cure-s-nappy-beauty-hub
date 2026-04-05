import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, UserPlus, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  orders_count: number | null;
  total_spent: number | null;
  segment: string | null;
}

const segmentColor: Record<string, string> = {
  nouveau: "bg-blue-100 text-blue-700",
  fidele: "bg-green-100 text-green-700",
  inactif: "bg-gray-100 text-gray-700",
};
const segmentLabel: Record<string, string> = {
  nouveau: "Nouveau", fidele: "Fidèle", inactif: "Inactif",
};

const AdminClients = () => {
  const [clients, setClients] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (data) setClients(data);
    };
    fetch();
  }, []);

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
  const newCount = clients.filter(c => c.segment === "nouveau").length;
  const loyalCount = clients.filter(c => c.segment === "fidele").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground text-sm">Base de données clients</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-8 w-8 text-primary" /><div><div className="text-xl font-bold">{clients.length}</div><div className="text-xs text-muted-foreground">Total clients</div></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><UserPlus className="h-8 w-8 text-blue-500" /><div><div className="text-xl font-bold">{newCount}</div><div className="text-xs text-muted-foreground">Nouveaux</div></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><UserCheck className="h-8 w-8 text-green-500" /><div><div className="text-xl font-bold">{loyalCount}</div><div className="text-xs text-muted-foreground">Fidèles</div></div></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">Aucun client pour le moment</p>}
        {filtered.map(c => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.phone} {c.email && `· ${c.email}`}</div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-sm font-bold">{(c.total_spent || 0).toLocaleString()} FCFA</div>
                  <div className="text-xs text-muted-foreground">{c.orders_count || 0} commandes</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${segmentColor[c.segment || "nouveau"]}`}>
                  {segmentLabel[c.segment || "nouveau"]}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminClients;
