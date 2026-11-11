import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, NumberField, LinesField, ToggleField, SelectField, ChecklistField, ImageField, ImagesField, Repeater, newId } from "@/admin/fields";
import type { ProductContent } from "@/content/types";

const SiteProducts = () => {
  const { draft, update } = useDraft();
  const { products, categories } = draft.catalog;
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const createProduct = (): ProductContent => ({
    id: newId("produit"), name: "Nouveau produit", shortDescription: "", description: "", price: 0,
    image: "", gallery: [], category: categories[0]?.id ?? "", extraCategories: [], volume: "",
    benefits: [], ingredients: [], usage: "", visible: true,
  });

  return (
    <div className="space-y-4">
      <PageTitle title="Produits" description="Le catalogue affiché dans la boutique, les fiches produit et les catégories.">
        <RestoreButton part="catalog" label="tout le catalogue (produits, gammes, duos, accessoires)" />
      </PageTitle>

      <Panel title={`Produits (${products.length})`} description="Cliquez sur un produit pour le modifier" defaultOpen>
        <Repeater
          items={products}
          onChange={(v) => update((d) => { d.catalog.products = v; })}
          itemTitle={(p) => `${p.name} · ${p.price.toLocaleString("fr-FR")} FCFA${p.visible ? "" : " · masqué"}`}
          create={createProduct}
          addLabel="Ajouter un produit"
          render={(p, change) => (
            <>
              <ToggleField label="Visible sur le site" checked={p.visible} onChange={(visible) => change({ ...p, visible })} hint="Décochez pour retirer le produit du site sans le supprimer." />
              <Grid>
                <TextField label="Nom" value={p.name} onChange={(name) => change({ ...p, name })} />
                <NumberField label="Prix (FCFA)" value={p.price} onChange={(price) => change({ ...p, price: price ?? 0 })} />
                <SelectField label="Catégorie principale" value={p.category} onChange={(category) => change({ ...p, category })} options={categoryOptions} />
                <TextField label="Contenance" value={p.volume} onChange={(volume) => change({ ...p, volume })} placeholder="ex. 100ml" />
              </Grid>
              <ChecklistField label="Autres catégories" value={p.extraCategories} onChange={(extraCategories) => change({ ...p, extraCategories })}
                options={categoryOptions.filter((c) => c.value !== p.category)} hint="Le produit apparaîtra aussi dans ces filtres de la boutique." />
              <TextField label="Résumé (sur la carte produit)" value={p.shortDescription} onChange={(shortDescription) => change({ ...p, shortDescription })} />
              <TextField label="Description (fiche produit)" multiline rows={4} value={p.description} onChange={(description) => change({ ...p, description })} />
              <ImageField label="Photo principale" value={p.image} onChange={(image) => change({ ...p, image })} allowEmpty={false} />
              <ImagesField label="Galerie (facultatif)" value={p.gallery} onChange={(gallery) => change({ ...p, gallery })} hint="Plusieurs photos sur la fiche produit. Si vous en mettez, la première remplace la photo principale sur la fiche." />
              <Grid>
                <LinesField label="Bienfaits" value={p.benefits} onChange={(benefits) => change({ ...p, benefits })} />
                <LinesField label="Ingrédients" value={p.ingredients} onChange={(ingredients) => change({ ...p, ingredients })} />
              </Grid>
              <TextField label="Conseils d'utilisation" multiline value={p.usage} onChange={(usage) => change({ ...p, usage })} />
              <p className="text-xs text-muted-foreground">Adresse de la fiche : /produit/{p.id}</p>
            </>
          )}
        />
      </Panel>

      <Panel title="Catégories" description="Les filtres de la boutique et les rubriques de Nos Gammes">
        <Repeater
          items={categories}
          onChange={(v) => update((d) => { d.catalog.categories = v; })}
          itemTitle={(c) => c.name}
          create={() => ({ id: newId("categorie"), name: "Nouvelle catégorie" })}
          addLabel="Ajouter une catégorie"
          render={(c, change) => <TextField label="Nom" value={c.name} onChange={(name) => change({ ...c, name })} />}
        />
      </Panel>
    </div>
  );
};

export default SiteProducts;
