-- Double authentification obligatoire pour l'administration.
-- Le rôle admin ne compte que si la session a validé le code de la double authentification
-- (niveau « aal2 » dans le jeton). Un mot de passe volé ne suffit donc plus à lire les commandes
-- ou à modifier le site : toutes les règles qui appellent has_role(..., 'admin') en profitent.
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
    AND (
      _role <> 'admin'
      -- Les fonctions serveur (clé de service) vérifient elles-mêmes la double authentification.
      OR auth.role() = 'service_role'
      OR (_user_id = auth.uid() AND COALESCE(auth.jwt() ->> 'aal', 'aal1') = 'aal2')
    )
$$;
