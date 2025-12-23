import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Repeat, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Clock, 
  Calendar, 
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Zap,
  Settings,
  CalendarClock,
  HelpCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from './useEditorialData';

interface RecurringSchedule {
  id: string;
  name: string;
  topics_per_run: number;
  categories: string[];
  day_of_week: number;
  time_of_day: string;
  auto_publish: boolean;
  min_geo_score: number;
  topic_templates: string[];
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
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

export function RecurringSchedulesManager() {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<RecurringSchedule | null>(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state for editing
  const [formName, setFormName] = useState('');
  const [formDayOfWeek, setFormDayOfWeek] = useState(1);
  const [formTime, setFormTime] = useState('09:00');
  const [formTopicsCount, setFormTopicsCount] = useState(5);
  const [formCategories, setFormCategories] = useState<string[]>(['Dicas']);
  const [formTemplates, setFormTemplates] = useState('');
  const [formAutoPublish, setFormAutoPublish] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recurring_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      toast({ title: 'Erro ao carregar agendamentos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (schedule: RecurringSchedule) => {
    setEditingSchedule(schedule);
    setFormName(schedule.name);
    setFormDayOfWeek(schedule.day_of_week);
    setFormTime(schedule.time_of_day);
    setFormTopicsCount(schedule.topics_per_run);
    setFormCategories(schedule.categories);
    setFormTemplates(schedule.topic_templates?.join('\n') || '');
    setFormAutoPublish(schedule.auto_publish);
  };

  const closeEditDialog = () => {
    setEditingSchedule(null);
    setFormName('');
    setFormDayOfWeek(1);
    setFormTime('09:00');
    setFormTopicsCount(5);
    setFormCategories(['Dicas']);
    setFormTemplates('');
    setFormAutoPublish(true);
  };

  const handleSave = async () => {
    if (!editingSchedule || !formName.trim()) return;

    setIsSaving(true);
    try {
      const templates = formTemplates
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const { error } = await supabase
        .from('recurring_schedules')
        .update({
          name: formName.trim(),
          day_of_week: formDayOfWeek,
          time_of_day: formTime,
          topics_per_run: formTopicsCount,
          categories: formCategories,
          topic_templates: templates,
          auto_publish: formAutoPublish,
        })
        .eq('id', editingSchedule.id);

      if (error) throw error;

      toast({ title: 'Agendamento atualizado!' });
      closeEditDialog();
      fetchSchedules();
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (schedule: RecurringSchedule) => {
    try {
      const { error } = await supabase
        .from('recurring_schedules')
        .update({ is_active: !schedule.is_active })
        .eq('id', schedule.id);

      if (error) throw error;

      toast({ 
        title: schedule.is_active ? 'Agendamento pausado' : 'Agendamento ativado',
        description: schedule.is_active 
          ? 'Posts não serão gerados automaticamente' 
          : 'Posts serão gerados na próxima execução'
      });
      fetchSchedules();
    } catch (err: any) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteScheduleId) return;

    try {
      const { error } = await supabase
        .from('recurring_schedules')
        .delete()
        .eq('id', deleteScheduleId);

      if (error) throw error;

      toast({ title: 'Agendamento excluído' });
      fetchSchedules();
    } catch (err: any) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } finally {
      setDeleteScheduleId(null);
    }
  };

  const handleRunNow = async (schedule: RecurringSchedule) => {
    setIsRunning(schedule.id);
    try {
      // Update next_run_at to now to trigger immediate execution
      const { error: updateError } = await supabase
        .from('recurring_schedules')
        .update({ next_run_at: new Date().toISOString() })
        .eq('id', schedule.id);

      if (updateError) throw updateError;

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('execute-recurring-schedules');

      if (error) throw error;

      toast({ 
        title: 'Execução iniciada!', 
        description: `${data?.totalPostsCreated || 0} posts gerados`
      });
      fetchSchedules();
    } catch (err: any) {
      toast({ title: 'Erro ao executar', description: err.message, variant: 'destructive' });
    } finally {
      setIsRunning(null);
    }
  };

  const toggleCategory = (cat: string) => {
    setFormCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const getDayLabel = (day: number) => DAYS_OF_WEEK.find(d => d.value === day)?.label || 'Desconhecido';

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando agendamentos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Repeat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Agendamentos Recorrentes</CardTitle>
                <CardDescription>
                  Geração automática de posts em dias e horários programados
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchSchedules}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarClock className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">Nenhum agendamento recorrente</p>
              <p className="text-sm mt-1">
                Crie um agendamento no botão "Gerar em Lote" → aba "Recorrente"
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      schedule.is_active 
                        ? 'bg-background border-border' 
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium truncate">{schedule.name}</h4>
                          {schedule.is_active ? (
                            <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/10 gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground gap-1">
                              <Pause className="h-3 w-3" />
                              Pausado
                            </Badge>
                          )}
                          {schedule.auto_publish && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Zap className="h-3 w-3" />
                              Auto-publicar
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Frequência</p>
                            <p className="font-medium flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {getDayLabel(schedule.day_of_week)} às {schedule.time_of_day}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Posts/execução</p>
                            <p className="font-medium">{schedule.topics_per_run}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Categorias</p>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {schedule.categories.slice(0, 2).map((cat) => (
                                <Badge key={cat} variant="outline" className="text-xs py-0">
                                  {cat}
                                </Badge>
                              ))}
                              {schedule.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs py-0">
                                  +{schedule.categories.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Próxima execução</p>
                            <p className="font-medium flex items-center gap-1">
                              {schedule.next_run_at ? (
                                <>
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(new Date(schedule.next_run_at), { 
                                    addSuffix: true, 
                                    locale: ptBR 
                                  })}
                                </>
                              ) : (
                                <span className="text-muted-foreground">Não definido</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {schedule.last_run_at && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Última execução: {format(new Date(schedule.last_run_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRunNow(schedule)}
                              disabled={isRunning === schedule.id}
                            >
                              {isRunning === schedule.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Executar agora</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleActive(schedule)}
                            >
                              {schedule.is_active ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {schedule.is_active ? 'Pausar' : 'Ativar'}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(schedule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteScheduleId(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSchedule} onOpenChange={() => closeEditDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Editar Agendamento
            </DialogTitle>
            <DialogDescription>
              Altere as configurações do agendamento recorrente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do agendamento</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Posts semanais de segunda-feira"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Dia da semana</Label>
                <Select 
                  value={formDayOfWeek.toString()} 
                  onValueChange={(v) => setFormDayOfWeek(parseInt(v))}
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
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Posts/execução</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={formTopicsCount}
                  onChange={(e) => setFormTopicsCount(parseInt(e.target.value) || 5)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categorias</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Badge 
                    key={cat}
                    variant={formCategories.includes(cat) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Templates de tópicos
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Use variáveis como [PROFISSÃO], [ANO], [MÊS], [TEMA] para personalização automática.</p>
                    <p className="mt-1">Deixe vazio para usar sugestões automáticas da IA.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                placeholder="Um template por linha..."
                value={formTemplates}
                onChange={(e) => setFormTemplates(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="editAutoPublish"
                  checked={formAutoPublish}
                  onCheckedChange={setFormAutoPublish}
                />
                <Label htmlFor="editAutoPublish" className="text-sm">
                  Auto-publicar se GEO Score ≥ 80
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formName.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteScheduleId} onOpenChange={() => setDeleteScheduleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O agendamento será removido permanentemente
              e nenhum post será mais gerado automaticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}