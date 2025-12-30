import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, FileText, Lightbulb, Wand2, Loader2, Sparkles, Copy, RotateCcw, Save, FileDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
}

interface AuditResult {
  score: number;
  issues: { type: 'error' | 'warning' | 'success'; message: string }[];
  suggestions: string[];
  answerFirstCheck: boolean;
  wordCountFirst50: number;
  hasFAQ: boolean;
  faqCount: number;
}

export function ContentAuditor() {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [optimizedContent, setOptimizedContent] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, content, slug, status')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleSelectPost = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      setSelectedPostId(postId);
      setContent(post.content);
      setResult(null);
      setOptimizedContent(null);
      toast({ title: 'Post carregado', description: `"${post.title}" foi carregado para análise.` });
    }
  };

  const handleSaveToPost = async () => {
    if (!selectedPostId || !optimizedContent) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ content: optimizedContent, updated_at: new Date().toISOString() })
        .eq('id', selectedPostId);

      if (error) throw error;

      toast({ title: 'Salvo com sucesso!', description: 'O conteúdo otimizado foi aplicado ao post.' });
      setContent(optimizedContent);
      setOptimizedContent(null);
      setResult(null);
      fetchBlogPosts();
    } catch (error) {
      console.error('Error saving:', error);
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar o conteúdo.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const analyzeContent = () => {
    setIsAnalyzing(true);
    setOptimizedContent(null);
    
    // Simulated analysis
    setTimeout(() => {
      const words = content.split(/\s+/).filter(w => w.length > 0);
      const first50Words = words.slice(0, 50).join(' ');
      const hasQuestionMark = first50Words.includes('?');
      const hasDirectAnswer = /^(sim|não|o|a|para|quando|como|porque)/i.test(content.trim());
      const faqMatches = content.match(/\?[\s\S]*?(?=\?|$)/g) || [];
      
      const issues: AuditResult['issues'] = [];
      const suggestions: string[] = [];
      let score = 100;

      // Check answer-first principle
      if (!hasDirectAnswer) {
        issues.push({ type: 'warning', message: 'O insight principal não está nas primeiras palavras' });
        suggestions.push('Comece o texto com a resposta direta à pergunta do usuário');
        score -= 15;
      } else {
        issues.push({ type: 'success', message: 'Conteúdo segue a arquitetura "Resposta Primeiro"' });
      }

      // Check word count
      if (words.length < 300) {
        issues.push({ type: 'warning', message: `Conteúdo curto (${words.length} palavras). Recomendado: 800-1500 palavras` });
        suggestions.push('Expanda o conteúdo para 800-1500 palavras para melhor cobertura do tema');
        score -= 10;
      }

      // Check FAQ structure
      if (faqMatches.length < 3) {
        issues.push({ type: 'error', message: 'Poucos pares de pergunta/resposta identificados' });
        suggestions.push('Adicione uma seção de FAQ com 5-7 perguntas frequentes');
        suggestions.push('Cada resposta deve ter 40-60 palavras para facilitar extração pela IA');
        score -= 20;
      } else {
        issues.push({ type: 'success', message: `${faqMatches.length} pares de FAQ detectados` });
      }

      // Check for statistics
      const hasStats = /\d+%|\d+\s*(mil|milhões|bilhões)/i.test(content);
      if (!hasStats) {
        issues.push({ type: 'warning', message: 'Sem estatísticas quantitativas detectadas' });
        suggestions.push('Adicione dados estatísticos para aumentar credibilidade (+40% visibilidade)');
        score -= 15;
      } else {
        issues.push({ type: 'success', message: 'Estatísticas quantitativas presentes' });
      }

      // Check for expert citations
      const hasQuotes = content.includes('"') || content.includes('segundo') || content.includes('de acordo com');
      if (!hasQuotes) {
        issues.push({ type: 'warning', message: 'Sem citações de especialistas detectadas' });
        suggestions.push('Inclua citações de especialistas ou fontes reconhecidas');
        score -= 10;
      } else {
        issues.push({ type: 'success', message: 'Citações de especialistas presentes' });
      }

      // Check for freshness signals
      const hasDate = /202[4-9]|última atualização|atualizado em/i.test(content);
      if (!hasDate) {
        issues.push({ type: 'warning', message: 'Sem sinais de "freshness" (data de atualização)' });
        suggestions.push('Adicione "Última atualização: [data]" para sinalizar conteúdo atual');
        score -= 10;
      } else {
        issues.push({ type: 'success', message: 'Sinais de freshness presentes' });
      }

      setResult({
        score: Math.max(0, score),
        issues,
        suggestions,
        answerFirstCheck: hasDirectAnswer,
        wordCountFirst50: Math.min(50, words.length),
        hasFAQ: faqMatches.length >= 3,
        faqCount: faqMatches.length,
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleOptimizeContent = async () => {
    if (!result || !content) return;

    setIsOptimizing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('optimize-content', {
        body: { 
          content,
          issues: result.issues,
          suggestions: result.suggestions
        },
      });

      if (error) throw error;

      if (data?.optimizedContent) {
        setOptimizedContent(data.optimizedContent);
        toast({ 
          title: 'Conteúdo otimizado!', 
          description: `Tamanho original: ${data.originalLength} → Novo: ${data.newLength} caracteres` 
        });
      } else {
        toast({ title: 'Erro ao otimizar', description: 'Nenhum conteúdo gerado.', variant: 'destructive' });
      }
    } catch (error: any) {
      console.error('Optimization error:', error);
      
      if (error?.message?.includes('429') || error?.status === 429) {
        toast({ 
          title: 'Limite de taxa excedido', 
          description: 'Aguarde um momento e tente novamente.', 
          variant: 'destructive' 
        });
      } else if (error?.message?.includes('402') || error?.status === 402) {
        toast({ 
          title: 'Créditos insuficientes', 
          description: 'Adicione créditos em Configurações → Workspace → Usage.', 
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Erro ao otimizar', 
          description: 'Por favor, tente novamente.', 
          variant: 'destructive' 
        });
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopyOptimized = () => {
    if (optimizedContent) {
      navigator.clipboard.writeText(optimizedContent);
      toast({ title: 'Copiado!', description: 'Conteúdo otimizado copiado para a área de transferência.' });
    }
  };

  const handleUseOptimized = () => {
    if (optimizedContent) {
      setContent(optimizedContent);
      setOptimizedContent(null);
      setResult(null);
      toast({ title: 'Conteúdo aplicado!', description: 'Analise novamente para verificar a pontuação.' });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const hasIssues = result && result.issues.some(i => i.type !== 'success');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Auditor de Conteúdo "Answer-First"
          </CardTitle>
          <CardDescription>
            Cole o conteúdo da página para análise de otimização GEO. O sistema verificará a estrutura, FAQ e sinais de autoridade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Post Selector */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={selectedPostId || ''} onValueChange={handleSelectPost}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingPosts ? "Carregando posts..." : "Selecione um post existente (opcional)"} />
                </SelectTrigger>
                <SelectContent>
                  {blogPosts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {post.status === 'published' ? 'Pub' : post.status === 'draft' ? 'Rasc' : 'Agend'}
                        </Badge>
                        <span className="truncate max-w-[300px]">{post.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPostId && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedPostId(null);
                  setContent('');
                  setResult(null);
                  setOptimizedContent(null);
                }}
              >
                Limpar Seleção
              </Button>
            )}
          </div>

          <Textarea
            placeholder="Cole aqui o conteúdo da página que deseja analisar ou selecione um post acima..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex gap-2">
            <Button onClick={analyzeContent} disabled={!content.trim() || isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Analisar Conteúdo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Score Card with Fix Button */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pontuação GEO</CardTitle>
                {hasIssues && (
                  <Button 
                    onClick={handleOptimizeContent} 
                    disabled={isOptimizing}
                    className="gap-2"
                    variant={result.score < 60 ? 'destructive' : 'default'}
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Otimizando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Corrigir Automaticamente com IA
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
                <div className="flex-1">
                  <Progress value={result.score} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.score >= 80 ? 'Excelente! Conteúdo bem otimizado para IA.' :
                     result.score >= 60 ? 'Bom, mas há oportunidades de melhoria.' :
                     'Precisa de otimização significativa. Use o botão "Corrigir Automaticamente" acima.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimized Content Result */}
          {optimizedContent && (
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Conteúdo Otimizado
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={handleCopyOptimized}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleUseOptimized}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Usar e Reanalisar
                    </Button>
                    {selectedPostId && (
                      <Button size="sm" onClick={handleSaveToPost} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar no Post
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription>
                  O conteúdo foi reescrito para melhorar a pontuação GEO. Revise e faça ajustes se necessário.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-background rounded-lg border p-4 max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{optimizedContent}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {issue.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : issue.type === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    )}
                    <span className={
                      issue.type === 'success' ? 'text-green-700' :
                      issue.type === 'error' ? 'text-red-700' : 'text-amber-700'
                    }>
                      {issue.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Sugestões de Otimização
                </CardTitle>
                <CardDescription>
                  {hasIssues && 'Clique em "Corrigir Automaticamente com IA" para aplicar todas as correções de uma vez.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Answer-First</span>
                  <Badge variant={result.answerFirstCheck ? 'default' : 'destructive'}>
                    {result.answerFirstCheck ? 'OK' : 'Revisar'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">FAQs Detectados</span>
                  <Badge variant={result.faqCount >= 3 ? 'default' : 'secondary'}>
                    {result.faqCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Primeiras 50 palavras</span>
                  <Badge variant="outline">{result.wordCountFirst50}/50</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
