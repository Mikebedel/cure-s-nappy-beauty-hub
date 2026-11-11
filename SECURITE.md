# Sécurité du site Cure's Nappy

Mis à jour le 11 novembre 2026.

## Ce qui a été corrigé dans le code

| Gravité | Problème | Correction |
|---|---|---|
| Critique | La fonction `create-admin` permettait à **n'importe qui** de se créer un compte administrateur, et de **changer le mot de passe de n'importe quel compte existant** (y compris le vôtre). Le bouton « Créer un compte admin » de la page de connexion l'appelait. | Fonction supprimée du code et bouton retiré. Les comptes admin se créent maintenant uniquement depuis la console Supabase (voir plus bas). |
| Élevée | La fonction `generate-invoice` renvoyait la facture complète (nom, téléphone, adresse du client) à quiconque connaissait le numéro interne d'une commande. | Réservée aux administrateurs connectés. |
| Élevée | Les textes des clients (nom, adresse…) étaient insérés tels quels dans la facture HTML : un nom piégé pouvait y injecter du code. | Tous les textes sont échappés. |
| Élevée | Un visiteur pouvait enregistrer une commande déjà marquée « payée », avec une remise ou un total incohérent. | Règle de la base durcie : une commande créée par un visiteur est toujours « nouvelle », « en attente de paiement », sans remise, avec total = sous-total + livraison. |
| Moyenne | Un visiteur pouvait publier un avis directement, sans validation. | Un avis envoyé par un visiteur arrive toujours « non approuvé ». |
| Faible | Un lien saisi dans le dashboard (Flash News) pouvait pointer vers du code ou un site externe. | Seules les pages du site (adresses qui commencent par `/`) sont acceptées. |

Points vérifiés et sans problème : le fichier `.env` ne contient que la clé publique de Supabase (faite pour être visible) ; aucune clé secrète n'est dans le code ; React échappe tous les textes affichés sur le site.

## À faire dans la console Supabase (quand la base sera activée)

1. **Supprimer la fonction `create-admin` déjà en ligne.** Console Supabase → Edge Functions → `create-admin` → Delete. Tant qu'elle existe en ligne, la faille critique reste ouverte. Par précaution, le dossier `supabase/functions/create-admin` contient maintenant une version désactivée (elle répond toujours « fonction désactivée ») : si les fonctions sont redéployées depuis ce code avant la suppression, elle remplace l'ancienne. Une fois la fonction supprimée dans Supabase, supprimez aussi ce dossier.
2. **Appliquer toutes les migrations** du dossier `supabase/migrations`, dans l'ordre (Lovable le fait d'habitude en recevant le code).
3. **Fermer les inscriptions publiques** : Authentication → Sign In / Providers → Email → désactiver « Allow new users to sign up ».
4. **Créer votre compte admin** (la double authentification sera demandée à la première connexion) :
   - Authentication → Users → Add user → votre e-mail et un mot de passe long (au moins 14 caractères), cocher « Auto confirm ».
   - SQL Editor, puis exécuter (avec votre e-mail) :
     ```sql
     insert into public.user_roles (user_id, role)
     select id, 'admin' from auth.users where email = 'votre@email.com';
     ```
5. **Vérifier qu'aucun inconnu n'est déjà admin** (la faille existait avant la correction) :
   ```sql
   select u.email, r.created_at from public.user_roles r join auth.users u on u.id = r.user_id where r.role = 'admin';
   ```
   Supprimez toute ligne que vous ne reconnaissez pas, puis changez votre mot de passe.
6. Activer la protection contre les mots de passe divulgués (Authentication → Policies) si elle est proposée.

## Paiement en ligne Jèko : mise en service

Jèko encaisse Wave, Orange Money, MTN, Moov et Djamo (1,5 % TTC par paiement, argent disponible tout de suite). **Jèko n'a pas de mode test** : on teste avec de vrais petits montants (100 FCFA) sur une boutique Jèko dédiée aux essais.

