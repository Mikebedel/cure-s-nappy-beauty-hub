import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast({
            title: "Erreur",
            description: data.error || "Impossible de créer le compte.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Compte créé",
            description: "Vous pouvez maintenant vous connecter.",
          });
          setMode("login");
        }
      } catch (err: any) {
        toast({
          title: "Erreur",
          description: err.message,
          variant: "destructive",
        });
      }
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">Cure's Nappy</CardTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Connexion Administration" : "Créer un compte admin"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@curesnappy.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Connexion..."
                  : "Création..."
                : mode === "login"
                ? "Se connecter"
                : "Créer le compte admin"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              {mode === "login" ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  Créer un compte admin
                </>
              ) : (
                "J'ai déjà un compte"
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
