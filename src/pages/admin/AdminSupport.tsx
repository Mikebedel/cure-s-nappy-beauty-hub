import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { useState } from "react";

const mockMessages = [
  { id: "1", client: "Aminata K.", subject: "Question sur ma commande", message: "Bonjour, je voudrais savoir quand ma commande sera livrée. Merci.", date: "2026-04-03", via: "Formulaire", replied: false },
  { id: "2", client: "Fatou D.", subject: "Produit pour cheveux fins", message: "Quel produit recommandez-vous pour les cheveux fins et cassants ?", date: "2026-04-02", via: "WhatsApp", replied: true },
  { id: "3", client: "Awa B.", subject: "Retour produit", message: "J'ai reçu un mauvais produit, comment faire un retour ?", date: "2026-04-01", via: "Email", replied: false },
];

const AdminSupport = () => {
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const detail = mockMessages.find(m => m.id === selectedMsg);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Support client</h1>
        <p className="text-muted-foreground text-sm">Répondre aux messages et demandes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {mockMessages.map(m => (
            <Card key={m.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedMsg === m.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedMsg(m.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{m.client}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{m.via}</span>
                    {!m.replied && <span className="h-2 w-2 bg-action rounded-full" />}
                  </div>
                </div>
                <p className="text-sm font-medium">{m.subject}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{m.message}</p>
                <span className="text-xs text-muted-foreground mt-1 block">{m.date}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {detail && (
          <Card className="h-fit sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold">{detail.subject}</h3>
                <p className="text-xs text-muted-foreground">{detail.client} · {detail.via} · {detail.date}</p>
              </div>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">{detail.message}</p>
              <div>
                <Textarea placeholder="Écrire votre réponse..." className="min-h-24" />
                <Button className="mt-3 w-full bg-primary text-primary-foreground">
                  <MessageSquare className="h-4 w-4 mr-1" /> Envoyer la réponse
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
