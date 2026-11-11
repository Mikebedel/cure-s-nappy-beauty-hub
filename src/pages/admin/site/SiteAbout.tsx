import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, RichTextField, IconField, HeadingFields, Repeater } from "@/admin/fields";

const SiteAbout = () => {
  const { draft, update } = useDraft();
  const page = draft.about;
  const cardRepeater = (items: typeof page.pillars, set: (v: typeof page.pillars) => void, addLabel: string) => (
    <Repeater items={items} onChange={set} itemTitle={(c) => c.title} create={() => ({ icon: "sparkles", title: "Nouveau", text: "" })} addLabel={addLabel}
      render={(c, change) => (
        <>
          <Grid>
            <TextField label="Titre" value={c.title} onChange={(title) => change({ ...c, title })} />
            <IconField value={c.icon} onChange={(icon) => change({ ...c, icon })} />
          </Grid>
          <TextField label="Texte" multiline value={c.text} onChange={(text) => change({ ...c, text })} />
        </>
      )} />
  );
  return (
    <div className="space-y-4">
      <PageTitle title="À propos" description="L'histoire, la vision et les engagements de la marque.">
        <RestoreButton part="about" label="la page À propos" />
      </PageTitle>

      <Panel title="Haut de la page" defaultOpen>
        <Grid cols={3}>
          <TextField label="Petit repère" value={page.eyebrow} onChange={(v) => update((d) => { d.about.eyebrow = v; })} />
          <TextField label="Titre" value={page.title} onChange={(v) => update((d) => { d.about.title = v; })} />
          <TextField label="Texte" value={page.description} onChange={(v) => update((d) => { d.about.description = v; })} />
        </Grid>
      </Panel>

      <Panel title="Notre histoire" defaultOpen>
        <HeadingFields value={page.story} onChange={(v) => update((d) => { d.about.story = { ...d.about.story, ...v }; })} />
        <RichTextField label="Texte" value={page.story.body} onChange={(v) => update((d) => { d.about.story.body = v; })} />
      </Panel>

      <Panel title="Vision, mission, valeurs" description="Les cartes sur fond beige">
        {cardRepeater(page.pillars, (v) => update((d) => { d.about.pillars = v; }), "Ajouter une carte")}
      </Panel>

      <Panel title="Nos engagements">
        <HeadingFields value={page.commitments} onChange={(v) => update((d) => { d.about.commitments = { ...d.about.commitments, ...v }; })} />
        {cardRepeater(page.commitments.items, (v) => update((d) => { d.about.commitments.items = v; }), "Ajouter un engagement")}
      </Panel>

      <Panel title="Bandeau final">
        <Grid>
          <TextField label="Phrase" value={page.cta.title} onChange={(v) => update((d) => { d.about.cta.title = v; })} />
          <TextField label="Bouton (vers la boutique)" value={page.cta.label} onChange={(v) => update((d) => { d.about.cta.label = v; })} />
        </Grid>
      </Panel>
    </div>
  );
};

export default SiteAbout;
