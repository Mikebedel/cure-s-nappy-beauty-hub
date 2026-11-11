import { useDraft } from "@/admin/DraftContext";
import { PageTitle, Panel, Grid, TextField, NumberField, LinesField, ChecklistField, ImageField, HeadingFields, Repeater, newId } from "@/admin/fields";

const SiteRanges = () => {
  const { draft, update } = useDraft();
  const { ranges, duos, products } = draft.catalog;
  const productOptions = products.map((p) => ({ value: p.id, label: `${p.name} (${p.price.toLocaleString("fr-FR")} FCFA)` }));
  const priceOf = (ids: string[]) => ids.reduce((sum, id) => sum + (products.find((p) => p.id === id)?.price ?? 0), 0);

  return (
    <div className="space-y-4">
      <PageTitle title="Gammes & duos" description="Les routines complètes et les combos, affichés dans la boutique, Nos Gammes et l'accueil." />

      <Panel title={`Gammes (${ranges.length})`} description="Routines complètes avec un prix fixe" defaultOpen>
        <Repeater items={ranges} onChange={(v) => update((d) => { d.catalog.ranges = v; })}
          itemTitle={(r) => `${r.name} · ${r.price.toLocaleString("fr-FR")} FCFA`}
          create={() => ({ id: newId("gamme"), name: "Nouvelle gamme", description: "", note: "", price: 0, image: "", benefits: [], contains: [] })}
          addLabel="Ajouter une gamme"
          render={(r, change) => (
            <>
              <Grid>
                <TextField label="Nom" value={r.name} onChange={(name) => change({ ...r, name })} />
                <NumberField label="Prix (FCFA)" value={r.price} onChange={(price) => change({ ...r, price: price ?? 0 })} />
              </Grid>
              <TextField label="Description" multiline value={r.description} onChange={(description) => change({ ...r, description })} />
              <TextField label="Note (facultatif)" value={r.note} onChange={(note) => change({ ...r, note })} hint="S'affiche sous la liste des soins, ex. « Idéale pour débuter »." />
              <ImageField label="Photo" value={r.image} onChange={(image) => change({ ...r, image })} allowEmpty={false} />
              <LinesField label="Soins inclus" value={r.contains} onChange={(contains) => change({ ...r, contains })} rows={6} />
            </>
          )} />
      </Panel>

      <Panel title={`Duos et trios (${duos.length})`} description="Leur prix est calculé tout seul : la somme des produits choisis">
        <Repeater items={duos} onChange={(v) => update((d) => { d.catalog.duos = v; })}
          itemTitle={(duo) => `${duo.name} · ${priceOf(duo.productIds).toLocaleString("fr-FR")} FCFA`}
          create={() => ({ id: newId("duo"), name: "Nouveau duo", description: "", image: "", productIds: [] })}
          addLabel="Ajouter un duo ou un trio"
          render={(duo, change) => (
            <>
              <TextField label="Nom" value={duo.name} onChange={(name) => change({ ...duo, name })} />
              <TextField label="Description" multiline value={duo.description} onChange={(description) => change({ ...duo, description })} />
              <ImageField label="Photo" value={duo.image} onChange={(image) => change({ ...duo, image })} allowEmpty={false} />
              <ChecklistField label="Produits du combo" value={duo.productIds} onChange={(productIds) => change({ ...duo, productIds })} options={productOptions}
                hint={`Prix affiché : ${priceOf(duo.productIds).toLocaleString("fr-FR")} FCFA`} />
            </>
          )} />
      </Panel>

      <Panel title="Titres de ces sections" description="Repères, titres et textes au-dessus des gammes et des duos">
        <p className="text-sm font-semibold">Section « Nos Gammes »</p>
        <HeadingFields value={draft.shop.rangesHeading} onChange={(v) => update((d) => { d.shop.rangesHeading = { ...d.shop.rangesHeading, ...v }; })} />
        <TextField label="Texte" value={draft.shop.rangesHeading.text} onChange={(v) => update((d) => { d.shop.rangesHeading.text = v; })} />
        <p className="text-sm font-semibold pt-2">Section « Nos Duos et Trio »</p>
        <HeadingFields value={draft.shop.duosHeading} onChange={(v) => update((d) => { d.shop.duosHeading = { ...d.shop.duosHeading, ...v }; })} />
        <TextField label="Texte" value={draft.shop.duosHeading.text} onChange={(v) => update((d) => { d.shop.duosHeading.text = v; })} />
      </Panel>
    </div>
  );
};

export default SiteRanges;
