import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Check, FileCode, HelpCircle, BookOpen, Building2, Newspaper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SchemaType = 'FAQPage' | 'HowTo' | 'Article' | 'Organization';

interface FAQItem {
  question: string;
  answer: string;
}

export function SchemaGenerator() {
  const { toast } = useToast();
  const [schemaType, setSchemaType] = useState<SchemaType>('FAQPage');
  const [copied, setCopied] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState<string>('');
  
  // FAQ State
  const [faqItems, setFaqItems] = useState<FAQItem[]>([{ question: '', answer: '' }]);
  
  // Article State
  const [articleData, setArticleData] = useState({
    headline: '',
    description: '',
    author: '',
    datePublished: '',
    dateModified: '',
    image: '',
  });

  // Organization State
  const [orgData, setOrgData] = useState({
    name: 'Contabilidade Zen',
    description: '',
    url: 'https://www.contabilidadezen.com.br',
    logo: '',
    email: '',
    phone: '',
    address: '',
  });

  // HowTo State
  const [howToData, setHowToData] = useState({
    name: '',
    description: '',
    totalTime: '',
    steps: [{ name: '', text: '' }],
  });

  const generateFAQSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.filter(f => f.question && f.answer).map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
    return JSON.stringify(schema, null, 2);
  };

  const generateArticleSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleData.headline,
      description: articleData.description,
      author: {
        '@type': 'Person',
        name: articleData.author,
      },
      datePublished: articleData.datePublished,
      dateModified: articleData.dateModified || articleData.datePublished,
      publisher: {
        '@type': 'Organization',
        name: 'Contabilidade Zen',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.contabilidadezen.com.br/logo.png',
        },
      },
      image: articleData.image,
    };
    return JSON.stringify(schema, null, 2);
  };

  const generateOrganizationSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: orgData.name,
      description: orgData.description,
      url: orgData.url,
      logo: orgData.logo,
      contactPoint: {
        '@type': 'ContactPoint',
        email: orgData.email,
        telephone: orgData.phone,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: orgData.address,
      },
    };
    return JSON.stringify(schema, null, 2);
  };

  const generateHowToSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howToData.name,
      description: howToData.description,
      totalTime: howToData.totalTime,
      step: howToData.steps.filter(s => s.name && s.text).map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    };
    return JSON.stringify(schema, null, 2);
  };

  const handleGenerate = () => {
    let schema = '';
    switch (schemaType) {
      case 'FAQPage':
        schema = generateFAQSchema();
        break;
      case 'Article':
        schema = generateArticleSchema();
        break;
      case 'Organization':
        schema = generateOrganizationSchema();
        break;
      case 'HowTo':
        schema = generateHowToSchema();
        break;
    }
    setGeneratedSchema(schema);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedSchema);
    setCopied(true);
    toast({ title: 'Schema copiado!', description: 'Cole no HTML da sua página.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const addFaqItem = () => setFaqItems([...faqItems, { question: '', answer: '' }]);
  const addHowToStep = () => setHowToData({
    ...howToData,
    steps: [...howToData.steps, { name: '', text: '' }],
  });

  const schemaIcons = {
    FAQPage: HelpCircle,
    HowTo: BookOpen,
    Article: Newspaper,
    Organization: Building2,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Gerador de Schema Markup (Dados Estruturados)
          </CardTitle>
          <CardDescription>
            Crie marcação estruturada para melhorar como sua página é entendida e citada por motores de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={schemaType} onValueChange={(v) => setSchemaType(v as SchemaType)}>
            <TabsList className="grid w-full grid-cols-4">
              {(['FAQPage', 'HowTo', 'Article', 'Organization'] as SchemaType[]).map(type => {
                const Icon = schemaIcons[type];
                return (
                  <TabsTrigger key={type} value={type} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {type}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="FAQPage" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                FAQ Schema aumenta chances de aparecer em respostas de IA. Cada resposta deve ter 40-60 palavras.
              </p>
              {faqItems.map((item, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <Label>Pergunta {index + 1}</Label>
                  <Input
                    placeholder="Ex: Quanto custa abrir uma empresa?"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[index].question = e.target.value;
                      setFaqItems(newItems);
                    }}
                  />
                  <Label>Resposta</Label>
                  <Textarea
                    placeholder="Resposta direta e concisa (40-60 palavras ideal)"
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[index].answer = e.target.value;
                      setFaqItems(newItems);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {item.answer.split(/\s+/).filter(w => w).length} palavras
                  </p>
                </div>
              ))}
              <Button variant="outline" onClick={addFaqItem}>+ Adicionar Pergunta</Button>
            </TabsContent>

            <TabsContent value="Article" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Título (headline)</Label>
                  <Input
                    value={articleData.headline}
                    onChange={(e) => setArticleData({ ...articleData, headline: e.target.value })}
                    placeholder="Título do artigo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Input
                    value={articleData.author}
                    onChange={(e) => setArticleData({ ...articleData, author: e.target.value })}
                    placeholder="Nome do autor"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Publicação</Label>
                  <Input
                    type="date"
                    value={articleData.datePublished}
                    onChange={(e) => setArticleData({ ...articleData, datePublished: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Última Atualização</Label>
                  <Input
                    type="date"
                    value={articleData.dateModified}
                    onChange={(e) => setArticleData({ ...articleData, dateModified: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={articleData.description}
                  onChange={(e) => setArticleData({ ...articleData, description: e.target.value })}
                  placeholder="Resumo do artigo"
                />
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input
                  value={articleData.image}
                  onChange={(e) => setArticleData({ ...articleData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>

            <TabsContent value="Organization" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={orgData.url}
                    onChange={(e) => setOrgData({ ...orgData, url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={orgData.email}
                    onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={orgData.phone}
                    onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={orgData.description}
                  onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                  placeholder="Descrição da empresa"
                />
              </div>
            </TabsContent>

            <TabsContent value="HowTo" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome do Tutorial</Label>
                  <Input
                    value={howToData.name}
                    onChange={(e) => setHowToData({ ...howToData, name: e.target.value })}
                    placeholder="Como abrir uma empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tempo Total</Label>
                  <Input
                    value={howToData.totalTime}
                    onChange={(e) => setHowToData({ ...howToData, totalTime: e.target.value })}
                    placeholder="PT30M (30 minutos)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={howToData.description}
                  onChange={(e) => setHowToData({ ...howToData, description: e.target.value })}
                />
              </div>
              {howToData.steps.map((step, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <Label>Passo {index + 1}</Label>
                  <Input
                    placeholder="Nome do passo"
                    value={step.name}
                    onChange={(e) => {
                      const newSteps = [...howToData.steps];
                      newSteps[index].name = e.target.value;
                      setHowToData({ ...howToData, steps: newSteps });
                    }}
                  />
                  <Textarea
                    placeholder="Descrição do passo"
                    value={step.text}
                    onChange={(e) => {
                      const newSteps = [...howToData.steps];
                      newSteps[index].text = e.target.value;
                      setHowToData({ ...howToData, steps: newSteps });
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addHowToStep}>+ Adicionar Passo</Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={handleGenerate}>
              <Code className="h-4 w-4 mr-2" />
              Gerar Schema
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedSchema && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Schema Gerado</CardTitle>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
            <CardDescription>
              Cole este código no &lt;head&gt; da sua página dentro de uma tag &lt;script type="application/ld+json"&gt;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{generatedSchema}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
