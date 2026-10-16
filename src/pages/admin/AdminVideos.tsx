import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getYoutubeId } from "@/lib/youtube";

type Video = { id: string; title: string | null; youtube_url: string; is_active: boolean };

const AdminVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const load = async () => {
    const { data } = await supabase.from("site_videos").select("*").order("created_at", { ascending: false });
    setVideos(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!getYoutubeId(url)) return toast.error("Lien YouTube invalide");
    const { error } = await supabase.from("site_videos").insert({ youtube_url: url.trim(), title: title.trim() || null });
    if (error) return toast.error(error.message);
    setUrl(""); setTitle(""); toast.success("Vidéo ajoutée"); load();
  };

  const toggle = async (v: Video) => {
    await supabase.from("site_videos").update({ is_active: !v.is_active }).eq("id", v.id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("site_videos").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vidéos de la page d'accueil</h1>
      <div className="border rounded-md p-4 space-y-3 bg-card">
        <Input placeholder="Lien YouTube (ex : https://youtube.com/shorts/...)" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Input placeholder="Titre (optionnel)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={add}>Ajouter la vidéo</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => {
          const id = getYoutubeId(v.youtube_url);
          return (
            <div key={v.id} className="border rounded-md overflow-hidden bg-card">
              {id && <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" className="w-full aspect-video object-cover" />}
              <div className="p-3 space-y-2">
                <p className="font-medium text-sm truncate">{v.title || v.youtube_url}</p>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={v.is_active} onCheckedChange={() => toggle(v)} /> Visible
                  </label>
                  <Button variant="ghost" size="icon" onClick={() => remove(v.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminVideos;
