import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Bot, AlertCircle, CheckCircle, Loader2, Eye, Image, Code, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SimulationResult {
  title: string;
  description: string;
  keyPoints: string[];
  issues: { type: 'error' | 'warning' | 'info'; message: string }[];
  extractedText: string;
  imageCount: number;
  scriptHeavy: boolean;
}

export function AIBrowserSimulator() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [selectedBrowser, setSelectedBrowser] = useState<'perplexity' | 'arc' | 'chatgpt'>('perplexity');

  const simulateBrowser = async () => {
    if (!url) return;

    setIsSimulating(true);
    setResult(null);

    try {
      // Simulated analysis - in production this would use the Perplexity API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock result based on common patterns
      const mockResult: SimulationResult = {
        title: 'Contabilidade para Médicos | Economia de até 30% em Impostos',
        description: 'Serviços especializados de contabilidade para profissionais de saúde. Abertura de empresa, planejamento tributário e gestão financeira.',
        keyPoints: [
          'Economia média de R$ 15.000/ano em impostos',
          'Especializado em profissionais de saúde',
          'Atendimento 100% digital',
          'Abertura de empresa em até 7 dias',
        ],
        issues: [
          { type: 'warning', message: 'Algumas informações importantes estão em imagens (não extraíveis por IA)' },
          { type: 'info', message: 'FAQ estruturado detectado - bom para extração' },
          { type: 'error', message: 'Preços não estão em texto simples (dentro de JavaScript)' },
        ],
        extractedText: 'A Contabilidade Zen é especializada em contabilidade para médicos, dentistas e psicólogos. Oferecemos abertura de empresa, gestão de impostos e planejamento tributário...',
        imageCount: 12,
        scriptHeavy: true,
      };

      setResult(mockResult);
    } catch (error) {
      toast({
        title: 'Erro na simulação',
        description: 'Não foi possível simular o navegador de IA.',
        variant: 'destructive',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const browserInfo = {
    perplexity: {
      name: 'Perplexity',
      description: 'Motor de busca com IA que cita fontes diretamente',
      icon: '🔍',
    },
    arc: {
      name: 'Arc Browser',
      description: 'Navegador com recursos de IA integrados',
      icon: '🌐',
    },
    chatgpt: {
      name: 'ChatGPT Browse',
      description: 'Capacidade de navegação do ChatGPT Plus',
      icon: '🤖',
    },
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Bot className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold mb-1">Simulador de Navegadores de IA</h3>
              <p className="text-sm text-muted-foreground">
                Veja como sua página aparece para motores de IA. Conteúdo em texto simples é priorizado sobre 
                informações em imagens ou JavaScript pesado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Testar Visibilidade para IA
          </CardTitle>
          <CardDescription>
            Insira a URL da página para simular como ela é "vista" por navegadores de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="https://contabilidadezen.com.br/servicos"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={simulateBrowser} disabled={!url || isSimulating}>
              {isSimulating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Simulando...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Simular
                </>
              )}
            </Button>
          </div>

          <Tabs value={selectedBrowser} onValueChange={(v) => setSelectedBrowser(v as any)}>
            <TabsList>
              {Object.entries(browserInfo).map(([key, info]) => (
                <TabsTrigger key={key} value={key} className="gap-2">
                  <span>{info.icon}</span>
                  {info.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedBrowser} className="mt-4">
              <p className="text-sm text-muted-foreground">
                {browserInfo[selectedBrowser].description}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Extracted Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Como a IA Vê Sua Página</CardTitle>
              <CardDescription>
                Prévia do conteúdo que pode ser extraído e citado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <Badge variant="outline" className="mb-2">Título</Badge>
                  <h3 className="text-lg font-semibold">{result.title}</h3>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">Descrição</Badge>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">Pontos-Chave Extraídos</Badge>
                  <ul className="list-disc list-inside space-y-1">
                    {result.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico de Visibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.issues.map((issue, i) => (
                  <div 
                    key={i} 
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      issue.type === 'error' ? 'bg-red-50 border border-red-200' :
                      issue.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    {issue.type === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : issue.type === 'warning' ? (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                    <span className={
                      issue.type === 'error' ? 'text-red-800' :
                      issue.type === 'warning' ? 'text-amber-800' :
                      'text-blue-800'
                    }>
                      {issue.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Image className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{result.imageCount}</p>
                    <p className="text-sm text-muted-foreground">Imagens detectadas</p>
                  </div>
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  ⚠ Conteúdo em imagens não é extraível
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Code className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{result.scriptHeavy ? 'Alto' : 'Baixo'}</p>
                    <p className="text-sm text-muted-foreground">Uso de JavaScript</p>
                  </div>
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  ⚠ Conteúdo dinâmico pode não ser indexado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{result.extractedText.split(' ').length}</p>
                    <p className="text-sm text-muted-foreground">Palavras extraíveis</p>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  ✓ Texto em HTML puro
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendações GEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium mb-1">1. Mova informações críticas para texto simples</p>
                  <p className="text-sm text-muted-foreground">
                    Preços, benefícios e CTAs devem estar em HTML, não em imagens ou gerados por JavaScript.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium mb-1">2. Adicione alt text descritivo</p>
                  <p className="text-sm text-muted-foreground">
                    Imagens importantes devem ter descrições que reforcem o conteúdo da página.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium mb-1">3. Implemente Server-Side Rendering</p>
                  <p className="text-sm text-muted-foreground">
                    Conteúdo gerado no servidor é mais facilmente extraído por crawlers de IA.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
