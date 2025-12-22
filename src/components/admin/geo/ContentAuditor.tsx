import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, FileText, Lightbulb, Wand2, Loader2 } from 'lucide-react';

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
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const analyzeContent = () => {
    setIsAnalyzing(true);
    
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
        suggestions.push('Inclua citações de especialistas ou fontes reconhecidas');
        score -= 10;
      }

      // Check for freshness signals
      const hasDate = /202[4-9]|última atualização|atualizado em/i.test(content);
      if (!hasDate) {
        issues.push({ type: 'warning', message: 'Sem sinais de "freshness" (data de atualização)' });
        suggestions.push('Adicione "Última atualização: [data]" para sinalizar conteúdo atual');
        score -= 10;
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

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
          <Textarea
            placeholder="Cole aqui o conteúdo da página que deseja analisar..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
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
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pontuação GEO</CardTitle>
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
                     'Precisa de otimização significativa.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
