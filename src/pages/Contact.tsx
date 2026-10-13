import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    toast({ title: "Message envoyé !", description: "Nous vous répondrons dans les plus brefs délais." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Contact
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">
            Une question ? N'hésitez pas à nous contacter.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Infos */}
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Nos coordonnées</h2>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Adresse", value: "Abidjan, Côte d'Ivoire" },
                { icon: Phone, label: "Téléphone", value: "+225 01 00 84 84 79" },
                { icon: Mail, label: "Email", value: "contact@curesnappy.ci" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <item.icon className="h-5 w-5 mt-1 text-primary shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-secondary rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-heading font-semibold">WhatsApp</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Pour une réponse rapide, contactez-nous directement sur WhatsApp.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <a href="https://wa.me/c/2250100848479" target="_blank" rel="noopener noreferrer">
                  Écrire sur WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nom *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Votre nom"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@email.com"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sujet</label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Sujet de votre message"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message *</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Votre message..."
                  rows={5}
                  maxLength={1000}
                />
              </div>
              <Button type="submit" className="w-full bg-action text-action-foreground hover:bg-action/90">
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