1. **Compte Jèko Business** (application ou https://business.jeko.africa) : compléter « Création du compte » dans « Augmenter votre plafond », sinon l'API répond « business_not_enabled_for_api_access ».
2. **Clés** : Paramètres → API & Webhooks → « Créer une clé API ». Noter la clé, son identifiant et l'identifiant du magasin.
3. **Webhook** : même écran, créer un webhook vers
   `https://<identifiant-du-projet>.supabase.co/functions/v1/jeko-webhook`
   et **copier le secret affiché une seule fois**.
4. **Secrets des fonctions** (Supabase → Edge Functions → Secrets). Ils ne doivent **jamais** être mis dans le code ni dans `.env` :
   | Nom | Valeur |
   |---|---|
   | `JEKO_API_KEY` | clé API Jèko |
   | `JEKO_API_KEY_ID` | identifiant de la clé |
   | `JEKO_STORE_ID` | identifiant du magasin |
   | `JEKO_WEBHOOK_SECRET` | secret du webhook |
   | `SITE_URL` | adresse du site en **https**, ex. `https://curesnappy.ci` (retour après paiement) |
   | `ALLOWED_ORIGINS` | adresses autorisées à appeler les fonctions, séparées par des virgules |
   | `RESEND_API_KEY` | facultatif : clé Resend pour envoyer le reçu par e-mail |
   | `RECEIPT_FROM_EMAIL` | facultatif : expéditeur, ex. `Cure's Nappy <commandes@curesnappy.ci>` |
5. **Déployer les fonctions** `create-order`, `order-receipt`, `jeko-webhook`, `generate-invoice` et `create-admin` (version désactivée). `jeko-webhook` est déployée sans vérification de compte (réglé dans `supabase/config.toml`) : c'est la signature Jèko qui l'authentifie.
6. **Option recommandée** : dans Jèko → Restriction par adresse IP, rien à faire tant que les fonctions tournent chez Supabase (adresses variables).
7. **Tester** une commande de 100 FCFA avec chaque moyen de paiement, vérifier qu'elle passe « payée » dans le dashboard et que le reçu s'affiche.

Ce qui protège les paiements :
- le navigateur n'envoie que les articles, les quantités, la destination et le moyen de paiement ; **le serveur recalcule prix, livraison et total** ;
- une commande n'est marquée « payée » que si **Jèko le confirme** : notification signée (HMAC SHA-256 vérifiée en temps constant), puis **état redemandé directement à Jèko**, référence, devise et montant contrôlés, traitement une seule fois ;
- un paiement en échec est enregistré comme tel, jamais comme payé ;
- les données de paiement restent chez Jèko et l'opérateur ; le site ne les voit jamais ;
- le reçu n'est accessible qu'avec son lien secret (identifiant aléatoire) ;
- au plus 5 commandes par numéro de téléphone toutes les 15 minutes.

## Administration : double authentification et protections

- **Double authentification obligatoire** : après le mot de passe, l'administration demande un code à 6 chiffres d'une application (Google Authenticator, Microsoft Authenticator, Authy). À la première connexion, l'écran affiche un QR code à scanner.
- **Vérifiée aussi par la base** (migration `20261112130000_admin_mfa.sql`) : sans le code, le rôle admin ne donne accès à rien, même avec le bon mot de passe. Un mot de passe volé ne suffit donc pas.
- Blocage de 60 secondes après 5 mots de passe ou 5 codes faux ; message d'erreur qui ne dit pas si c'est l'e-mail ou le mot de passe.
- Déconnexion automatique après 30 minutes sans activité.
- Pages d'administration exclues de Google (`robots.txt` et balise noindex).
- **Téléphone perdu** : dans Supabase → Authentication → Users → votre compte, supprimez le facteur « totp » ; à la connexion suivante, un nouveau QR code s'affiche.

À régler dans Supabase (Authentication) :
- vérifier que **MFA → TOTP** est activé (c'est le cas par défaut) ;
- longueur minimale des mots de passe : 12 caractères ; protection contre les mots de passe divulgués ;
- facultatif : CAPTCHA (Turnstile ou hCaptcha) sur la connexion.

## Reste à faire

- **Dépendances** : `react-router` a une alerte de sévérité moyenne dont la correction demande de passer à la version 7 ; à planifier. Les autres alertes concernent des outils de construction, pas le site livré aux visiteurs.
- **En-têtes de sécurité** (CSP, anti-iframe) : ils se règlent chez l'hébergeur (Lovable), pas dans le code.
