-- Journal des ajouts et retraits d'administrateurs (écran « Administrateurs » du dashboard).
-- Écrit uniquement par la fonction serveur manage-admins (clé de service) ; lisible par les admins (double authentification).
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_email TEXT,
  action TEXT NOT NULL CHECK (action IN ('ajout', 'retrait', 'reactivation')),
  target_email TEXT NOT NULL CHECK (length(target_email) <= 254),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read the admin audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can read the admin audit log" ON public.admin_audit_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
