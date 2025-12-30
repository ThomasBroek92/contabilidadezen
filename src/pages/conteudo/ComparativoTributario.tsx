import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingDown, 
  Building2, 
  User, 
  Briefcase, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Tabelas do Simples Nacional 2024
const ANEXO_3 = [
  { faixa: 1, aliquota: 6.00, deducao: 0, minReceita: 0, maxReceita: 180000 },
  { faixa: 2, aliquota: 11.20, deducao: 9360, minReceita: 180000.01, maxReceita: 360000 },
  { faixa: 3, aliquota: 13.50, deducao: 17640, minReceita: 360000.01, maxReceita: 720000 },
  { faixa: 4, aliquota: 16.00, deducao: 35640, minReceita: 720000.01, maxReceita: 1800000 },
  { faixa: 5, aliquota: 21.00, deducao: 125640, minReceita: 1800000.01, maxReceita: 3600000 },
  { faixa: 6, aliquota: 33.00, deducao: 648000, minReceita: 3600000.01, maxReceita: 4800000 },
];

const ANEXO_5 = [
  { faixa: 1, aliquota: 15.50, deducao: 0, minReceita: 0, maxReceita: 180000 },
  { faixa: 2, aliquota: 18.00, deducao: 4500, minReceita: 180000.01, maxReceita: 360000 },
  { faixa: 3, aliquota: 19.50, deducao: 9900, minReceita: 360000.01, maxReceita: 720000 },
  { faixa: 4, aliquota: 20.50, deducao: 17100, minReceita: 720000.01, maxReceita: 1800000 },
  { faixa: 5, aliquota: 23.00, deducao: 62100, minReceita: 1800000.01, maxReceita: 3600000 },
  { faixa: 6, aliquota: 30.50, deducao: 540000, minReceita: 3600000.01, maxReceita: 4800000 },
];

// Tabela IR PF 2024
const TABELA_IR = [
  { faixa: 1, aliquota: 0, deducao: 0, limite: 2259.20 },
  { faixa: 2, aliquota: 7.5, deducao: 169.44, limite: 2826.65 },
  { faixa: 3, aliquota: 15, deducao: 381.44, limite: 3751.05 },
  { faixa: 4, aliquota: 22.5, deducao: 662.77, limite: 4664.68 },
  { faixa: 5, aliquota: 27.5, deducao: 896.00, limite: Infinity },
];

// Tabela INSS 2024
const TABELA_INSS = [
  { aliquota: 7.5, limite: 1412.00 },
  { aliquota: 9, limite: 2666.68 },
  { aliquota: 12, limite: 4000.03 },
  { aliquota: 14, limite: 7786.02 },
];

const TETO_INSS = 7786.02;
const INSS_AUTONOMO_ALIQUOTA = 20; // 20% sobre faturamento até o teto

