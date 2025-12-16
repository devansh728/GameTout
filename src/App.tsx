import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { GlobalHeader } from "@/components/GlobalHeader"; // NEW IMPORT
import { SecurityAuthModal } from "@/components/SecurityAuthModal"; // Moved here


// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Documentary from "./pages/Documentary";
import Reviews from "./pages/Reviews";
import Portfolios from "./pages/Portfolios";
import Studios from "./pages/Studios";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ArticlePage from "./pages/ArticlePage";
import Podcast from "./pages/Podcast";

// Placeholders
const Opinion = () => <div className="pt-32 text-white text-center">Opinion Page Coming Soon</div>;

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/content/:type/:id" element={<ArticlePage />} />
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/documentary" element={<Documentary />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/opinion" element={<Opinion />} />
        <Route path="/portfolios" element={<Portfolios />} />
        <Route path="/studios" element={<Studios />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // Authentication State is now Global
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          
          {/* Global Header (Visible on all pages) */}
          <GlobalHeader 
            onLoginClick={() => setIsAuthOpen(true)}
            isAuthenticated={isAuthenticated}
          />

          {/* Global Auth Modal */}
          <SecurityAuthModal 
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={handleAuthSuccess}
          />

          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;