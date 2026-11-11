import { MessageCircle } from "lucide-react";
import { useContent } from "@/content/ContentProvider";

const WhatsAppButton = () => {
  const { contact } = useContent().content;
  return (
    <a
      href={contact.whatsappCatalogUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="no-print fixed bottom-5 right-5 z-40 h-14 w-14 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background hover:bg-primary/90 hover:scale-105 transition-all duration-200"
      aria-label="Contacter Cure's Nappy sur WhatsApp"
      title="Écrire sur WhatsApp"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
};

export default WhatsAppButton;
