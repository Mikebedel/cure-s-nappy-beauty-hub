import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import NewsletterCard from "@/admin/NewsletterCard";
import { Link } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { promotionActive } from "../../../supabase/functions/_shared/pricing";

const AdminMarketing = () => {
  const promo = useContent().content.promotion;
  const day = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const promoText = !promo.enabled || !promo.startDate || !promo.endDate ? "Aucune promotion active."
    : promotionActive(promo) ? `En cours : -${promo.percent} % jusqu'au ${day(promo.endDate)} inclus.`
    : `-${promo.percent} % du ${day(promo.startDate)} au ${day(promo.endDate)} (pas en cours aujourd'hui).`;
  return (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Marketing</h1>
      <p className="text-muted-foreground text-sm">Campagnes, codes promo et newsletter</p>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Promotion (réglée dans Contenu du site → Promotion) */}
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Tag className="h-5 w-5" /> Promotion</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{promoText}</p>
          <Button asChild variant="outline"><Link to="/admin/site/promotion">Régler la promotion</Link></Button>
        </CardContent>
      </Card>

      <NewsletterCard />
    </div>
  </div>
  );
};

export default AdminMarketing;
