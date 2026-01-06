import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, Mail, Building2, DollarSign, 
  ChevronLeft, ChevronRight, User, Clock, Trash2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string | null;
  cargo: string | null;
  segmento: string;
  pipeline_stage: string;
  valor_negocio: number | null;
  probabilidade_fechamento: number | null;
  data_ultimo_contato: string | null;
  created_at: string;
}

interface KanbanProps {
  onSelectLead: (leadId: string) => void;
}

const stages = [
  { key: 'primeiro_contato', label: 'Primeiro Contato', color: 'bg-blue-500' },
  { key: 'qualificacao', label: 'Qualificação', color: 'bg-yellow-500' },
  { key: 'proposta', label: 'Proposta', color: 'bg-purple-500' },
  { key: 'negociacao', label: 'Negociação', color: 'bg-orange-500' },
  { key: 'fechamento', label: 'Fechamento', color: 'bg-green-500' },
  { key: 'perdido', label: 'Perdido', color: 'bg-red-500' },
];

export function CRMKanban({ onSelectLead }: KanbanProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingLead, setDraggingLead] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast({
        title: 'Erro ao carregar leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const moveLeadToStage = async (leadId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ pipeline_stage: newStage as any })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, pipeline_stage: newStage }
            : lead
        )
      );

      toast({
        title: 'Lead movido',
        description: `Lead movido para ${stages.find(s => s.key === newStage)?.label}`,
      });
    } catch (err) {
      console.error('Error moving lead:', err);
      toast({
        title: 'Erro ao mover lead',
        variant: 'destructive',
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== leadId));

      toast({
        title: 'Lead excluído',
        description: 'O lead foi removido com sucesso.',
      });
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast({
        title: 'Erro ao excluir lead',
        description: 'Você precisa de permissão de administrador.',
        variant: 'destructive',
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggingLead(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageKey: string) => {
    e.preventDefault();
    if (draggingLead) {
      moveLeadToStage(draggingLead, stageKey);
      setDraggingLead(null);
    }
  };

  const getLeadsByStage = (stageKey: string) => {
    return leads.filter(lead => (lead.pipeline_stage || 'primeiro_contato') === stageKey);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStageIndex = (stageKey: string) => {
    return stages.findIndex(s => s.key === stageKey);
  };

  const moveLeadForward = (lead: Lead) => {
    const currentIndex = getStageIndex(lead.pipeline_stage || 'primeiro_contato');
    if (currentIndex < stages.length - 2) { // Don't move to 'perdido'
      moveLeadToStage(lead.id, stages[currentIndex + 1].key);
    }
  };

  const moveLeadBackward = (lead: Lead) => {
    const currentIndex = getStageIndex(lead.pipeline_stage || 'primeiro_contato');
    if (currentIndex > 0) {
      moveLeadToStage(lead.id, stages[currentIndex - 1].key);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => (
          <div key={stage.key} className="flex-shrink-0 w-72">
            <Card className="animate-pulse">
              <CardHeader className="py-3">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 bg-muted rounded" />
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map(stage => {
        const stageLeads = getLeadsByStage(stage.key);
        const stageValue = stageLeads.reduce((sum, l) => sum + (l.valor_negocio || 0), 0);
        
        return (
          <div 
            key={stage.key} 
            className="flex-shrink-0 w-72"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.key)}
          >
            <Card className="h-full">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <CardTitle className="text-sm font-medium">{stage.label}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stageLeads.length}
                  </Badge>
                </div>
                {stageValue > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(stageValue)}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3 min-h-[200px]">
                {stageLeads.map(lead => (
                  <Card 
                    key={lead.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      draggingLead === lead.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onClick={() => onSelectLead(lead.id)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm truncate max-w-[180px]">
                            {lead.nome}
                          </p>
                          {lead.empresa && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {lead.empresa}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {lead.segmento}
                        </Badge>
                      </div>
                      
                      {lead.valor_negocio && lead.valor_negocio > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(lead.valor_negocio)}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(lead.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      </div>

                      {/* Quick move buttons */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          disabled={getStageIndex(lead.pipeline_stage || 'primeiro_contato') === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLeadBackward(lead);
                          }}
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir <strong>{lead.nome}</strong>? 
                                Esta ação não pode ser desfeita e todas as interações e tarefas relacionadas serão perdidas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteLead(lead.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          disabled={getStageIndex(lead.pipeline_stage || 'primeiro_contato') >= stages.length - 2}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLeadForward(lead);
                          }}
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stageLeads.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Nenhum lead
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
