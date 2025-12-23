import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogTopic {
  id: string;
  topic: string;
  category: string;
  search_query: string | null;
  scheduled_date: string;
  status: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
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

interface GEOSettings {
  min_geo_score_publish: number;
  brand_name: string;
  brand_authority_keywords: string[];
  target_personas: string[];
  brand_statistics: Statistic[];
}

// Função para calcular GEO Score
function calculateGEOScore(
  content: string,
  expertQuotes: ExpertQuote[],
  statistics: Statistic[],
  faqSchema: FAQItem[],
  authorityCitations: string[]
): number {
  let score = 0;

  // Answer-First (20 pontos) - Verifica se responde nas primeiras 50 palavras
  const firstParagraph = content.split('\n\n')[0] || '';
  const firstWords = firstParagraph.split(/\s+/).slice(0, 50).join(' ');
  const hasAnswerFirst = firstWords.length > 100 && !firstWords.includes('Neste artigo') && !firstWords.includes('Vamos explorar');
  if (hasAnswerFirst) score += 20;

  // Estatísticas (20 pontos, 4 pontos cada até 5)
  score += Math.min(statistics.length * 4, 20);

  // Citações de Especialistas (20 pontos, 5 pontos cada até 4)
  score += Math.min(expertQuotes.length * 5, 20);

  // FAQ com Schema (15 pontos)
  if (faqSchema && faqSchema.length >= 5) score += 15;
  else if (faqSchema && faqSchema.length >= 3) score += 10;

  // Fontes Autoritativas (15 pontos)
  const authorityDomains = ['gov.br', 'cfc.org', 'cfm.org', 'cro.org', 'crp.org', 'receita.fazenda'];
  const authoritySources = authorityCitations.filter(c => 
    authorityDomains.some(domain => c.toLowerCase().includes(domain))
  );
  score += Math.min(authoritySources.length * 3, 15);

  // Freshness - menção a 2025 ou data atual (10 pontos)
  const currentYear = new Date().getFullYear().toString();
  if (content.includes(currentYear) || content.toLowerCase().includes('atualizado')) score += 10;

  return Math.min(score, 100);
}

// Função para gerar JSON-LD FAQPage Schema
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

// Buscar citações de especialistas via Perplexity
async function fetchExpertQuotes(
  topic: string,
  personas: string[],
  apiKey: string
): Promise<ExpertQuote[]> {
  console.log('Fetching expert quotes for:', topic);
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{
          role: 'user',
          content: `Encontre 3-5 citações reais de especialistas brasileiros (contadores, advogados tributaristas, consultores de ${personas.join(', ')}) sobre o tema: "${topic}".

RETORNE APENAS JSON válido neste formato (sem markdown):
{
  "expert_quotes": [
    {
      "quote": "texto exato da citação entre aspas",
      "author": "Nome Completo do Especialista",
      "title": "Cargo/Credencial (ex: Contador, CRC-SP)",
      "source_url": "URL da fonte original"
    }
  ]
}`
        }],
        search_recency_filter: 'year',
      }),
    });

    if (!response.ok) {
      console.error('Expert quotes API error:', response.status);
      return [];
    }

    const data: PerplexityResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      return parsed.expert_quotes || [];
    } catch {
      console.error('Failed to parse expert quotes JSON');
      return [];
    }
  } catch (error) {
    console.error('Error fetching expert quotes:', error);
    return [];
  }
}

// Buscar estatísticas atualizadas via Perplexity
async function fetchStatistics(
  topic: string,
  apiKey: string
): Promise<Statistic[]> {
  console.log('Fetching statistics for:', topic);
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{
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
        search_recency_filter: 'year',
        search_domain_filter: ['gov.br', 'ibge.gov.br', 'cfm.org.br', 'cfc.org.br']
      }),
    });

    if (!response.ok) {
      console.error('Statistics API error:', response.status);
      return [];
    }

    const data: PerplexityResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanContent);
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

interface ParsedContent {
  title: string;
  excerpt: string;
  content: string;
  meta_description: string;
  meta_keywords: string[];
  faqs: FAQItem[];
}

