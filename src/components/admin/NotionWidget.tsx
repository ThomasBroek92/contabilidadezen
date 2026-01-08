import { useEffect, useState } from 'react';
import { useNotion, NotionPage } from '@/hooks/use-notion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  RefreshCw, Plus, Trash2, Edit, ExternalLink, 
  FileText, Loader2, AlertCircle, CheckCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Helper to extract text from Notion property
const getPropertyValue = (property: any): string => {
  if (!property) return '';
  
  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'select':
      return property.select?.name || '';
    case 'multi_select':
      return property.multi_select?.map((s: any) => s.name).join(', ') || '';
    case 'status':
      return property.status?.name || '';
    case 'date':
      return property.date?.start || '';
    case 'checkbox':
      return property.checkbox ? 'Sim' : 'Não';
    case 'number':
      return property.number?.toString() || '';
    case 'url':
      return property.url || '';
    case 'email':
      return property.email || '';
    case 'phone_number':
      return property.phone_number || '';
    default:
      return JSON.stringify(property);
  }
};

// Helper to get status color (semantic tokens only)
const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('done') || statusLower.includes('concluí') || statusLower.includes('complete')) {
    return 'bg-primary/10 text-primary border-border';
  }
  if (statusLower.includes('progress') || statusLower.includes('andamento') || statusLower.includes('doing')) {
    return 'bg-secondary text-secondary-foreground border-border';
  }
  if (statusLower.includes('todo') || statusLower.includes('fazer') || statusLower.includes('pending')) {
    return 'bg-muted text-muted-foreground border-border';
  }
  return 'bg-muted/50 text-foreground border-border';
};

interface CreateFormData {
  title: string;
  description: string;
  status: string;
}

export function NotionWidget() {
  const { loading, pages, database, fetchDatabase, fetchPages, createPage, archivePage } = useNotion();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<CreateFormData>({ title: '', description: '', status: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect database properties
  const [titleProperty, setTitleProperty] = useState<string>('');
  const [statusProperty, setStatusProperty] = useState<string>('');
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [descProperty, setDescProperty] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setError(null);
    try {
      const db = await fetchDatabase();
      
      // Auto-detect properties
      if (db?.properties) {
        const props = db.properties;
        
        // Find title property
        const titleProp = Object.entries(props).find(([_, v]: [string, any]) => v.type === 'title');
        if (titleProp) setTitleProperty(titleProp[0]);
        
        // Find status/select property
        const statusProp = Object.entries(props).find(([k, v]: [string, any]) => 
          v.type === 'status' || (v.type === 'select' && k.toLowerCase().includes('status'))
        );
        if (statusProp) {
          setStatusProperty(statusProp[0]);
          const propData = statusProp[1] as any;
          if (propData.type === 'status' && propData.status?.options) {
            setStatusOptions(propData.status.options.map((o: any) => o.name));
          } else if (propData.type === 'select' && propData.select?.options) {
            setStatusOptions(propData.select.options.map((o: any) => o.name));
          }
        }
        
        // Find description/rich_text property
        const descProp = Object.entries(props).find(([k, v]: [string, any]) => 
          v.type === 'rich_text' && (k.toLowerCase().includes('desc') || k.toLowerCase().includes('nota'))
        );
        if (descProp) setDescProperty(descProp[0]);
      }
      
      await fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar com Notion');
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    
    setIsSubmitting(true);
    try {
      const properties: Record<string, any> = {};
      
      if (titleProperty) {
        properties[titleProperty] = {
          title: [{ text: { content: formData.title } }]
        };
      }
      
      if (descProperty && formData.description) {
        properties[descProperty] = {
          rich_text: [{ text: { content: formData.description } }]
        };
      }
      
      if (statusProperty && formData.status) {
        const propType = database?.properties?.[statusProperty]?.type;
        if (propType === 'status') {
          properties[statusProperty] = { status: { name: formData.status } };
        } else if (propType === 'select') {
          properties[statusProperty] = { select: { name: formData.status } };
        }
      }
      
      await createPage(properties);
      setFormData({ title: '', description: '', status: '' });
      setIsCreateOpen(false);
      await fetchPages();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Tem certeza que deseja arquivar este item?')) return;
    await archivePage(pageId);
    await fetchPages();
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Erro de Conexão
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notion
            </CardTitle>
            <CardDescription>
              {database?.title?.[0]?.plain_text || 'Database conectado'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar novo item</DialogTitle>
                  <DialogDescription>
                    Adicione um novo item ao seu database Notion
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Título *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Digite o título..."
                    />
                  </div>
                  {descProperty && (
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Digite uma descrição..."
                      />
                    </div>
                  )}
                  {statusOptions.length > 0 && (
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={isSubmitting || !formData.title.trim()}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && pages.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum item encontrado</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {pages.map((page) => {
                const title = titleProperty ? getPropertyValue(page.properties[titleProperty]) : 'Sem título';
                const status = statusProperty ? getPropertyValue(page.properties[statusProperty]) : '';
                const description = descProperty ? getPropertyValue(page.properties[descProperty]) : '';
                
                return (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{title}</span>
                        {status && (
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        )}
                      </div>
                      {description && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Atualizado {formatDistanceToNow(new Date(page.last_edited_time), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(`https://notion.so/${page.id.replace(/-/g, '')}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
