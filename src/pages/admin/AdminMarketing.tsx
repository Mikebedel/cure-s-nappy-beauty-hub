import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Tag, Mail, Megaphone } from "lucide-react";

const promoCodes = [
  { code: "BIENVENUE10", discount: "10%", type: "Pourcentage", active: true, uses: 23 },
  { code: "NAPPY20", discount: "20%", type: "Pourcentage", active: true, uses: 8 },
  { code: "LIVRAISON", discount: "Livraison gratuite", type: "Livraison", active: false, uses: 45 },
];

const AdminMarketing = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Marketing</h1>
      <p className="text-muted-foreground text-sm">Campagnes, codes promo et newsletter</p>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Promo codes */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><Tag className="h-5 w-5" /> Codes promo</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground"><Plus className="h-3 w-3 mr-1" /> Nouveau</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau code promo</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Code</Label><Input placeholder="ex: SUMMER25" /></div>
                <div><Label>Réduction (%)</Label><Input type="number" placeholder="10" /></div>
                <div><Label>Date d'expiration</Label><Input type="date" /></div>
                <Button className="w-full bg-primary text-primary-foreground">Créer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-3">
          {promoCodes.map(p => (
            <div key={p.code} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <span className="font-mono font-bold text-sm">{p.code}</span>
                <span className="text-xs text-muted-foreground block">{p.discount} · {p.uses} utilisations</span>
              </div>
              <Badge variant={p.active ? "default" : "secondary"}>{p.active ? "Actif" : "Expiré"}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Mail className="h-5 w-5" /> Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-muted-foreground">Abonnés</div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline"><Megaphone className="h-4 w-4 mr-1" /> Nouvelle campagne</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle newsletter</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Sujet</Label><Input placeholder="Objet de l'email" /></div>
                <div><Label>Contenu</Label><Textarea placeholder="Contenu de la newsletter..." className="min-h-32" /></div>
                <Button className="w-full bg-primary text-primary-foreground">Envoyer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminMarketing;
