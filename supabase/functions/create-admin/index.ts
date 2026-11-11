/**
 * Ancienne fonction de création de compte admin, désactivée pour raison de sécurité :
 * elle permettait à n'importe qui de devenir administrateur ou de changer un mot de passe.
 * Ce fichier ne sert qu'à écraser la version déjà déployée au prochain déploiement.
 * Supprimez ensuite la fonction dans Supabase (Edge Functions → create-admin → Delete), puis ce dossier.
 * Les comptes admin se créent depuis la console Supabase (voir SECURITE.md).
 */
Deno.serve(() =>
  new Response(JSON.stringify({ error: "Cette fonction est désactivée." }), {
    status: 410,
    headers: { "Content-Type": "application/json" },
  })
);
