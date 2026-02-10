import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SkipLink } from "@/components/SkipLink";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import { LegacyRedirects } from "@/components/LegacyRedirects";

// Lazy load all pages except Index (homepage) for code splitting
const Medicos = lazy(() => import("./pages/Medicos"));
const Servicos = lazy(() => import("./pages/Servicos"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contato = lazy(() => import("./pages/Contato"));
const ContabilidadeMedicos = lazy(() => import("./pages/segmentos/ContabilidadeMedicos"));
const ContabilidadeDentistas = lazy(() => import("./pages/segmentos/ContabilidadeDentistas"));
const ContabilidadePsicologos = lazy(() => import("./pages/segmentos/ContabilidadePsicologos"));
const ContabilidadeRepresentantes = lazy(() => import("./pages/segmentos/ContabilidadeRepresentantes"));
const CalculadoraPJCLT = lazy(() => import("./pages/conteudo/CalculadoraPJCLT"));
const GeradorRPA = lazy(() => import("./pages/conteudo/GeradorRPA"));
const GeradorInvoice = lazy(() => import("./pages/conteudo/GeradorInvoice"));
const ComparativoTributario = lazy(() => import("./pages/conteudo/ComparativoTributario"));
const TabelaSimplesNacional = lazy(() => import("./pages/conteudo/TabelaSimplesNacional"));
const ModeloContratoPJ = lazy(() => import("./pages/conteudo/ModeloContratoPJ"));
const AbrirEmpresa = lazy(() => import("./pages/AbrirEmpresa"));
const CidadesAtendidas = lazy(() => import("./pages/CidadesAtendidas"));
const ContabilidadeCampinas = lazy(() => import("./pages/cidades/ContabilidadeCampinas"));
const IndiqueGanhe = lazy(() => import("./pages/IndiqueGanhe"));
const PartnerDashboard = lazy(() => import("./pages/PartnerDashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const Termos = lazy(() => import("./pages/Termos"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load componentes não-críticos
const CookieConsent = lazy(() => 
  import("@/components/CookieConsent").then(m => ({ default: m.CookieConsent }))
);
const ExitIntentPopup = lazy(() => 
  import("@/components/ExitIntentPopup").then(m => ({ default: m.ExitIntentPopup }))
);

// Fallback minimalista para rotas lazy
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SkipLink />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/medicos" element={<Medicos />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/segmentos/contabilidade-para-medicos" element={<ContabilidadeMedicos />} />
              <Route path="/segmentos/contabilidade-para-dentistas" element={<ContabilidadeDentistas />} />
              <Route path="/segmentos/contabilidade-para-psicologos" element={<ContabilidadePsicologos />} />
              <Route path="/segmentos/contabilidade-para-representantes-comerciais" element={<ContabilidadeRepresentantes />} />
              <Route path="/conteudo/calculadora-pj-clt" element={<CalculadoraPJCLT />} />
              <Route path="/conteudo/gerador-rpa" element={<GeradorRPA />} />
              <Route path="/conteudo/gerador-invoice" element={<GeradorInvoice />} />
              <Route path="/conteudo/comparativo-tributario" element={<ComparativoTributario />} />
              <Route path="/conteudo/tabela-simples-nacional" element={<TabelaSimplesNacional />} />
              <Route path="/conteudo/modelo-contrato-pj" element={<ModeloContratoPJ />} />
              <Route path="/abrir-empresa" element={<AbrirEmpresa />} />
              <Route path="/cidades-atendidas" element={<CidadesAtendidas />} />
              <Route path="/contabilidade-em-campinas" element={<ContabilidadeCampinas />} />
              <Route path="/indique-e-ganhe" element={<IndiqueGanhe />} />
              <Route path="/parceiro/dashboard" element={<PartnerDashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/:tab" element={<Admin />} />
              <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/termos" element={<Termos />} />
              {/* Handler para URLs legadas do WordPress - deve vir antes do NotFound */}
              <Route path="*" element={<LegacyRedirects />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ScrollToTop />
          <AnalyticsTracker />
          {/* Componentes não-críticos carregados após o conteúdo principal */}
          <Suspense fallback={null}>
            <CookieConsent />
            <ExitIntentPopup />
          </Suspense>
          <FloatingWhatsApp />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
