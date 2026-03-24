import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

// In-memory rate limit store (resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetIn: record.resetTime - now };
}

// Authentication helper - verify admin role or service role key
async function verifyAdminAuth(req: Request, supabaseUrl: string, supabaseServiceKey: string): Promise<{ success: boolean; error?: string; userId?: string; isServiceRole?: boolean }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { success: false, error: 'Missing authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (token === supabaseServiceKey) {
    console.log('Service role key authentication - internal call');
    return { success: true, isServiceRole: true };
  }
  
  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
  if (authError || !user) {
    return { success: false, error: 'Invalid or expired token' };
  }

  const { data: userRoles } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single();

  if (!userRoles) {
    return { success: false, error: 'Admin access required' };
  }

  return { success: true, userId: user.id };
}

interface BlogTopic {
  id: string;
  topic: string;
  category: string;
  search_query: string | null;
  scheduled_date: string;
  status: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
}

// ===== DUAL PROVIDER ABSTRACTION =====
type AIProvider = 'perplexity' | 'claude';

interface AIResponse {
  content: string;
  citations: string[];
}

interface AIKeys {
  perplexity?: string;
  anthropic?: string;
}

async function callAI(
  provider: AIProvider,
  messages: Array<{ role: string; content: string }>,
  apiKeys: AIKeys,
  options?: {
    search_recency_filter?: string;
    search_domain_filter?: string[];
    model?: string;
  }
): Promise<AIResponse> {
  if (provider === 'claude') {
    const apiKey = apiKeys.anthropic;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

    // Claude uses separate system message
    const systemMsg = messages.find(m => m.role === 'system');
    const nonSystemMsgs = messages.filter(m => m.role !== 'system');

    const body: Record<string, unknown> = {
      model: options?.model || 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: nonSystemMsgs,
    };
    if (systemMsg) {
      body.system = systemMsg.content;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    return { content, citations: [] };
  }

  // Default: Perplexity
  const apiKey = apiKeys.perplexity;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY is not configured');

  const body: Record<string, unknown> = {
    model: options?.model || 'sonar',
    messages,
  };
  if (options?.search_recency_filter) body.search_recency_filter = options.search_recency_filter;
  if (options?.search_domain_filter && options.search_domain_filter.length > 0) {
    body.search_domain_filter = options.search_domain_filter;
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Perplexity API error:', response.status, errorText);
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  const citations = data.search_results?.map((r: { url: string }) => r.url) || data.citations || [];
  return { content, citations };
}

// Repair truncated JSON from AI responses
function repairTruncatedJSON(jsonStr: string): string {
  let str = jsonStr.trim();
  
  const jsonStart = str.indexOf('{');
  if (jsonStart === -1) throw new Error('No JSON object found');
  str = str.substring(jsonStart);
  
  const openBraces = (str.match(/{/g) || []).length;
  const closeBraces = (str.match(/}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    console.warn(`Truncated JSON detected (open: ${openBraces}, close: ${closeBraces}). Repairing...`);
    str = str.replace(/,\s*"[^"]*":\s*"[^"]*$/s, '');
    str = str.replace(/,\s*"[^"]*":\s*\[[^\]]*$/s, '');
    str = str.replace(/,\s*"[^"]*":\s*{[^}]*$/s, '');
    const remaining = (str.match(/{/g) || []).length - (str.match(/}/g) || []).length;
    for (let i = 0; i < remaining; i++) str += '}';
  }
  
  str = str
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/[\x00-\x1F\x7F]/g, (c) => c === '\n' || c === '\t' ? c : '');
  
  const jsonEnd = str.lastIndexOf('}');
  if (jsonEnd !== -1) str = str.substring(0, jsonEnd + 1);
  
  return str;
}

interface ExpertQuote {
  quote: string;
  author: string;
  title: string;
  source_url: string;
}

interface Statistic {
  value: string;
  description: string;
  source: string;
  source_url: string;
  year: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ContentSettings {
  min_geo_score_publish: number;
  brand_name: string;
  brand_authority_keywords: string[];
  target_personas: string[];
  brand_statistics: Statistic[];
  ai_tone: string;
  ai_custom_instructions: string;
  reading_level: string;
  content_length_min: number;
  content_length_max: number;
  auto_generate_faq: boolean;
  faq_count: number;
  internal_linking_enabled: boolean;
  min_internal_links: number;
  max_internal_links: number;
  external_linking_enabled: boolean;
  min_external_links: number;
  max_external_links: number;
  preferred_citation_sources: string[];
  seo_meta_auto_generate: boolean;
  structured_data_enabled: boolean;
  freshness_signals_enabled: boolean;
  answer_first_format: boolean;
  expert_quotes_enabled: boolean;
  statistics_citations_enabled: boolean;
  auto_expert_quotes_enabled: boolean;
  expert_name: string;
  expert_title: string;
  expert_company: string;
  expert_bio: string;
  exclude_competitor_quotes: boolean;
  excluded_citation_keywords: string[];
  allowed_external_sources: string[];
}

const DEFAULT_SETTINGS: ContentSettings = {
  min_geo_score_publish: 80,
  brand_name: 'Contabilidade Zen',
  brand_authority_keywords: [],
  target_personas: ['médicos', 'dentistas', 'psicólogos'],
  brand_statistics: [],
  ai_tone: 'profissional e educativo',
  ai_custom_instructions: '',
  reading_level: 'intermediário',
  content_length_min: 1500,
  content_length_max: 3000,
  auto_generate_faq: true,
  faq_count: 5,
  internal_linking_enabled: true,
  min_internal_links: 3,
  max_internal_links: 7,
  external_linking_enabled: true,
  min_external_links: 2,
  max_external_links: 5,
  preferred_citation_sources: ['gov.br', 'planalto.gov.br', 'receita.fazenda.gov.br', 'cfc.org.br'],
  seo_meta_auto_generate: true,
  structured_data_enabled: true,
  freshness_signals_enabled: true,
  answer_first_format: true,
  expert_quotes_enabled: true,
  statistics_citations_enabled: true,
  auto_expert_quotes_enabled: true,
  expert_name: 'Thomas Broek',
  expert_title: 'Contador Especialista',
  expert_company: 'Contabilidade Zen',
  expert_bio: 'Contador especializado em tributação para profissionais da saúde, com mais de 15 anos de experiência em planejamento tributário e abertura de empresas para médicos, dentistas e psicólogos.',
  exclude_competitor_quotes: true,
  excluded_citation_keywords: ['contabilidade digital', 'contador online', 'escritório contábil', 'contabilidade online'],
  allowed_external_sources: ['gov.br', 'cfc.org.br', 'cfm.org.br', 'cro.org.br', 'crp.org.br', 'crefito.org.br', 'receita.fazenda.gov.br', 'planalto.gov.br', 'ibge.gov.br', 'ans.gov.br', 'anvisa.gov.br'],
};

// Função para calcular GEO Score
function calculateGEOScore(
  content: string,
  expertQuotes: ExpertQuote[],
  statistics: Statistic[],
  faqSchema: FAQItem[],
  authorityCitations: string[],
  internalLinks: number,
  settings: ContentSettings
): number {
  let score = 0;

  if (settings.answer_first_format) {
    const firstParagraph = content.split('\n\n')[0] || '';
    const firstWords = firstParagraph.split(/\s+/).slice(0, 50).join(' ');
    const hasAnswerFirst = firstWords.length > 100 && !firstWords.includes('Neste artigo') && !firstWords.includes('Vamos explorar');
    if (hasAnswerFirst) score += 20;
  }

  if (settings.statistics_citations_enabled) {
    score += Math.min(statistics.length * 4, 20);
  }

  if (settings.expert_quotes_enabled) {
    score += Math.min(expertQuotes.length * 5, 20);
  }

  if (settings.auto_generate_faq && faqSchema) {
    if (faqSchema.length >= 5) score += 15;
    else if (faqSchema.length >= 3) score += 10;
  }

  if (settings.external_linking_enabled) {
    const authorityDomains = ['gov.br', 'cfc.org', 'cfm.org', 'cro.org', 'crp.org', 'receita.fazenda'];
    const authoritySources = authorityCitations.filter(c => 
      authorityDomains.some(domain => c.toLowerCase().includes(domain))
    );
    score += Math.min(authoritySources.length * 3, 15);
  }

  if (settings.internal_linking_enabled && internalLinks >= settings.min_internal_links) {
    score += 5;
  }

  if (settings.freshness_signals_enabled) {
    const currentYear = new Date().getFullYear().toString();
    if (content.includes(currentYear) || content.toLowerCase().includes('atualizado')) score += 5;
  }

  return Math.min(score, 100);
}

function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchExistingPosts(
  supabase: any,
  category: string,
  limit: number
): Promise<BlogPost[]> {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content, category')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit * 2);
  
  return (posts as BlogPost[]) || [];
}

function generateInternalLinks(
  existingPosts: BlogPost[],
  topic: string,
  minLinks: number,
  maxLinks: number
): { markdown: string; count: number } {
  if (existingPosts.length === 0) {
    return { markdown: '', count: 0 };
  }

  const topicWords = topic.toLowerCase().split(/\s+/);
  const relevantPosts = existingPosts
    .filter(post => {
      const postWords = post.title.toLowerCase();
      return topicWords.some(word => postWords.includes(word));
    })
    .slice(0, maxLinks);

  const postsToLink = relevantPosts.length >= minLinks 
    ? relevantPosts 
    : existingPosts.slice(0, minLinks);

  if (postsToLink.length === 0) {
    return { markdown: '', count: 0 };
  }

  const links = postsToLink.map(post => 
    `- [${post.title}](/blog/${post.slug})`
  ).join('\n');

  return {
    markdown: `\n\n---\n\n## Leia Também\n\n${links}`,
    count: postsToLink.length
  };
}

function filterExpertQuotes(
  quotes: ExpertQuote[],
  settings: ContentSettings
): ExpertQuote[] {
  if (!settings.exclude_competitor_quotes) return quotes;
  
  const excludedKeywords = settings.excluded_citation_keywords || [];
  const allowedSources = settings.allowed_external_sources || [];
  
  return quotes.filter(quote => {
    const quoteText = `${quote.quote} ${quote.author} ${quote.title}`.toLowerCase();
    const hasBlockedKeyword = excludedKeywords.some(keyword => 
      quoteText.includes(keyword.toLowerCase())
    );
    
    if (hasBlockedKeyword) {
      console.log(`Blocked quote from ${quote.author}: contains excluded keyword`);
      return false;
    }
    
    if (quote.source_url) {
      const isAllowedSource = allowedSources.some(source => 
        quote.source_url.toLowerCase().includes(source.toLowerCase())
      );
      
      if (!isAllowedSource && (
        quoteText.includes('contador') || 
        quoteText.includes('contabilidade') ||
        quoteText.includes('escritório')
      )) {
        console.log(`Blocked quote from ${quote.author}: not from allowed source and contains accounting terms`);
        return false;
      }
    }
    
    return true;
  });
}

// Buscar citações de especialistas
async function fetchExpertQuotes(
  topic: string,
  personas: string[],
  apiKeys: AIKeys,
  provider: AIProvider,
  enabled: boolean,
  settings: ContentSettings
): Promise<ExpertQuote[]> {
  if (!enabled) return [];
  
  console.log(`Fetching expert quotes for: ${topic} (provider: ${provider})`);
  
  const allowedSources = settings.allowed_external_sources || [];
  
  try {
    const { content } = await callAI(
      provider,
      [{
        role: 'user',
        content: `Encontre 3-5 citações de especialistas brasileiros sobre o tema: "${topic}".

IMPORTANTE: Busque citações apenas de:
- Órgãos governamentais (gov.br, Receita Federal)
- Conselhos profissionais (CFM, CFC, CRO, CRP, CREFITO)
- Associações de classe
- Advogados tributaristas
- Consultores de ${personas.join(', ')}

NÃO inclua citações de:
- Contadores de outras empresas
- Contabilidades digitais ou online
- Escritórios contábeis concorrentes

RETORNE APENAS JSON válido neste formato (sem markdown):
{
  "expert_quotes": [
    {
      "quote": "texto exato da citação entre aspas",
      "author": "Nome Completo do Especialista",
      "title": "Cargo/Credencial (ex: Presidente do CFM, Advogado Tributarista)",
      "source_url": "URL da fonte original"
    }
  ]
}`
      }],
      apiKeys,
      {
        search_recency_filter: 'year',
        search_domain_filter: allowedSources.length > 0 ? allowedSources : undefined,
      }
    );

    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const repairedJSON = repairTruncatedJSON(cleanContent);
      const parsed = JSON.parse(repairedJSON);
      const quotes = parsed.expert_quotes || [];
      return filterExpertQuotes(quotes, settings);
    } catch {
      console.error('Failed to parse expert quotes JSON');
      return [];
    }
  } catch (error) {
    console.error('Error fetching expert quotes:', error);
    return [];
  }
}

// Buscar estatísticas atualizadas
async function fetchStatistics(
  topic: string,
  apiKeys: AIKeys,
  provider: AIProvider,
  enabled: boolean,
  preferredSources: string[]
): Promise<Statistic[]> {
  if (!enabled) return [];
  
  console.log(`Fetching statistics for: ${topic} (provider: ${provider})`);
  
  try {
    const { content } = await callAI(
      provider,
      [{
        role: 'user',
        content: `Encontre 3-5 estatísticas/dados quantitativos recentes (2024-2025) sobre: "${topic}" no contexto brasileiro.

Priorize dados de: IBGE, Receita Federal, CFM, CFC, CRO, CRP, pesquisas de mercado.

RETORNE APENAS JSON válido neste formato (sem markdown):
{
  "statistics": [
    {
      "value": "85%",
      "description": "dos médicos que atuam como PJ economizam em impostos",
      "source": "Conselho Federal de Medicina",
      "source_url": "https://portal.cfm.org.br/...",
      "year": "2024"
    }
  ]
}`
      }],
      apiKeys,
      {
        search_recency_filter: 'year',
        search_domain_filter: preferredSources.length > 0 ? preferredSources : undefined,
      }
    );

    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const repairedJSON = repairTruncatedJSON(cleanContent);
      const parsed = JSON.parse(repairedJSON);
      return parsed.statistics || [];
    } catch {
      console.error('Failed to parse statistics JSON');
      return [];
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return [];
  }
}

// Gerar citação automática do especialista interno
async function generateInternalExpertQuote(
  topic: string,
  settings: ContentSettings,
  apiKeys: AIKeys,
  provider: AIProvider
): Promise<ExpertQuote | null> {
  if (!settings.auto_expert_quotes_enabled) return null;
  
  console.log(`Generating internal expert quote for: ${topic} (provider: ${provider})`);
  
  try {
    const { content } = await callAI(
      provider,
      [
        {
          role: 'system',
          content: `Você é ${settings.expert_name}, ${settings.expert_title} da ${settings.expert_company}. 
${settings.expert_bio}

Sua tarefa é criar uma citação profissional e relevante sobre o tema solicitado. 
A citação deve:
- Ser prática e útil para profissionais da saúde
- Demonstrar expertise e conhecimento técnico
- Oferecer uma dica ou insight valioso
- Ser concisa (2-3 frases)
- Ter tom consultivo e empático`
        },
        {
          role: 'user',
          content: `Crie uma citação profissional sua sobre o tema: "${topic}"

A citação deve trazer uma perspectiva prática ou dica valiosa baseada na sua experiência como contador especializado em profissionais da saúde.

RETORNE APENAS JSON válido neste formato (sem markdown):
{
  "quote": "texto da citação aqui"
}`
        }
      ],
      apiKeys
    );

    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const repairedJSON = repairTruncatedJSON(cleanContent);
      const parsed = JSON.parse(repairedJSON);
      
      return {
        quote: parsed.quote,
        author: settings.expert_name,
        title: `${settings.expert_title} - ${settings.expert_company}`,
        source_url: ''
      };
    } catch {
      console.error('Failed to parse internal expert quote JSON');
      return null;
    }
  } catch (error) {
    console.error('Error generating internal expert quote:', error);
    return null;
  }
}

interface ParsedContent {
  title: string;
  excerpt: string;
  content: string;
  meta_description: string;
  meta_keywords: string[];
  faqs: FAQItem[];
}

function buildSystemPrompt(settings: ContentSettings): string {
  const currentDate = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  
  let prompt = `Você é um especialista em contabilidade para profissionais de saúde no Brasil.
Escreva conteúdo otimizado para GEO (Generative Engine Optimization) - ou seja, conteúdo que será citado por ChatGPT, Perplexity, Google AI.

TOM DE VOZ: ${settings.ai_tone}
NÍVEL DE LEITURA: ${settings.reading_level}
TAMANHO: Entre ${settings.content_length_min} e ${settings.content_length_max} palavras.

REGRAS OBRIGATÓRIAS:`;

  if (settings.answer_first_format) {
    prompt += `
1. ANSWER-FIRST: Comece DIRETAMENTE com a resposta principal nas primeiras 50 palavras. NÃO use "Neste artigo vamos explorar..." ou introduções genéricas.`;
  }

  if (settings.statistics_citations_enabled) {
    prompt += `
2. Use dados quantitativos com fontes sempre que possível.`;
  }

  if (settings.expert_quotes_enabled) {
    prompt += `
3. Inclua citações de especialistas formatadas como blockquotes.`;
  }

  if (settings.auto_generate_faq) {
    prompt += `
4. NÃO inclua seção FAQ no conteúdo. As ${settings.faq_count} perguntas frequentes serão retornadas separadamente no JSON.`;
  }

  if (settings.freshness_signals_enabled) {
    prompt += `
5. Adicione rodapé com "Última atualização: ${currentDate}" e "Revisado por: Equipe ${settings.brand_name}".`;
  }

  if (settings.ai_custom_instructions) {
    prompt += `

INSTRUÇÕES ADICIONAIS:
${settings.ai_custom_instructions}`;
  }

  return prompt;
}

// Gerar conteúdo otimizado para GEO
async function generateGEOContent(
  topic: string,
  category: string,
  expertQuotes: ExpertQuote[],
  statistics: Statistic[],
  settings: ContentSettings,
  apiKeys: AIKeys,
  provider: AIProvider
): Promise<{ parsedContent: ParsedContent; faqs: FAQItem[]; citations: string[] }> {
  console.log(`Generating GEO-optimized content for: ${topic} (provider: ${provider})`);
  
  const statsText = statistics.length > 0 
    ? statistics.map(s => `- ${s.value}: ${s.description} (${s.source}, ${s.year})`).join('\n')
    : '';
  
  const quotesText = expertQuotes.length > 0
    ? expertQuotes.map(q => `- "${q.quote}" — ${q.author}, ${q.title}`).join('\n')
    : '';

  const systemPrompt = buildSystemPrompt(settings);

  const { content: rawContent, citations: rawCitations } = await callAI(
    provider,
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Escreva um artigo completo sobre: "${topic}"

Categoria: ${category}

${statsText ? `ESTATÍSTICAS PARA INCLUIR:\n${statsText}\n` : ''}
${quotesText ? `CITAÇÕES DE ESPECIALISTAS PARA INCLUIR:\n${quotesText}\n` : ''}

RETORNE EXATAMENTE neste formato JSON (sem markdown code blocks):
{
  "title": "Título otimizado para SEO (máximo 60 caracteres)",
  "excerpt": "Resumo direto com resposta principal (máximo 160 caracteres)",
  "content": "Conteúdo completo em Markdown seguindo regras GEO",
  "meta_description": "Meta description para SEO (máximo 160 caracteres)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3"],
  "faqs": [
    {"question": "Pergunta frequente?", "answer": "Resposta concisa e direta."}
  ]
}`
      }
    ],
    apiKeys,
    {
      model: provider === 'perplexity' ? 'sonar-pro' : undefined,
      search_domain_filter: settings.preferred_citation_sources.length > 0 
        ? settings.preferred_citation_sources 
        : ['gov.br', 'receita.fazenda.gov.br', 'cfc.org.br', 'cfm.org.br', 'contabeis.com.br', 'planalto.gov.br'],
      search_recency_filter: 'year',
    }
  );

  const citations = rawCitations;

  try {
    const cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const repairedJSON = repairTruncatedJSON(cleanContent);
    const parsed = JSON.parse(repairedJSON);
    
    const limitedFaqs = settings.auto_generate_faq 
      ? (parsed.faqs || []).slice(0, settings.faq_count)
      : [];
    
    return {
      parsedContent: {
        title: parsed.title || topic,
        excerpt: parsed.excerpt || rawContent.substring(0, 160),
        content: parsed.content || rawContent,
        meta_description: parsed.meta_description || rawContent.substring(0, 160),
        meta_keywords: parsed.meta_keywords || [category.toLowerCase()],
        faqs: limitedFaqs
      },
      faqs: limitedFaqs,
      citations: settings.external_linking_enabled 
        ? citations.slice(0, settings.max_external_links)
        : []
    };
  } catch (parseError) {
    console.error('Failed to parse blog content JSON:', parseError, 'Raw:', rawContent.substring(0, 300));
    return {
      parsedContent: {
        title: topic,
        excerpt: rawContent.substring(0, 160),
        content: rawContent,
        meta_description: rawContent.substring(0, 160),
        meta_keywords: [category.toLowerCase()],
        faqs: []
      },
      faqs: [],
      citations: []
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!PERPLEXITY_API_KEY && !ANTHROPIC_API_KEY) {
      throw new Error('No AI provider configured. Set PERPLEXITY_API_KEY or ANTHROPIC_API_KEY.');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    // Verify admin authentication
    const authResult = await verifyAdminAuth(req, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: authResult.error }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log('Authenticated admin user:', authResult.userId);

    // Check rate limit (skip for service role calls)
    if (!authResult.isServiceRole) {
      const rateLimitId = authResult.userId || 'anonymous';
      const rateLimit = checkRateLimit(`generate-blog:${rateLimitId}`);
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(rateLimit.resetIn / 1000)
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000))
            } 
          }
        );
      }
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar configurações completas
    const { data: geoSettingsData } = await supabase
      .from('geo_settings')
      .select('*')
      .limit(1)
      .single();

    const settings: ContentSettings = {
      ...DEFAULT_SETTINGS,
      ...(geoSettingsData || {})
    };

    console.log('Loaded content settings:', {
      ai_tone: settings.ai_tone,
      reading_level: settings.reading_level,
      auto_generate_faq: settings.auto_generate_faq,
      faq_count: settings.faq_count,
      internal_linking_enabled: settings.internal_linking_enabled,
      external_linking_enabled: settings.external_linking_enabled,
    });

    const body = await req.json().catch(() => ({}));
    const manualTopicId = body?.topic_id;
    const inlineMode = body?.inline === true;
    const inlineTopic = body?.topic;
    const inlineCategory = body?.category || 'Dicas';
    const enableGEO = body?.enable_geo !== false;

    // Determine AI provider from request body, default to perplexity
    const requestedProvider: AIProvider = body?.ai_provider === 'claude' ? 'claude' : 'perplexity';
    
    // Validate the requested provider has an API key
    const aiKeys: AIKeys = { perplexity: PERPLEXITY_API_KEY, anthropic: ANTHROPIC_API_KEY };
    
    let provider: AIProvider = requestedProvider;
    if (provider === 'claude' && !ANTHROPIC_API_KEY) {
      console.warn('Claude requested but ANTHROPIC_API_KEY not set, falling back to Perplexity');
      provider = 'perplexity';
    }
    if (provider === 'perplexity' && !PERPLEXITY_API_KEY) {
      console.warn('Perplexity requested but PERPLEXITY_API_KEY not set, falling back to Claude');
      provider = 'claude';
    }

    console.log(`Using AI provider: ${provider}`);

    // INLINE MODE com GEO
    if (inlineMode && inlineTopic) {
      console.log(`Inline GEO generation for topic: ${inlineTopic}`);

      let expertQuotes: ExpertQuote[] = [];
      let statistics: Statistic[] = [];

      if (enableGEO) {
        const [externalQuotes, statsData, internalQuote] = await Promise.all([
          fetchExpertQuotes(inlineTopic, settings.target_personas, aiKeys, provider, settings.expert_quotes_enabled, settings),
          fetchStatistics(inlineTopic, aiKeys, provider, settings.statistics_citations_enabled, settings.preferred_citation_sources),
          generateInternalExpertQuote(inlineTopic, settings, aiKeys, provider)
        ]);

        expertQuotes = internalQuote ? [internalQuote, ...externalQuotes] : externalQuotes;
        statistics = statsData;

        if (settings.brand_statistics && settings.brand_statistics.length > 0) {
          statistics = [...settings.brand_statistics, ...statistics];
        }
      }

      const { parsedContent, faqs, citations } = await generateGEOContent(
        inlineTopic,
        inlineCategory,
        expertQuotes,
        statistics,
        settings,
        aiKeys,
        provider
      );

      let finalContent = parsedContent.content;

      if (settings.auto_generate_faq && faqs.length > 0) {
        finalContent += '\n\n---\n\n## Perguntas Frequentes (FAQ)\n\n';
        faqs.forEach((faq: FAQItem) => {
          finalContent += `### ${faq.question}\n\n${faq.answer}\n\n`;
        });
      }

      if (settings.external_linking_enabled && citations.length > 0) {
        finalContent += '\n\n---\n\n## Fontes e Referências\n\n';
        citations.forEach((citation, index) => {
          finalContent += `${index + 1}. ${citation}\n`;
        });
      }

      let internalLinksCount = 0;
      if (settings.internal_linking_enabled) {
        const existingPosts = await fetchExistingPosts(supabase, inlineCategory, settings.max_internal_links);
        const internalLinks = generateInternalLinks(
          existingPosts,
          inlineTopic,
          settings.min_internal_links,
          settings.max_internal_links
        );
        if (internalLinks.markdown) {
          finalContent += internalLinks.markdown;
          internalLinksCount = internalLinks.count;
        }
      }

      const geoScore = calculateGEOScore(
        finalContent,
        expertQuotes,
        statistics,
        faqs,
        citations,
        internalLinksCount,
        settings
      );

      const faqSchema = settings.structured_data_enabled && faqs.length > 0 
        ? generateFAQSchema(faqs) 
        : null;

      console.log(`Inline GEO generation successful. Score: ${geoScore}`);

      return new Response(
        JSON.stringify({
          success: true,
          title: parsedContent.title,
          excerpt: parsedContent.excerpt,
          content: finalContent,
          meta_description: parsedContent.meta_description,
          meta_keywords: parsedContent.meta_keywords,
          citations,
          geo_score: geoScore,
          expert_quotes: expertQuotes,
          statistics,
          faq_schema: faqSchema,
          answer_first_validated: geoScore >= 20,
          internal_links_count: internalLinksCount,
          ai_provider: provider
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STANDARD MODE: Process topics from database
    let query = supabase
      .from('blog_topics')
      .select('*')
      .eq('status', 'pending');

    if (manualTopicId) {
      query = supabase
        .from('blog_topics')
        .select('*')
        .eq('id', manualTopicId)
        .in('status', ['pending', 'failed']);
    } else {
      query = query.lte('scheduled_date', new Date().toISOString());
    }

    const { data: topics, error: fetchError } = await query.limit(5);

    if (fetchError) {
      console.error('Error fetching topics:', fetchError);
      throw fetchError;
    }

    if (!topics || topics.length === 0) {
      console.log('No pending topics to process');
      return new Response(
        JSON.stringify({ message: 'No pending topics to process', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${topics.length} topic(s) with GEO optimization (provider: ${provider})`);

    const existingPosts = settings.internal_linking_enabled 
      ? await fetchExistingPosts(supabase, '', settings.max_internal_links * 2)
      : [];

    const results: Array<{ 
      topicId: string; 
      success: boolean; 
      postId?: string; 
      geoScore?: number;
      autoPublished?: boolean;
      error?: string 
    }> = [];

    for (const topic of topics as BlogTopic[]) {
      console.log(`Processing topic: ${topic.topic}`);

      await supabase
        .from('blog_topics')
        .update({ status: 'generating', updated_at: new Date().toISOString() })
        .eq('id', topic.id);

      try {
        const searchQuery = topic.search_query || topic.topic;

        const [externalQuotes, statistics, internalQuote] = await Promise.all([
          fetchExpertQuotes(searchQuery, settings.target_personas, aiKeys, provider, settings.expert_quotes_enabled, settings),
          fetchStatistics(searchQuery, aiKeys, provider, settings.statistics_citations_enabled, settings.preferred_citation_sources),
          generateInternalExpertQuote(searchQuery, settings, aiKeys, provider)
        ]);

        const expertQuotes = internalQuote ? [internalQuote, ...externalQuotes] : externalQuotes;

        const allStatistics = settings.brand_statistics 
          ? [...settings.brand_statistics, ...statistics]
          : statistics;

        const { parsedContent, faqs, citations } = await generateGEOContent(
          searchQuery,
          topic.category,
          expertQuotes,
          allStatistics,
          settings,
          aiKeys,
          provider
        );

        let finalContent = parsedContent.content;

        if (settings.auto_generate_faq && faqs.length > 0) {
          finalContent += '\n\n---\n\n## Perguntas Frequentes (FAQ)\n\n';
          faqs.forEach((faq: FAQItem) => {
            finalContent += `### ${faq.question}\n\n${faq.answer}\n\n`;
          });
        }

        if (settings.external_linking_enabled && citations.length > 0) {
          finalContent += '\n\n---\n\n## Fontes e Referências\n\n';
          citations.forEach((citation, index) => {
            finalContent += `${index + 1}. ${citation}\n`;
          });
        }

        let internalLinksCount = 0;
        if (settings.internal_linking_enabled && existingPosts.length > 0) {
          const internalLinks = generateInternalLinks(
            existingPosts,
            topic.topic,
            settings.min_internal_links,
            settings.max_internal_links
          );
          if (internalLinks.markdown) {
            finalContent += internalLinks.markdown;
            internalLinksCount = internalLinks.count;
          }
        }

        const geoScore = calculateGEOScore(
          finalContent,
          expertQuotes,
          allStatistics,
          faqs,
          citations,
          internalLinksCount,
          settings
        );

        const faqSchema = settings.structured_data_enabled && faqs.length > 0 
          ? generateFAQSchema(faqs) 
          : null;

        const shouldAutoPublish = geoScore >= settings.min_geo_score_publish;

        const generateSEOSlug = (title: string): string => {
          return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 80);
        };

        let baseSlug = generateSEOSlug(parsedContent.title);
        
        const { data: existingSlug } = await supabase
          .from('blog_posts')
          .select('slug')
          .like('slug', `${baseSlug}%`)
          .limit(10);
        
        let finalSlug = baseSlug;
        if (existingSlug && existingSlug.length > 0) {
          const existingSlugs = existingSlug.map(p => p.slug);
          let counter = 2;
          while (existingSlugs.includes(finalSlug)) {
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
          }
        }

        const { data: newPost, error: insertError } = await supabase
          .from('blog_posts')
          .insert({
            title: parsedContent.title,
            slug: finalSlug,
            excerpt: parsedContent.excerpt,
            content: finalContent,
            category: topic.category,
            status: shouldAutoPublish ? 'published' : 'draft',
            editorial_status: shouldAutoPublish ? 'published' : 'draft',
            published_at: shouldAutoPublish ? new Date().toISOString() : null,
            meta_title: parsedContent.title,
            meta_description: parsedContent.meta_description,
            meta_keywords: parsedContent.meta_keywords,
            read_time_minutes: Math.ceil(finalContent.split(/\s+/).length / 200),
            geo_score: geoScore,
            expert_quotes: expertQuotes,
            statistics: allStatistics,
            authority_citations: citations,
            faq_schema: faqSchema,
            answer_first_validated: geoScore >= 20,
            auto_published: shouldAutoPublish,
            freshness_date: new Date().toISOString()
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Error inserting post:', insertError);
          throw insertError;
        }

        await supabase
          .from('blog_topics')
          .update({
            status: 'generated',
            generated_post_id: newPost.id,
            error_message: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', topic.id);

        console.log(`Successfully generated post ${newPost.id} with GEO score ${geoScore}. Auto-published: ${shouldAutoPublish}`);
        results.push({ 
          topicId: topic.id, 
          success: true, 
          postId: newPost.id,
          geoScore,
          autoPublished: shouldAutoPublish
        });

      } catch (topicError) {
        const errorMessage = topicError instanceof Error ? topicError.message : 'Unknown error';
        console.error(`Error processing topic ${topic.id}:`, errorMessage);

        await supabase
          .from('blog_topics')
          .update({
            status: 'failed',
            error_message: errorMessage,
            updated_at: new Date().toISOString()
          })
          .eq('id', topic.id);

        results.push({ topicId: topic.id, success: false, error: errorMessage });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const autoPublishedCount = results.filter(r => r.autoPublished).length;
    console.log(`Completed: ${successCount}/${results.length} topics. Auto-published: ${autoPublishedCount}`);

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} topic(s) with GEO optimization`,
        processed: results.length,
        successful: successCount,
        autoPublished: autoPublishedCount,
        ai_provider: provider,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blog-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
