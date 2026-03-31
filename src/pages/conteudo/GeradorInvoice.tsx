import { useState, useCallback, useMemo, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolPageSEO } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Download, 
  Eye, 
  User, 
  Briefcase, 
  DollarSign, 
  Building2, 
  Palette,
  HelpCircle,
  CheckCircle2,
  MessageCircle,
  Calculator,
  Loader2,
  ArrowRight,
  Star,
  Coins,
  Languages,
  FileDown,
  Sparkles,
  UserX,
  FileText
} from "lucide-react";
import { toast } from "sonner";
// jsPDF is dynamically imported when generating PDF to reduce initial bundle size

import { InvoiceDocumentTypeSelector } from "@/components/gerador-invoice/InvoiceDocumentTypeSelector";
import { InvoiceThemeSelector } from "@/components/gerador-invoice/InvoiceThemeSelector";
import { InvoiceLanguageSelector } from "@/components/gerador-invoice/InvoiceLanguageSelector";
import { InvoicePreview } from "@/components/gerador-invoice/InvoicePreview";
import { 
  CURRENCIES, 
  INVOICE_THEMES, 
  INVOICE_TRANSLATIONS,
  INITIAL_FORM_DATA,
  type InvoiceFormData,
  type CurrencyCode 
} from "@/components/gerador-invoice/constants";
import {
  maskCnpj,
  maskCpfCnpj,
  maskPhone,
  isValidEmail,
  formatCurrency,
  formatDateBR,
  parseAmount,
  generatePdfFilename,
} from "@/lib/invoice-utils";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { useIsMobile } from "@/hooks/use-mobile";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

// Google logo SVG component
function GoogleLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Benefícios para o carrossel
const invoiceBenefits = [
  {
    icon: Coins,
    title: "29 Moedas",
    description: "Dólar, Euro, Libra e mais 26 moedas.",
  },
  {
    icon: CheckCircle2,
    title: "100% Gratuito",
    description: "Sem limite de invoices geradas.",
  },
  {
    icon: Languages,
    title: "Bilíngue (PT/EN)",
    description: "Labels em português ou inglês.",
  },
  {
    icon: FileDown,
    title: "Download PDF",
    description: "Arquivo profissional pronto para envio.",
  },
  {
    icon: Sparkles,
    title: "Preview em Tempo Real",
    description: "Veja as mudanças enquanto preenche.",
  },
  {
    icon: UserX,
    title: "Sem Cadastro",
    description: "Nenhuma conta necessária para usar.",
  },
];

