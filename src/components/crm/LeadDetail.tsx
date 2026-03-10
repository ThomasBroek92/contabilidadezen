import { useEffect, useState } from 'react';
import { openWhatsAppForPhone } from '@/lib/whatsapp';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  X, Phone, Mail, Building2, User, Calendar, DollarSign,
  MessageSquare, Clock, Plus, Check, AlertTriangle, Shield,
  ExternalLink, Trash2, Save
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Lead {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string | null;
  cargo: string | null;
  segmento: string;
  fonte: string;
  pipeline_stage: string | null;
  valor_negocio: number | null;
  probabilidade_fechamento: number | null;
  data_ultimo_contato: string | null;
  data_proximo_followup: string | null;
  consentimento_lgpd: boolean | null;
  data_consentimento: string | null;
  gmv_total: number | null;
  qtd_compras: number | null;
  media_compra_mensal: number | null;
  faturamento_mensal: number | null;
  economia_anual: number | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string | null;
  origem: string | null;
}

interface Interaction {
  id: string;
  tipo: string;
  descricao: string;
  data_interacao: string;
  duracao_minutos: number | null;
  resultado: string | null;
}

interface Task {
  id: string;
  titulo: string;
  descricao: string | null;
  data_vencimento: string;
  concluida: boolean;
  prioridade: string;
}

interface LeadDetailProps {
  leadId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const stageOptions = [
  { value: 'primeiro_contato', label: 'Primeiro Contato' },
  { value: 'qualificacao', label: 'Qualificação' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'negociacao', label: 'Negociação' },
  { value: 'fechamento', label: 'Fechamento' },
  { value: 'perdido', label: 'Perdido' },
];

const interactionTypes = [
  { value: 'chamada', label: 'Chamada', icon: Phone },
  { value: 'reuniao', label: 'Reunião', icon: Calendar },
  { value: 'email', label: 'E-mail', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { value: 'anotacao', label: 'Anotação', icon: MessageSquare },
];

export function LeadDetail({ leadId, onClose, onUpdate }: LeadDetailProps) {
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  
  // New interaction form
  const [newInteraction, setNewInteraction] = useState({
    tipo: 'chamada',
    descricao: '',
    duracao_minutos: '',
    resultado: '',
  });
  const [showInteractionForm, setShowInteractionForm] = useState(false);

  // New task form
  const [newTask, setNewTask] = useState({
    titulo: '',
    descricao: '',
    data_vencimento: '',
    prioridade: 'media',
  });
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    if (leadId) {
      fetchLeadData();
    }
  }, [leadId]);

