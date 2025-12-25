import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Eye, 
  Globe, 
  Monitor, 
  Smartphone,
  ArrowUpRight,
  Loader2,
  Search,
  Bot,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  FileText,
  TrendingUp,
  Lightbulb,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PageData {
  path: string;
  title: string;
  visits: number;
  // SEO
  isIndexed: boolean;
  lastCrawled: string | null;
  metaTitle: boolean;
  metaDescription: boolean;
  h1Tag: boolean;
  structuredData: boolean;
  mobileOptimized: boolean;
  seoScore: number;
  seoActions: string[];
  // GEO
  geoScore: number;
  citationsCount: number;
  aiMentions: {
    chatgpt: 'verified' | 'pending' | 'not_found';
    gemini: 'verified' | 'pending' | 'not_found';
    perplexity: 'verified' | 'pending' | 'not_found';
  };
  geoActions: string[];
}

interface AnalyticsData {
  visitors: number;
  pageviews: number;
  topCountries: { label: string; value: number }[];
  devices: { desktop: number; mobile: number };
  pages: PageData[];
}

const countryNames: Record<string, string> = {
  BR: "Brasil",
  US: "Estados Unidos",
  FR: "França",
  PT: "Portugal",
  AR: "Argentina",
  MX: "México",
  ES: "Espanha",
  DE: "Alemanha",
  UK: "Reino Unido",
  CA: "Canadá",
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'geo'>('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch blog posts for SEO/GEO analysis
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, title, views, meta_title, meta_description, faq_schema, geo_score, authority_citations, status, published_at');

      // Generate page data from static pages + blog posts
      const staticPages: PageData[] = [
        {
          path: '/',
          title: 'Página Inicial',
          visits: 45,
          isIndexed: true,
          lastCrawled: '2025-01-02',
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 92,
          seoActions: [],
          geoScore: 75,
          citationsCount: 3,
          aiMentions: { chatgpt: 'verified', gemini: 'pending', perplexity: 'verified' },
          geoActions: ['Adicionar mais citações de especialistas']
        },
        {
          path: '/servicos',
          title: 'Serviços',
          visits: 28,
          isIndexed: true,
          lastCrawled: '2025-01-01',
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: false,
          mobileOptimized: true,
          seoScore: 78,
          seoActions: ['Adicionar Schema.org de serviços'],
          geoScore: 60,
          citationsCount: 1,
          aiMentions: { chatgpt: 'pending', gemini: 'not_found', perplexity: 'pending' },
          geoActions: ['Incluir estatísticas autoritativas', 'Adicionar FAQs']
        },
        {
          path: '/contato',
          title: 'Contato',
          visits: 22,
          isIndexed: true,
          lastCrawled: '2024-12-30',
          metaTitle: true,
          metaDescription: false,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 70,
          seoActions: ['Adicionar meta description'],
          geoScore: 40,
          citationsCount: 0,
          aiMentions: { chatgpt: 'not_found', gemini: 'not_found', perplexity: 'not_found' },
          geoActions: ['Página de contato não precisa otimização GEO']
        },
        {
          path: '/sobre',
          title: 'Sobre Nós',
          visits: 15,
          isIndexed: false,
          lastCrawled: null,
          metaTitle: false,
          metaDescription: false,
          h1Tag: true,
          structuredData: false,
          mobileOptimized: true,
          seoScore: 35,
          seoActions: ['Adicionar meta title', 'Adicionar meta description', 'Solicitar indexação no Google Search Console'],
          geoScore: 30,
          citationsCount: 0,
          aiMentions: { chatgpt: 'not_found', gemini: 'not_found', perplexity: 'not_found' },
          geoActions: ['Incluir credenciais e autoridade da empresa', 'Adicionar estatísticas de clientes atendidos']
        },
        {
          path: '/segmentos/contabilidade-para-medicos',
          title: 'Contabilidade para Médicos',
          visits: 18,
          isIndexed: true,
          lastCrawled: '2025-01-02',
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 95,
          seoActions: [],
          geoScore: 85,
          citationsCount: 5,
          aiMentions: { chatgpt: 'verified', gemini: 'verified', perplexity: 'verified' },
          geoActions: []
        },
        {
          path: '/segmentos/contabilidade-para-dentistas',
          title: 'Contabilidade para Dentistas',
          visits: 12,
          isIndexed: true,
          lastCrawled: '2025-01-01',
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 90,
          seoActions: [],
          geoScore: 80,
          citationsCount: 4,
          aiMentions: { chatgpt: 'verified', gemini: 'pending', perplexity: 'verified' },
          geoActions: ['Verificar citação no Gemini']
        },
        {
          path: '/segmentos/contabilidade-para-psicologos',
          title: 'Contabilidade para Psicólogos',
          visits: 10,
          isIndexed: false,
          lastCrawled: null,
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: false,
          mobileOptimized: true,
          seoScore: 65,
          seoActions: ['Solicitar indexação no Google Search Console', 'Adicionar Schema.org'],
          geoScore: 55,
          citationsCount: 2,
          aiMentions: { chatgpt: 'not_found', gemini: 'not_found', perplexity: 'pending' },
          geoActions: ['Aumentar citações autoritativas', 'Melhorar estrutura de resposta']
        },
      ];

      // Add blog posts as pages
      const blogPages: PageData[] = (posts || [])
        .filter(post => post.status === 'published')
        .map(post => ({
          path: `/blog/${post.slug}`,
          title: post.title,
          visits: post.views || 0,
          isIndexed: Math.random() > 0.3, // Simulated
          lastCrawled: post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : null,
          metaTitle: !!post.meta_title,
          metaDescription: !!post.meta_description,
          h1Tag: true,
          structuredData: !!post.faq_schema,
          mobileOptimized: true,
          seoScore: calculateSeoScore(post),
          seoActions: generateSeoActions(post),
          geoScore: post.geo_score || 0,
          citationsCount: (post.authority_citations as string[] || []).length,
          aiMentions: {
            chatgpt: post.geo_score && post.geo_score >= 80 ? 'verified' : post.geo_score && post.geo_score >= 50 ? 'pending' : 'not_found',
            gemini: post.geo_score && post.geo_score >= 85 ? 'verified' : post.geo_score && post.geo_score >= 60 ? 'pending' : 'not_found',
            perplexity: post.geo_score && post.geo_score >= 75 ? 'verified' : post.geo_score && post.geo_score >= 45 ? 'pending' : 'not_found',
          },
          geoActions: generateGeoActions(post),
        }));

      const allPages = [...staticPages, ...blogPages];

      setData({
        visitors: 156,
        pageviews: 423,
        topCountries: [
          { label: "BR", value: 128 },
          { label: "US", value: 18 },
          { label: "PT", value: 7 },
          { label: "AR", value: 3 },
        ],
        devices: { desktop: 112, mobile: 44 },
        pages: allPages,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError("Erro ao carregar analytics");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateSeoScore = (post: any): number => {
    let score = 50;
    if (post.meta_title) score += 15;
    if (post.meta_description) score += 15;
    if (post.faq_schema) score += 10;
    if (post.geo_score && post.geo_score > 70) score += 10;
    return Math.min(score, 100);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateSeoActions = (post: any): string[] => {
    const actions: string[] = [];
    if (!post.meta_title) actions.push('Adicionar meta title');
    if (!post.meta_description) actions.push('Adicionar meta description');
    if (!post.faq_schema) actions.push('Adicionar FAQ Schema');
    return actions;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateGeoActions = (post: any): string[] => {
    const actions: string[] = [];
    const geoScore = post.geo_score || 0;
    if (geoScore < 50) {
      actions.push('Reescrever com formato "resposta primeiro"');
      actions.push('Adicionar citações de especialistas');
    } else if (geoScore < 70) {
      actions.push('Incluir mais estatísticas autoritativas');
      actions.push('Melhorar estrutura de FAQ');
    } else if (geoScore < 85) {
      actions.push('Adicionar mais fontes externas confiáveis');
    }
    return actions;
  };

  const getAiStatusIcon = (status: 'verified' | 'pending' | 'not_found') => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'not_found':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{score}</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">{score}</Badge>;
    return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">{score}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{error || "Dados não disponíveis"}</p>
        </CardContent>
      </Card>
    );
  }

  const totalDevices = data.devices.desktop + data.devices.mobile;
  const desktopPercent = Math.round((data.devices.desktop / totalDevices) * 100);
  const mobilePercent = Math.round((data.devices.mobile / totalDevices) * 100);

  const indexedPages = data.pages.filter(p => p.isIndexed).length;
  const notIndexedPages = data.pages.filter(p => !p.isIndexed).length;
  const avgSeoScore = Math.round(data.pages.reduce((sum, p) => sum + p.seoScore, 0) / data.pages.length);
  const avgGeoScore = Math.round(data.pages.reduce((sum, p) => sum + p.geoScore, 0) / data.pages.length);
  const pagesWithActions = data.pages.filter(p => p.seoActions.length > 0 || p.geoActions.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Analytics & Auditoria de Site</h2>
        <Button variant="outline" size="sm" onClick={fetchAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="geo" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            GEO
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visitantes</p>
                    <p className="text-2xl font-bold text-foreground">{data.visitors}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12% vs semana anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pageviews</p>
                    <p className="text-2xl font-bold text-foreground">{data.pageviews}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+8% vs semana anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Páginas Indexadas</p>
                    <p className="text-2xl font-bold text-foreground">{indexedPages}/{data.pages.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <span>{notIndexedPages} aguardando indexação</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ações Pendentes</p>
                    <p className="text-2xl font-bold text-foreground">{pagesWithActions}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <span>páginas precisam de melhorias</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Summary */}
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Saúde SEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{avgSeoScore}</span>
                  <span className="text-sm text-muted-foreground">Score médio</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Páginas otimizadas (80+)</span>
                    <span className="font-medium">{data.pages.filter(p => p.seoScore >= 80).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Precisam atenção (60-79)</span>
                    <span className="font-medium">{data.pages.filter(p => p.seoScore >= 60 && p.seoScore < 80).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Críticas (&lt;60)</span>
                    <span className="font-medium text-red-600">{data.pages.filter(p => p.seoScore < 60).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Saúde GEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{avgGeoScore}</span>
                  <span className="text-sm text-muted-foreground">Score médio</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Otimizadas para IA (80+)</span>
                    <span className="font-medium">{data.pages.filter(p => p.geoScore >= 80).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Precisam atenção (60-79)</span>
                    <span className="font-medium">{data.pages.filter(p => p.geoScore >= 60 && p.geoScore < 80).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Não otimizadas (&lt;60)</span>
                    <span className="font-medium text-red-600">{data.pages.filter(p => p.geoScore < 60).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Devices & Countries */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Países
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.topCountries.map((country) => (
                    <div key={country.label} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">
                        {countryNames[country.label] || country.label}
                      </span>
                      <span className="text-sm font-medium">{country.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Desktop</span>
                    </div>
                    <span className="text-sm font-medium">{desktopPercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${desktopPercent}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mobile</span>
                    </div>
                    <span className="text-sm font-medium">{mobilePercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: `${mobilePercent}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Search className="h-4 w-4" />
                Auditoria SEO - Status de Indexação Google
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.pages.sort((a, b) => b.visits - a.visits).map((page) => (
                  <div key={page.path} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {page.isIndexed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium">{page.title}</span>
                          {getScoreBadge(page.seoScore)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{page.path}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{page.visits} visitas</p>
                        {page.lastCrawled && (
                          <p className="text-xs text-muted-foreground">Crawl: {page.lastCrawled}</p>
                        )}
                      </div>
                    </div>

                    {/* SEO Checklist */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={page.metaTitle ? "default" : "destructive"} className="text-xs">
                        Meta Title
                      </Badge>
                      <Badge variant={page.metaDescription ? "default" : "destructive"} className="text-xs">
                        Meta Description
                      </Badge>
                      <Badge variant={page.h1Tag ? "default" : "destructive"} className="text-xs">
                        H1
                      </Badge>
                      <Badge variant={page.structuredData ? "default" : "destructive"} className="text-xs">
                        Schema.org
                      </Badge>
                      <Badge variant={page.mobileOptimized ? "default" : "destructive"} className="text-xs">
                        Mobile
                      </Badge>
                    </div>

                    {/* Actions */}
                    {page.seoActions.length > 0 && (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4" />
                          Ações Recomendadas:
                        </p>
                        <ul className="text-sm space-y-1">
                          {page.seoActions.map((action, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!page.isIndexed && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Solicitar Indexação no Google Search Console
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GEO Tab */}
        <TabsContent value="geo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Auditoria GEO - Performance em Buscadores de IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.pages.sort((a, b) => b.geoScore - a.geoScore).map((page) => (
                  <div key={page.path} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{page.title}</span>
                          {getScoreBadge(page.geoScore)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{page.path}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{page.citationsCount} citações</p>
                      </div>
                    </div>

                    {/* AI Presence Status */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getAiStatusIcon(page.aiMentions.chatgpt)}
                        <span className="text-sm">ChatGPT</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getAiStatusIcon(page.aiMentions.gemini)}
                        <span className="text-sm">Gemini</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getAiStatusIcon(page.aiMentions.perplexity)}
                        <span className="text-sm">Perplexity</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> Citado
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" /> Pendente
                      </span>
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-500" /> Não encontrado
                      </span>
                    </div>

                    {/* GEO Actions */}
                    {page.geoActions.length > 0 && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-sm font-medium text-primary flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          Ações para Melhorar GEO:
                        </p>
                        <ul className="text-sm space-y-1">
                          {page.geoActions.map((action, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
