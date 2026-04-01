import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SkipLink } from "@/components/SkipLink";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
const CatchAllHandler = lazy(() => import("@/components/CatchAllHandler"));

// Lazy load all pages except Index (homepage) for code splitting
const Sobre = lazy(() => import("./pages/Sobre"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contato = lazy(() => import("./pages/Contato"));
const ContabilidadeMedicos = lazy(() => import("./pages/segmentos/ContabilidadeMedicos"));
const ContabilidadeDentistas = lazy(() => import("./pages/segmentos/ContabilidadeDentistas"));
const ContabilidadePsicologos = lazy(() => import("./pages/segmentos/ContabilidadePsicologos"));
const ContabilidadeRepresentantes = lazy(() => import("./pages/segmentos/ContabilidadeRepresentantes"));
const ContabilidadeProdutoresDigitais = lazy(() => import("./pages/segmentos/ContabilidadeProdutoresDigitais"));
const ContabilidadeProfissionaisTI = lazy(() => import("./pages/segmentos/ContabilidadeProfissionaisTI"));
const ContabilidadeExportacaoServicos = lazy(() => import("./pages/segmentos/ContabilidadeExportacaoServicos"));
const ContabilidadePrestadoresServico = lazy(() => import("./pages/segmentos/ContabilidadePrestadoresServico"));
const ContabilidadeProfissionaisPJ = lazy(() => import("./pages/segmentos/ContabilidadeProfissionaisPJ"));
const ContabilidadeEcommerce = lazy(() => import("./pages/segmentos/ContabilidadeEcommerce"));
const ContabilidadeClinicasConsultorios = lazy(() => import("./pages/segmentos/ContabilidadeClinicasConsultorios"));
const ContabilidadeYoutubersCreators = lazy(() => import("./pages/segmentos/ContabilidadeYoutubersCreators"));
const ContabilidadeOutrosSegmentos = lazy(() => import("./pages/segmentos/ContabilidadeOutrosSegmentos"));
const CalculadoraPJCLT = lazy(() => import("./pages/conteudo/CalculadoraPJCLT"));
const ResultadoCalculadoraPJCLT = lazy(() => import("./pages/conteudo/ResultadoCalculadoraPJCLT"));
const GeradorRPA = lazy(() => import("./pages/conteudo/GeradorRPA"));
const GeradorInvoice = lazy(() => import("./pages/conteudo/GeradorInvoice"));
const ComparativoTributario = lazy(() => import("./pages/conteudo/ComparativoTributario"));
const TabelaSimplesNacional = lazy(() => import("./pages/conteudo/TabelaSimplesNacional"));
const ModeloContratoPJ = lazy(() => import("./pages/conteudo/ModeloContratoPJ"));
const GuiaContabilidadeMedicos = lazy(() => import("./pages/guias/GuiaContabilidadeMedicos"));
const AbrirEmpresa = lazy(() => import("./pages/AbrirEmpresa"));
const CidadesAtendidas = lazy(() => import("./pages/CidadesAtendidas"));
const IndiqueGanhe = lazy(() => import("./pages/IndiqueGanhe"));
const PartnerDashboard = lazy(() => import("./pages/PartnerDashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const Termos = lazy(() => import("./pages/Termos"));

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
              <Route path="/medicos" element={<Navigate to="/segmentos/contabilidade-para-medicos" replace />} />
              <Route path="/servicos" element={<Navigate to="/" replace />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/segmentos/contabilidade-para-medicos" element={<ContabilidadeMedicos />} />
              <Route path="/segmentos/contabilidade-para-dentistas" element={<ContabilidadeDentistas />} />
              <Route path="/segmentos/contabilidade-para-psicologos" element={<ContabilidadePsicologos />} />
              <Route path="/segmentos/contabilidade-para-representantes-comerciais" element={<ContabilidadeRepresentantes />} />
              <Route path="/segmentos/contabilidade-para-produtores-digitais" element={<ContabilidadeProdutoresDigitais />} />
              <Route path="/segmentos/contabilidade-para-profissionais-de-ti" element={<ContabilidadeProfissionaisTI />} />
              <Route path="/segmentos/contabilidade-para-exportacao-de-servicos" element={<ContabilidadeExportacaoServicos />} />
              <Route path="/segmentos/contabilidade-para-prestadores-de-servico" element={<ContabilidadePrestadoresServico />} />
              <Route path="/segmentos/contabilidade-para-profissionais-pj" element={<ContabilidadeProfissionaisPJ />} />
              <Route path="/segmentos/contabilidade-para-ecommerce" element={<ContabilidadeEcommerce />} />
              <Route path="/segmentos/contabilidade-para-clinicas-e-consultorios" element={<ContabilidadeClinicasConsultorios />} />
              <Route path="/segmentos/contabilidade-para-youtubers-e-creators" element={<ContabilidadeYoutubersCreators />} />
              <Route path="/segmentos/contabilidade-para-outros-segmentos" element={<ContabilidadeOutrosSegmentos />} />
              <Route path="/conteudo/calculadora-pj-clt" element={<CalculadoraPJCLT />} />
              <Route path="/conteudo/calculadora-pj-clt/resultado" element={<ResultadoCalculadoraPJCLT />} />
              <Route path="/conteudo/gerador-rpa" element={<GeradorRPA />} />
              <Route path="/conteudo/gerador-invoice" element={<GeradorInvoice />} />
              <Route path="/conteudo/comparativo-tributario" element={<ComparativoTributario />} />
              <Route path="/conteudo/tabela-simples-nacional" element={<TabelaSimplesNacional />} />
              <Route path="/conteudo/modelo-contrato-pj" element={<ModeloContratoPJ />} />
              <Route path="/guia-contabilidade-medicos" element={<GuiaContabilidadeMedicos />} />
              <Route path="/abrir-empresa" element={<AbrirEmpresa />} />
              <Route path="/cidades-atendidas" element={<CidadesAtendidas />} />
              <Route path="/indique-e-ganhe" element={<IndiqueGanhe />} />
              <Route path="/parceiro/dashboard" element={<PartnerDashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/:tab" element={<Admin />} />
              <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="*" element={<CatchAllHandler />} />
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
