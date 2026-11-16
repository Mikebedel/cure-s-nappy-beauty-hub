import { MessageCircle, MessageSquare, Mail, Send, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Copie un texte, y compris sur une page non sécurisée (http) où l'API presse-papiers est absente. */
export const copyText = async (value: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, value.length);
      const ok = document.execCommand("copy");
      area.remove();
      if (!ok) throw new Error("copy");
    }
    toast.success("Lien copié");
  } catch {
    toast.error("Copie impossible : appuyez longuement sur le lien pour le copier.");
  }
};

/**
 * Ouvre le menu de partage du téléphone quand il existe (pages https), sinon renvoie false :
 * la page affiche alors ShareSheet, notre propre menu.
 */
export const nativeShare = async (data: { title: string; text: string; url: string }) => {
  if (!navigator.share || !window.isSecureContext) return false;
  try {
    await navigator.share(data);
  } catch (error) {
    // Fermer le menu n'est pas une erreur ; tout autre échec bascule sur notre menu.
    if ((error as DOMException)?.name !== "AbortError") return false;
  }
  return true;
};

type Props = { open: boolean; onOpenChange: (open: boolean) => void; title: string; text: string; url: string };

/** Menu de partage de secours : WhatsApp, SMS, e-mail, Telegram et copie du lien. */
const ShareSheet = ({ open, onOpenChange, title, text, url }: Props) => {
  const message = `${text} : ${url}`;
  const options = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(message)}`, tone: "bg-[#25D366] text-white" },
    { label: "SMS", icon: MessageSquare, href: `sms:?&body=${encodeURIComponent(message)}`, tone: "bg-primary text-primary-foreground" },
    { label: "E-mail", icon: Mail, href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`, tone: "bg-accent text-accent-foreground" },
    { label: "Telegram", icon: Send, href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, tone: "bg-[#229ED9] text-white" },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm grid-cols-[minmax(0,1fr)] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Partager</DialogTitle>
          <DialogDescription>Ce lien ouvre votre reçu : partagez-le seulement avec des personnes de confiance.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3 pt-2">
          {options.map(({ label, icon: Icon, href, tone }) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" onClick={() => onOpenChange(false)}
              className="flex flex-col items-center gap-2 rounded-2xl p-2 text-xs font-semibold hover:bg-muted transition-colors">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${tone}`}><Icon className="h-5 w-5" /></span>
              {label}
            </a>
          ))}
        </div>
        <button type="button" onClick={() => { copyText(url); onOpenChange(false); }}
          className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-border p-3 text-left hover:bg-muted transition-colors">
          <Link2 className="h-5 w-5 shrink-0 text-primary" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Copier le lien</span>
            <span className="block truncate text-xs text-muted-foreground">{url}</span>
          </span>
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSheet;
