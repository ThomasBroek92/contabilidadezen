import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Key, 
  Shield, 
  AlertTriangle,
  Copy,
  Search,
  BarChart3,
  Building2,
  FileJson,
  Users,
  Globe,
  Loader2,
  Play,
  XCircle,
  CircleDot,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StepProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isCompleted?: boolean;
  stepKey: string;
  onToggle: (key: string, checked: boolean) => void;
  notes: string;
  onNotesChange: (key: string, notes: string) => void;
}

interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  details?: string;
}

interface IntegrationProgress {
  completedSteps: Record<string, boolean>;
  notes: Record<string, string>;
}

const STORAGE_KEY = 'google-integration-progress';

function loadProgress(): IntegrationProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  return { completedSteps: {}, notes: {} };
}

function saveProgress(progress: IntegrationProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

function Step({ number, title, description, children, isCompleted, stepKey, onToggle, notes, onNotesChange }: StepProps) {
  const [showNotes, setShowNotes] = useState(!!notes);
  
  return (
    <div className="relative pl-8 pb-8 border-l-2 border-border last:border-l-0 last:pb-0">
      <div className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isCompleted ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'
      }`}>
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : number}
      </div>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Checkbox 
              id={stepKey}
              checked={isCompleted}
              onCheckedChange={(checked) => onToggle(stepKey, checked as boolean)}
            />
            <Label htmlFor={stepKey} className="text-xs text-muted-foreground cursor-pointer">
              Concluído
            </Label>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          {children}
        </div>
        
        {/* Notes Section */}
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? 'Ocultar observações' : 'Adicionar observação'}
          </Button>
          {showNotes && (
            <Textarea
              placeholder="Adicione observações, anotações ou informações relevantes para esta etapa..."
              value={notes}
              onChange={(e) => onNotesChange(stepKey, e.target.value)}
              className="text-sm min-h-[80px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    toast.success("Copiado para a área de transferência!");
  };

  return (
    <div className="relative bg-background rounded-md border p-3 font-mono text-sm overflow-x-auto">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-6 w-6"
        onClick={copyToClipboard}
      >
        <Copy className="h-3 w-3" />
      </Button>
      <pre className="pr-8 whitespace-pre-wrap break-all">{children}</pre>
    </div>
  );
}

function TestButton({ 
  label, 
  onTest, 
  result 
}: { 
  label: string; 
  onTest: () => Promise<void>; 
  result: TestResult;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onTest}
        disabled={result.status === 'loading'}
        className="min-w-[140px]"
      >
        {result.status === 'loading' ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )}
        {label}
      </Button>
      {result.status === 'success' && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">{result.message}</span>
        </div>
      )}
      {result.status === 'error' && (
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-4 w-4" />
          <span className="text-sm">{result.message}</span>
        </div>
      )}
    </div>
  );
}

// Status indicator component (Farol)
function StatusIndicator({ status }: { status: 'success' | 'warning' | 'error' | 'idle' }) {
  const config = {
    success: { color: 'bg-green-500', label: 'Configurado', icon: CheckCircle2 },
    warning: { color: 'bg-yellow-500', label: 'Parcial', icon: CircleDot },
    error: { color: 'bg-red-500', label: 'Não configurado', icon: XCircle },
    idle: { color: 'bg-muted', label: 'Não testado', icon: Circle },
  };
  
  const { color, label, icon: Icon } = config[status];
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color} animate-pulse`} />
      <Icon className={`h-4 w-4 ${status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-yellow-500' : status === 'error' ? 'text-red-500' : 'text-muted-foreground'}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

// Integration card with status
function IntegrationStatusCard({ 
  title, 
  description, 
  icon: Icon, 
  iconColor,
  status,
  completedSteps,
  totalSteps,
  testResult,
  onTest
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  status: 'success' | 'warning' | 'error' | 'idle';
  completedSteps: number;
  totalSteps: number;
  testResult?: TestResult;
  onTest?: () => Promise<void>;
}) {
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 h-1 ${status === 'success' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : status === 'error' ? 'bg-red-500' : 'bg-muted'}`} style={{ width: `${progressPercent}%` }} />
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <StatusIndicator status={status} />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Etapas: {completedSteps}/{totalSteps}
          </span>
          <span className="font-medium">{Math.round(progressPercent)}%</span>
        </div>
        
        {onTest && testResult && (
          <div className="pt-2 border-t">
            <TestButton label="Testar Conexão" onTest={onTest} result={testResult} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function GoogleIntegrationGuide() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchConsoleTest, setSearchConsoleTest] = useState<TestResult>({ status: 'idle' });
  const [businessProfileTest, setBusinessProfileTest] = useState<TestResult>({ status: 'idle' });
  const [progress, setProgress] = useState<IntegrationProgress>(loadProgress);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleToggleStep = (key: string, checked: boolean) => {
    setProgress(prev => ({
      ...prev,
      completedSteps: { ...prev.completedSteps, [key]: checked }
    }));
    if (checked) {
      toast.success("Etapa marcada como concluída!");
    }
  };

  const handleNotesChange = (key: string, notes: string) => {
    setProgress(prev => ({
      ...prev,
      notes: { ...prev.notes, [key]: notes }
    }));
  };

  // Calculate progress for each section
  const serviceAccountSteps = ['sa-1', 'sa-2', 'sa-3', 'sa-4', 'sa-5'];
  const searchConsoleSteps = ['sc-1', 'sc-2', 'sc-3', 'sc-4'];
  const businessProfileSteps = ['bp-1', 'bp-2', 'bp-3'];
  const analyticsSteps = ['ga-1', 'ga-2', 'ga-3'];

  const countCompleted = (steps: string[]) => steps.filter(s => progress.completedSteps[s]).length;

  const getStatus = (completed: number, total: number, testResult?: TestResult): 'success' | 'warning' | 'error' | 'idle' => {
    if (testResult?.status === 'success') return 'success';
    if (testResult?.status === 'error') return 'error';
    if (completed === total) return 'success';
    if (completed > 0) return 'warning';
    return 'idle';
  };

  const requiredSecrets = [
    { name: "GOOGLE_SERVICE_ACCOUNT_JSON", description: "JSON completo da conta de serviço" },
    { name: "GOOGLE_SEARCH_CONSOLE_SITE_URL", description: "URL do site no Search Console (ex: https://seusite.com.br)" },
    { name: "GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID", description: "ID da conta do Google Business Profile" },
    { name: "GOOGLE_BUSINESS_PROFILE_LOCATION_ID", description: "ID da localização no Business Profile" },
  ];

  const testSearchConsole = async () => {
    setSearchConsoleTest({ status: 'loading' });
    try {
      const { data, error } = await supabase.functions.invoke('google-search-console', {
        body: { action: 'sitemaps' }
      });

      if (error) throw error;
      
      if (data?.success) {
        setSearchConsoleTest({ 
          status: 'success', 
          message: `Conectado! Site: ${data.siteUrl}`,
          details: JSON.stringify(data.data, null, 2)
        });
        toast.success("Search Console conectado com sucesso!");
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao testar conexão';
      setSearchConsoleTest({ status: 'error', message });
      toast.error(`Erro no Search Console: ${message}`);
    }
  };

  const testBusinessProfile = async () => {
    setBusinessProfileTest({ status: 'loading' });
    try {
      const { data, error } = await supabase.functions.invoke('publish-to-gmb', {
        body: { action: 'test' }
      });

      if (error) throw error;
      
      if (data?.success) {
        setBusinessProfileTest({ 
          status: 'success', 
          message: 'Autenticação válida!',
          details: JSON.stringify(data, null, 2)
        });
        toast.success("Business Profile conectado com sucesso!");
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao testar conexão';
      setBusinessProfileTest({ status: 'error', message });
      toast.error(`Erro no Business Profile: ${message}`);
    }
  };

  const totalSteps = serviceAccountSteps.length + searchConsoleSteps.length + businessProfileSteps.length + analyticsSteps.length;
  const totalCompleted = countCompleted([...serviceAccountSteps, ...searchConsoleSteps, ...businessProfileSteps, ...analyticsSteps]);
  const overallProgress = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Guia de Integração Google</h2>
          <p className="text-muted-foreground">Configure as integrações com Search Console, Business Profile e Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {overallProgress}% completo
          </Badge>
        </div>
      </div>

      {/* Status Overview (Farol) */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Painel de Status das Integrações
          </CardTitle>
          <CardDescription>
            Visão geral do progresso de configuração de cada integração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IntegrationStatusCard
              title="Conta de Serviço"
              description="Base obrigatória"
              icon={FileJson}
              iconColor="bg-blue-500/10 text-blue-500"
              status={getStatus(countCompleted(serviceAccountSteps), serviceAccountSteps.length)}
              completedSteps={countCompleted(serviceAccountSteps)}
              totalSteps={serviceAccountSteps.length}
            />
            <IntegrationStatusCard
              title="Search Console"
              description="SEO e indexação"
              icon={Search}
              iconColor="bg-green-500/10 text-green-500"
              status={getStatus(countCompleted(searchConsoleSteps), searchConsoleSteps.length, searchConsoleTest)}
              completedSteps={countCompleted(searchConsoleSteps)}
              totalSteps={searchConsoleSteps.length}
              testResult={searchConsoleTest}
              onTest={testSearchConsole}
            />
            <IntegrationStatusCard
              title="Business Profile"
              description="Publicação local"
              icon={Building2}
              iconColor="bg-orange-500/10 text-orange-500"
              status={getStatus(countCompleted(businessProfileSteps), businessProfileSteps.length, businessProfileTest)}
              completedSteps={countCompleted(businessProfileSteps)}
              totalSteps={businessProfileSteps.length}
              testResult={businessProfileTest}
              onTest={testBusinessProfile}
            />
            <IntegrationStatusCard
              title="Analytics"
              description="Métricas de uso"
              icon={BarChart3}
              iconColor="bg-purple-500/10 text-purple-500"
              status={getStatus(countCompleted(analyticsSteps), analyticsSteps.length)}
              completedSteps={countCompleted(analyticsSteps)}
              totalSteps={analyticsSteps.length}
            />
          </div>
        </CardContent>
      </Card>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Secrets Necessários
          </CardTitle>
          <CardDescription>
            Configure estes secrets no painel do Lovable Cloud para habilitar as integrações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {requiredSecrets.map((secret) => (
              <div key={secret.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <code className="text-sm font-mono text-foreground">{secret.name}</code>
                    <p className="text-xs text-muted-foreground">{secret.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guides */}
      <Accordion 
        type="multiple" 
        value={expandedSections} 
        onValueChange={setExpandedSections}
        className="space-y-4"
      >
        {/* Service Account Setup */}
        <AccordionItem value="service-account" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileJson className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold">1. Criar Conta de Serviço Google</h3>
                <p className="text-sm text-muted-foreground">Base para todas as integrações</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={countCompleted(serviceAccountSteps) === serviceAccountSteps.length ? "default" : "secondary"}>
                  {countCompleted(serviceAccountSteps)}/{serviceAccountSteps.length}
                </Badge>
                <Badge variant="destructive">Obrigatório</Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  A conta de serviço é necessária para autenticar com todas as APIs do Google. 
                  Guarde o arquivo JSON em local seguro.
                </AlertDescription>
              </Alert>

              <Step 
                number={1} 
                title="Acesse o Google Cloud Console" 
                description="Crie ou selecione um projeto"
                stepKey="sa-1"
                isCompleted={progress.completedSteps['sa-1']}
                onToggle={handleToggleStep}
                notes={progress.notes['sa-1'] || ''}
                onNotesChange={handleNotesChange}
              >
                <p className="text-sm">Acesse o console do Google Cloud e crie um novo projeto ou selecione um existente.</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                    Abrir Google Cloud Console <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step 
                number={2} 
                title="Ative as APIs necessárias" 
                description="Habilite as APIs que serão utilizadas"
                stepKey="sa-2"
                isCompleted={progress.completedSteps['sa-2']}
                onToggle={handleToggleStep}
                notes={progress.notes['sa-2'] || ''}
                onNotesChange={handleNotesChange}
              >
                <p className="text-sm mb-2">No menu lateral, vá em <strong>APIs e Serviços → Biblioteca</strong> e ative:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Google Search Console API</li>
                  <li>Google My Business API (Business Profile)</li>
                  <li>Google Analytics Data API (opcional)</li>
                </ul>
              </Step>

              <Step 
                number={3} 
                title="Crie a Conta de Serviço" 
                description="Gere as credenciais de autenticação"
                stepKey="sa-3"
                isCompleted={progress.completedSteps['sa-3']}
                onToggle={handleToggleStep}
                notes={progress.notes['sa-3'] || ''}
                onNotesChange={handleNotesChange}
              >
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Vá em <strong>APIs e Serviços → Credenciais</strong></li>
                  <li>Clique em <strong>Criar Credenciais → Conta de Serviço</strong></li>
                  <li>Preencha o nome (ex: "lovable-integration")</li>
                  <li>Clique em <strong>Criar e Continuar</strong></li>
                  <li>Pule a etapa de permissões (opcional)</li>
                  <li>Clique em <strong>Concluído</strong></li>
                </ol>
              </Step>

              <Step 
                number={4} 
                title="Gere a Chave JSON" 
                description="Baixe o arquivo de credenciais"
                stepKey="sa-4"
                isCompleted={progress.completedSteps['sa-4']}
                onToggle={handleToggleStep}
                notes={progress.notes['sa-4'] || ''}
                onNotesChange={handleNotesChange}
              >
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Na lista de contas de serviço, clique na conta criada</li>
                  <li>Vá na aba <strong>Chaves</strong></li>
                  <li>Clique em <strong>Adicionar Chave → Criar nova chave</strong></li>
                  <li>Selecione <strong>JSON</strong> e clique em <strong>Criar</strong></li>
                  <li>O arquivo será baixado automaticamente</li>
                </ol>
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Guarde este arquivo!</strong> Ele contém as credenciais privadas e não pode ser baixado novamente.
                  </AlertDescription>
                </Alert>
              </Step>

              <Step 
                number={5} 
                title="Configure o Secret" 
                description="Adicione o JSON nas configurações"
                stepKey="sa-5"
                isCompleted={progress.completedSteps['sa-5']}
                onToggle={handleToggleStep}
                notes={progress.notes['sa-5'] || ''}
                onNotesChange={handleNotesChange}
              >
                <p className="text-sm mb-2">Copie todo o conteúdo do arquivo JSON e adicione como secret:</p>
                <div className="bg-background rounded-md border p-3">
                  <p className="text-sm font-mono text-muted-foreground">
                    Secret: <strong className="text-foreground">GOOGLE_SERVICE_ACCOUNT_JSON</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor: Cole o conteúdo completo do arquivo JSON baixado
                  </p>
                </div>
              </Step>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Search Console Setup */}
        <AccordionItem value="search-console" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Search className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold">2. Configurar Google Search Console</h3>
                <p className="text-sm text-muted-foreground">Monitorar indexação e desempenho de busca</p>
              </div>
              <Badge variant={countCompleted(searchConsoleSteps) === searchConsoleSteps.length ? "default" : "secondary"}>
                {countCompleted(searchConsoleSteps)}/{searchConsoleSteps.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <Step 
                number={1} 
                title="Acesse o Search Console" 
                description="Abra o painel do Search Console"
                stepKey="sc-1"
                isCompleted={progress.completedSteps['sc-1']}
                onToggle={handleToggleStep}
                notes={progress.notes['sc-1'] || ''}
                onNotesChange={handleNotesChange}
              >
                <Button variant="outline" size="sm" asChild>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                    Abrir Search Console <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step 
                number={2} 
                title="Adicione o Site (se necessário)" 
                description="Verifique a propriedade do site"
                stepKey="sc-2"
                isCompleted={progress.completedSteps['sc-2']}
                onToggle={handleToggleStep}
                notes={progress.notes['sc-2'] || ''}
                onNotesChange={handleNotesChange}
              >
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Clique em <strong>Adicionar propriedade</strong></li>
                  <li>Escolha <strong>Prefixo de URL</strong></li>
                  <li>Digite a URL completa (ex: https://seusite.com.br)</li>
                  <li>Verifique usando um dos métodos disponíveis</li>
                </ol>
              </Step>

              <Step 
                number={3} 
                title="Adicione a Conta de Serviço como Usuário" 
                description="Permita acesso via API"
                stepKey="sc-3"
                isCompleted={progress.completedSteps['sc-3']}
                onToggle={handleToggleStep}
                notes={progress.notes['sc-3'] || ''}
                onNotesChange={handleNotesChange}
              >
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>No Search Console, vá em <strong>Configurações → Usuários e permissões</strong></li>
                  <li>Clique em <strong>Adicionar usuário</strong></li>
                  <li>Cole o email da conta de serviço (encontrado no JSON como <code>client_email</code>)</li>
                  <li>Selecione permissão <strong>Restrita</strong> ou <strong>Completa</strong></li>
                  <li>Clique em <strong>Adicionar</strong></li>
                </ol>
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    O email da conta de serviço tem formato: <code>nome@projeto.iam.gserviceaccount.com</code>
                  </AlertDescription>
                </Alert>
              </Step>

              <Step 
                number={4} 
                title="Configure o Secret da URL" 
                description="Adicione a URL do site"
                stepKey="sc-4"
                isCompleted={progress.completedSteps['sc-4']}
                onToggle={handleToggleStep}
                notes={progress.notes['sc-4'] || ''}
                onNotesChange={handleNotesChange}
              >
                <p className="text-sm mb-2">Configure o secret com a URL exata do seu site:</p>
                <div className="bg-background rounded-md border p-3">
                  <p className="text-sm font-mono text-muted-foreground">
                    Secret: <strong className="text-foreground">GOOGLE_SEARCH_CONSOLE_SITE_URL</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor: A URL completa do site (ex: https://www.contabilidadezen.com.br)
                  </p>
                </div>
              </Step>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Business Profile Setup */}
        <AccordionItem value="business-profile" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Building2 className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold">3. Configurar Google Business Profile</h3>
                <p className="text-sm text-muted-foreground">Publicar posts no perfil da empresa</p>
              </div>
              <Badge variant={countCompleted(businessProfileSteps) === businessProfileSteps.length ? "default" : "secondary"}>
                {countCompleted(businessProfileSteps)}/{businessProfileSteps.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <Step 
                number={1} 
                title="Acesse o Business Profile" 
                description="Abra o painel do Google Business"
                stepKey="bp-1"
                isCompleted={progress.completedSteps['bp-1']}
                onToggle={handleToggleStep}
                notes={progress.notes['bp-1'] || ''}
                onNotesChange={handleNotesChange}
              >
                <Button variant="outline" size="sm" asChild>
                  <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">
                    Abrir Business Profile <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step 
                number={2} 
                title="Obtenha os IDs necessários" 
                description="Encontre o Account ID e Location ID"
                stepKey="bp-2"
                isCompleted={progress.completedSteps['bp-2']}
                onToggle={handleToggleStep}
                notes={progress.notes['bp-2'] || ''}
                onNotesChange={handleNotesChange}
              >
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Acesse a API Business Profile no Google Cloud Console</li>
                  <li>Use o API Explorer para listar suas contas</li>
                  <li>Anote o <code>accountId</code> e <code>locationId</code> do seu negócio</li>
                </ol>
              </Step>

              <Step 
                number={3} 
                title="Configure os Secrets" 
                description="Adicione os IDs nas configurações"
                stepKey="bp-3"
                isCompleted={progress.completedSteps['bp-3']}
                onToggle={handleToggleStep}
                notes={progress.notes['bp-3'] || ''}
                onNotesChange={handleNotesChange}
              >
                <div className="space-y-3">
                  <div className="bg-background rounded-md border p-3">
                    <p className="text-sm font-mono text-muted-foreground">
                      Secret: <strong className="text-foreground">GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valor: ID da conta (ex: 123456789)
                    </p>
                  </div>
                  <div className="bg-background rounded-md border p-3">
                    <p className="text-sm font-mono text-muted-foreground">
                      Secret: <strong className="text-foreground">GOOGLE_BUSINESS_PROFILE_LOCATION_ID</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valor: ID da localização (ex: 987654321)
                    </p>
                  </div>
                </div>
              </Step>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Google Analytics Setup */}
        <AccordionItem value="analytics" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold">4. Configurar Google Analytics (Frontend)</h3>
                <p className="text-sm text-muted-foreground">Rastrear visitantes e conversões</p>
              </div>
              <Badge variant={countCompleted(analyticsSteps) === analyticsSteps.length ? "default" : "secondary"}>
                {countCompleted(analyticsSteps)}/{analyticsSteps.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <Alert>
                <BarChart3 className="h-4 w-4" />
                <AlertTitle>Integração Frontend</AlertTitle>
                <AlertDescription>
                  O Google Analytics é integrado diretamente no código do site, não precisa de edge functions.
                </AlertDescription>
              </Alert>

              <Step 
                number={1} 
                title="Crie uma propriedade GA4" 
                description="Configure o Google Analytics 4"
                stepKey="ga-1"
                isCompleted={progress.completedSteps['ga-1']}
                onToggle={handleToggleStep}
                notes={progress.notes['ga-1'] || ''}
                onNotesChange={handleNotesChange}
              >
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Acesse o <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics</a></li>
                  <li>Crie uma nova propriedade GA4</li>
                  <li>Configure o fluxo de dados Web</li>
                  <li>Anote o <strong>Measurement ID</strong> (formato: G-XXXXXXXXXX)</li>
                </ol>
              </Step>

              <Step 
                number={2} 
                title="Adicione o script ao site" 
                description="Integre o GA4 no código"
                stepKey="ga-2"
                isCompleted={progress.completedSteps['ga-2']}
                onToggle={handleToggleStep}
                notes={progress.notes['ga-2'] || ''}
                onNotesChange={handleNotesChange}
              >
                <p className="text-sm mb-2">Adicione o seguinte script no componente AnalyticsTracker ou no index.html:</p>
                <CodeBlock>{`<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}</CodeBlock>
              </Step>

              <Step 
                number={3} 
                title="Teste a integração" 
                description="Verifique se está funcionando"
                stepKey="ga-3"
                isCompleted={progress.completedSteps['ga-3']}
                onToggle={handleToggleStep}
                notes={progress.notes['ga-3'] || ''}
                onNotesChange={handleNotesChange}
              >
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Abra seu site em uma aba anônima</li>
                  <li>Aceite os cookies (se houver popup)</li>
                  <li>Acesse o relatório de <strong>Tempo Real</strong> no GA4</li>
                  <li>Você deve ver sua visita aparecendo</li>
                </ol>
              </Step>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Troubleshooting */}
        <AccordionItem value="troubleshooting" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold">Solução de Problemas</h3>
                <p className="text-sm text-muted-foreground">Erros comuns e como resolvê-los</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-500">Erro 403 - Forbidden</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    A conta de serviço não tem permissão. Verifique se você adicionou o email da conta de serviço 
                    como usuário no Search Console ou Business Profile.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-500">Erro 401 - Unauthorized</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    O JSON da conta de serviço está inválido ou mal formatado. Certifique-se de copiar o JSON 
                    completo, incluindo as chaves.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-500">Erro "API not enabled"</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    A API necessária não está ativada no Google Cloud. Acesse a Biblioteca de APIs e ative 
                    a API correspondente.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Useful Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Links Úteis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <Button variant="outline" asChild className="justify-start">
              <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Cloud Console
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Search Console
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Business Profile
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Analytics
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
