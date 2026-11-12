import { useDraft } from "@/admin/DraftContext";
import { PageTitle, Panel, Grid, TextField, NumberField, LinesField, ImageField, HeadingFields, Repeater, newId } from "@/admin/fields";

const SiteAccessories = () => {
  const { draft, update } = useDraft();
  const { accessories } = draft.catalog;
  return (
    <div className="space-y-4">
      <PageTitle title="Accessoires" description="Les accessoires de la boutique, ajoutés au panier comme les soins (un article par couleur)." />

      <Panel title={`Accessoires (${accessories.length})`} defaultOpen>
        <Repeater items={accessories} onChange={(v) => update((d) => { d.catalog.accessories = v; })}
          itemTitle={(a) => a.name}
          create={() => ({ id: newId("accessoire"), name: "Nouvel accessoire", price: null, intro: "", hook: "", colors: [{ name: "", swatch: "#7a8f4a", image: "" }], tools: [], why: "" })}
          addLabel="Ajouter un accessoire" startOpen
          render={(a, change) => (
            <>
              <Grid>
                <TextField label="Nom" value={a.name} onChange={(name) => change({ ...a, name })} />
                <NumberField label="Prix (FCFA)" value={a.price} allowEmpty onChange={(price) => change({ ...a, price })} hint="Indispensable pour le vendre en ligne : sans prix, la boutique affiche « Bientôt disponible » à la place du bouton Ajouter au panier." />
              </Grid>
              <TextField label="Présentation" multiline value={a.intro} onChange={(intro) => change({ ...a, intro })} />
              <TextField label="Accroche" multiline value={a.hook} onChange={(hook) => change({ ...a, hook })} />

              <div className="space-y-2">
                <p className="text-sm font-semibold">Couleurs</p>
                <Repeater items={a.colors} onChange={(colors) => change({ ...a, colors })}
                  itemTitle={(c) => c.name || "Couleur"} create={() => ({ name: "", swatch: "#7a8f4a", image: "" })} addLabel="Ajouter une couleur"
                  render={(c, changeColor, ci) => (
                    <>
                      <Grid>
                        <TextField label="Nom de la couleur" value={c.name} onChange={(name) => changeColor({ ...c, name })} />
                        <div className="space-y-1.5">
                          <label className="block text-sm font-semibold" htmlFor={`swatch-${a.id}-${ci}`}>Pastille</label>
                          <input id={`swatch-${a.id}-${ci}`} type="color" value={c.swatch.startsWith("#") ? c.swatch : "#7a8f4a"} onChange={(e) => changeColor({ ...c, swatch: e.target.value })} className="h-11 w-24 rounded-xl border border-input bg-background p-1" />
                        </div>
                      </Grid>
                      <ImageField label="Photo dans cette couleur" value={c.image} onChange={(image) => changeColor({ ...c, image })} allowEmpty={false} />
                    </>
                  )} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Ce que contient le set</p>
                <Repeater items={a.tools} onChange={(tools) => change({ ...a, tools })}
                  itemTitle={(t) => t.title} create={() => ({ title: "Nouvel outil", points: [] })} addLabel="Ajouter un élément"
                  render={(t, changeTool) => (
                    <>
                      <TextField label="Nom" value={t.title} onChange={(title) => changeTool({ ...t, title })} />
                      <LinesField label="Points" value={t.points} onChange={(points) => changeTool({ ...t, points })} />
                    </>
                  )} />
              </div>
              <TextField label="« Pourquoi on l'adore ? »" multiline value={a.why} onChange={(why) => change({ ...a, why })} />
            </>
          )} />
      </Panel>

      <Panel title="Titre de la section">
        <HeadingFields value={draft.shop.accessoriesHeading} onChange={(v) => update((d) => { d.shop.accessoriesHeading = v; })} />
      </Panel>
    </div>
  );
};

export default SiteAccessories;
