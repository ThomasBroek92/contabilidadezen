import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, 
  Sparkles, 
  Calendar, 
  Plus, 
  Trash2, 
  Zap,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from './useEditorialData';

interface BatchTopic {
  id: string;
  topic: string;
  category: string;
  scheduledDate: Date;
  status: 'pending' | 'generating' | 'success' | 'error';
  error?: string;
  postId?: string;
  geoScore?: number;
}

interface BatchGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function BatchGenerationDialog({ open, onOpenChange, onComplete }: BatchGenerationDialogProps) {
  const [topics, setTopics] = useState<BatchTopic[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [category, setCategory] = useState('Dicas');
  const [startDate, setStartDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [intervalDays, setIntervalDays] = useState(1);
  const [autoPublish, setAutoPublish] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const addTopic = () => {
    if (!newTopic.trim()) return;
    
    const lastDate = topics.length > 0 
      ? addDays(topics[topics.length - 1].scheduledDate, intervalDays)
      : new Date(startDate);

    setTopics([
      ...topics,
      {
        id: crypto.randomUUID(),
        topic: newTopic.trim(),
        category,
        scheduledDate: lastDate,
        status: 'pending'
      }
    ]);
    setNewTopic('');
  };

  const removeTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const updateTopicDate = (id: string, date: string) => {
    setTopics(topics.map(t => 
      t.id === id ? { ...t, scheduledDate: new Date(date) } : t
    ));
  };

  const recalculateDates = () => {
    const base = new Date(startDate);
    setTopics(topics.map((t, i) => ({
      ...t,
      scheduledDate: addDays(base, i * intervalDays)
    })));
  };

  const generateBatch = async () => {
    if (topics.length === 0) {
      toast({ title: 'Adicione ao menos um tópico', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      setCurrentIndex(i);
      
      // Update status to generating
      setTopics(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: 'generating' } : t
      ));

      try {
        // First, add to blog_topics queue
        const { data: topicData, error: topicError } = await supabase
          .from('blog_topics')
          .insert({
            topic: topic.topic,
            category: topic.category,
            scheduled_date: topic.scheduledDate.toISOString(),
            status: 'pending'
          })
          .select('id')
          .single();

        if (topicError) throw topicError;

        // Generate content
        const { data, error } = await supabase.functions.invoke('generate-blog-content', {
          body: { topic_id: topicData.id }
        });

        if (error) throw error;

        if (data?.successful > 0) {
          const result = data.results?.[0];
          setTopics(prev => prev.map((t, idx) => 
            idx === i ? { 
              ...t, 
              status: 'success',
              postId: result?.postId,
              geoScore: result?.geoScore
            } : t
          ));
          successCount++;
        } else {
          throw new Error(data?.results?.[0]?.error || 'Falha na geração');
        }

        // Small delay between generations to avoid rate limits
        if (i < topics.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (err: any) {
        console.error('Error generating topic:', topic.topic, err);
        setTopics(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'error', error: err.message } : t
        ));
        errorCount++;
      }
    }

    setIsGenerating(false);
    
    toast({
      title: 'Geração em lote concluída',
      description: `${successCount} sucesso, ${errorCount} erros de ${topics.length} tópicos`,
      variant: successCount > 0 ? 'default' : 'destructive'
    });

    if (successCount > 0) {
      onComplete();
    }
  };

  const getStatusIcon = (status: BatchTopic['status']) => {
    switch (status) {
      case 'generating':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const progress = isGenerating 
    ? ((currentIndex + 1) / topics.length) * 100 
    : 0;

  const completedCount = topics.filter(t => t.status === 'success').length;
  const errorCount = topics.filter(t => t.status === 'error').length;

  return (
    <Dialog open={open} onOpenChange={(v) => !isGenerating && onOpenChange(v)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Geração de Posts em Lote
          </DialogTitle>
          <DialogDescription>
            Adicione múltiplos tópicos para gerar posts automaticamente com datas sequenciais
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Configurações */}
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de início</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Intervalo entre posts (dias)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(parseInt(e.target.value) || 1)}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="autoPublish" 
                    checked={autoPublish}
                    onCheckedChange={(v) => setAutoPublish(v === true)}
                    disabled={isGenerating}
                  />
                  <Label htmlFor="autoPublish" className="text-sm">
                    Auto-publicar se GEO Score ≥ 80
                  </Label>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={recalculateDates}
                  disabled={isGenerating || topics.length === 0}
                >
                  Recalcular datas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Adicionar tópico */}
          <div className="flex gap-2">
            <Input
              placeholder="Digite o tópico do post..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
              disabled={isGenerating}
              className="flex-1"
            />
            <Select value={category} onValueChange={setCategory} disabled={isGenerating}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addTopic} disabled={isGenerating || !newTopic.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de tópicos */}
          <ScrollArea className="flex-1 min-h-[200px] border rounded-lg">
            {topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Sparkles className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium">Nenhum tópico adicionado</p>
                <p className="text-sm">Digite um tópico acima e pressione Enter</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {topics.map((topic, index) => (
                  <div 
                    key={topic.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      topic.status === 'generating' ? 'bg-blue-500/10 border-blue-500/30' :
                      topic.status === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      topic.status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                      'bg-muted/30'
                    }`}
                  >
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    
                    {getStatusIcon(topic.status)}
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{topic.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(topic.scheduledDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        {topic.geoScore !== undefined && (
                          <Badge className={`text-xs ${
                            topic.geoScore >= 80 ? 'bg-green-500/20 text-green-700' :
                            topic.geoScore >= 60 ? 'bg-yellow-500/20 text-yellow-700' :
                            'bg-red-500/20 text-red-700'
                          }`}>
                            GEO {topic.geoScore}
                          </Badge>
                        )}
                      </div>
                      {topic.error && (
                        <p className="text-xs text-red-600 mt-1">{topic.error}</p>
                      )}
                    </div>
                    
                    {topic.status === 'pending' && !isGenerating && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => removeTopic(topic.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Gerando post {currentIndex + 1} de {topics.length}...</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Summary */}
          {topics.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span>{topics.length} tópicos</span>
                {completedCount > 0 && (
                  <span className="text-green-600">{completedCount} gerados</span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-600">{errorCount} erros</span>
                )}
              </div>
              <span className="text-muted-foreground">
                Período: {format(topics[0].scheduledDate, "dd/MM", { locale: ptBR })} - {format(topics[topics.length - 1].scheduledDate, "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? 'Aguarde...' : 'Cancelar'}
          </Button>
          <Button 
            onClick={generateBatch} 
            disabled={isGenerating || topics.length === 0}
            className="flex-1 gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Gerar {topics.length} Posts
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
