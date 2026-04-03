import { useState } from "react";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products as initialProducts, gammes } from "@/data/products";

const AdminProducts = () => {
  const [productList] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const filtered = productList.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Produits</h1>
          <p className="text-muted-foreground text-sm">{productList.length} produits dans le catalogue</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau produit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Nom du produit</Label><Input placeholder="Nom du produit" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Prix (FCFA)</Label><Input type="number" placeholder="5000" /></div>
                <div><Label>Stock</Label><Input type="number" placeholder="50" /></div>
              </div>
              <div>
                <Label>Gamme</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {gammes.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea placeholder="Description du produit" /></div>
              <div><Label>Ingrédients</Label><Textarea placeholder="Un ingrédient par ligne" /></div>
              <div><Label>Mode d'utilisation</Label><Textarea placeholder="Comment utiliser" /></div>
              <div><Label>Image du produit</Label><Input type="file" accept="image/*" /></div>
              <Button className="w-full bg-primary text-primary-foreground">Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="overflow-hidden">
            <div className="h-40 bg-muted overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
                <Badge variant="secondary" className="text-xs ml-2 shrink-0">{p.price.toLocaleString()} F</Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.shortDescription}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" /> Stock: 50
                </span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
