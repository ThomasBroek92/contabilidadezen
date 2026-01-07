import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  RefreshCw,
  Send,
  Globe,
  Smartphone,
  FileText,
  Clock,
  XCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  BarChart3
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

export function SEOIndexingAuditor() {
  const { toast } = useToast();
  const [isAuditing, setIsAuditing] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [auditResults, setAuditResults] = useState<PageAuditResult[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [indexingProgress, setIndexingProgress] = useState({ current: 0, total: 0 });
  const [indexingResults, setIndexingResults] = useState<IndexingResult[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [siteUrl, setSiteUrl] = useState<string>('');

  // Get all pages to audit
  const getAllPagesToAudit = async (): Promise<string[]> => {
    const baseUrl = siteUrl || 'https://contabilidade-zen.com.br';
    
    // Static pages
    const staticPages = [
      '',
      '/sobre',
      '/servicos',
      '/contato',
      '/blog',
      '/indique-e-ganhe',
      '/abrir-empresa',
      '/segmentos/contabilidade-para-medicos',
      '/segmentos/contabilidade-para-dentistas',
      '/segmentos/contabilidade-para-psicologos',
      '/conteudo/calculadora-pj-clt',
      '/conteudo/comparativo-tributario',
      '/conteudo/gerador-rpa',
      '/politica-privacidade',
      '/termos',
    ].map(path => `${baseUrl}${path}`);

    // Get blog posts
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
      
      const { data, error } = await supabase.functions.invoke('google-search-console', {
        body: { action: 'audit', urls }
      });

      if (error) throw error;

      if (data?.success) {
        setAuditResults(data.data);
        setSummary(data.summary);
        setSiteUrl(data.siteUrl);
        
        // Auto-select pages with issues
        const pagesWithIssues = data.data
          .filter((p: PageAuditResult) => !p.indexed || p.issues.length > 0)
          .map((p: PageAuditResult) => p.url);
        setSelectedUrls(new Set(pagesWithIssues));
        
        toast({ 
          title: 'Auditoria concluída!', 
          description: `${data.summary.indexed}/${data.summary.total} páginas indexadas` 
        });
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Audit error:', error);
      toast({ 
        title: 'Erro na auditoria', 
        description: error instanceof Error ? error.message : 'Falha ao auditar páginas',
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
          toast({ 
            title: 'Indexação solicitada!', 
            description: `${success} páginas enviadas ao Google com sucesso.` 
          });
        } else if (success > 0 && failed > 0) {
          toast({ 
            title: 'Indexação parcial', 
            description: `${success} sucesso, ${failed} falhas.` 
          });
        } else {
          toast({ 
            title: 'Falha na indexação', 
            description: 'Nenhuma página foi enviada.',
            variant: 'destructive' 
          });
        }
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Indexing error:', error);
      toast({ 
        title: 'Erro ao solicitar indexação', 
        description: error instanceof Error ? error.message : 'Falha ao enviar para o Google',
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
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const toggleAllIssues = () => {
    const pagesWithIssues = auditResults
      .filter(p => !p.indexed || p.issues.length > 0)
      .map(p => p.url);
    
    const allSelected = pagesWithIssues.every(url => selectedUrls.has(url));
    
    if (allSelected) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(pagesWithIssues));
    }
  };

  const toggleRow = (url: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const getStatusIcon = (page: PageAuditResult) => {
    if (page.indexed && page.issues.length === 0) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (!page.indexed) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
    return <AlertCircle className="h-5 w-5 text-amber-600" />;
  };

  const getStatusBadge = (page: PageAuditResult) => {
    if (page.indexed && page.issues.length === 0) {
      return <Badge className="bg-green-600">Indexado</Badge>;
    }
    if (!page.indexed) {
      return <Badge variant="destructive">Não Indexado</Badge>;
    }
    return <Badge variant="secondary" className="bg-amber-500/10 text-amber-700">Com Avisos</Badge>;
  };

  const getIndexingResultIcon = (url: string) => {
    const result = indexingResults.find(r => r.url === url);
    if (!result) return null;
    
    if (result.success) {
      return <Badge className="bg-green-600 gap-1"><CheckCircle className="h-3 w-3" />Enviado</Badge>;
    }
    return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Falhou</Badge>;
  };

  const pagesWithIssues = auditResults.filter(p => !p.indexed || p.issues.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
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
            <div className="flex gap-2">
              <Button 
                onClick={runAudit} 
                disabled={isAuditing}
                variant="outline"
                className="gap-2"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Auditando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Auditar Páginas
                  </>
                )}
              </Button>
              {pagesWithIssues.length > 0 && (
                <Button 
                  onClick={requestIndexing} 
                  disabled={isIndexing || selectedUrls.size === 0}
                  className="gap-2"
                >
                  {isIndexing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Solicitar Indexação ({selectedUrls.size})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Summary Stats */}
        {summary && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-background border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Globe className="h-4 w-4" />
                  Total de Páginas
                </div>
                <p className="text-3xl font-bold">{summary.total}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
                  <CheckCircle className="h-4 w-4" />
                  Indexadas
                </div>
                <p className="text-3xl font-bold text-green-700">{summary.indexed}</p>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-700 text-sm mb-1">
                  <XCircle className="h-4 w-4" />
                  Não Indexadas
                </div>
                <p className="text-3xl font-bold text-red-700">{summary.notIndexed}</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-700 text-sm mb-1">
                  <AlertCircle className="h-4 w-4" />
                  Com Problemas
                </div>
                <p className="text-3xl font-bold text-amber-700">{summary.withIssues}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Taxa de Indexação</span>
                <span className="font-medium">{Math.round((summary.indexed / summary.total) * 100)}%</span>
              </div>
              <Progress value={(summary.indexed / summary.total) * 100} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Indexing Progress */}
      {isIndexing && indexingProgress.total > 0 && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Solicitando indexação...</AlertTitle>
          <AlertDescription>
            Enviando {indexingProgress.current} de {indexingProgress.total} URLs ao Google
            <Progress 
              value={(indexingProgress.current / indexingProgress.total) * 100} 
              className="mt-2 h-2" 
            />
          </AlertDescription>
        </Alert>
      )}

      {/* Results Table */}
      {auditResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Resultados da Auditoria
              </CardTitle>
              {pagesWithIssues.length > 0 && (
                <Button variant="outline" size="sm" onClick={toggleAllIssues}>
                  <Checkbox 
                    checked={pagesWithIssues.every(p => selectedUrls.has(p.url))}
                    className="mr-2"
                  />
                  Selecionar todas com problemas ({pagesWithIssues.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {auditResults.map((page) => (
                  <div key={page.url} className="border rounded-lg overflow-hidden">
                    {/* Main Row */}
                    <div 
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        !page.indexed ? 'bg-red-50 dark:bg-red-950/20' : 
                        page.issues.length > 0 ? 'bg-amber-50 dark:bg-amber-950/20' : ''
                      }`}
                      onClick={() => toggleRow(page.url)}
                    >
                      <Checkbox 
                        checked={selectedUrls.has(page.url)}
                        onCheckedChange={() => toggleUrl(page.url)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {getStatusIcon(page)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{page.url.replace(siteUrl, '')}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {page.lastCrawlTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Último crawl: {new Date(page.lastCrawlTime).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          {page.mobileUsable !== undefined && (
                            <span className="flex items-center gap-1">
                              <Smartphone className="h-3 w-3" />
                              {page.mobileUsable ? 'Mobile OK' : 'Mobile ⚠️'}
                            </span>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(page)}
                      {getIndexingResultIcon(page.url)}
                      {expandedRows.has(page.url) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    {/* Expanded Details */}
                    {expandedRows.has(page.url) && (
                      <div className="p-4 bg-muted/30 border-t space-y-3">
                        {/* Issues */}
                        {page.issues.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              Problemas Detectados
                            </h4>
                            <div className="space-y-1">
                              {page.issues.map((issue, i) => (
                                <div key={i} className={`text-sm flex items-start gap-2 ${
                                  issue.type === 'error' ? 'text-red-700' : 'text-amber-700'
                                }`}>
                                  {issue.type === 'error' ? (
                                    <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                  )}
                                  {issue.message}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggestions */}
                        {page.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                              <Lightbulb className="h-4 w-4 text-primary" />
                              Sugestões de Correção
                            </h4>
                            <div className="space-y-1">
                              {page.suggestions.map((suggestion, i) => (
                                <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <Zap className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technical Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="p-2 bg-background rounded border">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="ml-1 font-medium">{page.indexStatus}</span>
                          </div>
                          <div className="p-2 bg-background rounded border">
                            <span className="text-muted-foreground">Crawled as:</span>
                            <span className="ml-1 font-medium">{page.crawledAs}</span>
                          </div>
                          <div className="p-2 bg-background rounded border">
                            <span className="text-muted-foreground">Fetch:</span>
                            <span className="ml-1 font-medium">{page.pageFetchState}</span>
                          </div>
                          <div className="p-2 bg-background rounded border">
                            <span className="text-muted-foreground">Robots:</span>
                            <span className="ml-1 font-medium">{page.robotsTxtState}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(page.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Abrir Página
                          </Button>
                          {!page.indexed && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedUrls(new Set([page.url]));
                                requestIndexing();
                              }}
                              disabled={isIndexing}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Solicitar Indexação
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

      {/* Empty State */}
      {!isAuditing && auditResults.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma auditoria realizada</h3>
            <p className="text-muted-foreground mb-6">
              Clique no botão "Auditar Páginas" para verificar o status de indexação do seu site.
            </p>
            <Button onClick={runAudit} disabled={isAuditing} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Iniciar Auditoria
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Como funciona?</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            1. <strong>Auditar:</strong> Verifica o status de indexação de todas as páginas no Google Search Console.
          </p>
          <p>
            2. <strong>Selecionar:</strong> Páginas com problemas são automaticamente selecionadas.
          </p>
          <p>
            3. <strong>Solicitar Indexação:</strong> Envia as páginas selecionadas para o Google re-crawlear e indexar.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            * A indexação pode levar de algumas horas a alguns dias para ser processada pelo Google.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