export default function GeradorInvoice() {
  const [formData, setFormData] = useState<InvoiceFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const { saveLead } = useLeadCapture();
  const isMobile = useIsMobile();
  
  // Autoplay para carrossel
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // Fetch GMB stats
  const { data: gmbStats } = useQuery({
    queryKey: ['gmb-stats-invoice-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gmb_stats')
        .select('*')
        .order('synced_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching GMB stats:', error);
        return null;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Render stars
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} 
      />
    ));
  };

  // Scroll suave para o formulário
  const scrollToForm = () => {
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Atualizar campo do formulário
  const updateField = useCallback(<K extends keyof InvoiceFormData>(
    field: K, 
    value: InvoiceFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro ao editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Validar formulário
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof InvoiceFormData, string>> = {};
    
    if (!formData.providerName.trim() || formData.providerName.length < 3) {
      newErrors.providerName = "Nome do prestador é obrigatório (mín. 3 caracteres)";
    }
    
    if (!formData.providerEmail.trim()) {
      newErrors.providerEmail = "Email é obrigatório";
    } else if (!isValidEmail(formData.providerEmail)) {
      newErrors.providerEmail = "Email inválido";
    }
    
    if (!formData.clientName.trim() || formData.clientName.length < 3) {
      newErrors.clientName = "Nome do cliente é obrigatório (mín. 3 caracteres)";
    }
    
    const amount = parseAmount(formData.amount);
    if (amount <= 0) {
      newErrors.amount = "Valor deve ser maior que zero";
    }
    
    if (!formData.issueDate) {
      newErrors.issueDate = "Data de emissão é obrigatória";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Data de vencimento é obrigatória";
    } else if (formData.dueDate < formData.issueDate) {
      newErrors.dueDate = "Vencimento deve ser igual ou posterior à emissão";
    }
    
    if (!formData.serviceTitle.trim()) {
      newErrors.serviceTitle = "Título do serviço é obrigatório";
    } else if (formData.serviceTitle.length > 100) {
      newErrors.serviceTitle = "Máximo 100 caracteres";
    }
    
    if (!formData.serviceDescription.trim() || formData.serviceDescription.length < 20) {
      newErrors.serviceDescription = "Descrição é obrigatória (mín. 20 caracteres)";
    } else if (formData.serviceDescription.length > 1000) {
      newErrors.serviceDescription = "Máximo 1000 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Gerar PDF
  const generatePdf = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const theme = INVOICE_THEMES.find(t => t.id === formData.theme) || INVOICE_THEMES[0];
      const amount = parseAmount(formData.amount);
      const t = INVOICE_TRANSLATIONS[formData.language];
      const docTypeLabel = formData.documentType === "invoice" ? t.invoice : t.fatura;
      
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;
      
      // Função para adicionar texto com quebra de linha
      const addWrappedText = (text: string, x: number, yPos: number, maxWidth: number, lineHeight: number = 5): number => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, yPos);
        return yPos + (lines.length * lineHeight);
      };
      
      // Header com cor do tema
      doc.setFillColor(theme.color);
      doc.rect(0, 0, pageWidth, 35, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(docTypeLabel, margin, 20);
      
      if (formData.invoiceCode) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`${t.number} ${formData.invoiceCode}`, margin, 28);
      }
      
      y = 45;
      doc.setTextColor(0, 0, 0);
      
      // Dados do prestador
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(formData.providerName, margin, y);
      y += 6;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      
      if (formData.providerCnpj) {
        doc.text(`${t.cnpj}: ${formData.providerCnpj}`, margin, y);
        y += 5;
      }
      if (formData.providerAddress) {
        y = addWrappedText(formData.providerAddress, margin, y, contentWidth);
      }
      if (formData.providerPhone) {
        doc.text(`${t.phone} ${formData.providerPhone}`, margin, y);
        y += 5;
      }
      if (formData.providerEmail) {
        doc.text(formData.providerEmail, margin, y);
        y += 5;
      }
      
      y += 8;
      
      // Linha separadora
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      
      // Dados do cliente
      doc.setTextColor(theme.color);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.billedTo.toUpperCase(), margin, y);
      y += 5;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(formData.clientName, margin, y);
      y += 5;
      
      if (formData.clientDocument) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const docLabel = formData.clientDocument.replace(/\D/g, "").length <= 11 ? t.cpf : t.cnpj;
        doc.text(`${docLabel}: ${formData.clientDocument}`, margin, y);
        y += 5;
      }
      
      y += 8;
      
      // Datas
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(t.issueDate.toUpperCase(), margin, y);
      doc.text(t.dueDate.toUpperCase(), margin + 50, y);
      y += 5;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(formatDateBR(formData.issueDate), margin, y);
      doc.text(formatDateBR(formData.dueDate), margin + 50, y);
      y += 10;
      
      // Linha separadora
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      
      // Serviço
      doc.setTextColor(theme.color);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.service.toUpperCase(), margin, y);
      y += 5;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(formData.serviceTitle, margin, y);
      y += 8;
      
      // Descrição
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(t.description.toUpperCase(), margin, y);
      y += 5;
      
      doc.setFontSize(10);
      y = addWrappedText(formData.serviceDescription, margin, y, contentWidth);
      y += 10;
      
      // Box do valor
      const boxHeight = 25;
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, "F");
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(t.amountDue.toUpperCase(), pageWidth / 2, y + 8, { align: "center" });
      
      doc.setTextColor(theme.color);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(amount, formData.currency), pageWidth / 2, y + 18, { align: "center" });
      y += boxHeight + 10;
      
      // Dados bancários (se invoice)
      if (formData.documentType === "invoice" && (formData.swiftCode || formData.ibanCode)) {
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        doc.setTextColor(theme.color);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(t.bankDetails.toUpperCase(), margin, y);
        y += 5;
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        if (formData.swiftCode) {
          doc.text(`${t.swiftBic} ${formData.swiftCode}`, margin, y);
          y += 5;
        }
        if (formData.ibanCode) {
          doc.text(`${t.iban} ${formData.ibanCode}`, margin, y);
          y += 5;
        }
        y += 5;
      }
      
      // Rodapé
      const footerY = doc.internal.pageSize.getHeight() - 25;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(t.generatedBy, pageWidth / 2, footerY + 7, { align: "center" });
      
      doc.setTextColor(theme.color);
      doc.setFont("helvetica", "bold");
      doc.text("Contabilidade Zen", pageWidth / 2, footerY + 12, { align: "center" });
      
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text("contabilidadezen.com.br", pageWidth / 2, footerY + 17, { align: "center" });
      
      // Salvar arquivo
      const filename = generatePdfFilename(formData.invoiceCode, formData.clientName, formData.documentType);
      doc.save(filename);
      
      // Salvar lead no CRM sempre que houver e-mail
      if (formData.providerEmail) {
        await saveLead({
          nome: formData.providerName,
          email: formData.providerEmail,
          whatsapp: formData.providerPhone || "Não informado",
          fonte: "Gerador de Invoice",
          segmento: "Geral",
        });
      }
      
      toast.success("Invoice gerada com sucesso!", {
        description: "O download do PDF foi iniciado automaticamente.",
      });
      
      // Analytics
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "pdf_generated",
          document_type: formData.documentType,
          currency: formData.currency,
          theme: formData.theme,
        });
      }
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o documento", {
        description: "Tente novamente. Se o problema persistir, entre em contato.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [formData, validateForm, saveLead]);

  // Componente de tooltip de ajuda
  const HelpTooltip = ({ content }: { content: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="ml-1 text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );

  // Componente de campo com erro
  const FieldError = ({ error }: { error?: string }) => {
    if (!error) return null;
    return <p className="text-sm text-destructive mt-1">{error}</p>;
  };

  // Contador de caracteres
  const CharCounter = ({ current, max }: { current: number; max: number }) => (
    <p className={`text-xs mt-1 ${current > max ? "text-destructive" : "text-muted-foreground"}`}>
      {current}/{max} caracteres
    </p>
  );

  // Preview responsivo
  const PreviewContent = useMemo(() => (
    <InvoicePreview data={formData} />
  ), [formData]);

  return (
    <>
      <ToolPageSEO
        title="Gerador de Invoice 2026 — Crie Faturas Online Grátis"
        description="Faça invoice online grátis em minutos. 29 moedas, bilíngue PT/EN, download PDF instantâneo. Gerador de invoice profissional para freelancers e empresas."
        canonical="/conteudo/gerador-invoice"
      />
      
      <Header />
      
      <main id="main-content" className="min-h-screen bg-muted/30">
        {/* Hero Section - Estilo Abertura de Empresa */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-10">
              {/* Main Hero Grid */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <Badge variant="secondary" className="bg-zen-light-teal text-secondary px-4 py-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Ferramenta 100% gratuita
                  </Badge>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                    Gerador de Invoice Online:{" "}
                    <span className="text-gradient whitespace-nowrap">Crie Faturas Grátis</span>
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                    Gere invoices e faturas em minutos para operações nacionais e internacionais. 
                    Suporte a 29 moedas, bilíngue (PT/EN) e download em PDF.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="hero" size="xl" onClick={scrollToForm}>
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  {/* Google Reviews Badge */}
                  <a
                    href="https://g.page/r/CSe4RMezF61hEAI/review"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl hover:border-secondary/50 hover:shadow-card transition-all duration-300 group"
                  >
                    <GoogleLogo className="h-6 w-6" />
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {renderStars(Math.round(gmbStats?.average_rating || 5))}
                      </div>
                      <span className="font-bold text-foreground text-lg">
                        {gmbStats?.average_rating?.toFixed(1) || '5.0'}
                      </span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {gmbStats?.total_reviews || 0} avaliações no Google
                    </span>
                  </a>
                </motion.div>

                {/* Visual Mockup - Invoice Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative bg-card rounded-3xl shadow-card p-8 backdrop-blur border border-border/50">
                    {/* Invoice Header */}
                    <div className="bg-gradient-to-r from-secondary to-accent rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-secondary-foreground" />
                          <div>
                            <p className="font-bold text-secondary-foreground text-lg">INVOICE</p>
                            <p className="text-sm text-secondary-foreground/80">#INV-2024-001</p>
                          </div>
                        </div>
                        <Badge className="bg-secondary-foreground/20 text-secondary-foreground border-0">
                          Paga
                        </Badge>
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">De</p>
                          <p className="font-semibold text-foreground">Sua Empresa Ltda</p>
                          <p className="text-sm text-muted-foreground">contato@suaempresa.com</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground uppercase">Para</p>
                          <p className="font-semibold text-foreground">Acme Corporation</p>
                          <p className="text-sm text-muted-foreground">finance@acme.com</p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground uppercase mb-2">Serviço</p>
                        <p className="font-medium text-foreground">Consultoria em Desenvolvimento</p>
                        <p className="text-sm text-muted-foreground">Projeto de software personalizado</p>
                      </div>

                      {/* Amount Highlight */}
                      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Valor Total</p>
                          <p className="text-2xl font-bold text-secondary">$1,500.00</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground uppercase">Vencimento</p>
                          <p className="font-semibold text-foreground">15 Fev 2024</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t border-border/50 text-center">
                        <p className="text-xs text-muted-foreground">Gerado por</p>
                        <p className="text-sm font-semibold text-secondary">Contabilidade Zen</p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                  </div>
                </motion.div>
              </div>

              {/* Benefits Carousel - Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full"
              >
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[autoplayPlugin.current]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {invoiceBenefits.map((benefit, index) => (
                      <CarouselItem key={index} className="pl-4 basis-1/2 lg:basis-1/3">
                        <div className="flex items-center gap-4 bg-card border border-border/50 rounded-xl p-4 shadow-soft h-full">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center shrink-0">
                            <benefit.icon className="w-6 h-6 text-secondary-foreground" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-foreground">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Conteúdo Principal */}
        <section id="form-section" className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Coluna do Formulário */}
              <div className="space-y-8">
                {/* Tipo de Documento */}
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Tipo de Documento</h2>
                  <InvoiceDocumentTypeSelector
                    value={formData.documentType}
                    onChange={(value) => updateField("documentType", value)}
                  />
                </div>
                
                {/* Dados do Prestador */}
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-secondary" />
                    <h2 className="text-lg font-semibold">Seus Dados</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invoiceCode">
                        Código da {formData.documentType === "invoice" ? "Invoice" : "Fatura"}
                        <HelpTooltip content="Código opcional para seu controle interno (ex: INV-001)" />
                      </Label>
                      <Input
                        id="invoiceCode"
                        placeholder="Ex: INV-001"
                        value={formData.invoiceCode}
                        onChange={(e) => updateField("invoiceCode", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="providerName">
                        Nome / Razão Social <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="providerName"
                        placeholder="Razão social ou nome completo"
                        value={formData.providerName}
                        onChange={(e) => updateField("providerName", e.target.value)}
                        className={errors.providerName ? "border-destructive" : ""}
                      />
                      <FieldError error={errors.providerName} />
                    </div>
                    
                    <div>
                      <Label htmlFor="providerCnpj">CNPJ</Label>
                      <Input
                        id="providerCnpj"
                        placeholder="00.000.000/0000-00"
                        value={formData.providerCnpj}
                        onChange={(e) => updateField("providerCnpj", maskCnpj(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="providerAddress">Endereço</Label>
                      <Input
                        id="providerAddress"
                        placeholder="Rua, número, bairro, cidade - UF"
                        value={formData.providerAddress}
                        onChange={(e) => updateField("providerAddress", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="providerPhone">Telefone</Label>
                        <Input
                          id="providerPhone"
                          placeholder="(00) 00000-0000"
                          value={formData.providerPhone}
                          onChange={(e) => updateField("providerPhone", maskPhone(e.target.value))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="providerEmail">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="providerEmail"
                          type="email"
                          placeholder="seu@email.com.br"
                          value={formData.providerEmail}
                          onChange={(e) => updateField("providerEmail", e.target.value)}
                          className={errors.providerEmail ? "border-destructive" : ""}
                        />
                        <FieldError error={errors.providerEmail} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dados do Cliente */}
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-secondary" />
                    <h2 className="text-lg font-semibold">Dados do Cliente</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">
                        Nome do Cliente <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="clientName"
                        placeholder="Nome completo ou razão social"
                        value={formData.clientName}
                        onChange={(e) => updateField("clientName", e.target.value)}
                        className={errors.clientName ? "border-destructive" : ""}
                      />
                      <FieldError error={errors.clientName} />
                    </div>
                    
                    <div>
                      <Label htmlFor="clientDocument">CPF ou CNPJ</Label>
                      <Input
                        id="clientDocument"
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        value={formData.clientDocument}
                        onChange={(e) => updateField("clientDocument", maskCpfCnpj(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Informações Financeiras */}
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    <h2 className="text-lg font-semibold">Informações Financeiras</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currency">
                          Moeda <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => updateField("currency", value as CurrencyCode)}
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.code} - {currency.name} ({currency.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="amount">
                          Valor <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="amount"
                          type="text"
                          inputMode="decimal"
                          placeholder="0,00"
                          value={formData.amount}
                          onChange={(e) => updateField("amount", e.target.value)}
                          className={errors.amount ? "border-destructive" : ""}
                        />
                        <FieldError error={errors.amount} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="issueDate">
                          Data de Emissão <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={(e) => updateField("issueDate", e.target.value)}
                          className={errors.issueDate ? "border-destructive" : ""}
                        />
                        <FieldError error={errors.issueDate} />
                      </div>
                      
                      <div>
                        <Label htmlFor="dueDate">
                          Data de Vencimento <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => updateField("dueDate", e.target.value)}
                          min={formData.issueDate}
                          className={errors.dueDate ? "border-destructive" : ""}
                        />
                        <FieldError error={errors.dueDate} />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="serviceTitle">
                        Título do Serviço <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="serviceTitle"
                        placeholder="Ex: Consultoria Fiscal Mensal"
                        maxLength={100}
                        value={formData.serviceTitle}
                        onChange={(e) => updateField("serviceTitle", e.target.value)}
                        className={errors.serviceTitle ? "border-destructive" : ""}
                      />
                      <FieldError error={errors.serviceTitle} />
                    </div>
                    
                    <div>
                      <Label htmlFor="serviceDescription">
                        Descrição dos Serviços <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="serviceDescription"
                        placeholder="Descreva detalhadamente os serviços prestados..."
                        rows={4}
                        value={formData.serviceDescription}
                        onChange={(e) => updateField("serviceDescription", e.target.value)}
                        className={errors.serviceDescription ? "border-destructive" : ""}
                      />
                      <CharCounter current={formData.serviceDescription.length} max={1000} />
                      <FieldError error={errors.serviceDescription} />
                    </div>
                  </div>
                </div>
                
                {/* Dados Bancários (apenas para Invoice) */}
                {formData.documentType === "invoice" && (
                  <div className="bg-card rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-secondary" />
                      <h2 className="text-lg font-semibold">Dados Bancários Internacionais</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Opcional - Para facilitar pagamentos internacionais
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="swiftCode">
                          Código SWIFT/BIC
                          <HelpTooltip content="Código de 8 ou 11 caracteres usado para transferências internacionais (ex: BOFAUS3N)" />
                        </Label>
                        <Input
                          id="swiftCode"
                          placeholder="Ex: BOFAUS3N"
                          maxLength={11}
                          value={formData.swiftCode}
                          onChange={(e) => updateField("swiftCode", e.target.value.toUpperCase())}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ibanCode">
                          Código IBAN
                          <HelpTooltip content="Número internacional de conta bancária, até 34 caracteres (ex: BR1234567890123456789012345678)" />
                        </Label>
                        <Input
                          id="ibanCode"
                          placeholder="Ex: BR1234567890123456789012345678"
                          maxLength={34}
                          value={formData.ibanCode}
                          onChange={(e) => updateField("ibanCode", e.target.value.toUpperCase())}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tema Visual e Idioma */}
                <div className="bg-card rounded-xl p-6 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="h-5 w-5 text-secondary" />
                      <h2 className="text-lg font-semibold">Escolha o Tema</h2>
                    </div>
                    
                    <InvoiceThemeSelector
                      value={formData.theme}
                      onChange={(value) => updateField("theme", value)}
                    />
                  </div>
                  
                  <div className="border-t border-border pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold">Idioma do Documento</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Escolha o idioma dos labels na invoice/fatura gerada
                    </p>
                    
                    <InvoiceLanguageSelector
                      value={formData.language}
                      onChange={(value) => updateField("language", value)}
                    />
                  </div>
                </div>
                
                {/* Consentimento e Ação */}
                <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acceptMarketing"
                      checked={formData.acceptMarketing}
                      onCheckedChange={(checked) => updateField("acceptMarketing", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="acceptMarketing"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Aceito receber informações sobre contabilidade e planejamento tributário
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Você pode cancelar a qualquer momento
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Ao gerar o documento, você concorda com nossos{" "}
                    <a href="/termos" target="_blank" className="text-secondary hover:underline">
                      Termos de Uso
                    </a>{" "}
                    e{" "}
                    <a href="/politica-de-privacidade" target="_blank" className="text-secondary hover:underline">
                      Política de Privacidade
                    </a>
                  </p>
                  
                  <Button
                    onClick={generatePdf}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Gerando documento...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Gerar e Baixar {formData.documentType === "invoice" ? "Invoice" : "Fatura"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Coluna do Preview */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Visualização em tempo real</h3>
                  {PreviewContent}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mobile Preview Button */}
        {isMobile && (
          <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="lg"
                className="fixed bottom-20 right-4 z-40 shadow-lg"
              >
                <Eye className="h-5 w-5 mr-2" />
                Ver Preview
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Visualização do Documento</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                {PreviewContent}
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {/* CTA Section */}
        <section className="py-12 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Precisa de ajuda com sua contabilidade?
              </h2>
              <p className="text-muted-foreground mb-6">
                A Contabilidade Zen é especializada em profissionais e empresas que trabalham com 
                exportação de serviços, operações internacionais e gestão tributária complexa.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center gap-2 justify-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Economize até 50% em impostos</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Suporte via WhatsApp</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Operações internacionais</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Primeira consultoria gratuita</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="whatsapp" size="lg">
                  <a
                    href={getWhatsAppLink(WHATSAPP_MESSAGES.invoice)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Falar com Especialista
                  </a>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <a href="/conteudo/calculadora-pj-clt">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calcular Minha Economia
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
