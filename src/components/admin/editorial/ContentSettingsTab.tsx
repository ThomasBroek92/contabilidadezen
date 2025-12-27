import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Sparkles, 
  Link2, 
  ExternalLink, 
  FileQuestion, 
  Search, 
  Brain,
  Save,
  Loader2,
  Quote,
  BarChart3,
  Clock,
  Target,
  BookOpen,
  Zap,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContentSettings {
  id: string;
  // AI Configuration
  ai_tone: string;
  ai_custom_instructions: string;
  // FAQ Settings
  auto_generate_faq: boolean;
  faq_count: number;
  // Internal Linking
  internal_linking_enabled: boolean;
  min_internal_links: number;
  max_internal_links: number;
  // External Linking
  external_linking_enabled: boolean;
  min_external_links: number;
  max_external_links: number;
  preferred_citation_sources: string[];
  // SEO Settings
  seo_meta_auto_generate: boolean;
  structured_data_enabled: boolean;
  freshness_signals_enabled: boolean;
  // GEO Settings
  answer_first_format: boolean;
  expert_quotes_enabled: boolean;
  statistics_citations_enabled: boolean;
  // Expert Quote Settings
  auto_expert_quotes_enabled: boolean;
  expert_name: string;
  expert_title: string;
  expert_company: string;
  expert_bio: string;
  // Content Quality
  content_length_min: number;
  content_length_max: number;
  reading_level: string;
  // Brand Settings
  brand_name: string;
  target_personas: string[];
  brand_authority_keywords: string[];
  min_geo_score_publish: number;
}

const AI_TONE_OPTIONS = [
  { value: 'profissional e educativo', label: 'Profissional e Educativo', description: 'Tom formal, didático e confiável' },
  { value: 'amigável e acessível', label: 'Amigável e Acessível', description: 'Tom mais leve e próximo do leitor' },
  { value: 'técnico e especializado', label: 'Técnico e Especializado', description: 'Linguagem técnica para especialistas' },
  { value: 'consultivo e empático', label: 'Consultivo e Empático', description: 'Foco em resolver dores do cliente' },
];

const READING_LEVEL_OPTIONS = [
  { value: 'básico', label: 'Básico', description: 'Linguagem simples e direta' },
  { value: 'intermediário', label: 'Intermediário', description: 'Equilibrado entre técnico e acessível' },
  { value: 'avançado', label: 'Avançado', description: 'Conteúdo técnico e aprofundado' },
];

