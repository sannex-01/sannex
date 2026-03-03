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
import RewardsBoard from "./pages/RewardsBoard";
import NotFound from "./pages/NotFound";
import MagicEsimAccountDeletion from "./pages/MagicEsimAccountDeletion";
import MagicEsimPrivacyPolicy from "./pages/MagicEsimPrivacyPolicy";
import BookCall from "./pages/BookCall";
import AIMT from "./pages/AIMT";
import LanguageSelectionModal from "./components/LanguageSelectionModal";
import SnowEffect from "./components/SnowEffect";
import "./i18n/config";

const queryClient = new QueryClient();
const SITE_NAME = "Sannex";
const DEFAULT_DESCRIPTION =
  "AI, Automation & Fullstack Engineering for Ambitious Teams. Custom web apps, automation systems, and AI solutions based in Lagos, Nigeria.";
const DEFAULT_IMAGE_PATH = "/placeholder.svg";

type PageMeta = {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
};

const toTitleCaseFromSlug = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getPageMetaFromPath = (pathname: string): PageMeta => {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const segments = normalizedPath.split("/").filter(Boolean);
  const lang = segments[0] && ["en", "fr", "ig", "ha", "yo", "sw"].includes(segments[0]);
  const pathWithoutLang = lang ? `/${segments.slice(1).join("/")}` : normalizedPath;

  if (pathWithoutLang === "/AIM-T" || pathWithoutLang === "/AIM-T26" || pathWithoutLang === "/aim-t" || pathWithoutLang === "/aim-t26") {
    return {
      title: "AIM-T Cohort Program | Sannex",
      description:
        "AIM-T is Sannex's cohort program to build real AI and Web products in 90 days with team collaboration, weekly reviews, and portfolio outcomes.",
      image: "/AIM-T26.png",
    };
  }

  if (pathWithoutLang === "/book-call") {
    return {
      title: "Book a Call | Sannex",
      description: "Book a free consultation call with Sannex.",
    };
  }

  if (pathWithoutLang === "/projects") {
    return {
      title: "Projects | Sannex",
      description: "Explore Sannex projects across AI, automation, web platforms, and integrations.",
    };
  }

  if (pathWithoutLang.startsWith("/projects/")) {
    const slug = pathWithoutLang.replace("/projects/", "");
    return {
      title: `${toTitleCaseFromSlug(slug)} | Projects | Sannex`,
      description: "Project case study from Sannex.",
    };
  }

  if (pathWithoutLang === "/about") {
    return {
      title: "About Sannex",
      description:
        "Learn about Sannex, our mission, values, and expertise in AI-powered automation and fullstack engineering.",
    };
  }

  if (pathWithoutLang === "/contact") {
    return {
      title: "Contact Sannex",
      description: "Contact Sannex to discuss your project requirements and collaboration.",
    };
  }

  if (pathWithoutLang === "/privacy-policy") {
    return {
      title: "Privacy Policy | Sannex",
      description: "Read the Sannex privacy policy.",
    };
  }

  if (pathWithoutLang === "/terms-of-service") {
    return {
      title: "Terms of Service | Sannex",
      description: "Read the Sannex terms of service.",
    };
  }

  if (normalizedPath.startsWith("/top-clients/") || pathWithoutLang.startsWith("/top-clients/")) {
    const year = (normalizedPath.split("/").filter(Boolean).pop() || "").trim();
    return {
      title: `Top Clients ${year} | Sannex`,
      description: `Top clients leaderboard for ${year} on Sannex.`,
    };
  }

  if (normalizedPath.startsWith("/rewards")) {
    return {
      title: "Rewards Board | Sannex",
      description: "Sannex rewards board and leaderboard.",
      noindex: true,
    };
  }

  if (normalizedPath === "/esimmagic/user/request_delete") {
    return {
      title: "Magic eSIM Account Deletion | Sannex",
      description: "Request account deletion for Magic eSIM.",
      noindex: true,
    };
  }

  if (normalizedPath === "/esimmagic/privacy-policy") {
    return {
      title: "Magic eSIM Privacy Policy | Sannex",
      description: "Privacy policy for Magic eSIM.",
      noindex: true,
    };
  }

  if (pathWithoutLang === "/" || normalizedPath === "/") {
    return {
      title: "Sannex - AI, Automation & Fullstack Engineering",
      description: DEFAULT_DESCRIPTION,
    };
  }

  return {
    title: "Page Not Found | Sannex",
    description: "The page you are looking for does not exist.",
    noindex: true,
  };
};

const upsertMetaTag = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const RouteMetaManager = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = getPageMetaFromPath(location.pathname);
    const origin = window.location.origin;
    const canonicalUrl = new URL(location.pathname, origin).toString();
    const imageUrl = meta.image
      ? (meta.image.startsWith("http") ? meta.image : new URL(meta.image, origin).toString())
      : new URL(DEFAULT_IMAGE_PATH, origin).toString();

    document.title = meta.title;

    upsertMetaTag("name", "description", meta.description);
    upsertMetaTag("name", "author", SITE_NAME);
    upsertMetaTag("name", "robots", meta.noindex ? "noindex, nofollow" : "index, follow");

    upsertMetaTag("property", "og:title", meta.title);
    upsertMetaTag("property", "og:description", meta.description);
    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag("property", "og:image", imageUrl);

    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", meta.title);
    upsertMetaTag("name", "twitter:description", meta.description);
    upsertMetaTag("name", "twitter:image", imageUrl);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
  }, [location.pathname]);

  return null;
};

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
  const isRewardsPage = location.pathname.startsWith('/rewards');
  const isMagicEsimPage = location.pathname.startsWith('/esimmagic');

  // Rewards pages - no header/footer
  if (isRewardsPage) {
    return (
      <Routes>
        <Route path="/rewards" element={<RewardsBoard />} />
        <Route path="/rewards/2025" element={<RewardsBoard />} />
        <Route path="/rewards/board" element={<RewardsBoard />} />
        <Route path="*" element={<Navigate to="/rewards" replace />} />
      </Routes>
    );
  }

  // Top clients pages - no header/footer
  if (isTopClientsPage) {
    return (
      <Routes>
        <Route path="/top-clients/:year" element={<TopClients />} />
        <Route path="/:lang/top-clients/:year" element={<LanguageRouteWrapper><TopClients /></LanguageRouteWrapper>} />
      </Routes>
    );
  }

  // Magic eSIM pages - no header/footer
  if (isMagicEsimPage) {
    return (
      <Routes>
        <Route path="/esimmagic/user/request_delete" element={<MagicEsimAccountDeletion />} />
        <Route path="/esimmagic/privacy-policy" element={<MagicEsimPrivacyPolicy />} />
        <Route path="*" element={<Navigate to="/esimmagic/user/request_delete" replace />} />
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
          
          {/* Book call redirect */}
          <Route path="/book-call" element={<BookCall />} />
          <Route path="/AIM-T" element={<AIMT />} />
          <Route path="/aim-t" element={<Navigate to="/AIM-T" replace />} />
          <Route path="/AIM-T26" element={<Navigate to="/AIM-T" replace />} />
          <Route path="/aim-t26" element={<Navigate to="/AIM-T" replace />} />
          
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
        <SnowEffect />
        <BrowserRouter>
          <LanguageSelectionModal />
          <RouteMetaManager />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
