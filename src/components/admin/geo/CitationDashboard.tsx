import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, MessageSquare, ThumbsUp, ThumbsDown, Minus, Quote, BarChart2, Eye } from 'lucide-react';

interface CitationMetric {
  platform: string;
  mentions: number;
  trend: 'up' | 'down' | 'stable';
  sentiment: 'positive' | 'negative' | 'neutral';
  shareOfVoice: number;
}

const mockMetrics: CitationMetric[] = [
  { platform: 'ChatGPT', mentions: 45, trend: 'up', sentiment: 'positive', shareOfVoice: 32 },
  { platform: 'Perplexity', mentions: 28, trend: 'up', sentiment: 'positive', shareOfVoice: 24 },
  { platform: 'Google AI Overview', mentions: 67, trend: 'stable', sentiment: 'neutral', shareOfVoice: 41 },
  { platform: 'Claude', mentions: 12, trend: 'down', sentiment: 'neutral', shareOfVoice: 8 },
  { platform: 'Bing Copilot', mentions: 19, trend: 'up', sentiment: 'positive', shareOfVoice: 15 },
];

const sentimentConfig = {
  positive: { icon: ThumbsUp, color: 'text-green-600', bg: 'bg-green-100', label: 'Positivo' },
  negative: { icon: ThumbsDown, color: 'text-red-600', bg: 'bg-red-100', label: 'Negativo' },
  neutral: { icon: Minus, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Neutro' },
};

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-green-600' },
  down: { icon: TrendingDown, color: 'text-red-600' },
  stable: { icon: Minus, color: 'text-muted-foreground' },
};

export function CitationDashboard() {
  const totalMentions = mockMetrics.reduce((sum, m) => sum + m.mentions, 0);
  const avgShareOfVoice = Math.round(mockMetrics.reduce((sum, m) => sum + m.shareOfVoice, 0) / mockMetrics.length);
  const positiveSentiment = mockMetrics.filter(m => m.sentiment === 'positive').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Citações</CardTitle>
            <Quote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMentions}</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Share of Voice</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgShareOfVoice}%</div>
            <p className="text-xs text-muted-foreground">Média entre plataformas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentimento Positivo</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveSentiment}/{mockMetrics.length}</div>
            <p className="text-xs text-muted-foreground">Plataformas com menções positivas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visibilidade IA</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Plataformas monitoradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Citações por Plataforma de IA
          </CardTitle>
          <CardDescription>
            Monitoramento de frequência, tendência e sentimento das menções à sua marca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMetrics.map((metric) => {
              const TrendIcon = trendConfig[metric.trend].icon;
              const SentimentIcon = sentimentConfig[metric.sentiment].icon;
              
              return (
                <div key={metric.platform} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{metric.platform}</span>
                      <TrendIcon className={`h-4 w-4 ${trendConfig[metric.trend].color}`} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{metric.mentions} menções</span>
                      <Badge variant="outline" className={`${sentimentConfig[metric.sentiment].bg} ${sentimentConfig[metric.sentiment].color} border-0`}>
                        <SentimentIcon className="h-3 w-3 mr-1" />
                        {sentimentConfig[metric.sentiment].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-48">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Share of Voice</span>
                      <span className="font-medium">{metric.shareOfVoice}%</span>
                    </div>
                    <Progress value={metric.shareOfVoice} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights GEO</CardTitle>
          <CardDescription>Recomendações baseadas nos dados de citação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✓ Forte presença no Google AI Overview:</strong> Suas páginas de FAQ estão sendo citadas frequentemente. Continue investindo em conteúdo estruturado.
              </p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>⚠ Oportunidade no Claude:</strong> Baixa presença detectada. Considere adicionar mais dados estatísticos e citações de especialistas.
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Adicionar datas de "última atualização" pode aumentar a frequência de citação em até 25%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
