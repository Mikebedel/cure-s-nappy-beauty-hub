import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Megaphone, Star, FileText, MessageSquare, Video,
  LogOut, Menu, Home, Store, Layers, Sparkles, BookOpen, Info, Phone, Truck, ExternalLink, Save, Undo2, Loader2, AlertTriangle, CloudOff, Cloud,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useIdleSignOut, useNoIndex } from "@/admin/useAdminGuards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/content/ContentProvider";
import { DraftProvider, useDraft } from "@/admin/DraftContext";

const navGroups = [
  {
    title: "Contenu du site",
    items: [
      { label: "Page d'accueil", path: "/admin/site/accueil", icon: Home },
      { label: "Boutique & Nos Gammes", path: "/admin/site/boutique", icon: Store },
      { label: "Produits", path: "/admin/produits", icon: Package },
      { label: "Gammes & duos", path: "/admin/site/gammes", icon: Layers },
      { label: "Accessoires", path: "/admin/site/accessoires", icon: Sparkles },
      { label: "Conseils", path: "/admin/site/conseils", icon: BookOpen },
      { label: "À propos", path: "/admin/site/a-propos", icon: Info },
      { label: "Contact & infos", path: "/admin/site/contact", icon: Phone },
      { label: "Livraison & paiement", path: "/admin/site/livraison", icon: Truck },
      { label: "Vidéos", path: "/admin/videos", icon: Video },
    ],
  },
  {
    title: "Ventes",
    items: [
      { label: "Tableau de bord", path: "/admin", icon: LayoutDashboard },
      { label: "Commandes", path: "/admin/commandes", icon: ShoppingCart },
      { label: "Clients", path: "/admin/clients", icon: Users },
      { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
      { label: "Marketing", path: "/admin/marketing", icon: Megaphone },
      { label: "Avis", path: "/admin/avis", icon: Star },
      { label: "Rapports", path: "/admin/rapports", icon: FileText },
      { label: "Support", path: "/admin/support", icon: MessageSquare },
    ],
  },
];

/** Où partent les modifications : la base en ligne, ou l'aperçu de ce navigateur. */
const ModeBanner = () => {
  const { saveTarget, status, updatedAt } = useContent();
  if (saveTarget === "local") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm mb-6">
        <CloudOff className="h-5 w-5 shrink-0 text-accent-foreground mt-0.5" />
        <p><strong>Aperçu local.</strong> La base de données est coupée : vos modifications sont gardées dans ce navigateur, sur cet ordinateur seulement. Les visiteurs du site ne les voient pas. {status === "not-set-up" && "La base répond mais la table du contenu n'est pas encore créée."}</p>
      </div>
    );
  }
  if (saveTarget === "remote") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm mb-6">
        <Cloud className="h-5 w-5 shrink-0 text-primary" />
        <p><strong>En ligne.</strong> Ce que vous enregistrez est visible tout de suite par les visiteurs.{updatedAt && ` Dernier enregistrement : ${new Date(updatedAt).toLocaleString("fr-FR")}.`}</p>
      </div>
    );
  }
  if (status === "checking") return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm mb-6">
      <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
      <p><strong>Base de données injoignable.</strong> Les modifications ne peuvent pas être enregistrées pour le moment.</p>
    </div>
  );
};

/** Barre fixe en bas : apparaît dès qu'une modification n'est pas enregistrée. */
const SaveBar = () => {
  const { dirty, saving, save, discard } = useDraft();
  const { saveTarget } = useContent();
  if (!dirty) return null;
  return (
    <div className="sticky bottom-0 z-30 -mx-4 lg:-mx-8 mt-8 border-t border-border bg-background/95 backdrop-blur px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-medium">Modifications non enregistrées{saveTarget === "local" ? " (aperçu local)" : ""}</p>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => { if (window.confirm("Annuler toutes les modifications non enregistrées ?")) discard(); }} disabled={saving}><Undo2 />Annuler</Button>
        <Button onClick={save} disabled={saving || !saveTarget}>{saving ? <Loader2 className="animate-spin" /> : <Save />}Enregistrer</Button>
      </div>
    </div>
  );
};

const AdminShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { dirty } = useDraft();
  useNoIndex();

  // Session réelle (hors aperçu local) : déconnexion après 30 minutes d'inactivité.
  const onIdle = useCallback(async () => {
    await signOut();
    toast.info("Déconnecté après 30 minutes d'inactivité.");
    navigate("/admin/login");
  }, [signOut, navigate]);
  useIdleSignOut(!!user, onIdle);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="font-heading text-xl font-bold text-sidebar-primary">Cure's Nappy</Link>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-sidebar-foreground/50">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent/50">
            <ExternalLink className="h-4 w-4" /> Voir le site
          </a>
          {user && (
            <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-sidebar-accent/50 w-full">
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center gap-3 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-heading font-semibold text-lg">Back Office</span>
          {dirty && <span className="ml-auto text-xs font-semibold rounded-full bg-accent/20 px-3 py-1">Non enregistré</span>}
        </header>
        <main className="p-4 lg:p-8 max-w-6xl">
          <ModeBanner />
          <Outlet />
          <SaveBar />
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => (
  <DraftProvider>
    <AdminShell />
  </DraftProvider>
);

export default AdminLayout;
