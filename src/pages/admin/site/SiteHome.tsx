import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import {
  PageTitle, Panel, Grid, TextField, RichTextField, LinesField, ToggleField, SelectField, IconField,
  ImageField, ImagesField, ChecklistField, HeadingFields, Repeater,
} from "@/admin/fields";

const SiteHome = () => {
  const { draft, update } = useDraft();
  const home = draft.home;
  const productOptions = draft.catalog.products.map((p) => ({ value: p.id, label: p.name }));
  const rangeOptions = draft.catalog.ranges.map((r) => ({ value: r.id, label: r.name }));

  return (
    <div className="space-y-4">
      <PageTitle title="Page d'accueil" description="Chaque bloc correspond à une partie de la page, dans l'ordre où elle s'affiche.">
        <RestoreButton part="home" label="toute la page d'accueil" />
      </PageTitle>

      <Panel title="Haut de page" description="Titre animé, texte, boutons, chiffres et photos qui défilent" defaultOpen>
        <Grid>
          <TextField label="Titre, 1re ligne" value={home.hero.line1} onChange={(v) => update((d) => { d.home.hero.line1 = v; })} />
          <TextField label="Titre, 2e ligne (en vert)" value={home.hero.line2} onChange={(v) => update((d) => { d.home.hero.line2 = v; })} />
        </Grid>
        <LinesField label="Mots qui changent à la fin du titre (en doré)" value={home.hero.rotatingWords} onChange={(v) => update((d) => { d.home.hero.rotatingWords = v; })} hint="Un mot par ligne, sans point : il est ajouté automatiquement." />
        <TextField label="Texte sous le titre" multiline value={home.hero.description} onChange={(v) => update((d) => { d.home.hero.description = v; })} />
        <Grid>
          <TextField label="Bouton principal (vers la boutique)" value={home.hero.primaryCta} onChange={(v) => update((d) => { d.home.hero.primaryCta = v; })} />
          <TextField label="Bouton secondaire (vers Nos gammes)" value={home.hero.secondaryCta} onChange={(v) => update((d) => { d.home.hero.secondaryCta = v; })} />
        </Grid>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Les 3 chiffres</p>
          <Repeater items={home.hero.stats} onChange={(v) => update((d) => { d.home.hero.stats = v; })}
            itemTitle={(s) => `${s.value} ${s.label}`} create={() => ({ value: "", label: "" })} addLabel="Ajouter un chiffre"
            render={(s, change) => (
              <Grid>
                <TextField label="Chiffre" value={s.value} onChange={(value) => change({ ...s, value })} />
                <TextField label="Légende" value={s.label} onChange={(label) => change({ ...s, label })} />
              </Grid>
            )} />
        </div>
        <ImagesField label="Photos qui défilent" value={home.hero.slides} onChange={(v) => update((d) => { d.home.hero.slides = v; })} hint="Elles changent toutes les 5 secondes, dans cet ordre." />
      </Panel>

      <Panel title="Bandeau défilant" description="La bande verte avec les phrases qui défilent">
        <LinesField label="Phrases" value={home.ticker} onChange={(v) => update((d) => { d.home.ticker = v; })} hint="Une phrase par ligne. Laissez vide pour masquer le bandeau." />
      </Panel>

      <Panel title="Garanties" description="Les 4 cartes avec icône (qualité, livraison…)">
        <Repeater items={home.guarantees} onChange={(v) => update((d) => { d.home.guarantees = v; })}
          itemTitle={(g) => g.title} create={() => ({ icon: "sparkles", title: "Nouvelle garantie", text: "" })} addLabel="Ajouter une garantie"
          render={(g, change) => (
            <>
              <Grid>
                <TextField label="Titre" value={g.title} onChange={(title) => change({ ...g, title })} />
                <IconField value={g.icon} onChange={(icon) => change({ ...g, icon })} />
              </Grid>
              <TextField label="Texte" value={g.text} onChange={(text) => change({ ...g, text })} />
            </>
          )} />
      </Panel>

      <Panel title="Nos soins du moment" description="Les produits mis en avant juste après les garanties">
        <HeadingFields value={home.featured} onChange={(v) => update((d) => { d.home.featured = { ...d.home.featured, ...v }; })} />
        <ChecklistField label="Produits affichés" value={home.featured.productIds} onChange={(v) => update((d) => { d.home.featured.productIds = v; })} options={productOptions} hint="Ils s'affichent dans l'ordre où vous les cochez. 4 produits remplissent une ligne." />
      </Panel>

      <Panel title="Vidéo" description="Le texte à droite de la vidéo (les vidéos se gèrent dans « Vidéos »)">
        <HeadingFields value={home.video} onChange={(v) => update((d) => { d.home.video = { ...d.home.video, ...v }; })} />
        <TextField label="Texte" multiline value={home.video.text} onChange={(v) => update((d) => { d.home.video.text = v; })} />
        <LinesField label="Points cochés" value={home.video.points} onChange={(v) => update((d) => { d.home.video.points = v; })} />
      </Panel>

      <Panel title="Deux rituels" description="Les deux grandes cartes de gammes">
        <HeadingFields value={home.rituals} onChange={(v) => update((d) => { d.home.rituals = { ...d.home.rituals, ...v }; })} />
        <Repeater items={home.rituals.cards} onChange={(v) => update((d) => { d.home.rituals.cards = v; })}
          itemTitle={(c) => draft.catalog.ranges.find((r) => r.id === c.rangeId)?.name ?? "Carte"}
          create={() => ({ rangeId: rangeOptions[0]?.value ?? "", label: "", subtitle: "", description: "" })} addLabel="Ajouter une carte"
          render={(c, change) => (
            <>
              <SelectField label="Gamme" value={c.rangeId} onChange={(rangeId) => change({ ...c, rangeId })} options={rangeOptions} />
              <Grid>
                <TextField label="Étiquette (en haut)" value={c.label} onChange={(label) => change({ ...c, label })} />
                <TextField label="Sous-titre (en doré)" value={c.subtitle} onChange={(subtitle) => change({ ...c, subtitle })} />
              </Grid>
              <TextField label="Description" value={c.description} onChange={(description) => change({ ...c, description })} />
            </>
          )} />
      </Panel>

      <Panel title="Soin vedette" description="Un produit mis en grand (actuellement la Crème Bouclante)">
        <ToggleField label="Afficher ce bloc" checked={home.spotlight.visible} onChange={(v) => update((d) => { d.home.spotlight.visible = v; })} />
        <SelectField label="Produit" value={home.spotlight.productId} onChange={(v) => update((d) => { d.home.spotlight.productId = v; })} options={productOptions} hint="Le texte, le prix et les bienfaits viennent de la fiche du produit. Si le produit a 2 photos, la 2e s'affiche en petit." />
        <Grid cols={3}>
          <TextField label="Pastille sur la photo" value={home.spotlight.badge} onChange={(v) => update((d) => { d.home.spotlight.badge = v; })} />
          <TextField label="Petit repère" value={home.spotlight.eyebrow} onChange={(v) => update((d) => { d.home.spotlight.eyebrow = v; })} />
          <TextField label="Phrase sous le nom (en couleur)" value={home.spotlight.highlight} onChange={(v) => update((d) => { d.home.spotlight.highlight = v; })} />
        </Grid>
      </Panel>

      <Panel title="Flash News" description="Promotion, communiqué ou nouveauté mis en lumière">
        <ToggleField label="Afficher la Flash News" checked={home.flashNews.visible} onChange={(v) => update((d) => { d.home.flashNews.visible = v; })} />
        <Grid>
          <TextField label="Pastille (ex. Nouveauté, Promo -20 %)" value={home.flashNews.badge} onChange={(v) => update((d) => { d.home.flashNews.badge = v; })} />
          <TextField label="Titre" value={home.flashNews.title} onChange={(v) => update((d) => { d.home.flashNews.title = v; })} />
        </Grid>
        <TextField label="Texte" multiline value={home.flashNews.text} onChange={(v) => update((d) => { d.home.flashNews.text = v; })} />
        <TextField label="Phrase mise en valeur (en doré)" value={home.flashNews.highlight} onChange={(v) => update((d) => { d.home.flashNews.highlight = v; })} hint="Par exemple un prix promo ou une date limite." />
        <ImageField label="Image" value={home.flashNews.image} onChange={(v) => update((d) => { d.home.flashNews.image = v; })} />
        <Grid>
          <TextField label="Bouton principal" value={home.flashNews.ctaLabel} onChange={(v) => update((d) => { d.home.flashNews.ctaLabel = v; })} />
          <TextField label="Lien du bouton principal" value={home.flashNews.ctaLink} onChange={(v) => update((d) => { d.home.flashNews.ctaLink = v; })} hint="Une page du site, qui commence par / : ex. /boutique, /boutique#accessoires, /produit/13" />
          <TextField label="Bouton secondaire" value={home.flashNews.secondaryLabel} onChange={(v) => update((d) => { d.home.flashNews.secondaryLabel = v; })} hint="Laissez vide pour le masquer." />
          <TextField label="Lien du bouton secondaire" value={home.flashNews.secondaryLink} onChange={(v) => update((d) => { d.home.flashNews.secondaryLink = v; })} />
        </Grid>
      </Panel>

      <Panel title="Coffret" description="La grande carte verte d'une gamme à commander directement">
        <ToggleField label="Afficher le coffret" checked={home.boxSet.visible} onChange={(v) => update((d) => { d.home.boxSet.visible = v; })} />
        <SelectField label="Gamme" value={home.boxSet.rangeId} onChange={(v) => update((d) => { d.home.boxSet.rangeId = v; })} options={rangeOptions} hint="Le prix, l'image et le nombre de soins viennent de la gamme." />
        <Grid>
          <TextField label="Petit repère" value={home.boxSet.eyebrow} onChange={(v) => update((d) => { d.home.boxSet.eyebrow = v; })} />
          <TextField label="Titre" value={home.boxSet.title} onChange={(v) => update((d) => { d.home.boxSet.title = v; })} />
        </Grid>
        <TextField label="Texte" multiline value={home.boxSet.text} onChange={(v) => update((d) => { d.home.boxSet.text = v; })} />
      </Panel>

      <Panel title="Notre communauté" description="Les photos qui défilent en carrousel">
        <HeadingFields value={home.community} onChange={(v) => update((d) => { d.home.community = { ...d.home.community, ...v }; })} />
        <ImagesField label="Photos" value={home.community.images} onChange={(v) => update((d) => { d.home.community.images = v; })} />
      </Panel>

      <Panel title="Retours clients" description="Les avis qui défilent">
        <HeadingFields value={home.reviews} onChange={(v) => update((d) => { d.home.reviews = { ...d.home.reviews, ...v }; })} />
        <Repeater items={home.reviews.items} onChange={(v) => update((d) => { d.home.reviews.items = v; })}
          itemTitle={(r) => r.name} create={() => ({ name: "", text: "" })} addLabel="Ajouter un avis"
          render={(r, change) => (
            <>
              <TextField label="Nom" value={r.name} onChange={(name) => change({ ...r, name })} />
              <TextField label="Avis" multiline value={r.text} onChange={(text) => change({ ...r, text })} />
            </>
          )} />
      </Panel>

      <Panel title="Notre raison d'être" description="La carte vert foncé en bas de page">
        <HeadingFields value={home.mission} onChange={(v) => update((d) => { d.home.mission = { ...d.home.mission, ...v }; })} />
        <RichTextField label="Texte" rows={6} value={home.mission.body} onChange={(v) => update((d) => { d.home.mission.body = v; })} />
        <TextField label="Bouton (vers À propos)" value={home.mission.ctaLabel} onChange={(v) => update((d) => { d.home.mission.ctaLabel = v; })} />
      </Panel>

      <Panel title="Conseils capillaires" description="La carte blanche à côté, vers la page Conseils">
        <HeadingFields value={home.journal} onChange={(v) => update((d) => { d.home.journal = { ...d.home.journal, ...v }; })} />
        <TextField label="Texte" multiline value={home.journal.text} onChange={(v) => update((d) => { d.home.journal.text = v; })} />
        <TextField label="Bouton" value={home.journal.ctaLabel} onChange={(v) => update((d) => { d.home.journal.ctaLabel = v; })} />
      </Panel>
    </div>
  );
};

export default SiteHome;
