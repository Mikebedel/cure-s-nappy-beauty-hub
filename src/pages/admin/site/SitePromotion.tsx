import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, NumberField, ToggleField, SelectField, ChecklistField } from "@/admin/fields";
import { Input } from "@/components/ui/input";
import { discountedPrice, promotionActive, promotionKind, promotionMinItems } from "../../../../supabase/functions/_shared/pricing";
import { promotionShort } from "@/content/promotionText";

const day = (iso: string) => (iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—");

/** Champ date (AAAA-MM-JJ), premier et dernier jour inclus. */
const DateField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5 min-w-0">
    <span className="block text-sm font-semibold">{label}</span>
    <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />
  </div>
);

const SitePromotion = () => {
  const { draft, update } = useDraft();
  const promo = draft.promotion;
  const today = new Date().toISOString().slice(0, 10);
  const datesOk = !!promo.startDate && !!promo.endDate && promo.startDate <= promo.endDate;
  const amountKind = promotionKind(promo) === "amount";
  const status = !promo.enabled ? { text: "Désactivée : aucun prix n'est réduit.", tone: "bg-muted text-muted-foreground" }
    : !datesOk ? { text: "Choisissez une date de début et une date de fin (la fin après le début).", tone: "bg-amber-100 text-amber-900" }
    : promotionActive(promo) ? { text: `En cours jusqu'au ${day(promo.endDate)} inclus (${promotionShort(promo)}) : ${amountKind ? "la remise s'applique au panier et au paiement." : "les clientes voient les prix barrés."}`, tone: "bg-green-100 text-green-800" }
    : promo.startDate > today ? { text: `Programmée : elle démarrera le ${day(promo.startDate)}.`, tone: "bg-blue-100 text-blue-800" }
    : { text: `Terminée le ${day(promo.endDate)}.`, tone: "bg-muted text-muted-foreground" };
  const example = draft.catalog.products.find((p) => p.visible);
  const productOptions = [
    ...draft.catalog.products.map((p) => ({ value: p.id, label: p.name })),
    ...draft.catalog.ranges.map((r) => ({ value: `pack-${r.id}`, label: `Gamme · ${r.name}` })),
    ...draft.catalog.duos.map((d) => ({ value: `pack-${d.id}`, label: `Duo · ${d.name}` })),
  ];

  return (
    <div className="space-y-4">
      <PageTitle title="Promotion" description="Une réduction sur une période : en pourcentage (prix barrés) ou une remise fixe dès un nombre de produits achetés. Bandeau en haut des pages ; le serveur facture le même prix réduit.">
        <RestoreButton part="promotion" label="la promotion" />
      </PageTitle>

      <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${status.tone}`}>{status.text}</p>

      <Panel title="Réduction et période" defaultOpen>
        <ToggleField label="Activer la promotion" checked={promo.enabled} onChange={(v) => update((d) => { d.promotion.enabled = v; })} hint="Elle ne s'applique que pendant les dates ci-dessous, puis s'arrête toute seule." />
        <SelectField label="Type de réduction" value={promotionKind(promo)} onChange={(v) => update((d) => { d.promotion.kind = v as "percent" | "amount"; })}
          options={[{ value: "percent", label: "Un pourcentage sur chaque prix (prix barrés)" }, { value: "amount", label: "Une remise fixe sur la commande, dès un nombre de produits" }]} />
        <Grid cols={amountKind ? 2 : 3}>
          {amountKind ? (
            <>
              <NumberField label="Remise (FCFA)" value={promo.amount ?? 2500} onChange={(v) => update((d) => { d.promotion.amount = Math.max(5, Math.round((v ?? 2500) / 5) * 5); })} hint="Déduite une seule fois du total de la commande." />
              <NumberField label="À partir de combien de produits" value={promotionMinItems(promo)} onChange={(v) => update((d) => { d.promotion.minItems = Math.min(20, Math.max(1, Math.round(v ?? 2))); })} hint="Les quantités comptent : 2 fois le même soin = 2 produits." />
            </>
          ) : (
            <NumberField label="Réduction (%)" value={promo.percent} onChange={(v) => update((d) => { d.promotion.percent = Math.min(90, Math.max(1, Math.round(v ?? 20))); })} hint="Entre 1 et 90." />
          )}
          <DateField label="Premier jour" value={promo.startDate} onChange={(v) => update((d) => { d.promotion.startDate = v; })} />
          <DateField label="Dernier jour (inclus)" value={promo.endDate} onChange={(v) => update((d) => { d.promotion.endDate = v; })} />
        </Grid>
        {amountKind
          ? <p className="text-sm text-muted-foreground">Exemple : avec {promotionMinItems(promo)} produits concernés ou plus dans le panier, la cliente paie <strong className="text-foreground">{(promo.amount ?? 0).toLocaleString("fr-FR")} FCFA de moins</strong>. Avec moins, le panier lui indique combien de produits ajouter.</p>
          : example && <p className="text-sm text-muted-foreground">Exemple : {example.name} passe de <s>{example.price.toLocaleString("fr-FR")} FCFA</s> à <strong className="text-foreground">{discountedPrice(example.price, promo.percent).toLocaleString("fr-FR")} FCFA</strong> (arrondi aux 5 FCFA).</p>}
      </Panel>

      <Panel title="Articles concernés" defaultOpen>
        <SelectField label="S'applique à" value={promo.scope} onChange={(v) => update((d) => { d.promotion.scope = v as "all" | "selection"; })}
          options={[{ value: "all", label: "Tous les soins" }, { value: "selection", label: "Une sélection d'articles" }]} />
        {promo.scope === "all"
          ? <ToggleField label="Gammes et duos aussi" checked={promo.includePacks} onChange={(v) => update((d) => { d.promotion.includePacks = v; })} />
          : <ChecklistField label="Articles en promotion" value={promo.productIds} onChange={(v) => update((d) => { d.promotion.productIds = v; })} options={productOptions} />}
        <ToggleField label="Accessoires aussi" checked={promo.includeAccessories} onChange={(v) => update((d) => { d.promotion.includeAccessories = v; })} />
      </Panel>

      <Panel title="Textes affichés" defaultOpen>
        <Grid>
          <TextField label="Bandeau en haut des pages" value={promo.banner} onChange={(v) => update((d) => { d.promotion.banner = v; })} hint="La date de fin est ajoutée automatiquement : « … jusqu'au 30 novembre »." />
          {!amountKind && <TextField label="Badge sur les produits" value={promo.badge} onChange={(v) => update((d) => { d.promotion.badge = v; })} hint="Exemple : -20 %" />}
        </Grid>
      </Panel>
    </div>
  );
};

export default SitePromotion;
