import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Target, 
  Quote,
  BarChart2,
  ExternalLink,
  Award,
  Zap,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { format, subDays, eachDayOfInterval, eachWeekOfInterval, subMonths, isSameDay, isSameWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BlogPost } from './editorial/useEditorialData';

interface Stats {
  total: number;
  published: number;
  scheduled: number;
  drafts: number;
  avgGeoScore: number;
  highScorePosts: number;
  queueSize: number;
}

interface GEOAnalyticsDashboardProps {
  posts: BlogPost[];
  stats: Stats;
  getGEOScoreColor: (score: number | null) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#a855f7',
};

// Componente de ajuda com tooltip
function HelpTooltip({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="ml-1 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted p-0.5 transition-colors">
          <HelpCircle className="h-3.5 w-3.5" />
          <span className="sr-only">Ajuda</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[280px] text-sm">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function GEOAnalyticsDashboard({ posts, stats, getGEOScoreColor, getStatusBadge }: GEOAnalyticsDashboardProps) {
  // Dados de evolução temporal
  const timeSeriesData = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    return days.map(day => {
      const postsOnDay = posts.filter(p => {
        const postDate = new Date(p.created_at);
        return isSameDay(postDate, day);
      });
      
      const avgScore = postsOnDay.length > 0 
        ? Math.round(postsOnDay.reduce((acc, p) => acc + (p.geo_score || 0), 0) / postsOnDay.length)
        : null;
      
      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        fullDate: format(day, 'dd MMM', { locale: ptBR }),
        score: avgScore,
        posts: postsOnDay.length,
        published: postsOnDay.filter(p => p.status === 'published').length,
      };
    });
  }, [posts]);

  // Dados semanais para visão mais ampla
  const weeklyData = useMemo(() => {
    const today = new Date();
    const threeMonthsAgo = subMonths(today, 3);
    const weeks = eachWeekOfInterval({ start: threeMonthsAgo, end: today }, { weekStartsOn: 1 });
    
    return weeks.map(weekStart => {
      const postsInWeek = posts.filter(p => {
        const postDate = new Date(p.created_at);
        return isSameWeek(postDate, weekStart, { weekStartsOn: 1 });
      });
      
      const avgScore = postsInWeek.length > 0 
        ? Math.round(postsInWeek.reduce((acc, p) => acc + (p.geo_score || 0), 0) / postsInWeek.length)
        : 0;
      
      const highScoreCount = postsInWeek.filter(p => (p.geo_score || 0) >= 80).length;
      
      return {
        week: format(weekStart, "'Sem' w", { locale: ptBR }),
        fullDate: format(weekStart, "dd MMM", { locale: ptBR }),
        score: avgScore,
        posts: postsInWeek.length,
        highScore: highScoreCount,
        citations: postsInWeek.reduce((acc, p) => acc + ((p.expert_quotes as unknown[])?.length || 0), 0),
      };
    });
  }, [posts]);

  // Distribuição de scores
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { range: '0-39', min: 0, max: 39, color: COLORS.red, label: 'Baixo' },
      { range: '40-59', min: 40, max: 59, color: COLORS.yellow, label: 'Regular' },
      { range: '60-79', min: 60, max: 79, color: COLORS.blue, label: 'Bom' },
      { range: '80-100', min: 80, max: 100, color: COLORS.green, label: 'Excelente' },
    ];
    
    return ranges.map(r => ({
      ...r,
      count: posts.filter(p => {
        const score = p.geo_score || 0;
        return score >= r.min && score <= r.max;
      }).length,
    }));
  }, [posts]);

  // Métricas de citações e estatísticas
  const citationStats = useMemo(() => {
    const totalCitations = posts.reduce((acc, p) => acc + ((p.expert_quotes as unknown[])?.length || 0), 0);
    const totalStats = posts.reduce((acc, p) => acc + ((p.statistics as unknown[])?.length || 0), 0);
    const totalSources = posts.reduce((acc, p) => acc + (p.authority_citations?.length || 0), 0);
    const autoPublished = posts.filter(p => p.auto_published).length;
    
    return { totalCitations, totalStats, totalSources, autoPublished };
  }, [posts]);

  // Posts por categoria com score médio
  const categoryData = useMemo(() => {
    const categories: Record<string, { count: number; totalScore: number }> = {};
    
    posts.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = { count: 0, totalScore: 0 };
      }
      categories[p.category].count++;
      categories[p.category].totalScore += p.geo_score || 0;
    });
    
    return Object.entries(categories)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgScore: Math.round(data.totalScore / data.count),
      }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [posts]);

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <TooltipProvider delayDuration={200}>
    <div className="space-y-6">
      {/* KPIs Avançados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center">
                  Score GEO Médio
                  <HelpTooltip content="Média dos scores de otimização para IA de todos os posts. Quanto maior (ideal ≥80), mais chances de ser citado por ChatGPT, Perplexity e Google AI." />
                </p>
                <p className="text-3xl font-bold">{stats.avgGeoScore}</p>
              </div>
              <div className={`p-3 rounded-full ${stats.avgGeoScore >= 80 ? 'bg-green-500/10' : stats.avgGeoScore >= 60 ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                <TrendingUp className={`h-6 w-6 ${getGEOScoreColor(stats.avgGeoScore)}`} />
              </div>
            </div>
            <Progress value={stats.avgGeoScore} className="mt-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center">
                  Posts Score 80+
                  <HelpTooltip content="Quantidade de posts com score excelente (≥80). Esses posts têm alta probabilidade de serem citados por motores de IA e são elegíveis para auto-publicação." />
                </p>
                <p className="text-3xl font-bold">{stats.highScorePosts}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.total > 0 ? Math.round((stats.highScorePosts / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center">
                  Taxa de Publicação
                  <HelpTooltip content="Percentual de posts que foram publicados em relação ao total criado. Uma taxa alta indica um bom fluxo editorial com poucos rascunhos parados." />
                </p>
                <p className="text-3xl font-bold">{stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}%</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.published} de {stats.total} posts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center">
                  Fila Ativa
                  <HelpTooltip content="Tópicos aguardando geração automática de conteúdo pela IA. A geração ocorre diariamente às 9h UTC com pesquisa via Perplexity." />
                </p>
                <p className="text-3xl font-bold">{stats.queueSize}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              tópicos para geração
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Citações */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Quote className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{citationStats.totalCitations}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  Citações de Especialistas
                  <HelpTooltip content="Falas de especialistas (contadores, advogados, consultores) incluídas nos posts. Citações de autoridades aumentam a credibilidade e chance de ser referenciado por IAs." />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BarChart2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{citationStats.totalStats}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  Estatísticas Incluídas
                  <HelpTooltip content="Dados numéricos com fontes oficiais (IBGE, Receita Federal, CFM). Estatísticas verificáveis tornam o conteúdo mais confiável para motores de IA." />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <ExternalLink className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{citationStats.totalSources}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  Fontes Autoritativas
                  <HelpTooltip content="Links para fontes oficiais e confiáveis citadas nos posts. Referenciar fontes de autoridade melhora o E-E-A-T (experiência, especialização, autoridade, confiabilidade)." />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{citationStats.autoPublished}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  Auto-Publicados
                  <HelpTooltip content="Posts que atingiram o score mínimo GEO e foram publicados automaticamente sem revisão manual. Indica eficiência do sistema de geração de conteúdo." />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução do Score GEO - Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evolução do Score GEO
              <HelpTooltip content="Mostra a evolução da média do score GEO ao longo das semanas. Uma tendência de alta indica melhoria na qualidade do conteúdo para otimização em IA." />
            </CardTitle>
            <CardDescription>Média semanal nos últimos 3 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                  name="Score GEO"
                />
                <Line 
                  type="monotone" 
                  dataKey="highScore" 
                  stroke={COLORS.green}
                  strokeWidth={2}
                  dot={false}
                  name="Posts 80+"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Distribuição de Scores
              <HelpTooltip content="Divide os posts em 4 faixas de qualidade. O ideal é ter a maioria dos posts nas faixas 'Bom' (60-79) e 'Excelente' (80-100)." />
            </CardTitle>
            <CardDescription>Classificação de qualidade GEO</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="count"
                  label={({ label, count }) => count > 0 ? `${label}: ${count}` : ''}
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend 
                  formatter={(value, entry: any) => (
                    <span className="text-sm">{entry.payload.label} ({entry.payload.range})</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Produção e Citações por Semana */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Produção e Citações por Semana
            <HelpTooltip content="Acompanhe o volume de produção de conteúdo e a quantidade de citações de especialistas por semana. Mais citações = maior autoridade do conteúdo." />
          </CardTitle>
          <CardDescription>Volume de posts e citações de especialistas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="posts" 
                fill={COLORS.blue} 
                name="Posts Criados"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="citations" 
                fill={COLORS.purple} 
                name="Citações"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Score por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Score Médio por Categoria
              <HelpTooltip content="Compare o desempenho GEO entre diferentes categorias de conteúdo. Identifique quais tipos de conteúdo têm melhor otimização e quais precisam de atenção." />
            </CardTitle>
            <CardDescription>Desempenho GEO por tipo de conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.slice(0, 6).map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium truncate">{cat.name}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={cat.avgScore} 
                        className="flex-1"
                      />
                      <span className={`text-sm font-bold w-10 text-right ${
                        cat.avgScore >= 80 ? 'text-green-600' : 
                        cat.avgScore >= 60 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {cat.avgScore}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {cat.count} posts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts por Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Posts por Score GEO
              <HelpTooltip content="Os 5 posts com maior score GEO. Estes são seus melhores conteúdos para serem citados por IAs como ChatGPT e Perplexity." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {posts
                .sort((a, b) => (b.geo_score || 0) - (a.geo_score || 0))
                .slice(0, 5)
                .map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-amber-500 text-white' : 
                        index === 1 ? 'bg-slate-400 text-white' : 
                        index === 2 ? 'bg-amber-700 text-white' : 
                        'bg-primary/10 text-primary'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          {getStatusBadge(post.status)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getGEOScoreColor(post.geo_score)}`}>
                      {post.geo_score || 0}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}
