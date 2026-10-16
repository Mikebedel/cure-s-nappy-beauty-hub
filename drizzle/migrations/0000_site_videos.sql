CREATE TABLE public.site_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  youtube_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_videos TO authenticated;
GRANT ALL ON public.site_videos TO service_role;
ALTER TABLE public.site_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active videos are public" ON public.site_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage videos" ON public.site_videos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.site_videos (title, youtube_url) VALUES ('Cure''s Nappy en vidéo', 'https://youtube.com/shorts/STG6odV72s8');