import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, RichTextField, IconField, ImageField, ChecklistField, Repeater, newId } from "@/admin/fields";
import type { ArticleContent } from "@/content/types";

const ArticleFields = ({ article, change, productOptions }: { article: ArticleContent; change: (a: ArticleContent) => void; productOptions: { value: string; label: string }[] }) => (
  <>
    <Grid>
      <TextField label="Titre" value={article.title} onChange={(title) => change({ ...article, title })} />
      <IconField value={article.icon} onChange={(icon) => change({ ...article, icon })} />
    </Grid>
    <TextField label="Résumé (sur la carte et en haut de l'article)" multiline value={article.intro} onChange={(intro) => change({ ...article, intro })} />
    <ImageField label="Photo d'en-tête (facultatif)" value={article.image ?? ""} onChange={(image) => change({ ...article, image })} />
    <RichTextField label="Article" rows={20} value={article.body} onChange={(body) => change({ ...article, body })} />
    <div className="space-y-2">
      <p className="text-sm font-semibold">Sources (liens en bas de l'article)</p>
      <Repeater items={article.references ?? []} onChange={(references) => change({ ...article, references })}
        itemTitle={(r) => r.title} create={() => ({ title: "", url: "https://" })} addLabel="Ajouter une source"
        render={(r, changeRef) => (
          <Grid>
            <TextField label="Titre de la source" value={r.title} onChange={(title) => changeRef({ ...r, title })} />
            <TextField label="Adresse (https://…)" value={r.url} onChange={(url) => changeRef({ ...r, url: url.trim() })} />
          </Grid>
        )} />
    </div>
    <ChecklistField label="Soins proposés en fin d'article" value={article.productIds ?? []} onChange={(productIds) => change({ ...article, productIds })} options={productOptions} />
    <p className="text-xs text-muted-foreground">Adresse de l'article : /conseils/{article.id}</p>
  </>
);

const create = (): ArticleContent => ({ id: newId("article"), icon: "lightbulb", title: "Nouvel article", intro: "", body: "", references: [], productIds: [] });

const SiteAdvice = () => {
  const { draft, update } = useDraft();
  const page = draft.advice;
  const productOptions = draft.catalog.products.map((p) => ({ value: p.id, label: p.name }));
  return (
    <div className="space-y-4">
      <PageTitle title="Conseils" description="Les astuces et articles de la page Conseils.">
        <RestoreButton part="advice" label="la page Conseils" />
      </PageTitle>

      <Panel title="Haut de la page" defaultOpen>
        <Grid cols={3}>
          <TextField label="Petit repère" value={page.eyebrow} onChange={(v) => update((d) => { d.advice.eyebrow = v; })} />
          <TextField label="Titre" value={page.title} onChange={(v) => update((d) => { d.advice.title = v; })} />
          <TextField label="Fin du titre (en doré)" value={page.highlight} onChange={(v) => update((d) => { d.advice.highlight = v; })} />
        </Grid>
        <TextField label="Texte" value={page.description} onChange={(v) => update((d) => { d.advice.description = v; })} />
      </Panel>

      <Panel title={`${page.tipsTitle || "Astuces"} (${page.tips.length})`} defaultOpen>
        <TextField label="Titre de la rubrique" value={page.tipsTitle} onChange={(v) => update((d) => { d.advice.tipsTitle = v; })} />
        <Repeater items={page.tips} onChange={(v) => update((d) => { d.advice.tips = v; })} itemTitle={(a) => a.title} create={create} addLabel="Ajouter une astuce"
          render={(article, change) => <ArticleFields article={article} change={change} productOptions={productOptions} />} />
      </Panel>

      <Panel title={`${page.adviceTitle || "Conseils"} (${page.advice.length})`} defaultOpen>
        <TextField label="Titre de la rubrique" value={page.adviceTitle} onChange={(v) => update((d) => { d.advice.adviceTitle = v; })} />
        <Repeater items={page.advice} onChange={(v) => update((d) => { d.advice.advice = v; })} itemTitle={(a) => a.title} create={create} addLabel="Ajouter un conseil"
          render={(article, change) => <ArticleFields article={article} change={change} productOptions={productOptions} />} />
      </Panel>
    </div>
  );
};

export default SiteAdvice;
