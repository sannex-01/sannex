import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import TopClients from "./pages/TopClients";
import NotFound from "./pages/NotFound";
import LanguageSelectionModal from "./components/LanguageSelectionModal";
import "./i18n/config";

const queryClient = new QueryClient();

// Language-aware wrapper component
const LanguageRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  // Sync URL language with i18n using useEffect to avoid render issues
  useEffect(() => {
    if (lang && ['en', 'fr', 'ig', 'ha', 'yo', 'sw'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
      }
    }
  }, [lang, i18n]);
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();
  const isTopClientsPage = location.pathname.startsWith('/top-clients') || location.pathname.includes('/top-clients/');

  if (isTopClientsPage) {
    return (
      <Routes>
        <Route path="/top-clients/:year" element={<TopClients />} />
        <Route path="/:lang/top-clients/:year" element={<LanguageRouteWrapper><TopClients /></LanguageRouteWrapper>} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Root redirect - will be handled by LanguageSelectionModal */}
          <Route path="/" element={<Navigate to="/en" replace />} />
          
          {/* Language-prefixed routes */}
          <Route path="/:lang" element={<LanguageRouteWrapper><Home /></LanguageRouteWrapper>} />
          <Route path="/:lang/projects" element={<LanguageRouteWrapper><Projects /></LanguageRouteWrapper>} />
          <Route path="/:lang/projects/:slug" element={<LanguageRouteWrapper><ProjectDetail /></LanguageRouteWrapper>} />
          <Route path="/:lang/about" element={<LanguageRouteWrapper><About /></LanguageRouteWrapper>} />
          <Route path="/:lang/contact" element={<LanguageRouteWrapper><Contact /></LanguageRouteWrapper>} />
          <Route path="/:lang/privacy-policy" element={<LanguageRouteWrapper><PrivacyPolicy /></LanguageRouteWrapper>} />
          <Route path="/:lang/terms-of-service" element={<LanguageRouteWrapper><TermsOfService /></LanguageRouteWrapper>} />
          
          {/* Fallback routes without language prefix - redirect to English */}
          <Route path="/projects" element={<Navigate to="/en/projects" replace />} />
          <Route path="/about" element={<Navigate to="/en/about" replace />} />
          <Route path="/contact" element={<Navigate to="/en/contact" replace />} />
          <Route path="/privacy-policy" element={<Navigate to="/en/privacy-policy" replace />} />
          <Route path="/terms-of-service" element={<Navigate to="/en/terms-of-service" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageSelectionModal />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
