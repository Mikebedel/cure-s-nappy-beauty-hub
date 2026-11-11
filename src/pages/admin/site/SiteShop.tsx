import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, TextField, LinesField, SelectField, HeadingFields, Repeater } from "@/admin/fields";

const SiteShop = () => {
  const { draft, update } = useDraft();
  const productOptions = draft.catalog.products.map((p) => ({ value: p.id, label: p.name }));
  const nameOf = (id: string) => draft.catalog.products.find((p) => p.id === id)?.name ?? "Produit";

  return (
    <div className="space-y-4">
      <PageTitle title="Boutique & Nos Gammes" description="Le haut de la boutique et les titres des pages Boutique et Nos Gammes.">
        <RestoreButton part={["shop", "rangesPage"]} label="les textes de la boutique et de Nos Gammes" />
      </PageTitle>

      <Panel title="Soins à l'affiche" description="Les soins qui défilent en haut de la boutique (toutes les 5 secondes)" defaultOpen>
        <Repeater items={draft.shop.spotlights} onChange={(v) => update((d) => { d.shop.spotlights = v; })}
          itemTitle={(s) => nameOf(s.productId)}
          create={() => ({ productId: productOptions[0]?.value ?? "", hook: "", intro: "", benefits: [], tipTitle: "", tipText: "" })}
          addLabel="Ajouter un soin à l'affiche"
          render={(s, change) => (
            <>
              <SelectField label="Produit" value={s.productId} onChange={(productId) => change({ ...s, productId })} options={productOptions} hint="Le nom, la photo et le prix viennent de la fiche du produit." />
              <TextField label="Accroche (en doré)" value={s.hook} onChange={(hook) => change({ ...s, hook })} />
              <TextField label="Présentation" multiline value={s.intro} onChange={(intro) => change({ ...s, intro })} />
              <LinesField label="Bienfaits (4 conseillés)" value={s.benefits} onChange={(benefits) => change({ ...s, benefits })} />
              <TextField label="Astuce : début (en doré)" value={s.tipTitle} onChange={(tipTitle) => change({ ...s, tipTitle })} placeholder="Le vrai secret ? …" />
              <TextField label="Astuce : suite" multiline value={s.tipText} onChange={(tipText) => change({ ...s, tipText })} />
            </>
          )} />
      </Panel>

      <Panel title="Titre du catalogue" description="Au-dessus de « Tous les soins » dans la boutique">
        <HeadingFields value={draft.shop.catalogHeading} onChange={(v) => update((d) => { d.shop.catalogHeading = v; })} />
      </Panel>

      <Panel title="Page Nos Gammes" description="Le bandeau du haut et le titre des soins par objectif">
        <TextField label="Petit repère" value={draft.rangesPage.eyebrow} onChange={(v) => update((d) => { d.rangesPage.eyebrow = v; })} />
        <TextField label="Titre" value={draft.rangesPage.title} onChange={(v) => update((d) => { d.rangesPage.title = v; })} />
        <TextField label="Texte" multiline value={draft.rangesPage.description} onChange={(v) => update((d) => { d.rangesPage.description = v; })} />
        <p className="text-sm font-semibold pt-2">Titre « Soins par objectif capillaire »</p>
        <HeadingFields value={draft.rangesPage.themesHeading} onChange={(v) => update((d) => { d.rangesPage.themesHeading = v; })} />
      </Panel>
    </div>
  );
};

export default SiteShop;