export default function ComparativoTributario() {
  const [faturamentoMensal, setFaturamentoMensal] = useState(25000);
  const [folhaPagamento, setFolhaPagamento] = useState(6200);
  const [despesasMensal, setDespesasMensal] = useState(0);

  const faturamentoAnual = faturamentoMensal * 12;
  const folhaAnual = folhaPagamento * 12;

  // Calcula Fator R (para determinar se vai para Anexo 3 ou 5)
  const fatorR = useMemo(() => {
    if (faturamentoAnual === 0) return 0;
    return (folhaAnual / faturamentoAnual) * 100;
  }, [faturamentoAnual, folhaAnual]);

  const atingeFatorR = fatorR >= 28;

  // Função para calcular alíquota efetiva do Simples
  const calcularSimplesNacional = (tabela: typeof ANEXO_3) => {
    const faixa = tabela.find(f => faturamentoAnual >= f.minReceita && faturamentoAnual <= f.maxReceita);
    if (!faixa) return { aliquotaEfetiva: 0, impostoMensal: 0, impostoAnual: 0 };

    const aliquotaEfetiva = ((faturamentoAnual * (faixa.aliquota / 100)) - faixa.deducao) / faturamentoAnual * 100;
    const impostoMensal = (faturamentoMensal * aliquotaEfetiva) / 100;
    const impostoAnual = impostoMensal * 12;

    return { aliquotaEfetiva, impostoMensal, impostoAnual, faixa: faixa.faixa };
  };

  // Calcula IR para Carnê Leão (Autônomo)
  const calcularCarneLeao = () => {
    // Base de cálculo = faturamento - 20% (livro caixa simplificado)
    const baseCalculo = faturamentoMensal * 0.8;
    const baseAnual = baseCalculo * 12;

    // INSS Autônomo (20% até o teto)
    const baseINSS = Math.min(faturamentoMensal, TETO_INSS);
    const inssAutonomo = baseINSS * (INSS_AUTONOMO_ALIQUOTA / 100);

    // IR após dedução do INSS
    const baseIR = baseCalculo - inssAutonomo;
    const faixaIR = TABELA_IR.find(f => baseIR <= f.limite) || TABELA_IR[TABELA_IR.length - 1];
    const irMensal = Math.max(0, (baseIR * (faixaIR.aliquota / 100)) - faixaIR.deducao);

    const totalMensal = irMensal + inssAutonomo;
    const aliquotaEfetiva = (totalMensal / faturamentoMensal) * 100;

    return {
      irMensal,
      inssMensal: inssAutonomo,
      totalMensal,
      totalAnual: totalMensal * 12,
      aliquotaEfetiva,
    };
  };

  // Calcula CLT equivalente
  const calcularCLT = () => {
    // Para ganhar o equivalente como CLT, precisa de salário bruto maior
    // Considerando encargos do empregador (~70%)
    const salarioBrutoNecessario = faturamentoMensal / 1.7;

    // INSS do empregado (progressivo)
    let inssEmpregado = 0;
    let baseRestante = Math.min(salarioBrutoNecessario, TETO_INSS);
    let limiteAnterior = 0;

    for (const faixa of TABELA_INSS) {
      const baseNaFaixa = Math.min(baseRestante, faixa.limite) - limiteAnterior;
      if (baseNaFaixa > 0) {
        inssEmpregado += baseNaFaixa * (faixa.aliquota / 100);
      }
      limiteAnterior = faixa.limite;
      if (baseRestante <= faixa.limite) break;
    }

    // IR do empregado
    const baseIR = salarioBrutoNecessario - inssEmpregado;
    const faixaIR = TABELA_IR.find(f => baseIR <= f.limite) || TABELA_IR[TABELA_IR.length - 1];
    const irMensal = Math.max(0, (baseIR * (faixaIR.aliquota / 100)) - faixaIR.deducao);

    const totalDescontos = inssEmpregado + irMensal;
    const aliquotaEfetiva = (totalDescontos / salarioBrutoNecessario) * 100;

    return {
      salarioBruto: salarioBrutoNecessario,
      inssEmpregado,
      irMensal,
      totalDescontos,
      salarioLiquido: salarioBrutoNecessario - totalDescontos,
      aliquotaEfetiva,
    };
  };

  // Calcula Lucro Presumido
  const calcularLucroPresumido = () => {
    const baseCalculo = faturamentoMensal * 0.32; // 32% para serviços

    const pis = faturamentoMensal * 0.0065;
    const cofins = faturamentoMensal * 0.03;
    const iss = faturamentoMensal * 0.05; // 5% ISS médio
    const irpj = baseCalculo * 0.15;
    const csll = baseCalculo * 0.09;

    const totalMensal = pis + cofins + iss + irpj + csll;
    const aliquotaEfetiva = (totalMensal / faturamentoMensal) * 100;

    return {
      pis,
      cofins,
      iss,
      irpj,
      csll,
      totalMensal,
      totalAnual: totalMensal * 12,
      aliquotaEfetiva,
    };
  };

  // Resultados
  const simplesAnexo3 = calcularSimplesNacional(ANEXO_3);
  const simplesAnexo5 = calcularSimplesNacional(ANEXO_5);
  const carneLeao = calcularCarneLeao();
  const clt = calcularCLT();
  const lucroPresumido = calcularLucroPresumido();

  // Determina o melhor regime
  const regimes = [
    { nome: 'Simples Anexo III', aliquota: simplesAnexo3.aliquotaEfetiva, imposto: simplesAnexo3.impostoMensal, disponivel: atingeFatorR },
    { nome: 'Simples Anexo V', aliquota: simplesAnexo5.aliquotaEfetiva, imposto: simplesAnexo5.impostoMensal, disponivel: true },
    { nome: 'Lucro Presumido', aliquota: lucroPresumido.aliquotaEfetiva, imposto: lucroPresumido.totalMensal, disponivel: true },
    { nome: 'Carnê Leão (Autônomo)', aliquota: carneLeao.aliquotaEfetiva, imposto: carneLeao.totalMensal, disponivel: true },
  ];

  const melhorRegime = regimes
    .filter(r => r.disponivel)
    .sort((a, b) => a.aliquota - b.aliquota)[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Comparativo de Regimes Tributários | Simples Nacional, Lucro Presumido, CLT | Contabilidade Zen</title>
        <meta name="description" content="Compare Simples Nacional Anexo III e V, Lucro Presumido, CLT e Autônomo. Calculadora de Fator R e simulador de economia tributária para profissionais da saúde." />
        <meta name="keywords" content="comparativo tributário, simples nacional, anexo 3, anexo 5, fator r, lucro presumido, CLT, autônomo, médico, dentista, psicólogo" />
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="py-12 lg:py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">Ferramenta Gratuita</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Comparativo de Regimes Tributários
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Compare Simples Nacional (Anexo III e V), Lucro Presumido, CLT e Autônomo. 
                Descubra qual regime tributário é mais vantajoso para você.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calculator className="h-4 w-4" />
                <span>Cálculo automático do Fator R incluído</span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Input Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Simulador de Tributação
                  </CardTitle>
                  <CardDescription>
                    Ajuste os valores para simular sua situação tributária
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <Label className="flex items-center justify-between">
                        <span>Faturamento Mensal</span>
                        <span className="font-bold text-primary">{formatCurrency(faturamentoMensal)}</span>
                      </Label>
                      <Slider
                        value={[faturamentoMensal]}
                        onValueChange={([v]) => setFaturamentoMensal(v)}
                        min={5000}
                        max={200000}
                        step={1000}
                      />
                      <Input
                        type="number"
                        value={faturamentoMensal}
                        onChange={(e) => setFaturamentoMensal(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center justify-between">
                        <span>Folha de Pagamento + Pró-labore</span>
                        <span className="font-bold text-secondary">{formatCurrency(folhaPagamento)}</span>
                      </Label>
                      <Slider
                        value={[folhaPagamento]}
                        onValueChange={([v]) => setFolhaPagamento(v)}
                        min={0}
                        max={50000}
                        step={100}
                      />
                      <Input
                        type="number"
                        value={folhaPagamento}
                        onChange={(e) => setFolhaPagamento(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center justify-between">
                        <span>Despesas Mensais</span>
                        <span className="font-bold text-muted-foreground">{formatCurrency(despesasMensal)}</span>
                      </Label>
                      <Slider
                        value={[despesasMensal]}
                        onValueChange={([v]) => setDespesasMensal(v)}
                        min={0}
                        max={50000}
                        step={500}
                      />
                      <Input
                        type="number"
                        value={despesasMensal}
                        onChange={(e) => setDespesasMensal(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Fator R Indicator */}
                  <div className="mt-8 p-6 rounded-xl border-2 border-dashed bg-muted/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Fator R Calculado
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          O Fator R determina se você pode ser enquadrado no Anexo III (mais vantajoso) ou Anexo V
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{formatPercent(fatorR)}</p>
                        <Badge variant={atingeFatorR ? 'default' : 'destructive'} className="mt-2">
                          {atingeFatorR ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Atinge Fator R (≥28%)
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Não atinge (precisa ≥28%)
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Option Highlight */}
              <Card className="mb-8 border-2 border-secondary bg-secondary/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-secondary/20 rounded-full">
                        <TrendingDown className="h-8 w-8 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Regime mais vantajoso para você</p>
                        <h2 className="text-2xl font-bold text-foreground">{melhorRegime?.nome}</h2>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-sm text-muted-foreground">Alíquota efetiva</p>
                      <p className="text-3xl font-bold text-secondary">{formatPercent(melhorRegime?.aliquota || 0)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Imposto mensal: {formatCurrency(melhorRegime?.imposto || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparison Tabs */}
              <Tabs defaultValue="comparativo" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="comparativo">Comparativo Geral</TabsTrigger>
                  <TabsTrigger value="simples">Simples Nacional</TabsTrigger>
                  <TabsTrigger value="presumido">Lucro Presumido</TabsTrigger>
                  <TabsTrigger value="pf">PF / CLT</TabsTrigger>
                </TabsList>

                {/* Comparativo Geral */}
                <TabsContent value="comparativo">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Anexo III */}
                    <Card className={`relative ${atingeFatorR ? 'border-secondary' : 'opacity-60'}`}>
                      {atingeFatorR && melhorRegime?.nome === 'Simples Anexo III' && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary">
                          Recomendado
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Simples Anexo III
                        </CardTitle>
                        {!atingeFatorR && (
                          <Badge variant="outline" className="w-fit">Precisa Fator R ≥28%</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-center py-4 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-bold text-primary">{formatPercent(simplesAnexo3.aliquotaEfetiva)}</p>
                            <p className="text-xs text-muted-foreground">Alíquota efetiva</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Imposto mensal</span>
                              <span className="font-medium">{formatCurrency(simplesAnexo3.impostoMensal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Imposto anual</span>
                              <span className="font-medium">{formatCurrency(simplesAnexo3.impostoAnual)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Faixa</span>
                              <span className="font-medium">{simplesAnexo3.faixa}ª Faixa</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Anexo V */}
                    <Card className={melhorRegime?.nome === 'Simples Anexo V' ? 'border-secondary' : ''}>
                      {melhorRegime?.nome === 'Simples Anexo V' && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary">
                          Recomendado
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Simples Anexo V
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-center py-4 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-bold text-primary">{formatPercent(simplesAnexo5.aliquotaEfetiva)}</p>
                            <p className="text-xs text-muted-foreground">Alíquota efetiva</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Imposto mensal</span>
                              <span className="font-medium">{formatCurrency(simplesAnexo5.impostoMensal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Imposto anual</span>
                              <span className="font-medium">{formatCurrency(simplesAnexo5.impostoAnual)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Faixa</span>
                              <span className="font-medium">{simplesAnexo5.faixa}ª Faixa</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lucro Presumido */}
                    <Card className={melhorRegime?.nome === 'Lucro Presumido' ? 'border-secondary' : ''}>
                      {melhorRegime?.nome === 'Lucro Presumido' && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary">
                          Recomendado
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Lucro Presumido
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-center py-4 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-bold text-primary">{formatPercent(lucroPresumido.aliquotaEfetiva)}</p>
                            <p className="text-xs text-muted-foreground">Alíquota efetiva</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Imposto mensal</span>
                              <span className="font-medium">{formatCurrency(lucroPresumido.totalMensal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Imposto anual</span>
                              <span className="font-medium">{formatCurrency(lucroPresumido.totalAnual)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Base IR/CS</span>
                              <span className="font-medium">32%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Carnê Leão */}
                    <Card className={melhorRegime?.nome === 'Carnê Leão (Autônomo)' ? 'border-secondary' : ''}>
                      {melhorRegime?.nome === 'Carnê Leão (Autônomo)' && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary">
                          Recomendado
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Autônomo (PF)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-center py-4 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-bold text-destructive">{formatPercent(carneLeao.aliquotaEfetiva)}</p>
                            <p className="text-xs text-muted-foreground">Alíquota efetiva</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">IR mensal</span>
                              <span className="font-medium">{formatCurrency(carneLeao.irMensal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">INSS mensal</span>
                              <span className="font-medium">{formatCurrency(carneLeao.inssMensal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total mensal</span>
                              <span className="font-medium text-destructive">{formatCurrency(carneLeao.totalMensal)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Simples Nacional */}
                <TabsContent value="simples">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Anexo III - Serviços (com Fator R ≥28%)</CardTitle>
                        <CardDescription>
                          Aplicável quando a folha de pagamento representa pelo menos 28% do faturamento
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Faixa</th>
                                <th className="text-right py-2">Receita Bruta 12m</th>
                                <th className="text-right py-2">Alíquota</th>
                                <th className="text-right py-2">Dedução</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ANEXO_3.map((faixa) => (
                                <tr key={faixa.faixa} className={`border-b ${faturamentoAnual >= faixa.minReceita && faturamentoAnual <= faixa.maxReceita ? 'bg-secondary/10' : ''}`}>
                                  <td className="py-2">{faixa.faixa}ª Faixa</td>
                                  <td className="text-right py-2">Até {formatCurrency(faixa.maxReceita)}</td>
                                  <td className="text-right py-2">{faixa.aliquota}%</td>
                                  <td className="text-right py-2">{formatCurrency(faixa.deducao)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Anexo V - Serviços (sem Fator R)</CardTitle>
                        <CardDescription>
                          Aplicável quando a folha de pagamento é menor que 28% do faturamento
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Faixa</th>
                                <th className="text-right py-2">Receita Bruta 12m</th>
                                <th className="text-right py-2">Alíquota</th>
                                <th className="text-right py-2">Dedução</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ANEXO_5.map((faixa) => (
                                <tr key={faixa.faixa} className={`border-b ${faturamentoAnual >= faixa.minReceita && faturamentoAnual <= faixa.maxReceita ? 'bg-secondary/10' : ''}`}>
                                  <td className="py-2">{faixa.faixa}ª Faixa</td>
                                  <td className="text-right py-2">Até {formatCurrency(faixa.maxReceita)}</td>
                                  <td className="text-right py-2">{faixa.aliquota}%</td>
                                  <td className="text-right py-2">{formatCurrency(faixa.deducao)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Lucro Presumido */}
                <TabsContent value="presumido">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhamento Lucro Presumido</CardTitle>
                      <CardDescription>
                        Para serviços, a base de cálculo presumida é de 32% do faturamento
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="font-semibold">Impostos Mensais</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>PIS (0,65%)</span>
                              <span className="font-medium">{formatCurrency(lucroPresumido.pis)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>COFINS (3%)</span>
                              <span className="font-medium">{formatCurrency(lucroPresumido.cofins)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>ISS (5%)</span>
                              <span className="font-medium">{formatCurrency(lucroPresumido.iss)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>IRPJ (15% s/ base)</span>
                              <span className="font-medium">{formatCurrency(lucroPresumido.irpj)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>CSLL (9% s/ base)</span>
                              <span className="font-medium">{formatCurrency(lucroPresumido.csll)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-semibold">Resumo</h3>
                          <div className="p-6 bg-primary/5 rounded-xl border">
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Faturamento mensal</span>
                                <span className="font-semibold">{formatCurrency(faturamentoMensal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Base de cálculo (32%)</span>
                                <span className="font-semibold">{formatCurrency(faturamentoMensal * 0.32)}</span>
                              </div>
                              <div className="border-t pt-4">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Total de impostos mensal</span>
                                  <span className="font-bold text-lg text-primary">{formatCurrency(lucroPresumido.totalMensal)}</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                  <span className="text-muted-foreground">Alíquota efetiva</span>
                                  <span className="font-bold text-lg text-primary">{formatPercent(lucroPresumido.aliquotaEfetiva)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* PF / CLT */}
                <TabsContent value="pf">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Autônomo (Carnê Leão)
                        </CardTitle>
                        <CardDescription>
                          Tributação como pessoa física recebendo de outras pessoas físicas ou jurídicas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-6 bg-destructive/5 rounded-xl border border-destructive/20">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Alíquota efetiva</p>
                              <p className="text-4xl font-bold text-destructive">{formatPercent(carneLeao.aliquotaEfetiva)}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>IR Carnê Leão</span>
                              <span className="font-medium">{formatCurrency(carneLeao.irMensal)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>INSS Autônomo (20%)</span>
                              <span className="font-medium">{formatCurrency(carneLeao.inssMensal)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-destructive/10 rounded-lg font-semibold">
                              <span>Total mensal</span>
                              <span className="text-destructive">{formatCurrency(carneLeao.totalMensal)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          CLT (Equivalente)
                        </CardTitle>
                        <CardDescription>
                          Quanto você precisaria ganhar como CLT para ter o mesmo faturamento
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-6 bg-muted/50 rounded-xl border">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Salário bruto necessário</p>
                              <p className="text-4xl font-bold text-primary">{formatCurrency(clt.salarioBruto)}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Para equivaler a {formatCurrency(faturamentoMensal)}/mês como PJ
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>INSS empregado</span>
                              <span className="font-medium">{formatCurrency(clt.inssEmpregado)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                              <span>IR retido na fonte</span>
                              <span className="font-medium">{formatCurrency(clt.irMensal)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-secondary/10 rounded-lg font-semibold">
                              <span>Salário líquido</span>
                              <span className="text-secondary">{formatCurrency(clt.salarioLiquido)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* CTA Section */}
              <Card className="mt-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Quer uma análise personalizada para seu caso?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Nossa equipe de especialistas pode ajudar você a escolher o melhor regime tributário
                      e economizar legalmente nos impostos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" asChild className="gap-2">
                        <a href="https://wa.me/5519974158342?text=Olá! Fiz a simulação no comparativo tributário e gostaria de uma análise personalizada." target="_blank" rel="noopener noreferrer">
                          <Phone className="h-5 w-5" />
                          Falar com Especialista
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/abrir-empresa" className="gap-2">
                          Abrir Minha Empresa
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