export function ContentSettingsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSource, setNewSource] = useState('');
  const [newPersona, setNewPersona] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('geo_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (data && !error) {
      setSettings(data as unknown as ContentSettings);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('geo_settings')
      .update({
        ai_tone: settings.ai_tone,
        ai_custom_instructions: settings.ai_custom_instructions,
        auto_generate_faq: settings.auto_generate_faq,
        faq_count: settings.faq_count,
        internal_linking_enabled: settings.internal_linking_enabled,
        min_internal_links: settings.min_internal_links,
        max_internal_links: settings.max_internal_links,
        external_linking_enabled: settings.external_linking_enabled,
        min_external_links: settings.min_external_links,
        max_external_links: settings.max_external_links,
        preferred_citation_sources: settings.preferred_citation_sources,
        seo_meta_auto_generate: settings.seo_meta_auto_generate,
        structured_data_enabled: settings.structured_data_enabled,
        freshness_signals_enabled: settings.freshness_signals_enabled,
        answer_first_format: settings.answer_first_format,
        expert_quotes_enabled: settings.expert_quotes_enabled,
        statistics_citations_enabled: settings.statistics_citations_enabled,
        auto_expert_quotes_enabled: settings.auto_expert_quotes_enabled,
        expert_name: settings.expert_name,
        expert_title: settings.expert_title,
        expert_company: settings.expert_company,
        expert_bio: settings.expert_bio,
        content_length_min: settings.content_length_min,
        content_length_max: settings.content_length_max,
        reading_level: settings.reading_level,
        brand_name: settings.brand_name,
        target_personas: settings.target_personas,
        brand_authority_keywords: settings.brand_authority_keywords,
        min_geo_score_publish: settings.min_geo_score_publish,
      } as Record<string, unknown>)
      .eq('id', settings.id);

    if (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } else {
      toast({ title: 'Configurações salvas com sucesso!' });
    }
    setSaving(false);
  };

  const updateSetting = <K extends keyof ContentSettings>(key: K, value: ContentSettings[K]) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const addToArray = (key: 'preferred_citation_sources' | 'target_personas' | 'brand_authority_keywords', value: string) => {
    if (settings && value.trim()) {
      const currentArray = settings[key] || [];
      if (!currentArray.includes(value.trim())) {
        updateSetting(key, [...currentArray, value.trim()]);
      }
    }
  };

  const removeFromArray = (key: 'preferred_citation_sources' | 'target_personas' | 'brand_authority_keywords', value: string) => {
    if (settings) {
      updateSetting(key, (settings[key] || []).filter(item => item !== value));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Não foi possível carregar as configurações.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Configurações de Conteúdo</h2>
            <p className="text-sm text-muted-foreground">Personalize a geração de conteúdo, SEO e otimização para IA</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-primary" />
              Configuração da IA
            </CardTitle>
            <CardDescription>Defina o tom e instruções personalizadas para geração de conteúdo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tom de Voz</Label>
              <Select value={settings.ai_tone || ''} onValueChange={(v) => updateSetting('ai_tone', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  {AI_TONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nível de Leitura</Label>
              <Select value={settings.reading_level || ''} onValueChange={(v) => updateSetting('reading_level', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  {READING_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Instruções Personalizadas</Label>
              <Textarea
                value={settings.ai_custom_instructions || ''}
                onChange={(e) => updateSetting('ai_custom_instructions', e.target.value)}
                placeholder="Ex: Sempre mencione a importância de consultar um contador. Evite jargões técnicos excessivos. Foque em exemplos práticos..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Instruções adicionais que a IA seguirá ao gerar conteúdo
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Tamanho do Conteúdo (palavras)</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <span className="text-xs text-muted-foreground">Mínimo: {settings.content_length_min}</span>
                  <Slider
                    value={[settings.content_length_min || 1500]}
                    onValueChange={([v]) => updateSetting('content_length_min', v)}
                    min={500}
                    max={3000}
                    step={100}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs text-muted-foreground">Máximo: {settings.content_length_max}</span>
                  <Slider
                    value={[settings.content_length_max || 3000]}
                    onValueChange={([v]) => updateSetting('content_length_max', v)}
                    min={1000}
                    max={5000}
                    step={100}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileQuestion className="h-5 w-5 text-primary" />
              FAQ Automático
            </CardTitle>
            <CardDescription>Configure a geração automática de perguntas frequentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Gerar FAQ Automaticamente</Label>
                <p className="text-xs text-muted-foreground">Adiciona seção de FAQ ao final de cada post</p>
              </div>
              <Switch
                checked={settings.auto_generate_faq ?? true}
                onCheckedChange={(v) => updateSetting('auto_generate_faq', v)}
              />
            </div>

            {settings.auto_generate_faq && (
              <div className="space-y-2">
                <Label>Quantidade de Perguntas</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.faq_count || 5]}
                    onValueChange={([v]) => updateSetting('faq_count', v)}
                    min={3}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{settings.faq_count || 5}</span>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Dados Estruturados (Schema)
                </Label>
                <p className="text-xs text-muted-foreground">Gera JSON-LD para FAQ Schema</p>
              </div>
              <Switch
                checked={settings.structured_data_enabled ?? true}
                onCheckedChange={(v) => updateSetting('structured_data_enabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Formato Answer-First
                </Label>
                <p className="text-xs text-muted-foreground">Responde a pergunta principal logo no início</p>
              </div>
              <Switch
                checked={settings.answer_first_format ?? true}
                onCheckedChange={(v) => updateSetting('answer_first_format', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Internal Linking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-primary" />
              Links Internos
            </CardTitle>
            <CardDescription>Otimize a estrutura de links internos para SEO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar Links Internos</Label>
                <p className="text-xs text-muted-foreground">Adiciona links para outros posts do blog</p>
              </div>
              <Switch
                checked={settings.internal_linking_enabled ?? true}
                onCheckedChange={(v) => updateSetting('internal_linking_enabled', v)}
              />
            </div>

            {settings.internal_linking_enabled && (
              <>
                <div className="space-y-2">
                  <Label>Mínimo de Links: {settings.min_internal_links}</Label>
                  <Slider
                    value={[settings.min_internal_links || 3]}
                    onValueChange={([v]) => updateSetting('min_internal_links', v)}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Máximo de Links: {settings.max_internal_links}</Label>
                  <Slider
                    value={[settings.max_internal_links || 7]}
                    onValueChange={([v]) => updateSetting('max_internal_links', v)}
                    min={3}
                    max={15}
                    step={1}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* External Linking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ExternalLink className="h-5 w-5 text-primary" />
              Links Externos e Citações
            </CardTitle>
            <CardDescription>Configure fontes externas para autoridade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar Links Externos</Label>
                <p className="text-xs text-muted-foreground">Adiciona links para fontes autoritativas</p>
              </div>
              <Switch
                checked={settings.external_linking_enabled ?? true}
                onCheckedChange={(v) => updateSetting('external_linking_enabled', v)}
              />
            </div>

            {settings.external_linking_enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mínimo: {settings.min_external_links}</Label>
                    <Slider
                      value={[settings.min_external_links || 2]}
                      onValueChange={([v]) => updateSetting('min_external_links', v)}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Máximo: {settings.max_external_links}</Label>
                    <Slider
                      value={[settings.max_external_links || 5]}
                      onValueChange={([v]) => updateSetting('max_external_links', v)}
                      min={2}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fontes Preferidas</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      placeholder="Ex: gov.br"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('preferred_citation_sources', newSource);
                          setNewSource('');
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        addToArray('preferred_citation_sources', newSource);
                        setNewSource('');
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(settings.preferred_citation_sources || []).map((source) => (
                      <Badge key={source} variant="secondary" className="gap-1">
                        {source}
                        <button onClick={() => removeFromArray('preferred_citation_sources', source)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* GEO Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Otimização para IA (GEO)
            </CardTitle>
            <CardDescription>Configure sinais de autoridade para buscadores de IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Quote className="h-4 w-4" />
                  Citações de Especialistas Externos
                </Label>
                <p className="text-xs text-muted-foreground">Busca citações de especialistas via pesquisa</p>
              </div>
              <Switch
                checked={settings.expert_quotes_enabled ?? true}
                onCheckedChange={(v) => updateSetting('expert_quotes_enabled', v)}
              />
            </div>

            <Separator />

            {/* Auto Expert Quotes Section */}
            <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Quote className="h-4 w-4 text-primary" />
                    Citações do Especialista Interno
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Gera automaticamente citações do contador especialista da empresa
                  </p>
                </div>
                <Switch
                  checked={settings.auto_expert_quotes_enabled ?? true}
                  onCheckedChange={(v) => updateSetting('auto_expert_quotes_enabled', v)}
                />
              </div>

              {settings.auto_expert_quotes_enabled && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Especialista</Label>
                      <Input
                        value={settings.expert_name || ''}
                        onChange={(e) => updateSetting('expert_name', e.target.value)}
                        placeholder="Ex: Thomas Broek"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cargo/Título</Label>
                      <Input
                        value={settings.expert_title || ''}
                        onChange={(e) => updateSetting('expert_title', e.target.value)}
                        placeholder="Ex: Contador Especialista"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input
                      value={settings.expert_company || ''}
                      onChange={(e) => updateSetting('expert_company', e.target.value)}
                      placeholder="Ex: Contabilidade Zen"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Biografia/Credenciais</Label>
                    <Textarea
                      value={settings.expert_bio || ''}
                      onChange={(e) => updateSetting('expert_bio', e.target.value)}
                      placeholder="Ex: Contador especializado em tributação para profissionais da saúde, com mais de 15 anos de experiência..."
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Essas credenciais serão usadas para gerar citações contextuais e relevantes
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Estatísticas e Dados
                </Label>
                <p className="text-xs text-muted-foreground">Inclui estatísticas e dados atualizados</p>
              </div>
              <Switch
                checked={settings.statistics_citations_enabled ?? true}
                onCheckedChange={(v) => updateSetting('statistics_citations_enabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Sinais de Atualidade
                </Label>
                <p className="text-xs text-muted-foreground">Adiciona datas e indicadores de atualização</p>
              </div>
              <Switch
                checked={settings.freshness_signals_enabled ?? true}
                onCheckedChange={(v) => updateSetting('freshness_signals_enabled', v)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Score GEO Mínimo para Publicar</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.min_geo_score_publish || 80]}
                  onValueChange={([v]) => updateSetting('min_geo_score_publish', v)}
                  min={50}
                  max={95}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">{settings.min_geo_score_publish || 80}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-primary" />
              SEO e Meta Tags
            </CardTitle>
            <CardDescription>Configurações de otimização para buscadores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Gerar Meta Tags Automaticamente</Label>
                <p className="text-xs text-muted-foreground">Title, description e keywords</p>
              </div>
              <Switch
                checked={settings.seo_meta_auto_generate ?? true}
                onCheckedChange={(v) => updateSetting('seo_meta_auto_generate', v)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Nome da Marca</Label>
              <Input
                value={settings.brand_name || ''}
                onChange={(e) => updateSetting('brand_name', e.target.value)}
                placeholder="Ex: Contabilidade Zona Sul"
              />
            </div>

            <div className="space-y-2">
              <Label>Personas Alvo</Label>
              <div className="flex gap-2">
                <Input
                  value={newPersona}
                  onChange={(e) => setNewPersona(e.target.value)}
                  placeholder="Ex: médicos"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('target_personas', newPersona);
                      setNewPersona('');
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    addToArray('target_personas', newPersona);
                    setNewPersona('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(settings.target_personas || []).map((persona) => (
                  <Badge key={persona} variant="secondary" className="gap-1">
                    {persona}
                    <button onClick={() => removeFromArray('target_personas', persona)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Palavras-chave de Autoridade</Label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Ex: contabilidade médica"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('brand_authority_keywords', newKeyword);
                      setNewKeyword('');
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    addToArray('brand_authority_keywords', newKeyword);
                    setNewKeyword('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(settings.brand_authority_keywords || []).map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button onClick={() => removeFromArray('brand_authority_keywords', keyword)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button Footer */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}