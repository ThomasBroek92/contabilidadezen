import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Medicos from "./pages/Medicos";
import Servicos from "./pages/Servicos";
import Sobre from "./pages/Sobre";
import Blog from "./pages/Blog";
import Contato from "./pages/Contato";
import ContabilidadeMedicos from "./pages/segmentos/ContabilidadeMedicos";
import ContabilidadeDentistas from "./pages/segmentos/ContabilidadeDentistas";
import ContabilidadePsicologos from "./pages/segmentos/ContabilidadePsicologos";
import CalculadoraPJCLT from "./pages/conteudo/CalculadoraPJCLT";
import AbrirEmpresa from "./pages/AbrirEmpresa";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import Termos from "./pages/Termos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/segmentos/contabilidade-para-medicos" element={<ContabilidadeMedicos />} />
            <Route path="/segmentos/contabilidade-para-dentistas" element={<ContabilidadeDentistas />} />
            <Route path="/segmentos/contabilidade-para-psicologos" element={<ContabilidadePsicologos />} />
            <Route path="/conteudo/calculadora-pj-clt" element={<CalculadoraPJCLT />} />
            <Route path="/abrir-empresa" element={<AbrirEmpresa />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
