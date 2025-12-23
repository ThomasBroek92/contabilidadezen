import { useState, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  Sparkles, 
  Calendar, 
  Plus, 
  Trash2, 
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  ClipboardPaste,
  CalendarClock,
  Repeat,
  X
} from 'lucide-react';
import { format, addDays, nextDay } from 'date-fns';
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

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

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
  
  // Import state
  const [pastedText, setPastedText] = useState('');
  const [importCategory, setImportCategory] = useState('Dicas');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Recurring schedule state
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState(1); // Segunda
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleTopicsCount, setScheduleTopicsCount] = useState(5);
  const [scheduleCategories, setScheduleCategories] = useState<string[]>(['Dicas']);
  const [scheduleTemplates, setScheduleTemplates] = useState('');
  const [scheduleAutoPublish, setScheduleAutoPublish] = useState(true);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

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

  // === IMPORTAÇÃO ===
  const parseTopicsFromText = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));
  };

  const importFromText = () => {
    const parsedTopics = parseTopicsFromText(pastedText);
    if (parsedTopics.length === 0) {
      toast({ title: 'Nenhum tópico encontrado', variant: 'destructive' });
      return;
    }

    const base = topics.length > 0 
      ? addDays(topics[topics.length - 1].scheduledDate, intervalDays)
      : new Date(startDate);

    const newTopics: BatchTopic[] = parsedTopics.map((topic, i) => ({
      id: crypto.randomUUID(),
      topic,
      category: importCategory,
      scheduledDate: addDays(base, i * intervalDays),
      status: 'pending'
    }));

    setTopics([...topics, ...newTopics]);
    setPastedText('');
    toast({ title: `${parsedTopics.length} tópicos importados` });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let parsedTopics: string[] = [];

      if (file.name.endsWith('.csv')) {
        // Parse CSV - assume one topic per line or first column
        const lines = content.split('\n');
        parsedTopics = lines
          .map(line => {
            const parts = line.split(',');
            return parts[0]?.replace(/^["']|["']$/g, '').trim();
          })
          .filter(topic => topic && topic.length > 0 && !topic.toLowerCase().includes('topic'));
      } else {
        // Plain text - one topic per line
        parsedTopics = parseTopicsFromText(content);
      }

      if (parsedTopics.length === 0) {
        toast({ title: 'Nenhum tópico encontrado no arquivo', variant: 'destructive' });
        return;
      }

      const base = topics.length > 0 
        ? addDays(topics[topics.length - 1].scheduledDate, intervalDays)
        : new Date(startDate);

      const newTopics: BatchTopic[] = parsedTopics.map((topic, i) => ({
        id: crypto.randomUUID(),
        topic,
        category: importCategory,
        scheduledDate: addDays(base, i * intervalDays),
        status: 'pending'
      }));

      setTopics([...topics, ...newTopics]);
      toast({ title: `${parsedTopics.length} tópicos importados do arquivo` });
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPastedText(text);
      toast({ title: 'Conteúdo colado do clipboard' });
    } catch {
      toast({ title: 'Não foi possível acessar o clipboard', variant: 'destructive' });
    }
  };

  // === AGENDAMENTO RECORRENTE ===
  const toggleScheduleCategory = (cat: string) => {
    setScheduleCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const saveRecurringSchedule = async () => {
    if (!scheduleName.trim()) {
      toast({ title: 'Digite um nome para o agendamento', variant: 'destructive' });
      return;
    }

    if (scheduleCategories.length === 0) {
      toast({ title: 'Selecione ao menos uma categoria', variant: 'destructive' });
      return;
    }

    setIsSavingSchedule(true);

    try {
      // Calcular próxima execução
      const now = new Date();
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      let nextRun = nextDay(now, scheduleDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6);
      nextRun.setHours(hours, minutes, 0, 0);
      
      // Se a próxima execução calculada é hoje e já passou, pegar a semana seguinte
      if (nextRun <= now) {
        nextRun = addDays(nextRun, 7);
      }

      const templates = scheduleTemplates
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const { error } = await supabase
        .from('recurring_schedules')
        .insert({
          name: scheduleName.trim(),
          topics_per_run: scheduleTopicsCount,
          categories: scheduleCategories,
          day_of_week: scheduleDayOfWeek,
          time_of_day: scheduleTime,
          auto_publish: scheduleAutoPublish,
          min_geo_score: 80,
          topic_templates: templates,
          is_active: true,
          next_run_at: nextRun.toISOString()
        });

      if (error) throw error;

      toast({ 
        title: 'Agendamento recorrente criado',
        description: `Próxima execução: ${format(nextRun, "EEEE, dd/MM 'às' HH:mm", { locale: ptBR })}`
      });

      // Reset form
      setScheduleName('');
      setScheduleTemplates('');
      setScheduleTopicsCount(5);
      setScheduleCategories(['Dicas']);

    } catch (err: any) {
      console.error('Error saving schedule:', err);
      toast({ title: 'Erro ao salvar agendamento', description: err.message, variant: 'destructive' });
    } finally {
      setIsSavingSchedule(false);
    }
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Geração de Posts em Lote
          </DialogTitle>
          <DialogDescription>
            Adicione tópicos manualmente, importe de arquivo/clipboard, ou configure geração recorrente
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="gap-2">
              <Plus className="h-4 w-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <Upload className="h-4 w-4" />
              Importar
            </TabsTrigger>
            <TabsTrigger value="recurring" className="gap-2">
              <Repeat className="h-4 w-4" />
              Recorrente
            </TabsTrigger>
          </TabsList>

          {/* === TAB: MANUAL === */}
          <TabsContent value="manual" className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
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
            <ScrollArea className="flex-1 min-h-[150px] border rounded-lg">
              {topics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2 opacity-40" />
                  <p className="font-medium text-sm">Nenhum tópico adicionado</p>
                  <p className="text-xs">Digite um tópico ou importe de arquivo</p>
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

            {/* Footer Manual */}
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
          </TabsContent>

          {/* === TAB: IMPORTAR === */}
          <TabsContent value="import" className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Importar de Arquivo</Label>
                    <p className="text-sm text-muted-foreground">
                      CSV ou TXT com um tópico por linha
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isGenerating}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Colar do Clipboard</Label>
                      <p className="text-sm text-muted-foreground">
                        Cole uma lista de tópicos (um por linha)
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handlePasteFromClipboard}
                      disabled={isGenerating}
                    >
                      <ClipboardPaste className="h-4 w-4 mr-2" />
                      Colar
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="Cole os tópicos aqui, um por linha...&#10;&#10;Exemplo:&#10;Como abrir empresa médica em 2025&#10;Tributação para dentistas autônomos&#10;IRPF para psicólogos: guia completo"
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    rows={6}
                    disabled={isGenerating}
                    className="font-mono text-sm"
                  />
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                      <Label className="text-sm">Categoria para importados</Label>
                      <Select value={importCategory} onValueChange={setImportCategory} disabled={isGenerating}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={importFromText}
                      disabled={isGenerating || !pastedText.trim()}
                      className="mt-6"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Importar {parseTopicsFromText(pastedText).length || 0} Tópicos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview de tópicos importados */}
            {topics.length > 0 && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{topics.length} tópicos prontos para geração</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTopics([])}
                      disabled={isGenerating}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpar
                    </Button>
                  </div>
                  <ScrollArea className="h-32 border rounded-lg p-2">
                    {topics.map((t, i) => (
                      <div key={t.id} className="text-sm py-1 text-muted-foreground">
                        {i + 1}. {t.topic}
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Footer Import */}
            <div className="flex gap-2 pt-4 border-t mt-auto">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isGenerating}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button 
                onClick={generateBatch} 
                disabled={isGenerating || topics.length === 0}
                className="flex-1 gap-2"
              >
                <Zap className="h-4 w-4" />
                Gerar {topics.length} Posts
              </Button>
            </div>
          </TabsContent>

          {/* === TAB: RECORRENTE === */}
          <TabsContent value="recurring" className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Nome do agendamento</Label>
                  <Input
                    placeholder="Ex: Posts semanais de segunda-feira"
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Dia da semana</Label>
                    <Select 
                      value={scheduleDayOfWeek.toString()} 
                      onValueChange={(v) => setScheduleDayOfWeek(parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Horário</Label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Posts por execução</Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={scheduleTopicsCount}
                      onChange={(e) => setScheduleTopicsCount(parseInt(e.target.value) || 5)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categorias</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <Badge 
                        key={cat}
                        variant={scheduleCategories.includes(cat) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleScheduleCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Templates de tópicos (opcional)</Label>
                  <Textarea
                    placeholder="Deixe em branco para usar sugestões automáticas da IA, ou adicione templates:&#10;&#10;[PROFISSÃO]: como reduzir impostos em [ANO]&#10;Guia completo de [TEMA] para [PROFISSÃO]&#10;Novidades tributárias [MÊS]/[ANO]"
                    value={scheduleTemplates}
                    onChange={(e) => setScheduleTemplates(e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use variáveis como [PROFISSÃO], [ANO], [MÊS], [TEMA] para personalização automática
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="scheduleAutoPublish"
                      checked={scheduleAutoPublish}
                      onCheckedChange={setScheduleAutoPublish}
                    />
                    <Label htmlFor="scheduleAutoPublish" className="text-sm">
                      Auto-publicar se GEO Score ≥ 80
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <CalendarClock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Como funciona o agendamento recorrente</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• A IA irá sugerir tópicos automaticamente com base nas categorias selecionadas</li>
                      <li>• Posts serão gerados e agendados para publicação no dia/hora configurado</li>
                      <li>• Se templates forem fornecidos, serão usados como base para os tópicos</li>
                      <li>• Posts com GEO Score alto serão publicados automaticamente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Recurring */}
            <div className="flex gap-2 pt-4 border-t mt-auto">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="flex-1"
              >
                Fechar
              </Button>
              <Button 
                onClick={saveRecurringSchedule}
                disabled={isSavingSchedule || !scheduleName.trim()}
                className="flex-1 gap-2"
              >
                {isSavingSchedule ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Repeat className="h-4 w-4" />
                    Criar Agendamento
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
