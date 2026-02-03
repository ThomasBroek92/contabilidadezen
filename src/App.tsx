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
import Index from "./pages/Index";
import Medicos from "./pages/Medicos";
import Servicos from "./pages/Servicos";
import Sobre from "./pages/Sobre";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contato from "./pages/Contato";
import ContabilidadeMedicos from "./pages/segmentos/ContabilidadeMedicos";
import ContabilidadeDentistas from "./pages/segmentos/ContabilidadeDentistas";
import ContabilidadePsicologos from "./pages/segmentos/ContabilidadePsicologos";
import ContabilidadeRepresentantes from "./pages/segmentos/ContabilidadeRepresentantes";
import CalculadoraPJCLT from "./pages/conteudo/CalculadoraPJCLT";
import GeradorRPA from "./pages/conteudo/GeradorRPA";
import GeradorInvoice from "./pages/conteudo/GeradorInvoice";
import ComparativoTributario from "./pages/conteudo/ComparativoTributario";
import TabelaSimplesNacional from "./pages/conteudo/TabelaSimplesNacional";
import ModeloContratoPJ from "./pages/conteudo/ModeloContratoPJ";
import AbrirEmpresa from "./pages/AbrirEmpresa";
import IndiqueGanhe from "./pages/IndiqueGanhe";
import PartnerDashboard from "./pages/PartnerDashboard";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import Termos from "./pages/Termos";
import NotFound from "./pages/NotFound";

// Lazy load componentes não-críticos para reduzir bundle inicial
const CookieConsent = lazy(() => 
  import("@/components/CookieConsent").then(m => ({ default: m.CookieConsent }))
);
const ExitIntentPopup = lazy(() => 
  import("@/components/ExitIntentPopup").then(m => ({ default: m.ExitIntentPopup }))
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
            <Route path="/indique-e-ganhe" element={<IndiqueGanhe />} />
            <Route path="/parceiro/dashboard" element={<PartnerDashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:tab" element={<Admin />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
