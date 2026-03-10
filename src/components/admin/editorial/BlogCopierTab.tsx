import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Copy, Save, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

interface CopiedPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  category: string;
  faq_schema: any;
  expert_quotes: any[];
  source_url: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export function BlogCopierTab() {
  const { toast } = useToast();
  const [urls, setUrls] = useState('');
  const [sourceExpert, setSourceExpert] = useState('');
  const [targetExpert, setTargetExpert] = useState('Thomas Broek');
  const [sourceCompany, setSourceCompany] = useState('');
  const [targetCompany, setTargetCompany] = useState('Contabilidade Zen');
  const [results, setResults] = useState<CopiedPost[]>([]);
  const [processing, setProcessing] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleProcess = async () => {
    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urlList.length === 0) {
      toast({ title: 'Insira pelo menos uma URL', variant: 'destructive' });
      return;
    }

    setProcessing(true);
    const initialResults: CopiedPost[] = urlList.map(u => ({
      title: '', slug: '', content: '', excerpt: '', meta_title: '', meta_description: '',
      meta_keywords: [], category: '', faq_schema: null, expert_quotes: [],
      source_url: u, status: 'pending' as const,
    }));
    setResults(initialResults);

    for (let i = 0; i < urlList.length; i++) {
      setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'processing' } : r));

      try {
        const { data, error } = await supabase.functions.invoke('copy-blog-content', {
          body: {
            url: urlList[i],
            sourceExpert,
            targetExpert,
            sourceCompany,
            targetCompany,
          },
        });

        if (error) throw new Error(error.message);
        if (!data?.success) throw new Error(data?.error || 'Unknown error');

        setResults(prev => prev.map((r, idx) => idx === i ? {
          ...r,
          ...data.data,
          status: 'done' as const,
        } : r));
      } catch (err: any) {
        setResults(prev => prev.map((r, idx) => idx === i ? {
          ...r,
          status: 'error' as const,
          error: err.message || 'Erro desconhecido',
        } : r));
      }

      // Delay between requests
      if (i < urlList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setProcessing(false);
    toast({ title: 'Processamento concluído!' });
  };

  const handleSave = async (index: number, publish: boolean) => {
    const post = results[index];
    if (!post || post.status !== 'done') return;

    setSavingIndex(index);
    try {
      const insertData: any = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        meta_keywords: post.meta_keywords,
        category: post.category,
        faq_schema: post.faq_schema,
        expert_quotes: post.expert_quotes,
        geo_score: 75,
        status: publish ? 'published' : 'draft',
      };

      if (publish) {
        insertData.published_at = new Date().toISOString();
      }

      const { error } = await supabase.from('blog_posts').insert(insertData);

      if (error) throw error;

      const action = publish ? 'publicado' : 'salvo como rascunho';
      toast({ title: `Post ${action}!` });

      if (publish) {
        toast({
          title: 'Post publicado com sucesso!',
          description: `Acesse: /blog/${post.slug}`,
        });
      }

      setResults(prev => prev.map((r, idx) => idx === index ? { ...r, status: 'done' as const } : r));
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copiar Blog (Inspiração)
          </CardTitle>
          <CardDescription>
            Cole URLs de artigos para usar como inspiração. A IA reescreverá completamente, substituindo entidades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>URLs (uma por linha)</Label>
            <textarea
              className="w-full min-h-[100px] mt-1 p-3 border rounded-lg bg-background text-foreground text-sm font-mono resize-y"
              placeholder="https://blog.exemplo.com/artigo-1&#10;https://blog.exemplo.com/artigo-2"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={processing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Especialista Origem (opcional)</Label>
              <Input
                placeholder="Ex: Victor Torres"
                value={sourceExpert}
                onChange={(e) => setSourceExpert(e.target.value)}
                disabled={processing}
              />
            </div>
            <div className="space-y-2">
              <Label>Especialista Destino</Label>
              <Input
                value={targetExpert}
                onChange={(e) => setTargetExpert(e.target.value)}
                disabled={processing}
              />
            </div>
            <div className="space-y-2">
              <Label>Empresa Origem (opcional)</Label>
              <Input
                placeholder="Ex: Contabilizei"
                value={sourceCompany}
                onChange={(e) => setSourceCompany(e.target.value)}
                disabled={processing}
              />
            </div>
            <div className="space-y-2">
              <Label>Empresa Destino</Label>
              <Input
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                disabled={processing}
              />
            </div>
          </div>

          <Button onClick={handleProcess} disabled={processing} className="gap-2">
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
            {processing ? 'Processando...' : 'Processar URLs'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados ({results.filter(r => r.status === 'done').length}/{results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="shrink-0">
                    {result.status === 'pending' && <Badge variant="outline">Aguardando</Badge>}
                    {result.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {result.status === 'done' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {result.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    {result.status === 'done' ? (
                      <p className="font-medium text-sm truncate">{result.title}</p>
                    ) : result.status === 'error' ? (
                      <p className="text-sm text-destructive">{result.error}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground truncate">{result.source_url}</p>
                    )}
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {result.source_url}
                    </p>
                  </div>

                  {result.status === 'done' && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewIndex(previewIndex === index ? null : index)}
                      >
                        {previewIndex === index ? 'Fechar' : 'Preview'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave(index, false)}
                        disabled={savingIndex === index}
                        className="gap-1"
                      >
                        {savingIndex === index ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Rascunho
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(index, true)}
                        disabled={savingIndex === index}
                        className="gap-1"
                      >
                        {savingIndex === index ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                        Publicar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {previewIndex !== null && results[previewIndex]?.status === 'done' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{results[previewIndex].title}</CardTitle>
            <CardDescription>{results[previewIndex].excerpt}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge>{results[previewIndex].category}</Badge>
              {results[previewIndex].meta_keywords?.map((kw, i) => (
                <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[500px]">
              <MarkdownRenderer content={results[previewIndex].content} />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
