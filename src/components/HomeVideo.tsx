import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getYoutubeId } from "@/lib/youtube";

const FALLBACK = "https://youtube.com/shorts/STG6odV72s8";

const HomeVideo = () => {
  const [videos, setVideos] = useState<{ id: string; title: string | null; youtube_url: string }[]>([]);

  useEffect(() => {
    supabase
      .from("site_videos")
      .select("id,title,youtube_url")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setVideos(data && data.length ? data : [{ id: "f", title: null, youtube_url: FALLBACK }]));
  }, []);

  if (!videos.length) return null;

  return (
    <section className="py-14 md:py-16 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">En vidéo</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3">
            Découvrez <span className="text-accent font-medium">Cure's Nappy</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {videos.map((v) => {
            const id = getYoutubeId(v.youtube_url);
            if (!id) return null;
            return (
              <div key={v.id} className="w-full max-w-[340px] aspect-[9/16] rounded-md overflow-hidden shadow-lg bg-primary">
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  title={v.title ?? "Vidéo Cure's Nappy"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
