import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { ContentProvider, useContent } from "@/content/ContentProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import Boutique from "./pages/Boutique";
import NosGammes from "./pages/NosGammes";
import Conseils from "./pages/Conseils";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Panier from "./pages/Panier";
import Checkout from "./pages/Checkout";
import OrderReceipt from "./pages/OrderReceipt";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminMfa from "./admin/AdminMfa";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import SiteHome from "./pages/admin/site/SiteHome";
import SiteShop from "./pages/admin/site/SiteShop";
import SiteProducts from "./pages/admin/site/SiteProducts";
import SiteRanges from "./pages/admin/site/SiteRanges";
import SiteAccessories from "./pages/admin/site/SiteAccessories";
import SiteAdvice from "./pages/admin/site/SiteAdvice";
import SiteAbout from "./pages/admin/site/SiteAbout";
import SiteContact from "./pages/admin/site/SiteContact";
import SiteDelivery from "./pages/admin/site/SiteDelivery";
import AdminClients from "./pages/admin/AdminClients";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMarketing from "./pages/admin/AdminMarketing";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminReports from "./pages/admin/AdminReports";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminVideos from "./pages/admin/AdminVideos";

const queryClient = new QueryClient();

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, aal, loading } = useAuth();
  const { status, localPreview } = useContent();
  if (status === "checking") return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  // Sur l'ordinateur de développement, base coupée : on ouvre le dashboard en aperçu local.
  if (localPreview) return <>{children}</>;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  // Mot de passe validé : il faut encore le code de la double authentification.
  if (aal !== "aal2") return <AdminMfa />;
  return <>{children}</>;
};

const PublicStore = () => {
  const location = useLocation();
  const background = location.state?.backgroundLocation;
  const isCart = location.pathname === "/panier";
  return (
    <>
      <Navbar />
      <div key={(background ?? location).pathname} className="store-page">
        <Routes location={isCart ? background ?? { ...location, pathname: "/boutique" } : location}>
          <Route path="/" element={<Index />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/nos-gammes" element={<NosGammes />} />
          <Route path="/conseils" element={<Conseils />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/commande/:token" element={<OrderReceipt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      {!isCart && location.pathname !== "/checkout" && !location.pathname.startsWith("/commande/") && <WhatsAppButton />}
      {isCart && <Panier />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ContentProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <SplashScreen />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Admin login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              <Route path="/admin" element={
                <ProtectedAdmin>
                  <AdminLayout />
                </ProtectedAdmin>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="commandes" element={<AdminOrders />} />
                <Route path="produits" element={<SiteProducts />} />
                <Route path="site/accueil" element={<SiteHome />} />
                <Route path="site/boutique" element={<SiteShop />} />
                <Route path="site/gammes" element={<SiteRanges />} />
                <Route path="site/accessoires" element={<SiteAccessories />} />
                <Route path="site/conseils" element={<SiteAdvice />} />
                <Route path="site/a-propos" element={<SiteAbout />} />
                <Route path="site/contact" element={<SiteContact />} />
                <Route path="site/livraison" element={<SiteDelivery />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="marketing" element={<AdminMarketing />} />
                <Route path="avis" element={<AdminReviews />} />
                <Route path="rapports" element={<AdminReports />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="videos" element={<AdminVideos />} />
              </Route>

              {/* Public routes */}
              <Route path="*" element={<PublicStore />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
        </ContentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
