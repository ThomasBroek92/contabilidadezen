import { useState, useEffect } from 'react';
import { openWhatsAppForPhone } from '@/lib/whatsapp';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Search, RefreshCw, Download, FileText, ExternalLink,
  Building2, AlertTriangle, Filter, ArrowUpDown, Trash2
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
  fonte: string;
  pipeline_stage: string | null;
  valor_negocio: number | null;
  faturamento_mensal: number | null;
  economia_anual: number | null;
  data_ultimo_contato: string | null;
  data_proximo_followup: string | null;
  consentimento_lgpd: boolean | null;
  gmv_total: number | null;
  media_compra_mensal: number | null;
  qtd_compras: number | null;
  observacoes: string | null;
  created_at: string;
}

interface LeadsTableProps {
  onSelectLead: (leadId: string) => void;
}

const stageLabels: Record<string, string> = {
  primeiro_contato: 'Primeiro Contato',
  qualificacao: 'Qualificação',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  fechamento: 'Fechamento',
  perdido: 'Perdido',
};

const stageColors: Record<string, string> = {
  primeiro_contato: 'bg-blue-500',
  qualificacao: 'bg-yellow-500',
  proposta: 'bg-purple-500',
  negociacao: 'bg-orange-500',
  fechamento: 'bg-green-500',
  perdido: 'bg-red-500',
};

export function LeadsTable({ onSelectLead }: LeadsTableProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast({
        title: 'Erro ao carregar leads',
        description: 'Não foi possível carregar a lista de leads.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [sortField, sortDirection]);

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      lead.nome.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.whatsapp.toLowerCase().includes(search) ||
      (lead.empresa?.toLowerCase().includes(search) ?? false);
    
    const matchesStage = stageFilter === 'all' || (lead.pipeline_stage || 'primeiro_contato') === stageFilter;
    const matchesSegment = segmentFilter === 'all' || lead.segmento === segmentFilter;

    return matchesSearch && matchesStage && matchesSegment;
  });

  const segments = [...new Set(leads.map(l => l.segmento))];

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStageBadge = (stage: string | null) => {
    const stageKey = stage || 'primeiro_contato';
    return (
      <Badge className={`${stageColors[stageKey]} text-white`}>
        {stageLabels[stageKey] || stageKey}
      </Badge>
    );
  };

  const isChurnRisk = (lead: Lead) => {
    return lead.media_compra_mensal && lead.gmv_total && lead.qtd_compras &&
      (lead.gmv_total / lead.qtd_compras) < (lead.media_compra_mensal * 0.7);
  };

  const needsFollowup = (lead: Lead) => {
    if (!lead.data_ultimo_contato) return true;
    const daysSinceContact = Math.floor(
      (new Date().getTime() - new Date(lead.data_ultimo_contato).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceContact > 7;
  };

  const exportToCSV = () => {
    const headers = [
      'Nome', 'Email', 'WhatsApp', 'Empresa', 'Cargo', 'Segmento', 
      'Etapa', 'Valor do Negócio', 'Faturamento Mensal', 'Observações', 'Data'
    ];
    const rows = filteredLeads.map((lead) => [
      lead.nome,
      lead.email,
      lead.whatsapp,
      lead.empresa || '',
      lead.cargo || '',
      lead.segmento,
      stageLabels[lead.pipeline_stage || 'primeiro_contato'],
      lead.valor_negocio?.toString() || '',
      lead.faturamento_mensal?.toString() || '',
      lead.observacoes || '',
      format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const openWhatsApp = (whatsapp: string) => {
    openWhatsAppForPhone(whatsapp);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleDeleteLead = async () => {
    if (!deleteLeadId) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', deleteLeadId);
      
      if (error) throw error;
      
      setLeads(prev => prev.filter(l => l.id !== deleteLeadId));
      toast({ title: 'Lead excluído com sucesso' });
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast({
        title: 'Erro ao excluir lead',
        description: 'Não foi possível excluir o lead.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteLeadId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Leads
            </CardTitle>
            <CardDescription>
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} encontrado{filteredLeads.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={filteredLeads.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as etapas</SelectItem>
              {Object.entries(stageLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os segmentos</SelectItem>
              {segments.map(seg => (
                <SelectItem key={seg} value={seg}>
                  {seg.charAt(0).toUpperCase() + seg.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum lead encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('nome')}>
                      Nome
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('valor_negocio')}>
                      Valor
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')}>
                      Criado em
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectLead(lead.id)}
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {isChurnRisk(lead) && (
                          <span title="Risco de Churn">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          </span>
                        )}
                        {needsFollowup(lead) && (
                          <span title="Precisa de follow-up">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.nome}</p>
                        {lead.empresa && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {lead.empresa}
                          </p>
                        )}
                        {lead.observacoes && (
                          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]" title={lead.observacoes}>
                            📝 {lead.observacoes}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{lead.email}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-green-600 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            openWhatsApp(lead.whatsapp);
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {lead.whatsapp}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{getStageBadge(lead.pipeline_stage)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(lead.valor_negocio)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.data_ultimo_contato 
                        ? formatDistanceToNow(new Date(lead.data_ultimo_contato), { addSuffix: true, locale: ptBR })
                        : 'Nunca'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteLeadId(lead.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteLeadId} onOpenChange={(open) => !open && setDeleteLeadId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Lead</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteLead} 
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
