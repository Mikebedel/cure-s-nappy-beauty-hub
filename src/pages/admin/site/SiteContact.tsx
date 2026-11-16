import { useDraft } from "@/admin/DraftContext";
import RestoreButton from "@/admin/RestoreButton";
import { PageTitle, Panel, Grid, TextField, ToggleField } from "@/admin/fields";

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
          <TextField label="Lien de la page Facebook" value={contact.facebookUrl} onChange={(v) => update((d) => { d.contact.facebookUrl = v.trim(); })} hint="Adresse complète commençant par https://. Laisser vide pour masquer le bouton." />
          <TextField label="Lien du compte Instagram" value={contact.instagramUrl} onChange={(v) => update((d) => { d.contact.instagramUrl = v.trim(); })} hint="Ex. https://www.instagram.com/cures_nappy_officiel/ — laisser vide pour masquer le bouton." />
          <TextField label="Lien du compte TikTok" value={contact.tiktokUrl} onChange={(v) => update((d) => { d.contact.tiktokUrl = v.trim(); })} hint="Ex. https://www.tiktok.com/@cures.nappy_offic — laisser vide pour masquer le bouton." />
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

      <Panel title="Newsletter" description="La bande d'inscription au-dessus du pied de page (toutes les pages) et sur la page Contact. La liste des inscrites est dans Marketing.">
        <ToggleField label="Afficher l'inscription à la newsletter" checked={footer.newsletter.visible} onChange={(v) => update((d) => { d.footer.newsletter.visible = v; })} />
        <Grid>
          <TextField label="Titre" value={footer.newsletter.title} onChange={(v) => update((d) => { d.footer.newsletter.title = v; })} />
          <TextField label="Bouton" value={footer.newsletter.button} onChange={(v) => update((d) => { d.footer.newsletter.button = v; })} />
        </Grid>
        <TextField label="Texte" multiline value={footer.newsletter.text} onChange={(v) => update((d) => { d.footer.newsletter.text = v; })} />
        <Grid>
          <TextField label="Texte dans la case e-mail" value={footer.newsletter.placeholder} onChange={(v) => update((d) => { d.footer.newsletter.placeholder = v; })} />
          <TextField label="Petite mention sous la case" value={footer.newsletter.privacy} onChange={(v) => update((d) => { d.footer.newsletter.privacy = v; })} />
          <TextField label="Message après inscription" value={footer.newsletter.success} onChange={(v) => update((d) => { d.footer.newsletter.success = v; })} />
          <TextField label="Message si déjà inscrite" value={footer.newsletter.already} onChange={(v) => update((d) => { d.footer.newsletter.already = v; })} />
        </Grid>
      </Panel>
    </div>
  );
};

export default SiteContact;
