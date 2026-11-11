import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, RichTextField, IconField, Repeater, newId } from "@/admin/fields";
import type { ArticleContent } from "@/content/types";

const ArticleFields = ({ article, change }: { article: ArticleContent; change: (a: ArticleContent) => void }) => (
  <>
    <Grid>
      <TextField label="Titre" value={article.title} onChange={(title) => change({ ...article, title })} />
      <IconField value={article.icon} onChange={(icon) => change({ ...article, icon })} />
    </Grid>
    <TextField label="Résumé (sur la carte)" value={article.intro} onChange={(intro) => change({ ...article, intro })} />
    <RichTextField label="Article (s'ouvre au clic)" rows={12} value={article.body} onChange={(body) => change({ ...article, body })} />
  </>
);

const create = (): ArticleContent => ({ id: newId("article"), icon: "lightbulb", title: "Nouvel article", intro: "", body: "" });

const SiteAdvice = () => {
  const { draft, update } = useDraft();
  const page = draft.advice;
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
          render={(article, change) => <ArticleFields article={article} change={change} />} />
      </Panel>

      <Panel title={`${page.adviceTitle || "Conseils"} (${page.advice.length})`} defaultOpen>
        <TextField label="Titre de la rubrique" value={page.adviceTitle} onChange={(v) => update((d) => { d.advice.adviceTitle = v; })} />
        <Repeater items={page.advice} onChange={(v) => update((d) => { d.advice.advice = v; })} itemTitle={(a) => a.title} create={create} addLabel="Ajouter un conseil"
          render={(article, change) => <ArticleFields article={article} change={change} />} />
      </Panel>
    </div>
  );
};

export default SiteAdvice;
