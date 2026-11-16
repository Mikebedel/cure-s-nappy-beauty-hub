import { createContext, useCallback, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  /** Le compte a le rôle admin (la double authentification est vérifiée à part). */
  isAdmin: boolean;
  /** Niveau de connexion : « aal2 » une fois le code de double authentification validé. */
  aal: "aal1" | "aal2" | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  /** Relit le niveau de connexion (après validation d'un code). */
  refreshAal: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [aal, setAal] = useState<"aal1" | "aal2" | null>(null);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  const refreshAal = useCallback(async () => {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    setAal((data?.currentLevel as "aal1" | "aal2" | null) ?? null);
  }, []);

  // Rôle admin et niveau de connexion sont lus avant de déclarer le chargement terminé,
  // pour ne jamais rediriger à tort pendant la vérification.
  // Le compte n'est publié qu'avec son rôle : juste après la connexion, la page admin ne doit
  // jamais voir « connecté mais pas encore admin » (elle renverrait vers l'accueil).
  const load = useCallback(async (current: Session | null) => {
    if (!current?.user) {
      userIdRef.current = null;
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setAal(null);
      setLoading(false);
      return;
    }
    // Écran de chargement seulement quand le compte change (connexion), pas au renouvellement
    // automatique du jeton : le dashboard ouvert ne doit pas être démonté.
    if (current.user.id !== userIdRef.current) setLoading(true);
    userIdRef.current = current.user.id;
    const [{ data: role }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", current.user.id).eq("role", "admin").maybeSingle(),
      refreshAal(),
    ]);
    setSession(current);
    setUser(current.user);
    setIsAdmin(!!role);
    setLoading(false);
  }, [refreshAal]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
      // Appel différé : on ne doit pas rappeler Supabase depuis l'intérieur de ce rappel.
      setTimeout(() => { load(current); }, 0);
    });
    supabase.auth.getSession().then(({ data: { session: current } }) => load(current));
    return () => subscription.unsubscribe();
  }, [load]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // Compte, rôle et niveau de connexion sont chargés avant que la page de connexion ouvre /admin.
    if (!error) await load(data.session);
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setAal(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, aal, loading, signIn, signOut, refreshAal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
