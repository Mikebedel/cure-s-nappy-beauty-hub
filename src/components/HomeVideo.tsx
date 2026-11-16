import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getYoutubeId } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { useContent } from "@/content/ContentProvider";
import Highlight from "@/content/Highlight";

type Video = { id: string; title: string | null; youtube_url: string };

const FALLBACK: Video = { id: "f", title: null, youtube_url: "https://youtube.com/shorts/STG6odV72s8" };

// Origines contactées par le lecteur YouTube : on ouvre les connexions à l'avance.
const YT_ORIGINS = ["https://www.youtube-nocookie.com", "https://www.youtube.com", "https://i.ytimg.com", "https://www.google.com", "https://jnn-pa.googleapis.com"];
const warmConnections = () => {
  for (const href of YT_ORIGINS) {
    if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue;
    const link = Object.assign(document.createElement("link"), { rel: "preconnect", href, crossOrigin: "anonymous" });
    document.head.appendChild(link);
  }
};
/** Pré-chargement complet seulement sur une bonne connexion, sans mode « économie de données ». */
const goodConnection = () => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !c || (!c.saveData && (c.effectiveType === undefined || c.effectiveType === "4g"));
};

// Le lecteur YouTube pèse près de 2 Mo : on affiche d'abord l'image de la vidéo. Quand la vidéo approche
// à l'écran, les connexions s'ouvrent ; au survol, au toucher, ou après quelques secondes à l'écran sur une
// bonne connexion, le lecteur se charge en arrière-plan (sans lecture). L'appui sur ▶ démarre alors vite.
const VideoFrame = ({ video }: { video: Video }) => {
  const [playing, setPlaying] = useState(false);
  const [warm, setWarm] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const id = getYoutubeId(video.youtube_url);

  useEffect(() => {
    const el = box.current;
    if (!el || !id) return;
    let timer: number | undefined;
    const near = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { warmConnections(); near.disconnect(); } }, { rootMargin: "800px 0px" });
    const seen = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry.isIntersecting && goodConnection()) timer = window.setTimeout(() => setWarm(true), 1500);
    }, { threshold: 0.6 });
    near.observe(el); seen.observe(el);
    return () => { near.disconnect(); seen.disconnect(); window.clearTimeout(timer); };
  }, [id]);

  if (!id) return null;
  const title = video.title ?? "Vidéo Cure's Nappy";
  const src = `https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0`;
  const prepare = () => { warmConnections(); setWarm(true); };
  return (
    <div ref={box} className="relative w-full aspect-[9/16] rounded-[1.75rem] overflow-hidden bg-deep shadow-lift ring-8 ring-card">
      {playing ? (
        <iframe
          src={`${src}&autoplay=1`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {/* Lecteur préchargé, invisible : il remplit le cache pour que la lecture démarre vite. */}
          {warm && <iframe src={src} title="" aria-hidden="true" tabIndex={-1} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />}
          <button type="button" onClick={() => setPlaying(true)} onPointerEnter={prepare} onTouchStart={prepare} onFocus={prepare}
            aria-label={`Lire la vidéo : ${title}`} className="group absolute inset-0 w-full h-full">
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover" />
            <span className="absolute inset-0 bg-deep/25 transition-colors group-hover:bg-deep/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lift transition-transform group-hover:scale-105">
              <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
            </span>
          </button>
        </>
      )}
    </div>
  );
};

const HomeVideo = () => {
  // La vidéo par défaut s'affiche tout de suite ; celles de l'admin la remplacent si elles existent.
  const [videos, setVideos] = useState<Video[]>([FALLBACK]);
  const text = useContent().content.home.video;

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
            <span className="eyebrow">{text.eyebrow}</span>
            <h2 className="font-heading font-bold mt-3">
              <Highlight title={text.title} highlight={text.highlight} />
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">{text.text}</p>
            <ul className="mt-6 space-y-3">
              {text.points.map((point) => (
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