  const fetchLeadData = async () => {
    setLoading(true);
    try {
      // Fetch lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError) throw leadError;
      setLead(leadData);
      setEditedLead(leadData);

      // Fetch interactions
      const { data: interactionsData } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('data_interacao', { ascending: false });

      setInteractions(interactionsData || []);

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('lead_tasks')
        .select('*')
        .eq('lead_id', leadId)
        .order('data_vencimento', { ascending: true });

      setTasks(tasksData || []);
    } catch (err) {
      console.error('Error fetching lead:', err);
      toast({
        title: 'Erro ao carregar lead',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          nome: editedLead.nome,
          email: editedLead.email,
          whatsapp: editedLead.whatsapp,
          empresa: editedLead.empresa,
          cargo: editedLead.cargo,
          pipeline_stage: editedLead.pipeline_stage as any,
          valor_negocio: editedLead.valor_negocio,
          probabilidade_fechamento: editedLead.probabilidade_fechamento,
          data_proximo_followup: editedLead.data_proximo_followup,
          consentimento_lgpd: editedLead.consentimento_lgpd,
          data_consentimento: editedLead.consentimento_lgpd && !lead?.consentimento_lgpd 
            ? new Date().toISOString()
            : editedLead.data_consentimento,
          gmv_total: editedLead.gmv_total,
          qtd_compras: editedLead.qtd_compras,
          media_compra_mensal: editedLead.media_compra_mensal,
        })
        .eq('id', leadId);

      if (error) throw error;

      toast({ title: 'Lead atualizado com sucesso!' });
      setLead({ ...lead, ...editedLead } as Lead);
      onUpdate();
    } catch (err) {
      console.error('Error saving lead:', err);
      toast({
        title: 'Erro ao salvar lead',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddInteraction = async () => {
    try {
      const { error } = await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: leadId,
          tipo: newInteraction.tipo as any,
          descricao: newInteraction.descricao,
          duracao_minutos: newInteraction.duracao_minutos ? parseInt(newInteraction.duracao_minutos) : null,
          resultado: newInteraction.resultado || null,
        }]);

      if (error) throw error;

      // Update last contact date
      await supabase
        .from('leads')
        .update({ data_ultimo_contato: new Date().toISOString() })
        .eq('id', leadId);

      toast({ title: 'Interação registrada!' });
      setNewInteraction({ tipo: 'chamada', descricao: '', duracao_minutos: '', resultado: '' });
      setShowInteractionForm(false);
      fetchLeadData();
    } catch (err) {
      console.error('Error adding interaction:', err);
      toast({
        title: 'Erro ao registrar interação',
        variant: 'destructive',
      });
    }
  };

  const handleAddTask = async () => {
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .insert({
          lead_id: leadId,
          titulo: newTask.titulo,
          descricao: newTask.descricao || null,
          data_vencimento: newTask.data_vencimento,
          prioridade: newTask.prioridade,
        });

      if (error) throw error;

      toast({ title: 'Tarefa criada!' });
      setNewTask({ titulo: '', descricao: '', data_vencimento: '', prioridade: 'media' });
      setShowTaskForm(false);
      fetchLeadData();
    } catch (err) {
      console.error('Error adding task:', err);
      toast({
        title: 'Erro ao criar tarefa',
        variant: 'destructive',
      });
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .update({ concluida: completed })
        .eq('id', taskId);

      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, concluida: completed } : t));
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast({ title: 'Tarefa excluída!' });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const openWhatsApp = () => {
    if (lead?.whatsapp) {
      const { openWhatsAppForPhone } = require("@/lib/whatsapp");
      openWhatsAppForPhone(lead.whatsapp);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lead) return null;

  const isChurnRisk = lead.media_compra_mensal && lead.gmv_total && 
    (lead.gmv_total / (lead.qtd_compras || 1)) < (lead.media_compra_mensal * 0.7);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {lead.nome}
                {isChurnRisk && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Risco de Churn
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {lead.empresa && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {lead.empresa}
                  </span>
                )}
                {lead.cargo && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {lead.cargo}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openWhatsApp}>
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="info">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="interactions">
                  Histórico ({interactions.length})
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  Tarefas ({tasks.filter(t => !t.concluida).length})
                </TabsTrigger>
                <TabsTrigger value="lgpd">
                  <Shield className="h-4 w-4 mr-1" />
                  LGPD
                </TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={editedLead.nome || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={editedLead.email || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      value={editedLead.whatsapp || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, whatsapp: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input
                      value={editedLead.empresa || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, empresa: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input
                      value={editedLead.cargo || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, cargo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Etapa do Pipeline</Label>
                    <Select
                      value={editedLead.pipeline_stage || 'primeiro_contato'}
                      onValueChange={(v) => setEditedLead({ ...editedLead, pipeline_stage: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor do Negócio (R$)</Label>
                    <Input
                      type="number"
                      value={editedLead.valor_negocio || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, valor_negocio: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Probabilidade de Fechamento (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedLead.probabilidade_fechamento || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, probabilidade_fechamento: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Próximo Follow-up</Label>
                    <Input
                      type="datetime-local"
                      value={editedLead.data_proximo_followup?.slice(0, 16) || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, data_proximo_followup: e.target.value })}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>GMV Total</Label>
                    <Input
                      type="number"
                      value={editedLead.gmv_total || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, gmv_total: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Qtd. Compras</Label>
                    <Input
                      type="number"
                      value={editedLead.qtd_compras || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, qtd_compras: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Média Mensal (R$)</Label>
                    <Input
                      type="number"
                      value={editedLead.media_compra_mensal || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, media_compra_mensal: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="text-center">
                    <Label className="text-muted-foreground">Faturamento</Label>
                    <p className="text-lg font-semibold">{formatCurrency(lead.faturamento_mensal)}</p>
                  </div>
                </div>

                {/* Observações */}
                {lead.observacoes && (
                  <div className="pt-4 border-t">
                    <Label className="text-muted-foreground">Observações (Informações Adicionais)</Label>
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
                      {lead.observacoes.split(' | ').map((obs, idx) => (
                        <p key={idx} className="text-foreground">
                          • {obs}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleSaveLead} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </TabsContent>

              {/* Interactions Tab */}
              <TabsContent value="interactions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Histórico de Interações</h3>
                  <Dialog open={showInteractionForm} onOpenChange={setShowInteractionForm}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Interação
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registrar Interação</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select
                            value={newInteraction.tipo}
                            onValueChange={(v) => setNewInteraction({ ...newInteraction, tipo: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {interactionTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Textarea
                            value={newInteraction.descricao}
                            onChange={(e) => setNewInteraction({ ...newInteraction, descricao: e.target.value })}
                            placeholder="Descreva a interação..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Duração (min)</Label>
                            <Input
                              type="number"
                              value={newInteraction.duracao_minutos}
                              onChange={(e) => setNewInteraction({ ...newInteraction, duracao_minutos: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Resultado</Label>
                            <Input
                              value={newInteraction.resultado}
                              onChange={(e) => setNewInteraction({ ...newInteraction, resultado: e.target.value })}
                              placeholder="Ex: Agendou reunião"
                            />
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleAddInteraction}
                          disabled={!newInteraction.descricao}
                        >
                          Registrar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {interactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma interação registrada
                    </p>
                  ) : (
                    interactions.map(interaction => {
                      const typeInfo = interactionTypes.find(t => t.value === interaction.tipo);
                      const Icon = typeInfo?.icon || MessageSquare;
                      return (
                        <Card key={interaction.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-muted rounded-full">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline">{typeInfo?.label}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(interaction.data_interacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm">{interaction.descricao}</p>
                                {(interaction.duracao_minutos || interaction.resultado) && (
                                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                    {interaction.duracao_minutos && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {interaction.duracao_minutos} min
                                      </span>
                                    )}
                                    {interaction.resultado && (
                                      <span>Resultado: {interaction.resultado}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Tarefas e Follow-ups</h3>
                  <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Tarefa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Tarefa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            value={newTask.titulo}
                            onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                            placeholder="Ex: Enviar proposta"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Textarea
                            value={newTask.descricao}
                            onChange={(e) => setNewTask({ ...newTask, descricao: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Data de Vencimento</Label>
                            <Input
                              type="datetime-local"
                              value={newTask.data_vencimento}
                              onChange={(e) => setNewTask({ ...newTask, data_vencimento: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Prioridade</Label>
                            <Select
                              value={newTask.prioridade}
                              onValueChange={(v) => setNewTask({ ...newTask, prioridade: v })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="baixa">Baixa</SelectItem>
                                <SelectItem value="media">Média</SelectItem>
                                <SelectItem value="alta">Alta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleAddTask}
                          disabled={!newTask.titulo || !newTask.data_vencimento}
                        >
                          Criar Tarefa
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma tarefa criada
                    </p>
                  ) : (
                    tasks.map(task => {
                      const isOverdue = !task.concluida && new Date(task.data_vencimento) < new Date();
                      return (
                        <Card key={task.id} className={isOverdue ? 'border-destructive' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleToggleTask(task.id, !task.concluida)}
                              >
                                {task.concluida ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="h-4 w-4 border-2 rounded" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <p className={`font-medium ${task.concluida ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.titulo}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {format(new Date(task.data_vencimento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                  </span>
                                  <Badge 
                                    variant={task.prioridade === 'alta' ? 'destructive' : 'outline'}
                                    className="text-xs"
                                  >
                                    {task.prioridade}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* LGPD Tab */}
              <TabsContent value="lgpd" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Gestão de Consentimento LGPD
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Consentimento para tratamento de dados</Label>
                        <p className="text-sm text-muted-foreground">
                          O titular autorizou o tratamento de seus dados pessoais
                        </p>
                      </div>
                      <Switch
                        checked={editedLead.consentimento_lgpd || false}
                        onCheckedChange={(checked) => setEditedLead({ 
                          ...editedLead, 
                          consentimento_lgpd: checked,
                          data_consentimento: checked ? new Date().toISOString() : null,
                        })}
                      />
                    </div>

                    {lead.data_consentimento && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          Consentimento registrado em:{' '}
                          <strong>
                            {format(new Date(lead.data_consentimento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </strong>
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-3">
                      <h4 className="font-medium">Direitos do Titular</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Exportar Dados (Portabilidade)
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Solicitar Exclusão
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Estas ações devem ser realizadas conforme a Lei Geral de Proteção de Dados (LGPD).
                      </p>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSaveLead} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
