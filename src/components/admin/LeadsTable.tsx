import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, RefreshCw, Download, FileText, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  segmento: string;
  fonte: string;
  faturamento_mensal: number | null;
  economia_anual: number | null;
  created_at: string;
}

export function LeadsTable() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        description: 'Não foi possível carregar a lista de leads.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();
    return (
      lead.nome.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.whatsapp.toLowerCase().includes(search) ||
      lead.segmento.toLowerCase().includes(search)
    );
  });

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getSegmentoBadge = (segmento: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      medicos: 'default',
      dentistas: 'secondary',
      psicologos: 'outline',
    };
    return (
      <Badge variant={variants[segmento] || 'outline'}>
        {segmento.charAt(0).toUpperCase() + segmento.slice(1)}
      </Badge>
    );
  };

  // Sanitize cell to prevent CSV formula injection attacks
  const sanitizeCell = (cell: string | number | null | undefined): string => {
    if (cell === null || cell === undefined) return '';
    const cellStr = String(cell);
    
    // Prepend single quote to cells starting with dangerous characters
    // This prevents Excel from interpreting them as formulas
    if (/^[=+\-@\t\r]/.test(cellStr)) {
      return `'${cellStr}`;
    }
    
    return cellStr;
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Segmento', 'Fonte', 'Faturamento Mensal', 'Economia Anual', 'Data'];
    const rows = filteredLeads.map((lead) => [
      sanitizeCell(lead.nome),
      sanitizeCell(lead.email),
      sanitizeCell(lead.whatsapp),
      sanitizeCell(lead.segmento),
      sanitizeCell(lead.fonte),
      sanitizeCell(lead.faturamento_mensal),
      sanitizeCell(lead.economia_anual),
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
    const phone = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Leads Capturados
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
              Exportar CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, whatsapp ou segmento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
            {searchTerm && <p className="text-sm">Tente ajustar sua busca.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                  <TableHead className="text-right">Economia</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.nome}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{lead.email}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-green-600 hover:text-green-700"
                          onClick={() => openWhatsApp(lead.whatsapp)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {lead.whatsapp}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{getSegmentoBadge(lead.segmento)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{lead.fonte}</TableCell>
                    <TableCell className="text-right">{formatCurrency(lead.faturamento_mensal)}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(lead.economia_anual)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
