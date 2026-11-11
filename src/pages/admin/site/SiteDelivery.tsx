import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, NumberField, LinesField, ToggleField, Repeater } from "@/admin/fields";

const SiteDelivery = () => {
  const { draft, update } = useDraft();
  const delivery = draft.delivery;
  return (
    <div className="space-y-4">
      <PageTitle title="Livraison & paiement" description="Frais de livraison, communes, moyens de paiement et lien de paiement.">
        <RestoreButton part="delivery" label="la livraison et le paiement" />
      </PageTitle>

      <Panel title="Frais de livraison" defaultOpen>
        <Grid>
          <NumberField label="Zone standard (FCFA)" value={delivery.standardFee} onChange={(v) => update((d) => { d.delivery.standardFee = v ?? 0; })} />
          <NumberField label="Zone spéciale (FCFA)" value={delivery.specialFee} onChange={(v) => update((d) => { d.delivery.specialFee = v ?? 0; })} />
        </Grid>
        <TextField label="Texte pour les envois hors Abidjan et à l'étranger" multiline value={delivery.outsideNote} onChange={(v) => update((d) => { d.delivery.outsideNote = v; })} />
      </Panel>

      <Panel title={`Communes livrées (${delivery.communes.length})`} description="La liste proposée à l'étape de commande">
        <Repeater items={delivery.communes} onChange={(v) => update((d) => { d.delivery.communes = v; })}
          itemTitle={(c) => `${c.name}${c.special ? " · zone spéciale" : ""}`} create={() => ({ name: "Nouvelle commune", special: false })} addLabel="Ajouter une commune"
          render={(c, change) => (
            <>
              <TextField label="Nom" value={c.name} onChange={(name) => change({ ...c, name })} />
              <ToggleField label="Zone spéciale" checked={c.special} onChange={(special) => change({ ...c, special })} hint={`Frais : ${(c.special ? delivery.specialFee : delivery.standardFee).toLocaleString("fr-FR")} FCFA`} />
            </>
          )} />
      </Panel>

      <Panel title="Paiement">
        <LinesField label="Moyens de paiement proposés" value={delivery.paymentMethods} onChange={(v) => update((d) => { d.delivery.paymentMethods = v; })} />
        <Grid>
          <TextField label="Lien de paiement en ligne" value={delivery.paymentUrl} onChange={(v) => update((d) => { d.delivery.paymentUrl = v.trim(); })} hint="Proposé après l'enregistrement de la commande." />
          <TextField label="Texte du bouton de paiement" value={delivery.paymentLabel} onChange={(v) => update((d) => { d.delivery.paymentLabel = v; })} />
        </Grid>
      </Panel>
    </div>
  );
};

export default SiteDelivery;
