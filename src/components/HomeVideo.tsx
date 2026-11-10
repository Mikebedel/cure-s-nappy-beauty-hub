import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getYoutubeId } from "@/lib/youtube";
import { Button } from "@/components/ui/button";

type Video = { id: string; title: string | null; youtube_url: string };

const FALLBACK: Video = { id: "f", title: null, youtube_url: "https://youtube.com/shorts/STG6odV72s8" };

const VideoFrame = ({ video }: { video: Video }) => {
  const id = getYoutubeId(video.youtube_url);
  if (!id) return null;
  return (
    <div className="w-full aspect-[9/16] rounded-[1.75rem] overflow-hidden bg-deep shadow-lift ring-8 ring-card">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={video.title ?? "Vidéo Cure's Nappy"}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

const HomeVideo = () => {
  // La vidéo par défaut s'affiche tout de suite ; celles de l'admin la remplacent si elles existent.
  const [videos, setVideos] = useState<Video[]>([FALLBACK]);

  useEffect(() => {
    supabase
      .from("site_videos")
      .select("id,title,youtube_url")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length) setVideos(data); });
  }, []);

  const [main, ...others] = videos.filter((video) => getYoutubeId(video.youtube_url));
  if (!main) return null;

  return (
    <section className="section bg-secondary/60 reveal-section overflow-x-clip">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-10 md:gap-14 lg:gap-20 items-center">
          {/* Vidéo à gauche */}
          <div className="relative w-full max-w-[340px] md:max-w-none mx-auto">
            <div aria-hidden="true" className="absolute -inset-4 md:-inset-6 rounded-[2.5rem] bg-primary/15 -rotate-3" />
            <div className="relative"><VideoFrame video={main} /></div>
          </div>

          {/* Texte à droite */}
          <div>
            <span className="eyebrow">En vidéo</span>
            <h2 className="font-heading font-bold mt-3">
              Découvrez <span className="text-primary">Cure's Nappy</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Nos soins en action : les textures, les bons gestes et les résultats sur cheveux crépus, bouclés et naturels.
            </p>
            <ul className="mt-6 space-y-3">
              {["Les bons gestes pour appliquer chaque soin", "Des routines simples à refaire chez vous", "Le massage du cuir chevelu, étape clé de la pousse"].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  <span className="text-foreground/90">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/boutique">Découvrir la boutique <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/conseils">Nos conseils</Link></Button>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5">
            {others.map((video) => <VideoFrame key={video.id} video={video} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeVideo;
