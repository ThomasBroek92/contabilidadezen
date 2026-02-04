import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  CheckCircle,
  X,
  ArrowRight,
  Building2,
  User,
  TrendingUp,
  HelpCircle,
  Zap,
  FileText,
  CreditCard,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { toast } from "sonner";
import { triggerWhatsAppEmphasis } from "@/components/FloatingWhatsApp";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

// Tabela INSS 2024 (para cálculo CLT)
const INSS_FAIXAS = [
  { limite: 1412.00, aliquota: 0.075 },
  { limite: 2666.68, aliquota: 0.09 },
  { limite: 4000.03, aliquota: 0.12 },
  { limite: 7786.02, aliquota: 0.14 },
];

// Tabela IRRF 2024
const IRRF_FAIXAS = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

// Custo contabilidade
const CONTABILIDADE_MENSAL = 297.90;

interface ResultadoCalculoCLT {
  // CLT
  salarioBrutoCLT: number;
  inssCLT: number;
  irrfCLT: number;
  salarioLiquidoCLT: number;
  feriasMensal: number;
  decimoTerceiroMensal: number;
  fgtsMensal: number;
  beneficiosTotais: number;
  totalMensalCLT: number;
  totalAnualCLT: number;
  
  // PJ
  faturamentoPJ: number;
  impostosPJ: number;
  inssPJ: number;
  contabilidade: number;
  salarioLiquidoPJ: number;
  totalAnualPJ: number;
  
  // Economia
  economiaMensal: number;
  economiaAnual: number;
  percentualEconomia: number;
}

const vantagensPJ = [
  { icon: TrendingUp, title: "Impostos reduzidos", description: "a partir de 6% no Simples Nacional" },
  { icon: Zap, title: "Fator R", description: "profissionais da saúde podem pagar menos ainda" },
  { icon: FileText, title: "Nota Fiscal", description: "mais credibilidade com clientes e convênios" },
  { icon: CreditCard, title: "Conta PJ", description: "acesso a linhas de crédito melhores" },
];

const desvantagensCLT = [
  { text: "INSS progressivo: até 14% do rendimento bruto" },
  { text: "IRRF progressivo: até 27,5% sobre o salário" },
  { text: "Menor flexibilidade: horários e local fixos" },
  { text: "Limite salarial: teto definido pela empresa" },
];

