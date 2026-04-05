## Plan d'implémentation

### 1. Créer les tables en base de données
- **products** : catalogue produits avec stock
- **orders** + **order_items** : commandes clients
- **customers** : base clients
- **promo_codes** : codes promo
- **reviews** : avis clients
- **newsletter_subscribers** : newsletter
- **admin profiles + user_roles** : authentification admin

### 2. Sécuriser le back-office
- Authentification admin (login/mot de passe)
- RLS policies sur toutes les tables
- Rôle admin avec security definer function
- Page de login admin

### 3. Mettre à jour les catégories de produits
Selon vos instructions :
- **Hydratation & Nutrition** : Bain d'huile, Shampoing doux, Leave-in, Huile 2 en 1, Magical Spray, Crème Hydratante, Masque Hydratant & Protéiné
- **Volume et Longueur** : Huile extra pousse, Crème Hydratante & Volume+
- **Fortifiant & Anti Chute** : Masque fortifiant, Huile 2 en 1
- **Soin Nettoyant & Anti-pelliculaire** : Shampoing doux & Clarifiant
- **Définition de boucle** : Crème Bouclante
- Supprimer "Croissance & Pousse"

### 4. Connecter le front au backend
- Checkout → sauvegarde commandes en DB
- Admin → lecture/écriture depuis la DB

### 5. Génération factures PDF
- Edge function pour générer des factures PDF après commande

### 6. Accès admin
- URL : `/admin` avec page de connexion
