import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Boutique from "./pages/Boutique";
import NosGammes from "./pages/NosGammes";
import Conseils from "./pages/Conseils";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Panier from "./pages/Panier";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminClients from "./pages/admin/AdminClients";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMarketing from "./pages/admin/AdminMarketing";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminReports from "./pages/admin/AdminReports";
import AdminSupport from "./pages/admin/AdminSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin routes - no Navbar/Footer */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="commandes" element={<AdminOrders />} />
              <Route path="produits" element={<AdminProducts />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="marketing" element={<AdminMarketing />} />
              <Route path="avis" element={<AdminReviews />} />
              <Route path="rapports" element={<AdminReports />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>

            {/* Public routes */}
            <Route path="*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/boutique" element={<Boutique />} />
                  <Route path="/nos-gammes" element={<NosGammes />} />
                  <Route path="/conseils" element={<Conseils />} />
                  <Route path="/a-propos" element={<APropos />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/panier" element={<Panier />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
                <WhatsAppButton />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
