import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField } from "@/admin/fields";

const SiteContact = () => {
  const { draft, update } = useDraft();
  const { contact, footer, contactPage: page } = draft;
  return (
    <div className="space-y-4">
      <PageTitle title="Contact & infos" description="Coordonnées utilisées partout sur le site, page Contact et pied de page.">
        <RestoreButton part={["contact", "footer", "contactPage"]} label="les coordonnées, la page Contact et le pied de page" />
      </PageTitle>

      <Panel title="Coordonnées" description="Utilisées dans le pied de page, la page Contact, les boutons WhatsApp et la commande" defaultOpen>
        <Grid>
          <TextField label="Numéro WhatsApp (chiffres uniquement)" value={contact.whatsapp} onChange={(v) => update((d) => { d.contact.whatsapp = v.replace(/\D/g, ""); })} hint="Avec l'indicatif, sans + ni espaces : ex. 2250100848479. Sert aussi pour le lien d'appel." />
          <TextField label="Téléphone affiché" value={contact.phoneDisplay} onChange={(v) => update((d) => { d.contact.phoneDisplay = v; })} />
          <TextField label="E-mail" value={contact.email} onChange={(v) => update((d) => { d.contact.email = v.trim(); })} />
          <TextField label="Adresse" value={contact.address} onChange={(v) => update((d) => { d.contact.address = v; })} />
          <TextField label="Lien du catalogue WhatsApp" value={contact.whatsappCatalogUrl} onChange={(v) => update((d) => { d.contact.whatsappCatalogUrl = v.trim(); })} />
          <TextField label="Lien de la page Facebook" value={contact.facebookUrl} onChange={(v) => update((d) => { d.contact.facebookUrl = v.trim(); })} />
        </Grid>
      </Panel>

      <Panel title="Page Contact">
        <Grid cols={3}>
          <TextField label="Petit repère" value={page.eyebrow} onChange={(v) => update((d) => { d.contactPage.eyebrow = v; })} />
          <TextField label="Titre" value={page.title} onChange={(v) => update((d) => { d.contactPage.title = v; })} />
          <TextField label="Texte" value={page.description} onChange={(v) => update((d) => { d.contactPage.description = v; })} />
        </Grid>
        <Grid>
          <TextField label="Titre des coordonnées" value={page.infoTitle} onChange={(v) => update((d) => { d.contactPage.infoTitle = v; })} />
          <TextField label="Titre du formulaire" value={page.formTitle} onChange={(v) => update((d) => { d.contactPage.formTitle = v; })} />
          <TextField label="Encadré WhatsApp : texte" value={page.whatsappText} onChange={(v) => update((d) => { d.contactPage.whatsappText = v; })} />
          <TextField label="Encadré WhatsApp : bouton" value={page.whatsappLabel} onChange={(v) => update((d) => { d.contactPage.whatsappLabel = v; })} />
        </Grid>
      </Panel>

      <Panel title="Pied de page">
        <TextField label="Présentation" multiline value={footer.tagline} onChange={(v) => update((d) => { d.footer.tagline = v; })} />
        <TextField label="Citation (en doré)" value={footer.quote} onChange={(v) => update((d) => { d.footer.quote = v; })} />
      </Panel>
    </div>
  );
};

export default SiteContact;
