import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown, Trash2, Plus, ImageIcon, Upload, Library, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { imageLibrary, resolveImage } from "@/content/images";
import { icons } from "@/content/icons";
import { uploadImage } from "@/content/store";
import { useContent } from "@/content/ContentProvider";
import type { Heading } from "@/content/types";

/* ---------- Mise en page ---------- */

export const PageTitle = ({ title, description, children }: { title: string; description?: string; children?: ReactNode }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>}
    </div>
    {children}
  </div>
);

/** Bloc repliable regroupant les champs d'une partie de page. */
export const Panel = ({ title, description, children, defaultOpen = false, aside }: { title: string; description?: string; children: ReactNode; defaultOpen?: boolean; aside?: ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="flex-1 flex items-center justify-between gap-3 text-left">
          <span>
            <span className="block font-heading font-semibold text-lg">{title}</span>
            {description && <span className="block text-sm text-muted-foreground">{description}</span>}
          </span>
          {open ? <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />}
        </button>
        {aside}
      </div>
      {open && <div id={id} className="px-5 pb-6 pt-1 space-y-5 border-t border-border/70">{children}</div>}
    </section>
  );
};

export const Grid = ({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) => (
  <div className={`grid gap-4 ${cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>{children}</div>
);

const FieldShell = ({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) => (
  <div className="space-y-1.5 min-w-0">
    <label htmlFor={htmlFor} className="block text-sm font-semibold">{label}</label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

/* ---------- Champs simples ---------- */

export const TextField = ({ label, value, onChange, hint, multiline = false, rows = 3, placeholder }: { label: string; value: string; onChange: (value: string) => void; hint?: string; multiline?: boolean; rows?: number; placeholder?: string }) => {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      {multiline
        ? <Textarea id={id} value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </FieldShell>
  );
};

export const RichTextField = ({ label, value, onChange, rows = 8 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) => (
  <TextField label={label} value={value} onChange={onChange} multiline rows={rows}
    hint="Ligne vide = nouveau paragraphe · « ## Titre » = sous-titre · « - texte » = puce · « 1. texte » = étape · **texte** = gras" />
);

export const NumberField = ({ label, value, onChange, hint, allowEmpty = false }: { label: string; value: number | null; onChange: (value: number | null) => void; hint?: string; allowEmpty?: boolean }) => {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <Input id={id} type="number" inputMode="numeric" min={0} value={value ?? ""}
        onChange={(e) => {
          if (e.target.value === "") onChange(allowEmpty ? null : 0);
          else onChange(Math.max(0, Math.round(Number(e.target.value))));
        }} />
    </FieldShell>
  );
};

export const ToggleField = ({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (value: boolean) => void; hint?: string }) => {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-secondary/50 px-4 py-3">
      <div>
        <label htmlFor={id} className="text-sm font-semibold">{label}</label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
};

/** Une liste de textes, un par ligne. */
export const LinesField = ({ label, value, onChange, hint, rows = 4, placeholder }: { label: string; value: string[]; onChange: (value: string[]) => void; hint?: string; rows?: number; placeholder?: string }) => {
  const id = useId();
  const parse = (text: string) => text.split("\n").map((line) => line.trim()).filter(Boolean);
  const [text, setText] = useState(value.join("\n"));
  // Le texte tapé reste tel quel (lignes vides comprises) tant qu'il correspond à la liste reçue.
  useEffect(() => {
    if (parse(text).join("\n") !== value.join("\n")) setText(value.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <FieldShell label={label} hint={hint ?? "Un élément par ligne."} htmlFor={id}>
      <Textarea id={id} rows={rows} value={text} placeholder={placeholder} onChange={(e) => { setText(e.target.value); onChange(parse(e.target.value)); }} />
    </FieldShell>
  );
};

export const SelectField = ({ label, value, onChange, options, hint, placeholder = "Choisir…" }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; hint?: string; placeholder?: string }) => {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id={id}><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </FieldShell>
  );
};

export const IconField = ({ label = "Icône", value, onChange }: { label?: string; value: string; onChange: (value: string) => void }) => {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}><SelectValue placeholder="Choisir une icône" /></SelectTrigger>
        <SelectContent>
          {Object.entries(icons).map(([key, { label: name, icon: Icon }]) => (
            <SelectItem key={key} value={key}><span className="inline-flex items-center gap-2"><Icon className="h-4 w-4" />{name}</span></SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
};

/** Plusieurs choix cochés dans une liste (par exemple les produits d'un duo). */
export const ChecklistField = ({ label, value, onChange, options, hint }: { label: string; value: string[]; onChange: (value: string[]) => void; options: { value: string; label: string }[]; hint?: string }) => {
  const base = useId();
  return (
  <FieldShell label={label} hint={hint}>
    <div className="grid sm:grid-cols-2 gap-2 rounded-xl border border-input p-3">
      {options.map((option) => {
        const checked = value.includes(option.value);
        const id = `${base}-${option.value}`;
        return (
          <label key={option.value} htmlFor={id} className="flex items-center gap-2.5 text-sm rounded-lg px-2 py-1.5 hover:bg-secondary/60 cursor-pointer">
            <Checkbox id={id} checked={checked} onCheckedChange={(on) => onChange(on ? [...value, option.value] : value.filter((v) => v !== option.value))} />
            {option.label}
          </label>
        );
      })}
    </div>
  </FieldShell>
  );
};

/** Repère + titre + fin colorée, utilisé par la plupart des sections. */
export const HeadingFields = ({ value, onChange, withHighlight = true }: { value: Heading; onChange: (value: Heading) => void; withHighlight?: boolean }) => (
  <Grid cols={withHighlight ? 3 : 2}>
    <TextField label="Petit repère (au-dessus)" value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
    <TextField label="Titre" value={value.title} onChange={(title) => onChange({ ...value, title })} />
    {withHighlight && <TextField label="Fin du titre (en couleur)" value={value.highlight} onChange={(highlight) => onChange({ ...value, highlight })} />}
  </Grid>
);

/* ---------- Images ---------- */

const LibraryDialog = ({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (open: boolean) => void; onPick: (ref: string) => void }) => {
  const [url, setUrl] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Choisir une image</DialogTitle>
          <DialogDescription>Les photos déjà présentes sur le site, ou une adresse d'image en ligne.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {imageLibrary.map((image) => (
            <button key={image.ref} type="button" onClick={() => { onPick(image.ref); onOpenChange(false); }}
              className="group rounded-xl overflow-hidden border border-border hover:border-primary focus-visible:ring-2 focus-visible:ring-ring text-left">
              <img src={image.url} alt="" loading="lazy" className="aspect-square w-full object-cover bg-muted group-hover:scale-105 transition-transform" />
              <span className="block px-2 py-1.5 text-[11px] text-muted-foreground truncate">{image.key}</span>
            </button>
          ))}
        </div>
        <form className="flex gap-2 pt-2" onSubmit={(e) => { e.preventDefault(); if (/^https?:\/\//.test(url.trim())) { onPick(url.trim()); setUrl(""); onOpenChange(false); } else toast.error("Collez une adresse qui commence par https://"); }}>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… (adresse d'une image en ligne)" aria-label="Adresse d'une image" />
          <Button type="submit" variant="outline">Utiliser</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const useUpload = (onDone: (ref: string) => void) => {
  const { saveTarget } = useContent();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pick = () => {
    if (!saveTarget) { toast.error("La base est injoignable : impossible d'envoyer une image pour le moment."); return; }
    inputRef.current?.click();
  };
  const input = (
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !saveTarget) return;
      setBusy(true);
      try { onDone(await uploadImage(file, saveTarget)); }
      catch (error) { toast.error(error instanceof Error ? error.message : "Envoi impossible"); }
      finally { setBusy(false); }
    }} />
  );
  return { pick, busy, input };
};

export const ImageField = ({ label, value, onChange, hint, allowEmpty = true }: { label: string; value: string; onChange: (value: string) => void; hint?: string; allowEmpty?: boolean }) => {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const upload = useUpload(onChange);
  const src = resolveImage(value);
  return (
    <FieldShell label={label} hint={hint}>
      <div className="flex items-center gap-4 rounded-xl border border-input p-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setLibraryOpen(true)}><Library />Bibliothèque</Button>
          <Button type="button" size="sm" variant="outline" onClick={upload.pick} disabled={upload.busy}>{upload.busy ? <Loader2 className="animate-spin" /> : <Upload />}Envoyer</Button>
          {allowEmpty && value && <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}><X />Retirer</Button>}
        </div>
      </div>
      {upload.input}
      <LibraryDialog open={libraryOpen} onOpenChange={setLibraryOpen} onPick={onChange} />
    </FieldShell>
  );
};

/** Une suite d'images (diaporama, galerie) : ajouter, retirer, réordonner. */
export const ImagesField = ({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (value: string[]) => void; hint?: string }) => {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const upload = useUpload((ref) => onChange([...value, ref]));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };
  return (
    <FieldShell label={label} hint={hint}>
      <div className="rounded-xl border border-input p-3 space-y-3">
        {value.length === 0 && <p className="text-sm text-muted-foreground">Aucune image.</p>}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {value.map((ref, i) => (
            <div key={`${ref}-${i}`} className="relative group">
              <img src={resolveImage(ref)} alt="" className="aspect-square w-full rounded-lg object-cover bg-muted" />
              <span className="absolute top-1 left-1 rounded-full bg-background/90 px-1.5 text-[11px] font-bold">{i + 1}</span>
              <div className="mt-1 flex justify-center gap-1">
                <button type="button" aria-label="Déplacer avant" onClick={() => move(i, i - 1)} className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-secondary"><ArrowUp className="h-3.5 w-3.5 -rotate-90" /></button>
                <button type="button" aria-label="Déplacer après" onClick={() => move(i, i + 1)} className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-secondary"><ArrowDown className="h-3.5 w-3.5 -rotate-90" /></button>
                <button type="button" aria-label="Retirer l'image" onClick={() => onChange(value.filter((_, j) => j !== i))} className="h-7 w-7 inline-flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setLibraryOpen(true)}><Library />Ajouter depuis la bibliothèque</Button>
          <Button type="button" size="sm" variant="outline" onClick={upload.pick} disabled={upload.busy}>{upload.busy ? <Loader2 className="animate-spin" /> : <Upload />}Envoyer une image</Button>
        </div>
      </div>
      {upload.input}
      <LibraryDialog open={libraryOpen} onOpenChange={setLibraryOpen} onPick={(ref) => onChange([...value, ref])} />
    </FieldShell>
  );
};

/* ---------- Listes d'éléments ---------- */

/** Liste d'éléments modifiables : chacun dans sa carte, avec déplacement et suppression. */
export function Repeater<T>({ items, onChange, render, create, itemTitle, addLabel = "Ajouter", emptyText = "Aucun élément pour l'instant.", startOpen = false }: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, change: (item: T) => void, index: number) => ReactNode;
  create: () => T;
  itemTitle: (item: T, index: number) => string;
  addLabel?: string;
  emptyText?: string;
  startOpen?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(startOpen ? 0 : null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
    setOpenIndex(openIndex === from ? to : openIndex === to ? from : openIndex);
  };
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">{emptyText}</p>}
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="rounded-xl border border-border bg-background/60">
            <div className="flex items-center gap-1 pl-4 pr-2 py-2">
              <button type="button" aria-expanded={open} onClick={() => setOpenIndex(open ? null : i)} className="flex-1 min-w-0 flex items-center gap-2 text-left py-1.5">
                {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                <span className="truncate font-medium">{itemTitle(item, i) || `Élément ${i + 1}`}</span>
              </button>
              <button type="button" aria-label="Monter" onClick={() => move(i, i - 1)} disabled={i === 0} className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Descendre" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Supprimer" onClick={() => {
                if (!window.confirm(`Supprimer « ${itemTitle(item, i) || `élément ${i + 1}`} » ? (Rien n'est perdu tant que vous n'avez pas enregistré.)`)) return;
                onChange(items.filter((_, j) => j !== i));
                setOpenIndex(null);
              }} className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
            </div>
            {open && <div className="px-4 pb-5 pt-2 space-y-4 border-t border-border/70">{render(item, (changed) => onChange(items.map((current, j) => (j === i ? changed : current))), i)}</div>}
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={() => { onChange([...items, create()]); setOpenIndex(items.length); }}><Plus />{addLabel}</Button>
    </div>
  );
}

/** Identifiant court et lisible pour un nouvel élément. */
export const newId = (label = "item") =>
  `${label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "item"}-${Date.now().toString(36).slice(-4)}`;
