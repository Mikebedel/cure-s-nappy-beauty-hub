# Mise en ligne : Hostinger (vitrine) + Supabase (arrière-boutique)

- **Hostinger** sert le site (les pages que voient les clientes) et gère le nom de domaine et les adresses e-mail.
- **Supabase** garde les commandes, le contenu du dashboard, les comptes admin et fait tourner les fonctions de paiement Jèko.

Les étapes de sécurité et de paiement détaillées sont dans [SECURITE.md](SECURITE.md).

## 1. Nom de domaine et e-mails (Hostinger)

1. Prendre un hébergement Web Hostinger (« Premium » ou « Business »).
2. Réserver le domaine : `curesnappy.ci` si Hostinger le propose, sinon chez un revendeur `.ci` puis le relier à Hostinger. Prendre aussi `curesnappy.com` et le rediriger vers le `.ci`.
3. Créer les adresses e-mail (hPanel → E-mails) :
   - `contact@curesnappy.ci` : adresse publique, affichée sur le site ;
   - une adresse **réservée à l'administration**, jamais affichée, par exemple `gestion@curesnappy.ci`. C'est elle qui sert à se connecter au dashboard ;
   - facultatif : `commandes@curesnappy.ci` pour envoyer les reçus.
4. Activer la double authentification sur le compte Hostinger, et donner un mot de passe long et unique à l'adresse d'administration : qui contrôle cette boîte peut demander un nouveau mot de passe admin.

## 2. Base de données (Supabase)

1. Créer un compte sur supabase.com avec l'adresse d'administration, puis un projet (région la plus proche : Europe).
2. Appliquer toutes les migrations de `supabase/migrations`, dans l'ordre.
3. Déployer les fonctions `create-order`, `order-receipt`, `jeko-webhook`, `generate-invoice`, `create-admin`.
4. Renseigner les secrets (clés Jèko, `SITE_URL=https://curesnappy.ci`, etc.) : voir SECURITE.md.
5. Authentication :
   - désactiver les inscriptions publiques ;
   - créer le compte admin avec l'adresse d'administration et lui donner le rôle admin (requête dans SECURITE.md) ;
   - URL Configuration → Site URL : `https://curesnappy.ci` ;
   - facultatif : SMTP personnalisé avec la boîte Hostinger (réglages SMTP indiqués dans hPanel), pour que les e-mails de connexion viennent de votre domaine.
6. Passer au plan Pro au lancement : le plan gratuit met la base en pause après une semaine sans activité.

## 3. Construire le site

Dans le fichier `.env`, mettre les valeurs du **nouveau** projet Supabase (Settings → API) :

```
VITE_SUPABASE_URL="https://<identifiant>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<clé publique anon>"
VITE_SUPABASE_PROJECT_ID="<identifiant>"
```

Puis :

```bash
npm install
npm run build
```

Le dossier `dist/` contient tout le site à mettre en ligne (environ 18 Mo).

## 4. Envoyer le site sur Hostinger

1. hPanel → Sites web → Gestionnaire de fichiers → dossier `public_html`.
2. Supprimer le contenu par défaut, puis envoyer **tout le contenu** de `dist/` (pas le dossier lui-même), y compris le fichier caché `.htaccess`.
3. hPanel → Sécurité → SSL : activer le certificat gratuit.

Le fichier `.htaccess` (dans `public/`) s'occupe de :
- forcer le HTTPS ;
- faire fonctionner les adresses comme `/boutique` ou `/commande/…` quand on recharge la page ;
- ajouter des en-têtes de sécurité ;
- garder les images et scripts en cache, mais jamais `index.html`, pour que chaque mise à jour soit visible tout de suite.

À chaque nouvelle version : `npm run build`, puis remplacer le contenu de `public_html` par celui de `dist/`.

## 5. Vérifications après mise en ligne

- Ouvrir le site en HTTPS, recharger `/boutique` : la page doit s'afficher (pas d'erreur 404).
- Se connecter sur `/admin/login` : mot de passe puis QR code de double authentification.
- Modifier un texte dans le dashboard, l'enregistrer, le voir sur le site depuis un autre téléphone.
- Commande de 100 FCFA payée avec chaque moyen Jèko : elle doit passer « payée » et le reçu s'afficher.
- Ouvrir 2 ou 3 pages sur un iPhone et un Android.