export function PJCalculatorSection() {
  const [salarioBruto, setSalarioBruto] = useState("");
  const [valeRefeicao, setValeRefeicao] = useState("");
  const [valeTransporte, setValeTransporte] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");
  const [outrosBeneficios, setOutrosBeneficios] = useState("");
  const [resultado, setResultado] = useState<ResultadoCalculoCLT | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasTriggeredEmphasis, setHasTriggeredEmphasis] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Ref for scroll-triggered emphasis
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // Trigger WhatsApp emphasis when calculator section comes into view
  useEffect(() => {
    if (isInView && !hasTriggeredEmphasis) {
      const timer = setTimeout(() => {
        triggerWhatsAppEmphasis();
        setHasTriggeredEmphasis(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasTriggeredEmphasis]);
  
  // Lead capture
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const { saveLead } = useLeadCapture();

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (numericValue === "") {
      setter("");
      return;
    }
    const number = parseInt(numericValue, 10) / 100;
    setter(number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
  };

  const calcularINSS = (salario: number): number => {
    let inss = 0;
    let salarioRestante = salario;
    let faixaAnterior = 0;
    for (const faixa of INSS_FAIXAS) {
      if (salarioRestante <= 0) break;
      const baseCalculo = Math.min(salarioRestante, faixa.limite - faixaAnterior);
      inss += baseCalculo * faixa.aliquota;
      salarioRestante -= baseCalculo;
      faixaAnterior = faixa.limite;
    }
    return inss;
  };

  const calcularIRRF = (salario: number, inss: number): number => {
    const baseCalculo = salario - inss;
    for (const faixa of IRRF_FAIXAS) {
      if (baseCalculo <= faixa.limite) {
        return Math.max(0, baseCalculo * faixa.aliquota - faixa.deducao);
      }
    }
    return 0;
  };

  const calcular = () => {
    setFormError("");
    const salario = parseCurrency(salarioBruto);
    
    // Validação: salário mínimo R$ 1.412
    if (salario < 1412) {
      setFormError("O salário bruto deve ser no mínimo R$ 1.412,00 (salário mínimo 2024)");
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      const vr = parseCurrency(valeRefeicao);
      const vt = parseCurrency(valeTransporte);
      const ps = parseCurrency(planoSaude);
      const outros = parseCurrency(outrosBeneficios);

      // Cálculos CLT
      const inssCLT = calcularINSS(salario);
      const irrfCLT = calcularIRRF(salario, inssCLT);
      const salarioLiquidoCLT = salario - inssCLT - irrfCLT;
      
      // Benefícios CLT anualizados (divididos por 12 para mensal equivalente)
      const feriasMensal = (salario / 12) + (salario / 12 * 0.3333); // 1/12 férias + 1/3
      const decimoTerceiroMensal = salario / 12; // 1/12 do 13º
      const fgtsMensal = salario * 0.08; // 8% FGTS
      
      const beneficiosTotais = vr + vt + ps + outros;
      
      // Total mensal CLT = líquido + benefícios trabalhistas mensalizados + benefícios informados
      const totalMensalCLT = salarioLiquidoCLT + feriasMensal + decimoTerceiroMensal + fgtsMensal + beneficiosTotais;
      const totalAnualCLT = totalMensalCLT * 12;

      // Cálculos PJ - comparação justa (mesma base de faturamento)
      // Faturamento PJ = mesmo valor do salário bruto CLT informado
      const faturamentoPJ = salario;
      
      // Simples Nacional com Fator R (alíquota efetiva ~6%)
      const aliquotaSimples = 0.06;
      const proLabore = 1412; // 1 salário mínimo
      const inssPJ = proLabore * 0.11;
      const contabilidade = CONTABILIDADE_MENSAL;
      
      const impostosPJ = faturamentoPJ * aliquotaSimples;
      const salarioLiquidoPJ = faturamentoPJ - impostosPJ - inssPJ - contabilidade;
      const totalAnualPJ = salarioLiquidoPJ * 12;

      // Economia ao migrar para PJ
      const economiaMensal = salarioLiquidoPJ - totalMensalCLT;
      const economiaAnual = totalAnualPJ - totalAnualCLT;
      const percentualEconomia = totalMensalCLT > 0 ? ((salarioLiquidoPJ / totalMensalCLT) - 1) * 100 : 0;

      setResultado({
        salarioBrutoCLT: salario,
        inssCLT,
        irrfCLT,
        salarioLiquidoCLT,
        feriasMensal,
        decimoTerceiroMensal,
        fgtsMensal,
        beneficiosTotais,
        totalMensalCLT,
        totalAnualCLT,
        faturamentoPJ,
        impostosPJ,
        inssPJ,
        contabilidade,
        salarioLiquidoPJ,
        totalAnualPJ,
        economiaMensal,
        economiaAnual,
        percentualEconomia,
      });

      setShowLeadForm(true);
      setIsCalculating(false);
    }, 600);
  };

  const handleLeadSubmit = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      toast.error("Preencha todos os campos para ver o resultado");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Informe um e-mail válido");
      return;
    }

    const saved = await saveLead({
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: telefone.trim(),
      segmento: "CLT x PJ",
      fonte: "Calculadora Homepage",
      faturamento_mensal: parseCurrency(salarioBruto),
      economia_anual: resultado?.economiaAnual,
    });

    if (saved) {
      setLeadSubmitted(true);
      toast.success("Pronto! Veja sua economia abaixo.");
    }
  };

  const whatsappMessage = resultado
    ? `Olá! Usei a calculadora CLT x PJ e descobri que posso economizar ${formatCurrency(resultado.economiaAnual)} por ano abrindo uma empresa. Quero saber mais!`
    : WHATSAPP_MESSAGES.abrirEmpresa;

  const whatsappLink = getWhatsAppLink(whatsappMessage);

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            CALCULADORA GRATUITA
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            Calculadora CLT x PJ
            <span className="text-secondary">.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubra <strong className="text-foreground">quanto você pode economizar</strong> migrando de CLT para PJ.
            Compare impostos, benefícios e veja a economia real entre o regime de carteira assinada 
            e abrir sua própria empresa.
          </p>
        </motion.div>

        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <Card className="border-border shadow-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-foreground text-center mb-6">
                Informe seus rendimentos atuais como CLT:
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-1">
                  <Label className="text-foreground font-medium">Salário bruto mensal (CLT):</Label>
                  <Input
                    placeholder="R$ 0,00"
                    value={salarioBruto}
                    onChange={(e) => handleInputChange(setSalarioBruto, e.target.value)}
                    className={`mt-1 ${formError ? "border-destructive" : ""}`}
                  />
                  {formError && (
                    <p className="text-xs text-destructive mt-1">{formError}</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Vale-refeição/alimentação (opcional):</Label>
                  <Input
                    placeholder="R$ 0,00"
                    value={valeRefeicao}
                    onChange={(e) => handleInputChange(setValeRefeicao, e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Vale-transporte (opcional):</Label>
                  <Input
                    placeholder="R$ 0,00"
                    value={valeTransporte}
                    onChange={(e) => handleInputChange(setValeTransporte, e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-muted-foreground text-sm">Plano de saúde (opcional):</Label>
                  <Input
                    placeholder="R$ 0,00"
                    value={planoSaude}
                    onChange={(e) => handleInputChange(setPlanoSaude, e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Label className="text-muted-foreground text-sm">Outros benefícios (opcional):</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Inclua aqui outros benefícios como academia, cursos, etc.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    placeholder="R$ 0,00"
                    value={outrosBeneficios}
                    onChange={(e) => handleInputChange(setOutrosBeneficios, e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mb-4">
                Ao utilizar esta ferramenta, você declara estar ciente de que os valores são estimativas e concorda com nossa{" "}
                <Link to="/politica-de-privacidade" className="text-secondary hover:underline">Política de Privacidade</Link>{" "}
                e <Link to="/termos" className="text-secondary hover:underline">Termos de Uso</Link>.
              </p>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={calcular}
                  disabled={isCalculating}
                  className="px-8"
                >
                  {isCalculating ? "Calculando..." : "VER RESULTADO"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Form Gate */}
        {showLeadForm && !leadSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto mb-16"
          >
            <Card className="border-secondary/50 shadow-card bg-gradient-to-br from-secondary/5 to-accent/5">
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Seu resultado está pronto! 🎉
                  </h3>
                  <p className="text-muted-foreground">
                    Preencha seus dados para ver quanto você pode economizar e receber uma análise personalizada.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground">Nome completo</Label>
                    <Input
                      placeholder="Seu nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">E-mail</Label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">WhatsApp</Label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => setTelefone(formatPhone(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleLeadSubmit} className="w-full" size="lg">
                    Ver minha economia
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {resultado && leadSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Por que PJ vale a pena */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Por que migrar de CLT para PJ vale a pena<span className="text-secondary">?</span>
              </h3>
              <p className="text-muted-foreground mb-8">
                Profissionais CLT pagam impostos altos (INSS de até 14% + IRRF de até 27,5%) e têm pouca flexibilidade. 
                Ao abrir uma empresa no Simples Nacional, especialmente com o benefício do Fator R, você pode reduzir 
                drasticamente essa carga tributária e aumentar seu ganho líquido.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* CLT Card */}
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-semibold text-foreground">CLT (Carteira Assinada)</h4>
                    </div>
                    <ul className="space-y-3">
                      {desvantagensCLT.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* PJ Card */}
                <Card className="border-secondary/50 bg-gradient-to-br from-secondary/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5 text-secondary" />
                      <h4 className="font-semibold text-foreground">PJ (Pessoa Jurídica)</h4>
                    </div>
                    <ul className="space-y-3 mb-4">
                      {vantagensPJ.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                          <span>
                            <strong className="text-foreground">{item.title}:</strong>{" "}
                            <span className="text-muted-foreground">{item.description}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm">
                      <span className="text-warning">⚡</span>{" "}
                      <span className="text-foreground">
                        Com o <strong>Fator R</strong>, profissionais da saúde podem ter alíquota inicial de apenas{" "}
                        <strong className="text-secondary">6%</strong> sobre o faturamento!
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Summary Card */}
            <Card className="border-secondary bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 shrink-0 mt-1" />
                  <div>
                    <p className="text-lg">
                      Com base no seu salário CLT de{" "}
                      <strong>{formatCurrency(resultado.salarioBrutoCLT)}/mês</strong>, você recebe líquido{" "}
                      <strong>{formatCurrency(resultado.salarioLiquidoCLT)}</strong>. Como PJ faturando o mesmo valor, você teria{" "}
                      <strong>{formatCurrency(resultado.salarioLiquidoPJ)}/mês</strong> líquidos. {" "}
                      {resultado.economiaMensal > 0 ? (
                        <>Isso representa <strong>+{formatCurrency(resultado.economiaMensal)}/mês</strong> no seu bolso!</>
                      ) : (
                        <>Considere que como CLT você tem benefícios trabalhistas que compensam.</>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button size="xl" variant="whatsapp" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Quero abrir minha empresa
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Abertura de empresa <strong>grátis</strong> + Sede Virtual incluída
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
