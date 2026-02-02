import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Banknote, TrendingUp, ArrowRight } from "lucide-react";

const planos = [
  { valor: 197, label: "R$ 197/mês", descricao: "MEI / Autônomo" },
  { valor: 397, label: "R$ 397/mês", descricao: "Simples Nacional" },
  { valor: 597, label: "R$ 597/mês", descricao: "Profissional Liberal" },
  { valor: 997, label: "R$ 997/mês", descricao: "Empresas / Lucro Presumido" }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export function PartnerEarningsCalculator() {
  const [mensalidade, setMensalidade] = useState(597);
  const [qtdIndicacoes, setQtdIndicacoes] = useState(3);
  const [meses, setMeses] = useState(12);
  const [modelo, setModelo] = useState("imediato");

  // Cálculos
  const ganhoImediato = mensalidade * qtdIndicacoes;
  const ganhoMensalRecorrente = mensalidade * 0.10 * qtdIndicacoes;
  const ganhoTotalRecorrente = ganhoMensalRecorrente * meses;

  const handleIndicacoesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQtdIndicacoes(Math.max(1, value));
  };

  const scrollToCadastro = () => {
    document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-4">
            <Calculator className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">Simulador de Ganhos</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Calcule seus <span className="text-gradient">ganhos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja quanto você pode ganhar indicando empresas para a Contabilidade Zen
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-card border-secondary/20">
          <CardContent className="p-6 lg:p-8">
            <Tabs value={modelo} onValueChange={setModelo} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="imediato" className="gap-2">
                  <Banknote className="h-4 w-4" />
                  100% do 1º Mês
                </TabsTrigger>
                <TabsTrigger value="recorrente" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  10% Recorrente
                </TabsTrigger>
              </TabsList>

              {/* Campos de entrada - comuns aos dois modelos */}
              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="mensalidade">Valor da mensalidade do indicado</Label>
                  <Select
                    value={mensalidade.toString()}
                    onValueChange={(value) => setMensalidade(parseInt(value))}
                  >
                    <SelectTrigger id="mensalidade" className="h-12">
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {planos.map((plano) => (
                        <SelectItem key={plano.valor} value={plano.valor.toString()}>
                          {plano.label} - {plano.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indicacoes">Quantas empresas você pode indicar?</Label>
                  <Input
                    id="indicacoes"
                    type="number"
                    min={1}
                    value={qtdIndicacoes}
                    onChange={handleIndicacoesChange}
                    className="h-12"
                  />
                </div>

                {modelo === "recorrente" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Período de recorrência</Label>
                      <span className="text-sm font-medium text-secondary">{meses} meses</span>
                    </div>
                    <Slider
                      value={[meses]}
                      onValueChange={(value) => setMeses(value[0])}
                      min={6}
                      max={36}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>6 meses</span>
                      <span>36 meses</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resultados */}
              <TabsContent value="imediato" className="mt-0">
                <div className="bg-gradient-primary rounded-xl p-6 text-center text-primary-foreground">
                  <p className="text-sm opacity-90 mb-2">Seu potencial de ganhos</p>
                  <p className="text-4xl lg:text-5xl font-bold mb-3">
                    {formatCurrency(ganhoImediato)}
                  </p>
                  <p className="text-sm opacity-90">
                    {qtdIndicacoes} {qtdIndicacoes === 1 ? "indicação" : "indicações"} × {formatCurrency(mensalidade)} = {formatCurrency(ganhoImediato)} via PIX
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="recorrente" className="mt-0">
                <div className="bg-gradient-primary rounded-xl p-6 text-center text-primary-foreground">
                  <p className="text-sm opacity-90 mb-2">Seu potencial de ganhos em {meses} meses</p>
                  <p className="text-4xl lg:text-5xl font-bold mb-3">
                    {formatCurrency(ganhoTotalRecorrente)}
                  </p>
                  <p className="text-sm opacity-90">
                    {formatCurrency(ganhoMensalRecorrente)}/mês × {meses} meses
                  </p>
                  <p className="text-xs opacity-75 mt-2">
                    ({qtdIndicacoes} {qtdIndicacoes === 1 ? "indicação" : "indicações"} × 10% de {formatCurrency(mensalidade)})
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              variant="hero"
              size="lg"
              className="w-full mt-6 group"
              onClick={scrollToCadastro}
            >
              Quero me cadastrar
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