// Gerar conteúdo otimizado para GEO
async function generateGEOContent(
  topic: string,
  category: string,
  expertQuotes: ExpertQuote[],
  statistics: Statistic[],
  brandName: string,
  apiKey: string
): Promise<{ parsedContent: ParsedContent; faqs: FAQItem[]; citations: string[] }> {
  console.log('Generating GEO-optimized content for:', topic);
  
  // Formatar estatísticas para o prompt
  const statsText = statistics.length > 0 
    ? statistics.map(s => `- ${s.value}: ${s.description} (${s.source}, ${s.year})`).join('\n')
    : '';
  
  // Formatar citações para o prompt
  const quotesText = expertQuotes.length > 0
    ? expertQuotes.map(q => `- "${q.quote}" — ${q.author}, ${q.title}`).join('\n')
    : '';

  const currentDate = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: `Você é um especialista em contabilidade para profissionais de saúde no Brasil.
Escreva conteúdo otimizado para GEO (Generative Engine Optimization) - ou seja, conteúdo que será citado por ChatGPT, Perplexity, Google AI.

REGRAS OBRIGATÓRIAS:
1. ANSWER-FIRST: Comece DIRETAMENTE com a resposta principal nas primeiras 50 palavras. NÃO use "Neste artigo vamos explorar..." ou introduções genéricas.
2. Use dados quantitativos com fontes sempre que possível.
3. Inclua citações de especialistas formatadas como blockquotes.
4. Termine com seção FAQ de 5-7 perguntas frequentes.
5. Adicione rodapé com "Última atualização: ${currentDate}" e "Revisado por: Equipe ${brandName}".`
        },
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
      search_domain_filter: [
        'gov.br',
        'receita.fazenda.gov.br',
        'cfc.org.br',
        'cfm.org.br',
        'contabeis.com.br',
        'planalto.gov.br'
      ],
      search_recency_filter: 'year',
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data: PerplexityResponse = await response.json();
  const rawContent = data.choices[0]?.message?.content || '';
  const citations = data.citations || [];

  try {
    const cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanContent);
    return {
      parsedContent: {
        title: parsed.title || topic,
        excerpt: parsed.excerpt || rawContent.substring(0, 160),
        content: parsed.content || rawContent,
        meta_description: parsed.meta_description || rawContent.substring(0, 160),
        meta_keywords: parsed.meta_keywords || [category.toLowerCase()],
        faqs: parsed.faqs || []
      },
      faqs: parsed.faqs || [],
      citations
    };
  } catch {
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
      citations
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar configurações GEO
    const { data: geoSettings } = await supabase
      .from('geo_settings')
      .select('*')
      .limit(1)
      .single();

    const settings: GEOSettings = geoSettings || {
      min_geo_score_publish: 80,
      brand_name: 'Contabilidade Zona Sul',
      brand_authority_keywords: [],
      target_personas: ['médicos', 'dentistas', 'psicólogos'],
      brand_statistics: []
    };

    const body = await req.json().catch(() => ({}));
    const manualTopicId = body?.topic_id;
    const inlineMode = body?.inline === true;
    const inlineTopic = body?.topic;
    const inlineCategory = body?.category || 'Dicas';
    const enableGEO = body?.enable_geo !== false; // GEO habilitado por padrão

    // INLINE MODE com GEO
    if (inlineMode && inlineTopic) {
      console.log(`Inline GEO generation for topic: ${inlineTopic}`);

      let expertQuotes: ExpertQuote[] = [];
      let statistics: Statistic[] = [];

      if (enableGEO) {
        // Buscar citações e estatísticas em paralelo
        [expertQuotes, statistics] = await Promise.all([
          fetchExpertQuotes(inlineTopic, settings.target_personas, PERPLEXITY_API_KEY),
          fetchStatistics(inlineTopic, PERPLEXITY_API_KEY)
        ]);

        // Adicionar estatísticas da marca se houver
        if (settings.brand_statistics && settings.brand_statistics.length > 0) {
          statistics = [...settings.brand_statistics, ...statistics];
        }
      }

      const { parsedContent, faqs, citations } = await generateGEOContent(
        inlineTopic,
        inlineCategory,
        expertQuotes,
        statistics,
        settings.brand_name,
        PERPLEXITY_API_KEY
      );

      // Montar conteúdo final com seção de fontes
      let finalContent = parsedContent.content;

      // Adicionar seção FAQ formatada
      if (faqs.length > 0) {
        finalContent += '\n\n---\n\n## Perguntas Frequentes (FAQ)\n\n';
        faqs.forEach((faq: FAQItem) => {
          finalContent += `### ${faq.question}\n\n${faq.answer}\n\n`;
        });
      }

      // Adicionar fontes
      if (citations.length > 0) {
        finalContent += '\n\n---\n\n## Fontes e Referências\n\n';
        citations.forEach((citation, index) => {
          finalContent += `${index + 1}. ${citation}\n`;
        });
      }

      // Calcular GEO Score
      const geoScore = calculateGEOScore(
        finalContent,
        expertQuotes,
        statistics,
        faqs,
        citations
      );

      const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

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
          answer_first_validated: geoScore >= 20
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

    console.log(`Processing ${topics.length} topic(s) with GEO optimization`);

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

        // Buscar citações e estatísticas em paralelo
        const [expertQuotes, statistics] = await Promise.all([
          fetchExpertQuotes(searchQuery, settings.target_personas, PERPLEXITY_API_KEY),
          fetchStatistics(searchQuery, PERPLEXITY_API_KEY)
        ]);

        // Adicionar estatísticas da marca
        const allStatistics = settings.brand_statistics 
          ? [...settings.brand_statistics, ...statistics]
          : statistics;

        // Gerar conteúdo otimizado para GEO
        const { parsedContent, faqs, citations } = await generateGEOContent(
          searchQuery,
          topic.category,
          expertQuotes,
          allStatistics,
          settings.brand_name,
          PERPLEXITY_API_KEY
        );

        // Montar conteúdo final
        let finalContent = parsedContent.content;

        if (faqs.length > 0) {
          finalContent += '\n\n---\n\n## Perguntas Frequentes (FAQ)\n\n';
          faqs.forEach((faq: FAQItem) => {
            finalContent += `### ${faq.question}\n\n${faq.answer}\n\n`;
          });
        }

        if (citations.length > 0) {
          finalContent += '\n\n---\n\n## Fontes e Referências\n\n';
          citations.forEach((citation, index) => {
            finalContent += `${index + 1}. ${citation}\n`;
          });
        }

        // Calcular GEO Score
        const geoScore = calculateGEOScore(
          finalContent,
          expertQuotes,
          allStatistics,
          faqs,
          citations
        );

        const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

        // Determinar se deve auto-publicar
        const shouldAutoPublish = geoScore >= settings.min_geo_score_publish;

        const slug = parsedContent.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 100);

        const { data: newPost, error: insertError } = await supabase
          .from('blog_posts')
          .insert({
            title: parsedContent.title,
            slug: `${slug}-${Date.now()}`,
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
