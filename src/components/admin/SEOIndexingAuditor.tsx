import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndexingHistoryReport } from './IndexingHistoryReport';
import { 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  RefreshCw,
  Send,
  Globe,
  Smartphone,
  Clock,
  XCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  BarChart3,
  CalendarClock,
  Play,
  List,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PageAuditResult {
  url: string;
  indexed: boolean;
  indexStatus: string;
  crawledAs?: string;
  lastCrawlTime?: string | null;
  pageFetchState?: string;
  robotsTxtState?: string;
  indexingState?: string;
  mobileUsable?: boolean;
  mobileIssues?: unknown[];
  hasRichResults?: boolean;
  richResultsIssues?: unknown[];
  issues: { type: string; message: string }[];
  suggestions: string[];
  error?: string;
}

interface AuditSummary {
  total: number;
  indexed: number;
  notIndexed: number;
  withIssues: number;
}

interface IndexingResult {
  url: string;
  success: boolean;
  message: string;
}

interface QueueItem {
  id: string;
  url: string;
  action: string;
  status: string;
  blog_post_id: string | null;
  created_at: string;
  processed_at: string | null;
  result: unknown;
  retry_count: number;
}

export function SEOIndexingAuditor() {
  const { toast } = useToast();
  const [isAuditing, setIsAuditing] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [auditResults, setAuditResults] = useState<PageAuditResult[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [indexingProgress, setIndexingProgress] = useState({ current: 0, total: 0 });
  const [indexingResults, setIndexingResults] = useState<IndexingResult[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [siteUrl, setSiteUrl] = useState<string>('');
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');

  const fetchQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const { data, error } = await supabase
        .from('indexing_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setQueueItems(data || []);
    } catch (error) {
      console.error('Error fetching queue:', error);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'queue') {
      fetchQueue();
    }
  }, [activeTab]);

  const processQueueNow = async () => {
    setIsProcessingQueue(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-indexing-queue', {});
      
      if (error) throw error;
      
      if (data?.success) {
        toast({
          title: 'Fila processada!',
          description: `${data.successCount || 0} URLs indexadas, ${data.failCount || 0} falhas`
        });
        fetchQueue();
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Error processing queue:', error);
      toast({
        title: 'Erro ao processar fila',
        description: error instanceof Error ? error.message : 'Falha ao processar',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingQueue(false);
    }
  };

  const getAllPagesToAudit = async (): Promise<string[]> => {
    const baseUrl = siteUrl || 'https://contabilidadezen.com.br';
    
    const staticPages = [
      '', '/sobre', '/servicos', '/contato', '/blog', '/indique-e-ganhe', '/abrir-empresa',
      '/segmentos/contabilidade-para-medicos', '/segmentos/contabilidade-para-dentistas',
      '/segmentos/contabilidade-para-psicologos', '/conteudo/calculadora-pj-clt',
      '/conteudo/comparativo-tributario', '/conteudo/gerador-rpa', '/politica-privacidade', '/termos',
    ].map(path => `${baseUrl}${path}`);

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published');

    const blogPages = (posts || []).map(post => `${baseUrl}/blog/${post.slug}`);
    return [...staticPages, ...blogPages];
  };

  const runAudit = async () => {
    setIsAuditing(true);
    setAuditResults([]);
    setSummary(null);
    setSelectedUrls(new Set());
    setIndexingResults([]);

    try {
      const urls = await getAllPagesToAudit();
      console.log('Starting audit for', urls.length, 'URLs');
      
      toast({ 
        title: 'Iniciando auditoria...', 
        description: `Analisando ${urls.length} páginas. Isso pode levar alguns segundos.` 
      });
      
      const { data, error } = await supabase.functions.invoke('google-search-console', {
        body: { action: 'audit', urls }
      });

      console.log('Audit response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Erro ao chamar função');
      }

      if (data?.success) {
        setAuditResults(data.data);
        setSummary(data.summary);
        setSiteUrl(data.siteUrl);
        
        const pagesWithIssues = data.data
          .filter((p: PageAuditResult) => !p.indexed || p.issues.length > 0)
          .map((p: PageAuditResult) => p.url);
        setSelectedUrls(new Set(pagesWithIssues));
        
        toast({ 
          title: 'Auditoria concluída!', 
          description: `${data.summary.indexed}/${data.summary.total} páginas indexadas` 
        });
      } else {
        throw new Error(data?.error || 'Erro desconhecido na resposta');
      }
    } catch (error) {
      console.error('Audit error:', error);
      toast({ 
        title: 'Erro na auditoria', 
        description: error instanceof Error ? error.message : 'Falha ao auditar páginas. Verifique as credenciais do Google Search Console.',
        variant: 'destructive' 
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const requestIndexing = async () => {
    const urlsToIndex = Array.from(selectedUrls);
    
    if (urlsToIndex.length === 0) {
      toast({ title: 'Selecione páginas', description: 'Selecione ao menos uma página para indexar.' });
      return;
    }

    setIsIndexing(true);
    setIndexingProgress({ current: 0, total: urlsToIndex.length });
    setIndexingResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('google-search-console', {
        body: { action: 'request-indexing', urls: urlsToIndex }
      });

      if (error) throw error;

      if (data?.success) {
        setIndexingResults(data.data);
        
        const { success, failed } = data.summary;
        
        if (success > 0 && failed === 0) {
          toast({ title: 'Indexação solicitada!', description: `${success} páginas enviadas.` });
        } else if (success > 0 && failed > 0) {
          toast({ title: 'Indexação parcial', description: `${success} sucesso, ${failed} falhas.` });
        } else {
          toast({ title: 'Falha na indexação', description: 'Nenhuma página foi enviada.', variant: 'destructive' });
        }
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Indexing error:', error);
      toast({ 
        title: 'Erro ao solicitar indexação', 
        description: error instanceof Error ? error.message : 'Falha ao enviar',
        variant: 'destructive' 
      });
    } finally {
      setIsIndexing(false);
      setIndexingProgress({ current: 0, total: 0 });
    }
  };

  const toggleUrl = (url: string) => {
    setSelectedUrls(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const toggleAllIssues = () => {
    const pagesWithIssues = auditResults.filter(p => !p.indexed || p.issues.length > 0).map(p => p.url);
    const allSelected = pagesWithIssues.every(url => selectedUrls.has(url));
    setSelectedUrls(allSelected ? new Set() : new Set(pagesWithIssues));
  };

  const toggleRow = (url: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const getStatusIcon = (page: PageAuditResult) => {
    if (page.indexed && page.issues.length === 0) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (!page.indexed) return <XCircle className="h-5 w-5 text-red-600" />;
    return <AlertCircle className="h-5 w-5 text-amber-600" />;
  };

  const getStatusBadge = (page: PageAuditResult) => {
    if (page.indexed && page.issues.length === 0) return <Badge className="bg-green-600">Indexado</Badge>;
    if (!page.indexed) return <Badge variant="destructive">Não Indexado</Badge>;
    return <Badge variant="secondary" className="bg-amber-500/10 text-amber-700">Com Avisos</Badge>;
  };

  const getIndexingResultIcon = (url: string) => {
    const result = indexingResults.find(r => r.url === url);
    if (!result) return null;
    if (result.success) return <Badge className="bg-green-600 gap-1"><CheckCircle className="h-3 w-3" />Enviado</Badge>;
    return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Falhou</Badge>;
  };

  const getQueueStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-600">Concluído</Badge>;
      case 'failed': return <Badge variant="destructive">Falhou</Badge>;
      case 'pending': return <Badge variant="secondary">Pendente</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pagesWithIssues = auditResults.filter(p => !p.indexed || p.issues.length > 0);
  const pendingQueueItems = queueItems.filter(q => q.status === 'pending');
  const completedQueueItems = queueItems.filter(q => q.status === 'completed');
  const failedQueueItems = queueItems.filter(q => q.status === 'failed');

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Search className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">Auditoria de Indexação SEO</CardTitle>
              <CardDescription className="text-base">
                Analise, corrija e solicite indexação de páginas ao Google em lote
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit" className="gap-2">
            <Search className="h-4 w-4" />
            Auditoria Manual
          </TabsTrigger>
          <TabsTrigger value="queue" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Fila Automática
            {pendingQueueItems.length > 0 && (
              <Badge variant="secondary" className="ml-1">{pendingQueueItems.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Activity className="h-4 w-4" />
            Relatório Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <div className="flex gap-2 justify-end">
            <Button onClick={runAudit} disabled={isAuditing} variant="outline" className="gap-2">
              {isAuditing ? <><Loader2 className="h-4 w-4 animate-spin" />Auditando...</> : <><RefreshCw className="h-4 w-4" />Auditar Páginas</>}
            </Button>
            {pagesWithIssues.length > 0 && (
              <Button onClick={requestIndexing} disabled={isIndexing || selectedUrls.size === 0} className="gap-2">
                {isIndexing ? <><Loader2 className="h-4 w-4 animate-spin" />Enviando...</> : <><Send className="h-4 w-4" />Solicitar Indexação ({selectedUrls.size})</>}
              </Button>
            )}
          </div>

          {summary && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Globe className="h-4 w-4" />Total</div>
                    <p className="text-3xl font-bold">{summary.total}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-700 text-sm mb-1"><CheckCircle className="h-4 w-4" />Indexadas</div>
                    <p className="text-3xl font-bold text-green-700">{summary.indexed}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-700 text-sm mb-1"><XCircle className="h-4 w-4" />Não Indexadas</div>
                    <p className="text-3xl font-bold text-red-700">{summary.notIndexed}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-700 text-sm mb-1"><AlertCircle className="h-4 w-4" />Com Problemas</div>
                    <p className="text-3xl font-bold text-amber-700">{summary.withIssues}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Taxa de Indexação</span>
                    <span className="font-medium">{Math.round((summary.indexed / summary.total) * 100)}%</span>
                  </div>
                  <Progress value={(summary.indexed / summary.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {isIndexing && indexingProgress.total > 0 && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Solicitando indexação...</AlertTitle>
              <AlertDescription>
                Enviando {indexingProgress.current} de {indexingProgress.total} URLs
                <Progress value={(indexingProgress.current / indexingProgress.total) * 100} className="mt-2 h-2" />
              </AlertDescription>
            </Alert>
          )}

          {auditResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Resultados</CardTitle>
                  {pagesWithIssues.length > 0 && (
                    <Button variant="outline" size="sm" onClick={toggleAllIssues}>
                      <Checkbox checked={pagesWithIssues.every(p => selectedUrls.has(p.url))} className="mr-2" />
                      Selecionar todas ({pagesWithIssues.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {auditResults.map((page) => (
                      <div key={page.url} className="border rounded-lg overflow-hidden">
                        <div 
                          className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            !page.indexed ? 'bg-red-50 dark:bg-red-950/20' : page.issues.length > 0 ? 'bg-amber-50 dark:bg-amber-950/20' : ''
                          }`}
                          onClick={() => toggleRow(page.url)}
                        >
                          <Checkbox checked={selectedUrls.has(page.url)} onCheckedChange={() => toggleUrl(page.url)} onClick={(e) => e.stopPropagation()} />
                          {getStatusIcon(page)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{page.url.replace(siteUrl, '')}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {page.lastCrawlTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(page.lastCrawlTime).toLocaleDateString('pt-BR')}</span>}
                              {page.mobileUsable !== undefined && <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" />{page.mobileUsable ? 'OK' : '⚠️'}</span>}
                            </div>
                          </div>
                          {getStatusBadge(page)}
                          {getIndexingResultIcon(page.url)}
                          {expandedRows.has(page.url) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>

                        {expandedRows.has(page.url) && (
                          <div className="p-4 bg-muted/30 border-t space-y-3">
                            {page.issues.length > 0 && (
                              <div>
                                <h4 className="font-medium text-sm mb-2 flex items-center gap-1"><AlertCircle className="h-4 w-4 text-amber-600" />Problemas</h4>
                                <div className="space-y-1">
                                  {page.issues.map((issue, i) => (
                                    <div key={i} className={`text-sm flex items-start gap-2 ${issue.type === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                                      {issue.type === 'error' ? <XCircle className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                                      {issue.message}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {page.suggestions.length > 0 && (
                              <div>
                                <h4 className="font-medium text-sm mb-2 flex items-center gap-1"><Lightbulb className="h-4 w-4 text-primary" />Sugestões</h4>
                                <div className="space-y-1">
                                  {page.suggestions.map((suggestion, i) => (
                                    <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <Zap className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{suggestion}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div className="p-2 bg-background rounded border"><span className="text-muted-foreground">Status:</span><span className="ml-1 font-medium">{page.indexStatus}</span></div>
                              <div className="p-2 bg-background rounded border"><span className="text-muted-foreground">Crawled:</span><span className="ml-1 font-medium">{page.crawledAs}</span></div>
                              <div className="p-2 bg-background rounded border"><span className="text-muted-foreground">Fetch:</span><span className="ml-1 font-medium">{page.pageFetchState}</span></div>
                              <div className="p-2 bg-background rounded border"><span className="text-muted-foreground">Robots:</span><span className="ml-1 font-medium">{page.robotsTxtState}</span></div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" onClick={() => window.open(page.url, '_blank')}><ExternalLink className="h-4 w-4 mr-1" />Abrir</Button>
                              {!page.indexed && (
                                <Button size="sm" onClick={() => { setSelectedUrls(new Set([page.url])); requestIndexing(); }} disabled={isIndexing}>
                                  <Send className="h-4 w-4 mr-1" />Indexar
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {!isAuditing && auditResults.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma auditoria realizada</h3>
                <p className="text-muted-foreground mb-6">Clique em "Auditar Páginas" para verificar o status de indexação.</p>
                <Button onClick={runAudit} disabled={isAuditing} className="gap-2"><RefreshCw className="h-4 w-4" />Iniciar Auditoria</Button>
              </CardContent>
            </Card>
          )}

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Como funciona?</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>1. <strong>Auditar:</strong> Verifica status de indexação no Google Search Console.</p>
              <p>2. <strong>Selecionar:</strong> Páginas com problemas são auto-selecionadas.</p>
              <p>3. <strong>Indexar:</strong> Envia as páginas para o Google re-crawlear.</p>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fila de Indexação Automática</h3>
              <p className="text-sm text-muted-foreground">Posts publicados ou atualizados são adicionados automaticamente e processados a cada 30 min.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchQueue} disabled={isLoadingQueue} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${isLoadingQueue ? 'animate-spin' : ''}`} />Atualizar
              </Button>
              <Button onClick={processQueueNow} disabled={isProcessingQueue || pendingQueueItems.length === 0} className="gap-2">
                {isProcessingQueue ? <><Loader2 className="h-4 w-4 animate-spin" />Processando...</> : <><Play className="h-4 w-4" />Processar Agora</>}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Clock className="h-4 w-4" />Pendentes</div>
              <p className="text-2xl font-bold">{pendingQueueItems.length}</p>
            </Card>
            <Card className="p-4 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2 text-green-700 text-sm mb-1"><CheckCircle className="h-4 w-4" />Concluídos</div>
              <p className="text-2xl font-bold text-green-700">{completedQueueItems.length}</p>
            </Card>
            <Card className="p-4 bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-2 text-red-700 text-sm mb-1"><XCircle className="h-4 w-4" />Falhas</div>
              <p className="text-2xl font-bold text-red-700">{failedQueueItems.length}</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><List className="h-5 w-5" />Itens na Fila</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingQueue ? (
                <div className="py-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>
              ) : queueItems.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <CalendarClock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum item na fila.</p>
                  <p className="text-sm">Quando você publicar ou atualizar posts, eles aparecerão aqui.</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {queueItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        {item.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {item.status === 'pending' && <Clock className="h-5 w-5 text-amber-600" />}
                        {item.status === 'failed' && <XCircle className="h-5 w-5 text-red-600" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">{item.url.replace('https://contabilidadezen.com.br', '')}</p>
                          <p className="text-xs text-muted-foreground">
                            Criado: {new Date(item.created_at).toLocaleString('pt-BR')}
                            {item.processed_at && ` • Processado: ${new Date(item.processed_at).toLocaleString('pt-BR')}`}
                          </p>
                        </div>
                        {getQueueStatusBadge(item.status)}
                        {item.retry_count > 0 && <Badge variant="outline" className="text-xs">{item.retry_count}x</Badge>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          <Alert>
            <CalendarClock className="h-4 w-4" />
            <AlertTitle>Re-indexação Automática</AlertTitle>
            <AlertDescription className="space-y-2">
              <p><strong>Automático:</strong> Posts publicados/atualizados são adicionados à fila.</p>
              <p><strong>Processamento:</strong> Fila processada a cada 30 minutos via cron.</p>
              <p><strong>Retentativas:</strong> Falhas são reprocessadas até 3 vezes.</p>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <IndexingHistoryReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
