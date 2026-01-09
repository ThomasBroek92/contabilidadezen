import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Calculator, AlertTriangle, User, Building2, Download, RefreshCw, Printer } from "lucide-react";
import jsPDF from "jspdf";
import logoFull from "@/assets/logo-full.png";
import { useLeadCapture } from "@/hooks/use-lead-capture";

// Tabela IRRF 2026 - Atualizada conforme legislação vigente
// Fonte: Receita Federal (janeiro/2026)
const IRRF_TABLE_2026 = [
  { min: 0, max: 2428.80, rate: 0, deduction: 0 },
  { min: 2428.81, max: 2826.65, rate: 0.075, deduction: 182.16 },
  { min: 2826.66, max: 3751.05, rate: 0.15, deduction: 394.16 },
  { min: 3751.06, max: 4664.68, rate: 0.225, deduction: 675.49 },
  { min: 4664.69, max: Infinity, rate: 0.275, deduction: 908.73 },
];

// Parâmetros da redução adicional do IR 2026 (isenção até R$ 5.000)
const IRRF_REDUCAO_2026 = {
  limiteIsencaoTotal: 5000.00, // Renda até R$ 5.000 = isenção total
  limiteReducaoGradual: 7350.00, // Renda até R$ 7.350 = redução gradual
  valorMaximoReducao: 312.89, // Redução máxima para quem ganha até R$ 5.000
  fatorReducao: 0.133145, // Fator para cálculo da redução gradual
  valorBaseReducao: 978.62, // Valor base para fórmula: 978,62 - (0,133145 × renda)
};

// Teto INSS 2026 (valores atualizados)
const INSS_TETO_2026 = 8502.27;
const INSS_CONTRIBUICAO_MAXIMA = 935.25;
const INSS_ALIQUOTA_AUTONOMO = 0.11;

interface DadosPrestador {
  nome: string;
  cpf: string;
  nit: string;
  endereco: string;
  telefone: string;
  email: string;
}

interface DadosContratante {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
}

interface DadosServico {
  descricao: string;
  valorBruto: number;
}

interface ResultadoRPA {
  valorBruto: number;
  inss: number;
  baseIRRF: number;
  irrf: number;
  totalDescontos: number;
  valorLiquido: number;
}

