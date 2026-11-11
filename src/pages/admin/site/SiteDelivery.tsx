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
        <Grid>
          <TextField label="Délai annoncé, zone standard" value={delivery.standardDelay} onChange={(v) => update((d) => { d.delivery.standardDelay = v; })} hint="Affiché après « Livrée … » : ex. sous 24 à 48 h" />
          <TextField label="Délai annoncé, zone spéciale" value={delivery.specialDelay} onChange={(v) => update((d) => { d.delivery.specialDelay = v; })} />
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
        <ToggleField label="Proposer le paiement en ligne (Paystack)" checked={delivery.onlinePayment} onChange={(v) => update((d) => { d.delivery.onlinePayment = v; })}
          hint="Wave, Orange Money, MTN et carte bancaire. Il faut aussi que la clé secrète Paystack soit configurée sur le serveur." />
        <ToggleField label="Proposer « Payer plus tard »" checked={delivery.payLater} onChange={(v) => update((d) => { d.delivery.payLater = v; })}
          hint="La commande est enregistrée et l'équipe recontacte le client sur WhatsApp pour le paiement." />
        <LinesField label="Moyens de paiement affichés" value={delivery.paymentMethods} onChange={(v) => update((d) => { d.delivery.paymentMethods = v; })} hint="Texte affiché sous « Payer maintenant ». Un moyen par ligne." />
      </Panel>
    </div>
  );
};

export default SiteDelivery;
