import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { toast } from "sonner";

// Tabela INSS 2024
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

interface ResultadoCalculo {
  salarioBrutoAutonomo: number;
  inss: number;
  irrf: number;
  salarioLiquidoAutonomo: number;
  beneficiosTotais: number;
  totalMensalEquivalenteAutonomo: number;
  faturamentoPJ: number;
  impostosPJ: number;
  inssPJ: number;
  contabilidade: number;
  salarioLiquidoPJ: number;
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

const desvantagensAutonomo = [
  { text: "INSS progressivo: até 14% do rendimento bruto" },
  { text: "IRRF progressivo: até 27,5% sobre o lucro" },
  { text: "Carnê-leão: obrigação de pagar mensalmente" },
  { text: "Menor credibilidade: clientes preferem NF de empresa" },
];

export function PJCalculatorSection() {
  const [faturamento, setFaturamento] = useState("");
  const [valeRefeicao, setValeRefeicao] = useState("");
  const [valeTransporte, setValeTransporte] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");
  const [outrosBeneficios, setOutrosBeneficios] = useState("");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
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
    const salario = parseCurrency(faturamento);
    if (salario <= 0) {
      toast.error("Informe um faturamento válido");
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      const vr = parseCurrency(valeRefeicao);
      const vt = parseCurrency(valeTransporte);
      const ps = parseCurrency(planoSaude);
      const outros = parseCurrency(outrosBeneficios);

      // Autônomo
      const inss = calcularINSS(salario);
      const irrf = calcularIRRF(salario, inss);
      const salarioLiquidoAutonomo = salario - inss - irrf;
      const beneficiosTotais = vr + vt + ps + outros;
      const totalMensalEquivalenteAutonomo = salarioLiquidoAutonomo + beneficiosTotais;

      // PJ - Simples Nacional 6% (Fator R)
      const aliquotaSimples = 0.06;
      const proLabore = 1412;
      const inssPJ = proLabore * 0.11;
      const contabilidade = 297.90;
      const faturamentoPJ = salario;
      const impostosPJ = faturamentoPJ * aliquotaSimples;
      const salarioLiquidoPJ = faturamentoPJ - impostosPJ - inssPJ - contabilidade + beneficiosTotais;

      const economiaMensal = salarioLiquidoPJ - totalMensalEquivalenteAutonomo;
      const economiaAnual = economiaMensal * 12;
      const percentualEconomia = ((salarioLiquidoPJ / totalMensalEquivalenteAutonomo) - 1) * 100;

      setResultado({
        salarioBrutoAutonomo: salario,
        inss,
        irrf,
        salarioLiquidoAutonomo,
        beneficiosTotais,
        totalMensalEquivalenteAutonomo,
        faturamentoPJ,
        impostosPJ,
        inssPJ,
        contabilidade,
        salarioLiquidoPJ,
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
      segmento: "PJ x Autônomo",
      fonte: "Calculadora Homepage",
      faturamento_mensal: parseCurrency(faturamento),
      economia_anual: resultado?.economiaAnual,
    });

    if (saved) {
      setLeadSubmitted(true);
      toast.success("Pronto! Veja sua economia abaixo.");
    }
  };

  const whatsappMessage = resultado
    ? `Olá! Usei a calculadora e descobri que posso economizar ${formatCurrency(resultado.economiaAnual)} por ano abrindo uma empresa. Quero saber mais!`
    : "Olá! Quero abrir minha empresa e reduzir meus impostos!";

  const whatsappLink = `https://wa.me/5519974158342?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            CALCULADORA GRATUITA
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            Calculadora PJ x Autônomo
            <span className="text-secondary">.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubra <strong className="text-foreground">quanto você pode economizar</strong> migrando de autônomo para PJ.
            Nossa calculadora mostra a diferença real entre pagar impostos como pessoa física (até 27,5% de IR) 
            e como PJ no Simples Nacional (a partir de 6%).
          </p>
        </motion.div>

        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="border-border shadow-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-foreground text-center mb-6">
                Informe seus rendimentos atuais como autônomo:
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-1">
                  <Label className="text-foreground font-medium">Faturamento mensal bruto:</Label>
                  <Input
                    placeholder="R$ 0,00"
                    value={faturamento}
                    onChange={(e) => handleInputChange(setFaturamento, e.target.value)}
                    className="mt-1"
                  />
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
                Por que ser PJ vale a pena<span className="text-secondary">?</span>
              </h3>
              <p className="text-muted-foreground mb-8">
                Profissionais autônomos pagam impostos altíssimos como pessoa física (INSS de até 14% + IRRF de até 27,5%). 
                Ao abrir uma empresa no Simples Nacional, especialmente com o benefício do Fator R, você pode reduzir 
                drasticamente essa carga tributária.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Autônomo Card */}
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-semibold text-foreground">Autônomo (Pessoa Física)</h4>
                    </div>
                    <ul className="space-y-3">
                      {desvantagensAutonomo.map((item, idx) => (
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
                      Na prática, profissionais que faturam{" "}
                      <strong>{formatCurrency(resultado.salarioBrutoAutonomo)}/mês</strong> como autônomo podem economizar{" "}
                      <strong>mais de {formatCurrency(resultado.economiaMensal)}/mês</strong> ao migrar para PJ.{" "}
                      Isso representa <strong>mais de {formatCurrency(resultado.economiaAnual)}/ano</strong> no seu bolso!
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