export default function GeradorRPA() {
  const [step, setStep] = useState(1);
  const [prestador, setPrestador] = useState<DadosPrestador>({
    nome: "",
    cpf: "",
    nit: "",
    endereco: "",
    telefone: "",
    email: "",
  });
  const [contratante, setContratante] = useState<DadosContratante>({
    razaoSocial: "",
    cnpj: "",
    endereco: "",
  });
  const [servico, setServico] = useState<DadosServico>({
    descricao: "",
    valorBruto: 0,
  });
  const [resultado, setResultado] = useState<ResultadoRPA | null>(null);
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split("T")[0]);
  
  const { saveLead } = useLeadCapture();

  // Save lead when step 1 is completed (prestador data collected)
  useEffect(() => {
    if (step === 2 && prestador.nome && prestador.email && prestador.telefone) {
      saveLead({
        nome: prestador.nome,
        email: prestador.email,
        whatsapp: prestador.telefone,
        segmento: "RPA - Autônomo",
        fonte: "Gerador de RPA",
        faturamento_mensal: servico.valorBruto > 0 ? servico.valorBruto : undefined,
      });
    }
  }, [step]);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 14);
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const calcularINSS = (valorBruto: number): number => {
    const baseCalculo = Math.min(valorBruto, INSS_TETO_2026);
    const contribuicao = baseCalculo * INSS_ALIQUOTA_AUTONOMO;
    return Math.min(contribuicao, INSS_CONTRIBUICAO_MAXIMA);
  };

  // Cálculo do IRRF com a nova legislação 2026
  // Inclui redução adicional para rendas até R$ 7.350
  const calcularIRRF = (baseCalculo: number): number => {
    // Primeiro, calcula o imposto pela tabela tradicional
    let impostoTabela = 0;
    for (const faixa of IRRF_TABLE_2026) {
      if (baseCalculo >= faixa.min && baseCalculo <= faixa.max) {
        impostoTabela = Math.max(0, baseCalculo * faixa.rate - faixa.deduction);
        break;
      }
    }

    // Aplica a redução adicional da legislação 2026
    let reducao = 0;
    
    if (baseCalculo <= IRRF_REDUCAO_2026.limiteIsencaoTotal) {
      // Renda até R$ 5.000: isenção total (redução de até R$ 312,89 ou o que for necessário para zerar)
      reducao = Math.min(impostoTabela, IRRF_REDUCAO_2026.valorMaximoReducao);
    } else if (baseCalculo <= IRRF_REDUCAO_2026.limiteReducaoGradual) {
      // Renda entre R$ 5.000,01 e R$ 7.350: redução gradual
      // Fórmula: R$ 978,62 - (0,133145 × renda mensal)
      reducao = Math.max(0, IRRF_REDUCAO_2026.valorBaseReducao - (IRRF_REDUCAO_2026.fatorReducao * baseCalculo));
    }
    // Acima de R$ 7.350: sem redução adicional

    return Math.max(0, impostoTabela - reducao);
  };

  const calcularRPA = () => {
    const valorBruto = servico.valorBruto;
    const inss = calcularINSS(valorBruto);
    const baseIRRF = valorBruto - inss;
    const irrf = calcularIRRF(baseIRRF);
    const totalDescontos = inss + irrf;
    const valorLiquido = valorBruto - totalDescontos;

    setResultado({
      valorBruto,
      inss,
      baseIRRF,
      irrf,
      totalDescontos,
      valorLiquido,
    });
  };

  const validarStep1 = (): boolean => {
    if (!prestador.nome.trim()) {
      toast.error("Nome completo do prestador é obrigatório");
      return false;
    }
    if (!prestador.telefone.trim()) {
      toast.error("Telefone do prestador é obrigatório");
      return false;
    }
    if (!prestador.email.trim() || !prestador.email.includes("@")) {
      toast.error("E-mail válido do prestador é obrigatório");
      return false;
    }
    if (!prestador.cpf.trim() || prestador.cpf.replace(/\D/g, "").length !== 11) {
      toast.error("CPF válido do prestador é obrigatório");
      return false;
    }
    return true;
  };

  const validarStep2 = (): boolean => {
    if (!contratante.razaoSocial.trim()) {
      toast.error("Razão social do contratante é obrigatória");
      return false;
    }
    if (!contratante.cnpj.trim() || contratante.cnpj.replace(/\D/g, "").length !== 14) {
      toast.error("CNPJ válido do contratante é obrigatório");
      return false;
    }
    return true;
  };

  const validarStep3 = (): boolean => {
    if (!servico.descricao.trim()) {
      toast.error("Descrição do serviço é obrigatória");
      return false;
    }
    if (servico.valorBruto <= 0) {
      toast.error("Valor do serviço deve ser maior que zero");
      return false;
    }
    return true;
  };

  const avancarStep = () => {
    if (step === 1 && validarStep1()) setStep(2);
    else if (step === 2 && validarStep2()) setStep(3);
    else if (step === 3 && validarStep3()) {
      calcularRPA();
      setStep(4);
    }
  };

  const imprimirRPA = () => {
    window.print();
  };

  const exportarPDF = async () => {
    if (!resultado) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 15;

    // Helper function for text
    const addText = (text: string, x: number, yPos: number, options?: { fontSize?: number; fontStyle?: "normal" | "bold"; align?: "left" | "center" | "right" }) => {
      doc.setFontSize(options?.fontSize || 10);
      doc.setFont("helvetica", options?.fontStyle || "normal");
      if (options?.align === "center") {
        doc.text(text, pageWidth / 2, yPos, { align: "center" });
      } else if (options?.align === "right") {
        doc.text(text, pageWidth - margin, yPos, { align: "right" });
      } else {
        doc.text(text, x, yPos);
      }
    };

    // Add Logo
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = logoFull;
      });
      
      // Calculate logo dimensions (max height 15mm, maintain aspect ratio)
      const maxHeight = 15;
      const aspectRatio = img.width / img.height;
      const logoHeight = maxHeight;
      const logoWidth = logoHeight * aspectRatio;
      
      doc.addImage(img, "PNG", margin, y, logoWidth, logoHeight);
      y += logoHeight + 5;
    } catch {
      // If logo fails to load, just continue without it
      y += 5;
    }

    // Title
    addText("RECIBO DE PAGAMENTO A AUTÔNOMO - RPA", margin, y, { fontSize: 16, fontStyle: "bold", align: "center" });
    y += 8;
    addText(`Data de Emissão: ${new Date(dataEmissao).toLocaleDateString("pt-BR")}`, margin, y, { fontSize: 10, align: "center" });
    y += 15;

    // Contratante Section
    doc.setDrawColor(200);
    doc.rect(margin, y, pageWidth - 2 * margin, 35);
    y += 8;
    addText("CONTRATANTE (PAGADOR)", margin + 5, y, { fontSize: 11, fontStyle: "bold" });
    y += 7;
    addText(`Razão Social: ${contratante.razaoSocial}`, margin + 5, y);
    y += 6;
    addText(`CNPJ: ${contratante.cnpj}`, margin + 5, y);
    if (contratante.endereco) {
      y += 6;
      addText(`Endereço: ${contratante.endereco}`, margin + 5, y);
    }
    y += 20;

    // Prestador Section
    doc.rect(margin, y, pageWidth - 2 * margin, 50);
    y += 8;
    addText("PRESTADOR (RECEBEDOR)", margin + 5, y, { fontSize: 11, fontStyle: "bold" });
    y += 7;
    addText(`Nome: ${prestador.nome}`, margin + 5, y);
    y += 6;
    addText(`CPF: ${prestador.cpf}`, margin + 5, y);
    if (prestador.nit) {
      y += 6;
      addText(`NIT/PIS: ${prestador.nit}`, margin + 5, y);
    }
    y += 6;
    addText(`Telefone: ${prestador.telefone}`, margin + 5, y);
    y += 6;
    addText(`E-mail: ${prestador.email}`, margin + 5, y);
    if (prestador.endereco) {
      y += 6;
      addText(`Endereço: ${prestador.endereco}`, margin + 5, y);
    }
    y += 20;

    // Serviço Section
    const descricaoLines = doc.splitTextToSize(servico.descricao, pageWidth - 2 * margin - 10);
    const servicoHeight = Math.max(25, descricaoLines.length * 5 + 15);
    doc.rect(margin, y, pageWidth - 2 * margin, servicoHeight);
    y += 8;
    addText("DESCRIÇÃO DO SERVIÇO", margin + 5, y, { fontSize: 11, fontStyle: "bold" });
    y += 7;
    doc.setFontSize(10);
    doc.text(descricaoLines, margin + 5, y);
    y += servicoHeight - 5;

    // Valores Section
    doc.rect(margin, y, pageWidth - 2 * margin, 55);
    y += 8;
    addText("VALORES E DESCONTOS", margin + 5, y, { fontSize: 11, fontStyle: "bold" });
    y += 10;

    const addValueRow = (label: string, value: string, isNegative?: boolean, isBold?: boolean) => {
      addText(label, margin + 5, y, { fontStyle: isBold ? "bold" : "normal" });
      addText(value, margin, y, { align: "right", fontStyle: isBold ? "bold" : "normal" });
      y += 7;
    };

    addValueRow("Valor Bruto do Serviço", formatCurrency(resultado.valorBruto));
    addValueRow("(-) INSS (11%)", formatCurrency(resultado.inss), true);
    addValueRow("(-) IRRF", formatCurrency(resultado.irrf), true);
    y += 3;
    doc.setLineWidth(0.5);
    doc.line(margin + 5, y, pageWidth - margin - 5, y);
    y += 7;
    addValueRow("VALOR LÍQUIDO A RECEBER", formatCurrency(resultado.valorLiquido), false, true);
    y += 25;

    // Assinaturas
    const sigY = y + 10;
    doc.line(margin + 10, sigY, margin + 70, sigY);
    addText("Assinatura do Contratante", margin + 15, sigY + 5, { fontSize: 9 });
    
    doc.line(pageWidth - margin - 70, sigY, pageWidth - margin - 10, sigY);
    addText("Assinatura do Prestador", pageWidth - margin - 65, sigY + 5, { fontSize: 9 });

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text("Documento gerado por Contabilidade Zen - www.contabilidadezen.com.br", pageWidth / 2, y, { align: "center" });

    // Save
    const fileName = `RPA_${prestador.nome.replace(/\s+/g, "_")}_${new Date(dataEmissao).toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
    toast.success("PDF exportado com sucesso!");
  };

  const resetarFormulario = () => {
    setPrestador({ nome: "", cpf: "", nit: "", endereco: "", telefone: "", email: "" });
    setContratante({ razaoSocial: "", cnpj: "", endereco: "" });
    setServico({ descricao: "", valorBruto: 0 });
    setResultado(null);
    setStep(1);
    toast.success("Formulário resetado com sucesso!");
  };

  return (
    <>
      <Helmet>
        <title>Gerador de RPA 2026 - Recibo de Pagamento a Autônomo | Contabilidade Zen</title>
        <meta
          name="description"
          content="Gere RPA (Recibo de Pagamento a Autônomo) com cálculo automático de INSS e IRRF. Ferramenta gratuita atualizada com a nova legislação tributária 2026, incluindo isenção para quem ganha até R$ 5.000."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <FileText className="w-3 h-3 mr-1" />
              Ferramenta Gratuita
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Gerador de RPA 2026
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recibo de Pagamento a Autônomo com cálculo automático de impostos.
              Atualizado com a <strong>nova legislação tributária 2026</strong>, incluindo isenção total para rendas até R$ 5.000.
            </p>
          </div>

          {/* Aviso Legal */}
          <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
            <CardContent className="flex items-start gap-4 pt-6">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-600 mb-1">Aviso Importante</h3>
                <p className="text-sm text-muted-foreground">
                  O RPA deve ser utilizado apenas para serviços <strong>esporádicos</strong> prestados por pessoas físicas.
                  Caso haja subordinação, horário fixo ou habitualidade, a relação pode configurar vínculo empregatício (CLT),
                  gerando riscos jurídicos para a empresa contratante.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Steps Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-12 h-1 ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Step 1: Dados do Prestador */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Dados do Prestador de Serviço
                  </CardTitle>
                  <CardDescription>
                    Informações do profissional autônomo que receberá o pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={prestador.nome}
                        onChange={(e) => setPrestador({ ...prestador, nome: e.target.value })}
                        placeholder="Nome completo do prestador"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={prestador.cpf}
                        onChange={(e) => setPrestador({ ...prestador, cpf: formatCPF(e.target.value) })}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nit">NIT/PIS</Label>
                      <Input
                        id="nit"
                        value={prestador.nit}
                        onChange={(e) => setPrestador({ ...prestador, nit: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                        placeholder="Número do NIT/PIS"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={prestador.telefone}
                        onChange={(e) => setPrestador({ ...prestador, telefone: formatPhone(e.target.value) })}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={prestador.email}
                        onChange={(e) => setPrestador({ ...prestador, email: e.target.value })}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="endereco-prestador">Endereço Completo</Label>
                      <Input
                        id="endereco-prestador"
                        value={prestador.endereco}
                        onChange={(e) => setPrestador({ ...prestador, endereco: e.target.value })}
                        placeholder="Rua, número, bairro, cidade - UF"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={avancarStep}>Continuar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Dados do Contratante */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Dados do Contratante
                  </CardTitle>
                  <CardDescription>
                    Informações da empresa que está contratando o serviço
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="razao-social">Razão Social *</Label>
                      <Input
                        id="razao-social"
                        value={contratante.razaoSocial}
                        onChange={(e) => setContratante({ ...contratante, razaoSocial: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input
                        id="cnpj"
                        value={contratante.cnpj}
                        onChange={(e) => setContratante({ ...contratante, cnpj: formatCNPJ(e.target.value) })}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="endereco-contratante">Endereço</Label>
                      <Input
                        id="endereco-contratante"
                        value={contratante.endereco}
                        onChange={(e) => setContratante({ ...contratante, endereco: e.target.value })}
                        placeholder="Rua, número, bairro, cidade - UF"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                    <Button onClick={avancarStep}>Continuar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Dados do Serviço */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Dados do Serviço
                  </CardTitle>
                  <CardDescription>
                    Descrição e valores do serviço prestado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="descricao">Descrição do Serviço *</Label>
                    <Textarea
                      id="descricao"
                      value={servico.descricao}
                      onChange={(e) => setServico({ ...servico, descricao: e.target.value })}
                      placeholder="Descreva detalhadamente o serviço prestado..."
                      rows={4}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valor-bruto">Valor Bruto (R$) *</Label>
                      <Input
                        id="valor-bruto"
                        type="number"
                        min="0"
                        step="0.01"
                        value={servico.valorBruto || ""}
                        onChange={(e) => setServico({ ...servico, valorBruto: parseFloat(e.target.value) || 0 })}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="data-emissao">Data de Emissão</Label>
                      <Input
                        id="data-emissao"
                        type="date"
                        value={dataEmissao}
                        onChange={(e) => setDataEmissao(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                    <Button onClick={avancarStep}>Calcular e Gerar RPA</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: RPA Gerado */}
            {step === 4 && resultado && (
              <div className="space-y-6">
                {/* Resumo dos Cálculos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Resumo dos Cálculos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valor Bruto:</span>
                          <span className="font-medium">{formatCurrency(resultado.valorBruto)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-destructive">
                          <span>INSS (11%):</span>
                          <span>- {formatCurrency(resultado.inss)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-sm">
                          <span>Base IRRF:</span>
                          <span>{formatCurrency(resultado.baseIRRF)}</span>
                        </div>
                        <div className="flex justify-between text-destructive">
                          <span>IRRF:</span>
                          <span>- {formatCurrency(resultado.irrf)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Valor Líquido:</span>
                          <span className="text-primary">{formatCurrency(resultado.valorLiquido)}</span>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Informações dos Cálculos (2026)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• INSS: 11% sobre valor bruto (teto R$ 8.502,27)</li>
                          <li>• IRRF: Tabela progressiva sobre base (após INSS)</li>
                          <li>• Isenção IRRF: até R$ 2.428,80 pela tabela base</li>
                          <li>• <strong>Isenção total: renda até R$ 5.000</strong></li>
                          <li>• Redução gradual: renda até R$ 7.350</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* RPA para Impressão */}
                <Card className="print:shadow-none print:border-2" id="rpa-document">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold">RECIBO DE PAGAMENTO A AUTÔNOMO - RPA</h2>
                      <p className="text-sm text-muted-foreground">Data de Emissão: {new Date(dataEmissao).toLocaleDateString("pt-BR")}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-primary">CONTRATANTE (PAGADOR)</h3>
                        <p><strong>Razão Social:</strong> {contratante.razaoSocial}</p>
                        <p><strong>CNPJ:</strong> {contratante.cnpj}</p>
                        {contratante.endereco && <p><strong>Endereço:</strong> {contratante.endereco}</p>}
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-primary">PRESTADOR (RECEBEDOR)</h3>
                        <p><strong>Nome:</strong> {prestador.nome}</p>
                        <p><strong>CPF:</strong> {prestador.cpf}</p>
                        {prestador.nit && <p><strong>NIT/PIS:</strong> {prestador.nit}</p>}
                        <p><strong>Telefone:</strong> {prestador.telefone}</p>
                        <p><strong>E-mail:</strong> {prestador.email}</p>
                        {prestador.endereco && <p><strong>Endereço:</strong> {prestador.endereco}</p>}
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 mb-6">
                      <h3 className="font-semibold mb-2 text-primary">DESCRIÇÃO DO SERVIÇO</h3>
                      <p className="whitespace-pre-wrap">{servico.descricao}</p>
                    </div>

                    <div className="border rounded-lg p-4 mb-6">
                      <h3 className="font-semibold mb-3 text-primary">VALORES E DESCONTOS</h3>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">Valor Bruto do Serviço</td>
                            <td className="py-2 text-right font-medium">{formatCurrency(resultado.valorBruto)}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">(-) INSS (11%)</td>
                            <td className="py-2 text-right text-destructive">{formatCurrency(resultado.inss)}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">(-) IRRF</td>
                            <td className="py-2 text-right text-destructive">{formatCurrency(resultado.irrf)}</td>
                          </tr>
                          <tr className="font-bold text-lg">
                            <td className="py-3">VALOR LÍQUIDO A RECEBER</td>
                            <td className="py-3 text-right text-primary">{formatCurrency(resultado.valorLiquido)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-8 pt-6 border-t">
                      <div className="text-center">
                        <div className="border-t border-foreground w-48 mx-auto mb-2 pt-2" />
                        <p className="text-sm">Assinatura do Contratante</p>
                      </div>
                      <div className="text-center">
                        <div className="border-t border-foreground w-48 mx-auto mb-2 pt-2" />
                        <p className="text-sm">Assinatura do Prestador</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Voltar e Editar
                  </Button>
                  <Button variant="outline" onClick={resetarFormulario}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Novo RPA
                  </Button>
                  <Button variant="outline" onClick={imprimirRPA}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button onClick={exportarPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Explicação */}
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {/* Nova Legislação 2026 */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Nova Tabela do IR 2026
                </CardTitle>
                <CardDescription>
                  Atualizada conforme legislação em vigor desde 1º de janeiro de 2026
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  A <strong>nova tabela do Imposto de Renda 2026</strong> trouxe importantes mudanças para milhões de contribuintes:
                </p>
                <ul>
                  <li><strong>Isenção total</strong> para rendas até <strong>R$ 5.000/mês</strong></li>
                  <li><strong>Redução gradual</strong> do imposto para rendas entre R$ 5.000,01 e R$ 7.350</li>
                  <li>Acima de R$ 7.350, a tabela progressiva tradicional é aplicada</li>
                </ul>
                <h4 className="font-semibold text-foreground mt-4">Tabela IRRF Mensal 2026</h4>
                <div className="overflow-x-auto">
                  <table className="text-sm w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Base de Cálculo</th>
                        <th className="text-left py-2">Alíquota</th>
                        <th className="text-left py-2">Dedução</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Até R$ 2.428,80</td>
                        <td className="py-2">Isento</td>
                        <td className="py-2">-</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">R$ 2.428,81 a R$ 2.826,65</td>
                        <td className="py-2">7,5%</td>
                        <td className="py-2">R$ 182,16</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">R$ 2.826,66 a R$ 3.751,05</td>
                        <td className="py-2">15%</td>
                        <td className="py-2">R$ 394,16</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">R$ 3.751,06 a R$ 4.664,68</td>
                        <td className="py-2">22,5%</td>
                        <td className="py-2">R$ 675,49</td>
                      </tr>
                      <tr>
                        <td className="py-2">Acima de R$ 4.664,68</td>
                        <td className="py-2">27,5%</td>
                        <td className="py-2">R$ 908,73</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs mt-2">
                  <strong>Fonte:</strong> Receita Federal do Brasil (janeiro/2026)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>O que é o RPA?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  O <strong>RPA (Recibo de Pagamento a Autônomo)</strong> é um documento utilizado para formalizar 
                  o pagamento de serviços esporádicos prestados por pessoas físicas sem vínculo empregatício.
                </p>
                <p>
                  <strong>Analogia:</strong> Imagine que o RPA é como um "ingresso de cinema" para um serviço único: 
                  ele comprova que você entrou (prestou o serviço) e pagou pelo acesso (impostos), mas não lhe dá 
                  o direito de morar no cinema (vínculo empregatício permanente).
                </p>
                <h4 className="font-semibold text-foreground mt-4">Quando usar o RPA?</h4>
                <ul>
                  <li>Serviços esporádicos e pontuais</li>
                  <li>Prestador sem vínculo empregatício</li>
                  <li>Autônomos que prestam serviços a empresas</li>
                </ul>
                <h4 className="font-semibold text-foreground mt-4">Quando NÃO usar o RPA?</h4>
                <ul>
                  <li>Serviços com habitualidade (frequentes/regulares)</li>
                  <li>Relações com subordinação hierárquica</li>
                  <li>Horário fixo de trabalho definido pelo contratante</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #rpa-document, #rpa-document * {
            visibility: visible;
          }
          #rpa-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
