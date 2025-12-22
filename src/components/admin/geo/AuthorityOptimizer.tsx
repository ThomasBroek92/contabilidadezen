import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BarChart3, Calendar, Quote, Plus, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Statistic {
  id: string;
  value: string;
  description: string;
  source: string;
  addedDate: string;
}

interface ExpertQuote {
  id: string;
  quote: string;
  author: string;
  title: string;
  source: string;
}

interface FreshnessItem {
  id: string;
  page: string;
  lastUpdated: string;
  nextReview: string;
  status: 'current' | 'needs_update' | 'outdated';
}

export function AuthorityOptimizer() {
  const [statistics, setStatistics] = useState<Statistic[]>([
    {
      id: '1',
      value: '85%',
      description: 'dos médicos economizam em impostos com PJ',
      source: 'Pesquisa interna 2024',
      addedDate: '2024-01-15',
    },
    {
      id: '2',
      value: 'R$ 15.000',
      description: 'economia média anual por cliente',
      source: 'Relatório de clientes 2024',
      addedDate: '2024-02-01',
    },
  ]);

  const [quotes, setQuotes] = useState<ExpertQuote[]>([
    {
      id: '1',
      quote: 'O planejamento tributário é essencial para profissionais de saúde que buscam otimizar seus ganhos.',
      author: 'Dr. Carlos Silva',
      title: 'Contador Especialista em Saúde',
      source: 'Entrevista exclusiva',
    },
  ]);

  const [freshnessItems, setFreshnessItems] = useState<FreshnessItem[]>([
    { id: '1', page: '/blog/guia-pj-medicos', lastUpdated: '2024-10-15', nextReview: '2025-01-15', status: 'current' },
    { id: '2', page: '/servicos/abertura-empresa', lastUpdated: '2024-06-20', nextReview: '2024-09-20', status: 'needs_update' },
    { id: '3', page: '/faq', lastUpdated: '2024-03-01', nextReview: '2024-06-01', status: 'outdated' },
  ]);

  const [newStat, setNewStat] = useState({ value: '', description: '', source: '' });
  const [newQuote, setNewQuote] = useState({ quote: '', author: '', title: '', source: '' });

  const addStatistic = () => {
    if (newStat.value && newStat.description) {
      setStatistics([
        ...statistics,
        {
          id: Date.now().toString(),
          ...newStat,
          addedDate: new Date().toISOString().split('T')[0],
        },
      ]);
      setNewStat({ value: '', description: '', source: '' });
    }
  };

  const addQuote = () => {
    if (newQuote.quote && newQuote.author) {
      setQuotes([...quotes, { id: Date.now().toString(), ...newQuote }]);
      setNewQuote({ quote: '', author: '', title: '', source: '' });
    }
  };

  const getStatusConfig = (status: FreshnessItem['status']) => {
    switch (status) {
      case 'current':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Atual' };
      case 'needs_update':
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Revisar' };
      case 'outdated':
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'Desatualizado' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold mb-1">Por que Autoridade Importa para GEO?</h3>
              <p className="text-sm text-muted-foreground">
                Estatísticas quantitativas e citações de especialistas podem aumentar a visibilidade em IA em até <strong>40%</strong>. 
                Motores de resposta priorizam conteúdo com dados verificáveis e sinais de expertise (E-E-A-T).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="statistics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="quotes" className="gap-2">
            <Quote className="h-4 w-4" />
            Citações de Especialistas
          </TabsTrigger>
          <TabsTrigger value="freshness" className="gap-2">
            <Calendar className="h-4 w-4" />
            Freshness (Atualização)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banco de Estatísticas</CardTitle>
              <CardDescription>
                Dados quantitativos que podem ser inseridos no conteúdo para aumentar credibilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Valor/Número</Label>
                  <Input
                    placeholder="Ex: 85%, R$ 10.000"
                    value={newStat.value}
                    onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Descrição</Label>
                  <Input
                    placeholder="O que esse número representa"
                    value={newStat.description}
                    onChange={(e) => setNewStat({ ...newStat, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fonte</Label>
                  <Input
                    placeholder="Pesquisa, relatório..."
                    value={newStat.source}
                    onChange={(e) => setNewStat({ ...newStat, source: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addStatistic} disabled={!newStat.value || !newStat.description}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Estatística
              </Button>

              <div className="space-y-3 mt-6">
                {statistics.map((stat) => (
                  <div key={stat.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary min-w-[100px]">{stat.value}</div>
                    <div className="flex-1">
                      <p className="font-medium">{stat.description}</p>
                      <p className="text-sm text-muted-foreground">Fonte: {stat.source}</p>
                    </div>
                    <Badge variant="outline">{stat.addedDate}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStatistics(statistics.filter((s) => s.id !== stat.id))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Citações de Especialistas</CardTitle>
              <CardDescription>
                Depoimentos e citações que adicionam autoridade ao conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Citação</Label>
                  <Textarea
                    placeholder="O texto da citação..."
                    value={newQuote.quote}
                    onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Autor</Label>
                    <Input
                      placeholder="Nome do especialista"
                      value={newQuote.author}
                      onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Título/Cargo</Label>
                    <Input
                      placeholder="Contador, Advogado..."
                      value={newQuote.title}
                      onChange={(e) => setNewQuote({ ...newQuote, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fonte</Label>
                    <Input
                      placeholder="Entrevista, artigo..."
                      value={newQuote.source}
                      onChange={(e) => setNewQuote({ ...newQuote, source: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={addQuote} disabled={!newQuote.quote || !newQuote.author}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Citação
              </Button>

              <div className="space-y-3 mt-6">
                {quotes.map((quote) => (
                  <div key={quote.id} className="p-4 border rounded-lg bg-muted/30">
                    <blockquote className="text-lg italic mb-3">"{quote.quote}"</blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{quote.author}</p>
                        <p className="text-sm text-muted-foreground">{quote.title}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuotes(quotes.filter((q) => q.id !== quote.id))}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="freshness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Freshness</CardTitle>
              <CardDescription>
                Monitore datas de atualização para manter conteúdo relevante para IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {freshnessItems.map((item) => {
                  const config = getStatusConfig(item.status);
                  const StatusIcon = config.icon;
                  const daysSinceUpdate = differenceInDays(new Date(), new Date(item.lastUpdated));

                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <StatusIcon className={`h-5 w-5 ${config.color}`} />
                      <div className="flex-1">
                        <p className="font-medium font-mono text-sm">{item.page}</p>
                        <p className="text-sm text-muted-foreground">
                          Atualizado há {daysSinceUpdate} dias
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${config.bg} ${config.color} border-0`}>
                          {config.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Próx. revisão: {format(new Date(item.nextReview), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Atualizar
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica GEO:</strong> Adicione "Última atualização: {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}" 
                  e referências ao ano atual (2025) para sinalizar à IA que seu conteúdo não é estático.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
