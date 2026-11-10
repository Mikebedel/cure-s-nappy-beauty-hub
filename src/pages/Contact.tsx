import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PageHero from "@/components/PageHero";

const Contact = () => {
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
    window.open(`https://wa.me/2250100848479?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    toast({ title: "WhatsApp s’ouvre avec votre message", description: "Appuyez sur Envoyer dans WhatsApp pour nous le transmettre." });
  };

  return (
    <div className="min-h-screen">
      <PageHero eyebrow="Parlons cheveux" title="Contact" description="Une question ? N'hésitez pas à nous contacter." />

      <div className="container mx-auto section">
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {/* Infos */}
          <div className="surface p-6 md:p-9">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Nos coordonnées</h2>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Adresse", value: "Abidjan, Côte d'Ivoire", href: undefined },
                { icon: Phone, label: "Téléphone", value: "+225 01 00 84 84 79", href: "tel:+2250100848479" },
                { icon: Mail, label: "Email", value: "contact@curesnappy.ci", href: "mailto:contact@curesnappy.ci" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><item.icon className="h-5 w-5" strokeWidth={1.6} /></span>
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-muted-foreground text-sm hover:text-primary transition-colors">{item.value}</a>
                      : <p className="text-muted-foreground text-sm">{item.value}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-secondary/70 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">WhatsApp</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Retrouvez tous nos soins et commandez directement depuis notre catalogue WhatsApp.
              </p>
              <Button asChild variant="outline" className="bg-card">
                <a href="https://wa.me/c/2250100848479" target="_blank" rel="noopener noreferrer">
                  Voir le catalogue WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="surface p-6 md:p-9">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Écrivez-nous</h2>
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
