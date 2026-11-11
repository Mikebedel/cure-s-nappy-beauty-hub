import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, NumberField, LinesField, ToggleField, Repeater } from "@/admin/fields";

const feeText = (fee: number | null) => (fee === null ? "à confirmer" : `${fee.toLocaleString("fr-FR")} FCFA`);

const SiteDelivery = () => {
  const { draft, update } = useDraft();
  const { abidjan, national, international } = draft.delivery;
  return (
    <div className="space-y-4">
      <PageTitle title="Livraison & paiement" description="Livraison à Abidjan, expéditions en Côte d'Ivoire et à l'international, moyens de paiement.">
        <RestoreButton part="delivery" label="la livraison et le paiement" />
      </PageTitle>

      <Panel title={`Livraison à Abidjan (${abidjan.communes.length} communes)`} description="Un prix par commune" defaultOpen>
        <TextField label="Délai annoncé" value={abidjan.delay} onChange={(v) => update((d) => { d.delivery.abidjan.delay = v; })} hint="Affiché après « Livrée … » : ex. sous 24 à 48 h" />
        <Repeater items={abidjan.communes} onChange={(v) => update((d) => { d.delivery.abidjan.communes = v; })}
          itemTitle={(c) => `${c.name} · ${feeText(c.fee)}`} create={() => ({ name: "Nouvelle commune", fee: 1500 })} addLabel="Ajouter une commune"
          render={(c, change) => (
            <Grid>
              <TextField label="Commune" value={c.name} onChange={(name) => change({ ...c, name })} />
              <NumberField label="Frais de livraison (FCFA)" value={c.fee} onChange={(fee) => change({ ...c, fee: fee ?? 0 })} />
            </Grid>
          )} />
      </Panel>

      <Panel title={`Expédition en Côte d'Ivoire (${national.cities.length} villes)`} description="Les autres villes du pays">
        <ToggleField label="Proposer l'expédition en Côte d'Ivoire" checked={national.enabled} onChange={(v) => update((d) => { d.delivery.national.enabled = v; })} />
        <TextField label="Délai annoncé" value={national.delay} onChange={(v) => update((d) => { d.delivery.national.delay = v; })} hint="Affiché après « Expédiée … » : ex. sous 2 à 4 jours. Laissez vide pour ne rien afficher." />
        <ToggleField label="Proposer « Autre ville »" checked={national.allowOther} onChange={(v) => update((d) => { d.delivery.national.allowOther = v; })} hint="Le client écrit sa ville ; les frais sont alors à confirmer par l'équipe." />
        <p className="text-sm text-muted-foreground">Une ville sans frais renseignés affiche « frais confirmés par notre équipe » : le client commande avec « Payer plus tard » et vous lui donnez le prix sur WhatsApp.</p>
        <Repeater items={national.cities} onChange={(v) => update((d) => { d.delivery.national.cities = v; })}
          itemTitle={(c) => `${c.name} · ${feeText(c.fee)}`} create={() => ({ name: "Nouvelle ville", fee: null })} addLabel="Ajouter une ville"
          render={(c, change) => (
            <Grid>
              <TextField label="Ville" value={c.name} onChange={(name) => change({ ...c, name })} />
              <NumberField label="Frais d'expédition (FCFA)" value={c.fee} allowEmpty onChange={(fee) => change({ ...c, fee })} hint="Laissez vide si le prix est à confirmer." />
            </Grid>
          )} />
      </Panel>

      <Panel title={`Expédition internationale (${international.zones.length} zones)`} description="Un tarif et un délai par groupe de pays">
        <ToggleField label="Proposer l'expédition internationale" checked={international.enabled} onChange={(v) => update((d) => { d.delivery.international.enabled = v; })} />
        <ToggleField label="Proposer « Autre pays »" checked={international.allowOther} onChange={(v) => update((d) => { d.delivery.international.allowOther = v; })} hint="Le client écrit son pays ; les frais sont alors à confirmer par l'équipe." />
        <Repeater items={international.zones} onChange={(v) => update((d) => { d.delivery.international.zones = v; })}
          itemTitle={(z) => `${z.name} · ${z.countries.length} pays · ${feeText(z.fee)}`} create={() => ({ name: "Nouvelle zone", fee: null, delay: "", countries: [] })} addLabel="Ajouter une zone"
          render={(z, change) => (
            <>
              <Grid cols={3}>
                <TextField label="Nom de la zone" value={z.name} onChange={(name) => change({ ...z, name })} />
                <NumberField label="Frais d'expédition (FCFA)" value={z.fee} allowEmpty onChange={(fee) => change({ ...z, fee })} hint="Vide = à confirmer." />
                <TextField label="Délai annoncé" value={z.delay} onChange={(delay) => change({ ...z, delay })} placeholder="ex. sous 7 à 10 jours" />
              </Grid>
              <LinesField label="Pays de cette zone" value={z.countries} onChange={(countries) => change({ ...z, countries })} rows={8} hint="Un pays par ligne. Ils apparaissent dans la liste « Pays » de la commande." />
            </>
          )} />
      </Panel>

      <Panel title="Paiement">
        <ToggleField label="Proposer le paiement en ligne (Paystack)" checked={draft.delivery.onlinePayment} onChange={(v) => update((d) => { d.delivery.onlinePayment = v; })}
          hint="Wave, Orange Money, MTN et carte bancaire. Il faut aussi que la clé secrète Paystack soit configurée sur le serveur." />
        <ToggleField label="Proposer « Payer plus tard »" checked={draft.delivery.payLater} onChange={(v) => update((d) => { d.delivery.payLater = v; })}
          hint="La commande est enregistrée et l'équipe recontacte le client sur WhatsApp. Toujours utilisé quand les frais d'expédition sont à confirmer." />
        <LinesField label="Moyens de paiement affichés" value={draft.delivery.paymentMethods} onChange={(v) => update((d) => { d.delivery.paymentMethods = v; })} hint="Texte affiché sous « Payer maintenant ». Un moyen par ligne." />
      </Panel>
    </div>
  );
};

export default SiteDelivery;
