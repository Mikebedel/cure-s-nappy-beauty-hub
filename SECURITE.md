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

1. **Supprimer la fonction `create-admin` déjà en ligne.** La retirer du code ne l'efface pas du serveur. Console Supabase → Edge Functions → `create-admin` → Delete. Tant qu'elle existe en ligne, la faille critique reste ouverte.
2. **Appliquer les migrations** du dossier `supabase/migrations` (Lovable le fait d'habitude en recevant le code) : `20261111090000_site_content.sql` et `20261111120000_orders_hardening.sql`.
3. **Fermer les inscriptions publiques** : Authentication → Sign In / Providers → Email → désactiver « Allow new users to sign up ».
4. **Créer votre compte admin** :
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

## Paiement en ligne Paystack : mise en service

Le code est prêt ; il reste à le relier à votre compte Paystack. Tout se fait d'abord en **mode test** (clés `sk_test_…`, aucun argent réel), puis en mode réel avec les clés `sk_live_…`.

1. **Migrations** : appliquer aussi `20261112090000_online_payment.sql` (colonnes de paiement, journal des notifications ; elle retire toute écriture directe des commandes depuis le navigateur).
2. **Secrets des fonctions** (Supabase → Edge Functions → Secrets). Ils ne doivent **jamais** être mis dans le code ni dans `.env` :
   | Nom | Valeur |
   |---|---|
   | `PAYSTACK_SECRET_KEY` | clé secrète Paystack (Settings → API Keys & Webhooks) |
   | `SITE_URL` | adresse du site, ex. `https://curesnappy.ci` (retour après paiement) |
   | `ALLOWED_ORIGINS` | adresses autorisées à appeler les fonctions, séparées par des virgules |
   | `RESEND_API_KEY` | facultatif : clé Resend pour envoyer le reçu par e-mail |
   | `RECEIPT_FROM_EMAIL` | facultatif : expéditeur, ex. `Cure's Nappy <commandes@curesnappy.ci>` (domaine vérifié chez Resend) |
3. **Déployer les fonctions** `create-order`, `order-receipt`, `paystack-webhook` et `generate-invoice`. `paystack-webhook` est déployée sans vérification de compte (réglé dans `supabase/config.toml`) : c'est la signature Paystack qui l'authentifie.
4. **Dans Paystack** (Settings → API Keys & Webhooks), renseigner l'adresse de notification :
   `https://<identifiant-du-projet>.supabase.co/functions/v1/paystack-webhook`
5. **Tester** une commande en mode test (Paystack fournit des numéros et cartes de test), vérifier qu'elle passe « payée » dans le dashboard et que le reçu s'affiche. Puis remplacer la clé de test par la clé réelle et faire un vrai paiement de faible montant.

Ce qui protège les paiements :
- le navigateur n'envoie que les articles et les quantités ; **le serveur recalcule prix, livraison et total** à partir du catalogue publié ;
- une commande n'est marquée « payée » que si **Paystack le confirme** : notification signée (HMAC SHA-512 vérifiée), puis vérification directe auprès de Paystack, **montant et devise contrôlés**, traitement une seule fois ;
- les données de carte et de Mobile Money restent chez Paystack ; le site ne les voit jamais ;
- le reçu n'est accessible qu'avec son lien secret (identifiant aléatoire) ;
- au plus 5 commandes par numéro de téléphone toutes les 15 minutes.

## Reste à faire

- **Dépendances** : `react-router` a une alerte de sévérité moyenne dont la correction demande de passer à la version 7 ; à planifier. Les autres alertes concernent des outils de construction, pas le site livré aux visiteurs.
- **En-têtes de sécurité** (CSP, anti-iframe) : ils se règlent chez l'hébergeur (Lovable), pas dans le code.
