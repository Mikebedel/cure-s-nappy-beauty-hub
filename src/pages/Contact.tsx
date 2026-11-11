import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PageHero from "@/components/PageHero";
import { useContent } from "@/content/ContentProvider";

const Contact = () => {
  const { contact, contactPage: page } = useContent().content;
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    // Pas de messagerie côté site : le message part dans WhatsApp, où l'équipe répond.
    const text = [`Bonjour, je suis ${form.name.trim()}.`, form.subject.trim() && `Sujet : ${form.subject.trim()}`, form.message.trim()].filter(Boolean).join("\n");
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    toast({ title: "WhatsApp s’ouvre avec votre message", description: "Appuyez sur Envoyer dans WhatsApp pour nous le transmettre." });
  };

  return (
    <div className="min-h-screen">
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />

      <div className="container mx-auto section">
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {/* Infos */}
          <div className="surface p-5 sm:p-6 md:p-9 min-w-0">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">{page.infoTitle}</h2>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Adresse", value: contact.address, href: undefined },
                { icon: Phone, label: "Téléphone", value: contact.phoneDisplay, href: `tel:+${contact.whatsapp}` },
                { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><item.icon className="h-5 w-5" strokeWidth={1.6} /></span>
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-muted-foreground text-sm hover:text-primary transition-colors break-all">{item.value}</a>
                      : <p className="text-muted-foreground text-sm">{item.value}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 sm:p-6 bg-secondary/70 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">WhatsApp</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {page.whatsappText}
              </p>
              <Button asChild variant="outline" className="bg-card">
                <a href={contact.whatsappCatalogUrl} target="_blank" rel="noopener noreferrer">
                  {page.whatsappLabel}
                </a>
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="surface p-5 sm:p-6 md:p-9 min-w-0">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">{page.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium mb-1 block">Nom *</label>
                <Input
                  id="contact-name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Votre nom"
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="text-sm font-medium mb-1 block">Sujet</label>
                <Input
                  id="contact-subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Sujet de votre message"
                  maxLength={200}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium mb-1 block">Message *</label>
                <Textarea
                  id="contact-message"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Votre message..."
                  rows={5}
                  maxLength={1000}
                />
              </div>
              <Button type="submit" size="lg" className="w-full h-12">
                <MessageCircle /> Envoyer sur WhatsApp
              </Button>
              <p className="text-sm text-muted-foreground text-center">Votre message s’ouvre dans WhatsApp, prêt à être envoyé.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
