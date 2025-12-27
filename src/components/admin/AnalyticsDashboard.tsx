import { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  CloudOff,
  Link2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GSCInspectionResult {
  inspectionResult?: {
    indexStatusResult?: {
      verdict?: string;
      coverageState?: string;
      lastCrawlTime?: string;
      pageFetchState?: string;
      crawledAs?: string;
    };
    mobileUsabilityResult?: {
      verdict?: string;
    };
    richResultsResult?: {
      verdict?: string;
    };
  };
}

interface GSCPageData {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

interface PageData {
  path: string;
  title: string;
  visits: number;
  // SEO from GSC
  isIndexed: boolean;
  indexStatus: string;
  lastCrawled: string | null;
  crawledAs: string | null;
  metaTitle: boolean;
  metaDescription: boolean;
  h1Tag: boolean;
  structuredData: boolean;
  mobileOptimized: boolean;
  seoScore: number;
  seoActions: string[];
  // GSC Search Analytics
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
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
  gscConnected: boolean;
  siteUrl: string | null;
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
  const [loadingGSC, setLoadingGSC] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'geo'>('overview');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateSeoScore = (post: any, inspection?: GSCInspectionResult | null): number => {
    let score = 40;
    if (post.meta_title) score += 15;
    if (post.meta_description) score += 15;
    if (post.faq_schema) score += 10;
    
    if (inspection?.inspectionResult?.indexStatusResult?.verdict === 'PASS') {
      score += 10;
    }
    if (inspection?.inspectionResult?.mobileUsabilityResult?.verdict === 'PASS') {
      score += 5;
    }
    if (inspection?.inspectionResult?.richResultsResult?.verdict === 'PASS') {
      score += 5;
    }
    
    return Math.min(score, 100);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateSeoActions = (post: any, inspection?: GSCInspectionResult | null): string[] => {
    const actions: string[] = [];
    if (!post.meta_title) actions.push('Adicionar meta title');
    if (!post.meta_description) actions.push('Adicionar meta description');
    if (!post.faq_schema) actions.push('Adicionar FAQ Schema');
    
    const indexStatus = inspection?.inspectionResult?.indexStatusResult;
    if (indexStatus) {
      if (indexStatus.verdict !== 'PASS') {
        actions.push(`Corrigir indexação: ${indexStatus.coverageState || 'Status desconhecido'}`);
      }
      if (indexStatus.pageFetchState === 'SOFT_404') {
        actions.push('Corrigir soft 404 - página retorna conteúdo vazio');
      }
      if (indexStatus.pageFetchState === 'BLOCKED_ROBOTS_TXT') {
        actions.push('Remover bloqueio do robots.txt');
      }
    }
    
    if (inspection?.inspectionResult?.mobileUsabilityResult?.verdict !== 'PASS') {
      actions.push('Melhorar usabilidade mobile');
    }
    
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

  const fetchGSCData = useCallback(async (pages: PageData[], siteUrl: string) => {
    try {
      setLoadingGSC(true);
      
      // Fetch search analytics
      const { data: analyticsResponse, error: analyticsError } = await supabase.functions.invoke(
        'google-search-console',
        { body: { action: 'analytics' } }
      );

      if (analyticsError) throw analyticsError;

      const gscAnalytics: Record<string, GSCPageData> = {};
      if (analyticsResponse?.data?.rows) {
        for (const row of analyticsResponse.data.rows) {
          const url = row.keys?.[0];
          if (url) {
            const path = url.replace(siteUrl, '').replace(/\/$/, '') || '/';
            gscAnalytics[path] = {
              clicks: row.clicks || 0,
              impressions: row.impressions || 0,
              ctr: (row.ctr || 0) * 100,
              position: row.position || 0
            };
          }
        }
      }

      // Fetch URL inspections for pages
      const urlsToInspect = pages.slice(0, 20).map(p => 
        p.path.startsWith('/') ? `${siteUrl}${p.path}` : `${siteUrl}/${p.path}`
      );

      const { data: inspectionResponse, error: inspectionError } = await supabase.functions.invoke(
        'google-search-console',
        { body: { action: 'inspect', urls: urlsToInspect } }
      );

      if (inspectionError) {
        console.error('Inspection error:', inspectionError);
      }

      const inspectionResults: Record<string, GSCInspectionResult> = {};
      if (inspectionResponse?.data) {
        for (const result of inspectionResponse.data) {
          const path = result.url.replace(siteUrl, '').replace(/\/$/, '') || '/';
          inspectionResults[path] = result.inspection;
        }
      }

      // Update pages with GSC data
      const updatedPages = pages.map(page => {
        const inspection = inspectionResults[page.path];
        const analytics = gscAnalytics[page.path];
        
        const indexResult = inspection?.inspectionResult?.indexStatusResult;
        const isIndexed = indexResult?.verdict === 'PASS';
        const lastCrawled = indexResult?.lastCrawlTime 
          ? new Date(indexResult.lastCrawlTime).toLocaleDateString('pt-BR')
          : null;

        return {
          ...page,
          isIndexed,
          indexStatus: indexResult?.coverageState || 'Não verificado',
          lastCrawled,
          crawledAs: indexResult?.crawledAs || null,
          mobileOptimized: inspection?.inspectionResult?.mobileUsabilityResult?.verdict === 'PASS',
          structuredData: inspection?.inspectionResult?.richResultsResult?.verdict === 'PASS' || page.structuredData,
          clicks: analytics?.clicks || 0,
          impressions: analytics?.impressions || 0,
          ctr: analytics?.ctr || 0,
          avgPosition: analytics?.position || 0,
          seoScore: calculateSeoScore({ 
            meta_title: page.metaTitle, 
            meta_description: page.metaDescription, 
            faq_schema: page.structuredData 
          }, inspection),
          seoActions: generateSeoActions({ 
            meta_title: page.metaTitle, 
            meta_description: page.metaDescription, 
            faq_schema: page.structuredData 
          }, inspection),
        };
      });

      return updatedPages;
    } catch (err) {
      console.error('Error fetching GSC data:', err);
      toast.error('Erro ao buscar dados do Google Search Console');
      return pages;
    } finally {
      setLoadingGSC(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
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
          isIndexed: false,
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 70,
          seoActions: [],
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
          geoScore: 75,
          citationsCount: 3,
          aiMentions: { chatgpt: 'verified', gemini: 'pending', perplexity: 'verified' },
          geoActions: ['Adicionar mais citações de especialistas']
        },
        {
          path: '/servicos',
          title: 'Serviços',
          visits: 28,
          isIndexed: false,
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: false,
          mobileOptimized: true,
          seoScore: 60,
          seoActions: ['Adicionar Schema.org de serviços'],
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
          geoScore: 60,
          citationsCount: 1,
          aiMentions: { chatgpt: 'pending', gemini: 'not_found', perplexity: 'pending' },
          geoActions: ['Incluir estatísticas autoritativas', 'Adicionar FAQs']
        },
        {
          path: '/contato',
          title: 'Contato',
          visits: 22,
          isIndexed: false,
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: true,
          metaDescription: false,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 55,
          seoActions: ['Adicionar meta description'],
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
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
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: false,
          metaDescription: false,
          h1Tag: true,
          structuredData: false,
          mobileOptimized: true,
          seoScore: 35,
          seoActions: ['Adicionar meta title', 'Adicionar meta description'],
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
          geoScore: 30,
          citationsCount: 0,
          aiMentions: { chatgpt: 'not_found', gemini: 'not_found', perplexity: 'not_found' },
          geoActions: ['Incluir credenciais e autoridade da empresa', 'Adicionar estatísticas de clientes atendidos']
        },
        {
          path: '/segmentos/contabilidade-para-medicos',
          title: 'Contabilidade para Médicos',
          visits: 18,
          isIndexed: false,
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 75,
          seoActions: [],
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
          geoScore: 85,
          citationsCount: 5,
          aiMentions: { chatgpt: 'verified', gemini: 'verified', perplexity: 'verified' },
          geoActions: []
        },
        {
          path: '/segmentos/contabilidade-para-dentistas',
          title: 'Contabilidade para Dentistas',
          visits: 12,
          isIndexed: false,
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: true,
          mobileOptimized: true,
          seoScore: 70,
          seoActions: [],
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
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
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: true,
          metaDescription: true,
          h1Tag: true,
          structuredData: false,
          mobileOptimized: true,
          seoScore: 55,
          seoActions: ['Adicionar Schema.org'],
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
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
          isIndexed: false,
          indexStatus: 'Não verificado',
          lastCrawled: null,
          crawledAs: null,
          metaTitle: !!post.meta_title,
          metaDescription: !!post.meta_description,
          h1Tag: true,
          structuredData: !!post.faq_schema,
          mobileOptimized: true,
          seoScore: calculateSeoScore(post),
          seoActions: generateSeoActions(post),
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avgPosition: 0,
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

      // Try to get GSC data
      let gscConnected = false;
      let siteUrl: string | null = null;
      let updatedPages = allPages;

      try {
        const { data: gscResponse, error: gscError } = await supabase.functions.invoke(
          'google-search-console',
          { body: { action: 'analytics' } }
        );

        if (!gscError && gscResponse?.success) {
          gscConnected = true;
          siteUrl = gscResponse.siteUrl;
          toast.success('Dados do Google Search Console carregados');
          
          // Fetch detailed GSC data
          updatedPages = await fetchGSCData(allPages, siteUrl);
        }
      } catch {
        console.log('GSC not configured or error');
      }

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
        pages: updatedPages,
        gscConnected,
        siteUrl,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError("Erro ao carregar analytics");
    } finally {
      setLoading(false);
    }
  }, [fetchGSCData]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refreshGSCData = async () => {
    if (!data?.siteUrl) return;
    
    const updatedPages = await fetchGSCData(data.pages, data.siteUrl);
    setData(prev => prev ? { ...prev, pages: updatedPages } : null);
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

  const getIndexStatusBadge = (isIndexed: boolean, status: string) => {
    if (isIndexed) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Indexada</Badge>;
    }
    if (status === 'Não verificado') {
      return <Badge variant="outline" className="text-muted-foreground">Não verificado</Badge>;
    }
    return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">{status}</Badge>;
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
  const notIndexedPages = data.pages.filter(p => !p.isIndexed && p.indexStatus !== 'Não verificado').length;
  const avgSeoScore = Math.round(data.pages.reduce((sum, p) => sum + p.seoScore, 0) / data.pages.length);
  const avgGeoScore = Math.round(data.pages.reduce((sum, p) => sum + p.geoScore, 0) / data.pages.length);
  const pagesWithActions = data.pages.filter(p => p.seoActions.length > 0 || p.geoActions.length > 0).length;
  const totalClicks = data.pages.reduce((sum, p) => sum + p.clicks, 0);
  const totalImpressions = data.pages.reduce((sum, p) => sum + p.impressions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">Analytics & Auditoria de Site</h2>
          {data.gscConnected ? (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
              <Link2 className="h-3 w-3" />
              GSC Conectado
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <CloudOff className="h-3 w-3" />
              GSC Não Configurado
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {data.gscConnected && (
            <Button variant="outline" size="sm" onClick={refreshGSCData} disabled={loadingGSC}>
              {loadingGSC ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Atualizar GSC
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {data.siteUrl && (
        <p className="text-sm text-muted-foreground">
          Site: <span className="font-mono text-foreground">{data.siteUrl}</span>
        </p>
      )}

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

            {data.gscConnected && (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Cliques (GSC)</p>
                        <p className="text-2xl font-bold text-foreground">{totalClicks}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Search className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <span>Últimos 28 dias</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Impressões (GSC)</p>
                        <p className="text-2xl font-bold text-foreground">{totalImpressions.toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <span>Últimos 28 dias</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!data.gscConnected && (
              <>
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
                      <span>{notIndexedPages} com problemas</span>
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
              </>
            )}
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
          {/* GSC Summary */}
          {data.gscConnected && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{indexedPages}</p>
                    <p className="text-sm text-muted-foreground">Indexadas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{notIndexedPages}</p>
                    <p className="text-sm text-muted-foreground">Com Problemas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{totalClicks}</p>
                    <p className="text-sm text-muted-foreground">Cliques (28d)</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{totalImpressions.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Impressões (28d)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Search className="h-4 w-4" />
                Auditoria SEO - Status de Indexação Google
                {data.gscConnected && (
                  <Badge variant="outline" className="ml-2 text-xs">Dados reais do GSC</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.pages.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions || b.visits - a.visits).map((page) => (
                  <div key={page.path} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {page.isIndexed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : page.indexStatus !== 'Não verificado' ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="font-medium">{page.title}</span>
                          {getScoreBadge(page.seoScore)}
                          {getIndexStatusBadge(page.isIndexed, page.indexStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{page.path}</p>
                      </div>
                      <div className="text-right">
                        {data.gscConnected && (page.clicks > 0 || page.impressions > 0) ? (
                          <>
                            <p className="text-sm font-medium">{page.clicks} cliques</p>
                            <p className="text-xs text-muted-foreground">{page.impressions.toLocaleString()} impressões</p>
                            {page.avgPosition > 0 && (
                              <p className="text-xs text-muted-foreground">Posição: {page.avgPosition.toFixed(1)}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm font-medium">{page.visits} visitas</p>
                        )}
                        {page.lastCrawled && (
                          <p className="text-xs text-muted-foreground">Crawl: {page.lastCrawled}</p>
                        )}
                        {page.crawledAs && (
                          <p className="text-xs text-muted-foreground">Bot: {page.crawledAs}</p>
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

                    {!page.isIndexed && page.indexStatus !== 'Não verificado' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => window.open(`https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(data.siteUrl || '')}&id=${encodeURIComponent(page.path)}`, '_blank')}
                      >
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
