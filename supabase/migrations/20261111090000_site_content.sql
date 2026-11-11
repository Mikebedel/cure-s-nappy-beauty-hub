-- Contenu du site modifiable depuis le dashboard (/admin).
-- Une seule ligne (id = 'main') contient tout le contenu au format JSON.
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Tout le monde lit le contenu (c'est ce qu'affiche le site) ; seuls les admins le modifient.
CREATE POLICY "Site content is publicly readable" ON public.site_content
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert site content" ON public.site_content
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site content" ON public.site_content
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site content" ON public.site_content
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Images envoyées depuis le dashboard : lisibles par tous, envoyées par les admins.
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Site images are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Admins can upload site images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site images" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
