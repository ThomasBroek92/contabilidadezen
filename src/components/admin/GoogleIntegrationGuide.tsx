import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Globe
} from "lucide-react";
import { toast } from "sonner";

interface StepProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isCompleted?: boolean;
}

function Step({ number, title, description, children, isCompleted }: StepProps) {
  return (
    <div className="relative pl-8 pb-8 border-l-2 border-border last:border-l-0 last:pb-0">
      <div className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isCompleted ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'
      }`}>
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : number}
      </div>
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          {children}
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

export function GoogleIntegrationGuide() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["service-account"]);

  const requiredSecrets = [
    { name: "GOOGLE_SERVICE_ACCOUNT_JSON", description: "JSON completo da conta de serviço" },
    { name: "GOOGLE_SEARCH_CONSOLE_SITE_URL", description: "URL do site no Search Console (ex: https://seusite.com.br)" },
    { name: "GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID", description: "ID da conta do Google Business Profile" },
    { name: "GOOGLE_BUSINESS_PROFILE_LOCATION_ID", description: "ID da localização no Business Profile" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Guia de Integração Google</h2>
          <p className="text-muted-foreground">Configure as integrações com Search Console, Business Profile e Analytics</p>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Visão Geral das Integrações
          </CardTitle>
          <CardDescription>
            Para integrar completamente com os serviços Google, você precisará configurar os seguintes secrets:
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileJson className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">1. Criar Conta de Serviço Google</h3>
                <p className="text-sm text-muted-foreground">Base para todas as integrações</p>
              </div>
              <Badge variant="destructive" className="ml-auto">Obrigatório</Badge>
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

              <Step number={1} title="Acesse o Google Cloud Console" description="Crie ou selecione um projeto">
                <p className="text-sm">Acesse o console do Google Cloud e crie um novo projeto ou selecione um existente.</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                    Abrir Google Cloud Console <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step number={2} title="Ative as APIs necessárias" description="Habilite as APIs que serão utilizadas">
                <p className="text-sm mb-2">No menu lateral, vá em <strong>APIs e Serviços → Biblioteca</strong> e ative:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Google Search Console API</li>
                  <li>Google My Business API (Business Profile)</li>
                  <li>Google Analytics Data API (opcional)</li>
                </ul>
              </Step>

              <Step number={3} title="Crie a Conta de Serviço" description="Gere as credenciais de autenticação">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Vá em <strong>APIs e Serviços → Credenciais</strong></li>
                  <li>Clique em <strong>Criar Credenciais → Conta de Serviço</strong></li>
                  <li>Preencha o nome (ex: "lovable-integration")</li>
                  <li>Clique em <strong>Criar e Continuar</strong></li>
                  <li>Pule a etapa de permissões (opcional)</li>
                  <li>Clique em <strong>Concluído</strong></li>
                </ol>
              </Step>

              <Step number={4} title="Gere a Chave JSON" description="Baixe o arquivo de credenciais">
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

              <Step number={5} title="Configure o Secret" description="Adicione o JSON nas configurações">
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Search className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">2. Configurar Google Search Console</h3>
                <p className="text-sm text-muted-foreground">Monitorar indexação e desempenho de busca</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <Step number={1} title="Acesse o Search Console" description="Abra o painel do Search Console">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                    Abrir Search Console <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step number={2} title="Adicione o Site (se necessário)" description="Verifique a propriedade do site">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Clique em <strong>Adicionar propriedade</strong></li>
                  <li>Escolha <strong>Prefixo de URL</strong></li>
                  <li>Digite a URL completa (ex: https://seusite.com.br)</li>
                  <li>Verifique usando um dos métodos disponíveis</li>
                </ol>
              </Step>

              <Step number={3} title="Adicione a Conta de Serviço como Usuário" description="Permita acesso via API">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>No Search Console, vá em <strong>Configurações → Usuários e permissões</strong></li>
                  <li>Clique em <strong>Adicionar usuário</strong></li>
                  <li>Cole o email da conta de serviço (encontrado no JSON como <code>client_email</code>)</li>
                  <li>Selecione permissão <strong>Completa</strong></li>
                  <li>Clique em <strong>Adicionar</strong></li>
                </ol>
                <Alert className="mt-3">
                  <AlertDescription>
                    O email da conta de serviço tem formato: <code>nome@projeto.iam.gserviceaccount.com</code>
                  </AlertDescription>
                </Alert>
              </Step>

              <Step number={4} title="Configure o Secret da URL" description="Adicione a URL do site">
                <div className="bg-background rounded-md border p-3">
                  <p className="text-sm font-mono text-muted-foreground">
                    Secret: <strong className="text-foreground">GOOGLE_SEARCH_CONSOLE_SITE_URL</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor: URL exata como aparece no Search Console (ex: https://seusite.com.br)
                  </p>
                </div>
              </Step>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Business Profile Setup */}
        <AccordionItem value="business-profile" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Building2 className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">3. Configurar Google Business Profile</h3>
                <p className="text-sm text-muted-foreground">Publicar posts automaticamente no perfil da empresa</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Pré-requisito</AlertTitle>
                <AlertDescription>
                  Você precisa ter um perfil empresarial verificado no Google Business Profile.
                </AlertDescription>
              </Alert>

              <Step number={1} title="Acesse o Business Profile Manager" description="Abra o painel de gerenciamento">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">
                    Abrir Business Profile <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step number={2} title="Obtenha o Account ID" description="Encontre o ID da sua conta">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Acesse a API Explorer do Google My Business</li>
                  <li>Execute o método <code>accounts.list</code></li>
                  <li>Copie o valor de <code>name</code> (formato: accounts/XXXXX)</li>
                  <li>O Account ID é o número após "accounts/"</li>
                </ol>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a href="https://developers.google.com/my-business/reference/rest/v4/accounts/list" target="_blank" rel="noopener noreferrer">
                    Acessar API Explorer <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step number={3} title="Obtenha o Location ID" description="Encontre o ID da localização">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Use o método <code>accounts.locations.list</code></li>
                  <li>Informe o Account ID obtido anteriormente</li>
                  <li>Copie o valor de <code>name</code> (formato: accounts/XXX/locations/YYY)</li>
                  <li>O Location ID é o número após "locations/"</li>
                </ol>
              </Step>

              <Step number={4} title="Adicione a Conta de Serviço" description="Conceda acesso à API">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>No Business Profile Manager, vá em <strong>Configurações</strong></li>
                  <li>Clique em <strong>Gerentes</strong></li>
                  <li>Adicione o email da conta de serviço como <strong>Gerente</strong></li>
                </ol>
              </Step>

              <Step number={5} title="Configure os Secrets" description="Adicione os IDs nas configurações">
                <div className="space-y-3">
                  <div className="bg-background rounded-md border p-3">
                    <p className="text-sm font-mono text-muted-foreground">
                      Secret: <strong className="text-foreground">GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valor: Apenas o número do Account ID (ex: 123456789)
                    </p>
                  </div>
                  <div className="bg-background rounded-md border p-3">
                    <p className="text-sm font-mono text-muted-foreground">
                      Secret: <strong className="text-foreground">GOOGLE_BUSINESS_PROFILE_LOCATION_ID</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valor: Apenas o número do Location ID (ex: 987654321)
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <BarChart3 className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">4. Configurar Google Analytics (Frontend)</h3>
                <p className="text-sm text-muted-foreground">Rastreamento de visitantes e conversões</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <Alert className="bg-green-500/10 border-green-500/20">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Configuração Simples</AlertTitle>
                <AlertDescription>
                  O Google Analytics é configurado diretamente no código frontend, sem necessidade de secrets do backend.
                </AlertDescription>
              </Alert>

              <Step number={1} title="Acesse o Google Analytics" description="Crie ou acesse sua propriedade">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                    Abrir Google Analytics <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </Step>

              <Step number={2} title="Obtenha o Measurement ID" description="Encontre o ID de medição GA4">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Vá em <strong>Administrador → Fluxos de dados</strong></li>
                  <li>Selecione seu fluxo da web</li>
                  <li>Copie o <strong>ID de medição</strong> (formato: G-XXXXXXXXXX)</li>
                </ol>
              </Step>

              <Step number={3} title="Configure no Código" description="Atualize o arquivo de analytics">
                <p className="text-sm mb-2">
                  Edite o arquivo <code>src/hooks/use-analytics.ts</code> e substitua o ID:
                </p>
                <CodeBlock>{`const GA_MEASUREMENT_ID = "G-SEU_ID_AQUI";`}</CodeBlock>
              </Step>

              <Step number={4} title="Verifique a Integração" description="Confirme que está funcionando">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Acesse seu site em uma aba anônima</li>
                  <li>Aceite os cookies quando solicitado</li>
                  <li>No GA4, vá em <strong>Relatórios → Tempo real</strong></li>
                  <li>Você deve ver sua visita registrada</li>
                </ol>
              </Step>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Troubleshooting */}
        <AccordionItem value="troubleshooting" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">5. Solução de Problemas</h3>
                <p className="text-sm text-muted-foreground">Erros comuns e como resolver</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 mt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Erro: "Cannot read properties of undefined (reading 'replace')"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Causa:</strong> O JSON da conta de serviço está incompleto ou mal formatado.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solução:</strong> Verifique se o JSON contém os campos <code>client_email</code>, 
                      <code>private_key</code> e <code>project_id</code>. Baixe novamente o arquivo se necessário.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Erro: "403 Forbidden" ou "Permission Denied"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Causa:</strong> A conta de serviço não tem permissão no serviço.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solução:</strong> Adicione o email da conta de serviço como usuário/gerente 
                      no Search Console ou Business Profile.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Erro: "API not enabled"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Causa:</strong> A API necessária não está ativada no projeto Google Cloud.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solução:</strong> Vá em APIs e Serviços → Biblioteca e ative a API mencionada no erro.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Analytics não registra visitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Causa:</strong> Cookies não foram aceitos ou ID incorreto.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solução:</strong> Verifique se o ID de medição está correto e se o usuário 
                      aceitou os cookies de analytics.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Links Úteis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                <FileJson className="h-4 w-4 mr-2" />
                Google Cloud
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                <Search className="h-4 w-4 mr-2" />
                Search Console
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">
                <Building2 className="h-4 w-4 mr-2" />
                Business Profile
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
