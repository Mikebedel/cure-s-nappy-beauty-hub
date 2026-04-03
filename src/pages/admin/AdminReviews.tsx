import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check, X, MessageSquare } from "lucide-react";

const mockReviews = [
  { id: "1", client: "Aminata K.", product: "Huile Extra Pousse", rating: 5, text: "Mes cheveux poussent beaucoup plus vite depuis que j'utilise cette huile !", date: "2026-04-02", status: "pending" },
  { id: "2", client: "Fatou D.", product: "Magical Spray", rating: 4, text: "Très bon produit, j'adore l'odeur. Seul bémol : le flacon est un peu petit.", date: "2026-04-01", status: "approved" },
  { id: "3", client: "Marie A.", product: "Crème Hydratante", rating: 5, text: "La meilleure crème que j'ai utilisée pour mes cheveux crépus !", date: "2026-03-30", status: "approved" },
];

const AdminReviews = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Avis clients</h1>
      <p className="text-muted-foreground text-sm">Gérer les évaluations et commentaires</p>
    </div>

    <div className="space-y-4">
      {mockReviews.map(r => (
        <Card key={r.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{r.client}</span>
                  <span className="text-xs text-muted-foreground">sur {r.product}</span>
                  {r.status === "pending" && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">En attente</span>}
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-accent text-accent" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
                <span className="text-xs text-muted-foreground mt-2 block">{r.date}</span>
              </div>
              <div className="flex gap-1 ml-4">
                {r.status === "pending" && (
                  <>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600"><Check className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                  </>
                )}
                <Button size="icon" variant="ghost" className="h-8 w-8"><MessageSquare className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminReviews;
