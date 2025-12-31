import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Zap, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Quote,
  BarChart2,
  Calendar,
  Eye,
  ExternalLink,
  Loader2,
  Settings,
  Lightbulb,
  MapPin,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GEOSettings {
  id: string;
  min_geo_score_publish: number;
  auto_suggest_frequency: string;
  preferred_expert_types: string[];
  brand_statistics: any[];
  target_personas: string[];
  brand_name: string;
  brand_authority_keywords: string[];
}

interface TopicSuggestion {
  topic: string;
  category: string;
  search_query: string;
  geo_potential: 'alto' | 'medio' | 'baixo';
  reasoning: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  geo_score: number | null;
  expert_quotes: any[] | null;
  statistics: any[] | null;
  authority_citations: string[] | null;
  auto_published: boolean | null;
  created_at: string;
  published_at: string | null;
}

interface PendingTopic {
  id: string;
  topic: string;
  category: string;
  scheduled_date: string;
  status: string;
}

export function BlogGEODashboard() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<GEOSettings | null>(null);
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [pendingTopics, setPendingTopics] = useState<PendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestingTopics, setSuggestingTopics] = useState(false);
  const [generatingContent, setGeneratingContent] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [publishingToGMB, setPublishingToGMB] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('geo_settings')
        .select('*')
        .limit(1)
        .single();

      if (settingsData) {
        setSettings(settingsData as GEOSettings);
      }

      // Fetch recent posts with GEO data
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('id, title, slug, status, geo_score, expert_quotes, statistics, authority_citations, auto_published, created_at, published_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (postsData) {
        setRecentPosts(postsData as BlogPost[]);
      }

      // Fetch pending topics
      const { data: topicsData } = await supabase
        .from('blog_topics')
        .select('id, topic, category, scheduled_date, status')
        .in('status', ['pending', 'generating'])
        .order('scheduled_date', { ascending: true })
        .limit(10);

      if (topicsData) {
        setPendingTopics(topicsData as PendingTopic[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTopics = async () => {
    setSuggestingTopics(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-geo-topics', {
        body: { num_suggestions: 10, auto_schedule: false }
      });

      if (error) throw error;

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        toast({
          title: 'Tópicos sugeridos!',
          description: `${data.suggestions.length} tópicos com potencial GEO encontrados.`,
        });
      }
    } catch (error) {
      console.error('Error suggesting topics:', error);
      toast({
        title: 'Erro ao sugerir tópicos',
        description: 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      });
    } finally {
      setSuggestingTopics(false);
    }
  };

  const handleScheduleTopic = async (suggestion: TopicSuggestion) => {
    try {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 1);

      const { error } = await supabase
        .from('blog_topics')
        .insert({
          topic: suggestion.topic,
          category: suggestion.category,
          search_query: suggestion.search_query,
          scheduled_date: scheduledDate.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      setSuggestions(prev => prev.filter(s => s.topic !== suggestion.topic));
      fetchData();

      toast({
        title: 'Tópico agendado!',
        description: `"${suggestion.topic}" foi adicionado à fila.`,
      });
    } catch (error) {
      console.error('Error scheduling topic:', error);
      toast({
        title: 'Erro ao agendar',
        description: 'Não foi possível agendar o tópico.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateNow = async (topicId: string) => {
    setGeneratingContent(topicId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { topic_id: topicId }
      });

      if (error) throw error;

      fetchData();

      toast({
        title: 'Conteúdo gerado!',
        description: data?.results?.[0]?.geoScore 
          ? `Score GEO: ${data.results[0].geoScore}/100`
          : 'Post criado com sucesso.',
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Erro na geração',
        description: 'Falha ao gerar conteúdo. Verifique os logs.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingContent(null);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from('geo_settings')
        .update({
          min_geo_score_publish: settings.min_geo_score_publish,
          brand_name: settings.brand_name,
          target_personas: settings.target_personas,
          brand_authority_keywords: settings.brand_authority_keywords
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: 'Configurações salvas!',
        description: 'As configurações GEO foram atualizadas.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePublishToGMB = async (postId: string, postTitle: string) => {
    setPublishingToGMB(postId);
    try {
      const { data, error } = await supabase.functions.invoke('publish-to-gmb', {
        body: { 
          postId,
          siteUrl: 'https://contabilidadezen.com.br'
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Publicado no Google Meu Negócio!',
          description: `"${postTitle}" foi compartilhado com sucesso.`,
        });
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('Error publishing to GMB:', error);
      toast({
        title: 'Erro ao publicar no GMB',
        description: error.message || 'Não foi possível publicar. Verifique as credenciais.',
        variant: 'destructive',
      });
    } finally {
      setPublishingToGMB(null);
    }
  };

  const getGEOScoreColor = (score: number | null) => {
    if (!score) return 'bg-muted';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGEOScoreLabel = (score: number | null) => {
    if (!score) return 'N/A';
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Baixo';
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'alto': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medio': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Calculate stats
  const avgGEOScore = recentPosts.length > 0
    ? Math.round(recentPosts.reduce((acc, p) => acc + (p.geo_score || 0), 0) / recentPosts.length)
    : 0;
  const autoPublishedCount = recentPosts.filter(p => p.auto_published).length;
  const highScoreCount = recentPosts.filter(p => (p.geo_score || 0) >= 80).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Blog + GEO Unificado</CardTitle>
              <CardDescription>
                Geração automática de conteúdo otimizado para IA com citações, estatísticas e FAQ Schema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score GEO Médio</p>
                <p className="text-3xl font-bold">{avgGEOScore}</p>
              </div>
              <div className={`p-3 rounded-full ${getGEOScoreColor(avgGEOScore)}/10`}>
                <TrendingUp className={`h-6 w-6 ${avgGEOScore >= 80 ? 'text-green-600' : avgGEOScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
              </div>
            </div>
            <Progress value={avgGEOScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts Score 80+</p>
                <p className="text-3xl font-bold">{highScoreCount}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              de {recentPosts.length} posts recentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Publicados</p>
                <p className="text-3xl font-bold">{autoPublishedCount}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              score ≥ {settings?.min_geo_score_publish || 80}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Na Fila</p>
                <p className="text-3xl font-bold">{pendingTopics.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              tópicos aguardando geração
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden md:inline">Sugerir & Gerar</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Fila</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Posts GEO</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Config</span>
          </TabsTrigger>
        </TabsList>

        {/* Suggest & Generate Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Sugestões de Tópicos GEO</CardTitle>
                  <CardDescription>
                    Tópicos com alto potencial de citação por IAs
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleSuggestTopics} 
                  disabled={suggestingTopics}
                  className="gap-2"
                >
                  {suggestingTopics ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Buscar Tópicos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Clique em "Buscar Tópicos" para obter sugestões com potencial GEO</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{suggestion.category}</Badge>
                              <Badge className={getPotentialColor(suggestion.geo_potential)}>
                                Potencial {suggestion.geo_potential}
                              </Badge>
                            </div>
                            <h4 className="font-medium mb-1">{suggestion.topic}</h4>
                            <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleScheduleTopic(suggestion)}
                          >
                            Agendar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fila de Geração</CardTitle>
              <CardDescription>
                Tópicos agendados para geração automática de conteúdo GEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTopics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum tópico na fila. Adicione sugestões!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTopics.map((topic) => (
                    <div 
                      key={topic.id}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{topic.category}</Badge>
                          <Badge variant={topic.status === 'generating' ? 'default' : 'secondary'}>
                            {topic.status === 'generating' ? 'Gerando...' : 'Pendente'}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{topic.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          Agendado: {format(new Date(topic.scheduled_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateNow(topic.id)}
                        disabled={generatingContent === topic.id || topic.status === 'generating'}
                      >
                        {generatingContent === topic.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        <span className="ml-2">Gerar Agora</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posts com Dados GEO</CardTitle>
              <CardDescription>
                Visualize score, citações e estatísticas de cada post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div 
                      key={post.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                              {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </Badge>
                            {post.auto_published && (
                              <Badge variant="outline" className="gap-1">
                                <Zap className="h-3 w-3" />
                                Auto
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium line-clamp-1">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(post.created_at), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getGEOScoreColor(post.geo_score)}/10`}>
                            <span className={`w-2 h-2 rounded-full ${getGEOScoreColor(post.geo_score)}`}></span>
                            {post.geo_score || 0}/100
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getGEOScoreLabel(post.geo_score)}
                          </p>
                        </div>
                      </div>

                      {/* GEO Details */}
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Quote className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {(post.expert_quotes as any[])?.length || 0} citações
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {(post.statistics as any[])?.length || 0} estatísticas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {post.authority_citations?.length || 0} fontes
                          </span>
                        </div>
                      </div>

                      {post.status === 'published' && (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1 gap-2"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                            Ver Post
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 gap-2"
                            onClick={() => handlePublishToGMB(post.id, post.title)}
                            disabled={publishingToGMB === post.id}
                          >
                            {publishingToGMB === post.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                            Publicar GMB
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações GEO</CardTitle>
              <CardDescription>
                Defina parâmetros para geração automática de conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="brand_name">Nome da Marca</Label>
                      <Input 
                        id="brand_name"
                        value={settings.brand_name}
                        onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min_score">Score Mínimo para Auto-Publicar</Label>
                      <div className="flex items-center gap-4">
                        <Input 
                          id="min_score"
                          type="number"
                          min={0}
                          max={100}
                          value={settings.min_geo_score_publish}
                          onChange={(e) => setSettings({ ...settings, min_geo_score_publish: parseInt(e.target.value) || 80 })}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">
                          Posts com score ≥ {settings.min_geo_score_publish} serão publicados automaticamente
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personas">Personas Alvo (separadas por vírgula)</Label>
                    <Input 
                      id="personas"
                      value={settings.target_personas.join(', ')}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        target_personas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="médicos, dentistas, psicólogos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords de Autoridade (separadas por vírgula)</Label>
                    <Input 
                      id="keywords"
                      value={settings.brand_authority_keywords.join(', ')}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        brand_authority_keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="contabilidade saúde, contador médico"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="gap-2"
                  >
                    {savingSettings ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Salvar Configurações
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
