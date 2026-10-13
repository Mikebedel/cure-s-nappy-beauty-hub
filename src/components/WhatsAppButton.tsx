import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/c/2250100848479"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 flex items-center justify-center text-primary bg-background/95 rounded-md hover:text-action transition-colors"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={1.5} />
    </a>
  );
};

export default WhatsAppButton;
