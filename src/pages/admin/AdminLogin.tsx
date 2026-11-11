import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/content/ContentProvider";
import { useNoIndex } from "@/admin/useAdminGuards";

const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 60;

/**
 * Connexion à l'administration. Il n'y a volontairement aucune inscription ici :
 * les comptes admin se créent depuis la console Supabase (voir SECURITE.md).
 */
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { localPreview } = useContent();
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  useNoIndex();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Frein aux essais en série (Supabase limite aussi les tentatives côté serveur).
    if (Date.now() < lockedUntil) {
      toast({ title: "Trop de tentatives", description: `Patientez ${Math.ceil((lockedUntil - Date.now()) / 1000)} secondes.`, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setPassword("");
    if (error) {
      const next = attempts + 1;
      setAttempts(next >= MAX_ATTEMPTS ? 0 : next);
      if (next >= MAX_ATTEMPTS) setLockedUntil(Date.now() + LOCK_SECONDS * 1000);
      // Message volontairement vague : on ne dit pas si c'est l'e-mail ou le mot de passe qui est faux.
      toast({ title: "Erreur de connexion", description: next >= MAX_ATTEMPTS ? `Trop de tentatives. Patientez ${LOCK_SECONDS} secondes.` : "Email ou mot de passe incorrect.", variant: "destructive" });
    } else {
      // La double authentification est demandée à l'étape suivante.
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">Cure's Nappy</CardTitle>
          <p className="text-sm text-muted-foreground">Connexion Administration</p>
        </CardHeader>
        <CardContent>
          {localPreview && (
            <div className="mb-6 rounded-2xl border border-accent/50 bg-accent/10 p-4 text-sm space-y-3">
              <p><strong>La base de données est coupée.</strong> Sur cet ordinateur, vous pouvez quand même ouvrir le dashboard en aperçu local : vos modifications resteront dans ce navigateur.</p>
              <Button type="button" className="w-full" onClick={() => navigate("/admin/site/accueil")}>Ouvrir l'aperçu local</Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
