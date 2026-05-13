import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/c/2250100848479"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" style={{ color: 'white' }} />
    </a>
  );
};

export default WhatsAppButton;
