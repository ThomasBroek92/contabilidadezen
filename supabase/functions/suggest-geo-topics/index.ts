import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

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
  
  // Check if this is a service role key (internal service-to-service call)
  if (token === supabaseServiceKey) {
    console.log('Service role key authentication - internal call');
    return { success: true, isServiceRole: true };
  }
  
  // Otherwise, verify as user token
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

interface TopicSuggestion {
  topic: string;
  category: string;
  search_query: string;
  geo_potential: 'alto' | 'medio' | 'baixo';
  reasoning: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
  search_results?: Array<{ title: string; url: string; date?: string; snippet?: string }>;
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
      const rateLimit = checkRateLimit(`suggest-geo-topics:${rateLimitId}`);
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

    // Buscar configurações GEO
    const { data: geoSettings } = await supabase
      .from('geo_settings')
      .select('*')
      .limit(1)
      .single();

    const settings = geoSettings || {
      target_personas: ['médicos', 'dentistas', 'psicólogos'],
      brand_authority_keywords: ['contabilidade saúde', 'contador médico', 'tributação PJ médico']
    };

    const body = await req.json().catch(() => ({}));
    const numSuggestions = body?.num_suggestions || 10;
    const autoSchedule = body?.auto_schedule === true;

    console.log(`Generating ${numSuggestions} GEO topic suggestions`);

    // Buscar tópicos existentes para evitar duplicatas
    const { data: existingTopics } = await supabase
      .from('blog_topics')
      .select('topic')
      .order('created_at', { ascending: false })
      .limit(50);

    const existingTopicsList = existingTopics?.map(t => t.topic.toLowerCase()) || [];

    // Buscar títulos de posts existentes também
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('title')
      .order('created_at', { ascending: false })
      .limit(100);

    const existingPostTitles = existingPosts?.map(p => p.title.toLowerCase()) || [];

    const personasText = settings.target_personas.join(', ');
    const keywordsText = settings.brand_authority_keywords.join(', ');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{
          role: 'user',
          content: `Você é um especialista em SEO e GEO (Generative Engine Optimization) para contabilidade de profissionais de saúde no Brasil.

Analise as tendências atuais e sugira ${numSuggestions} tópicos de blog que têm ALTO POTENCIAL de serem citados por IAs como ChatGPT, Perplexity e Google AI Overview.

PÚBLICO-ALVO: ${personasText}
PALAVRAS-CHAVE DA MARCA: ${keywordsText}

CRITÉRIOS PARA ALTO POTENCIAL GEO:
1. Perguntas frequentes que usuários fazem para IAs
2. Temas técnicos que IAs buscam fontes confiáveis
3. Atualizações de legislação tributária 2024-2025
4. Comparativos (CLT vs PJ, regimes tributários)
5. Calculadoras e ferramentas práticas
6. Guias passo-a-passo

TÓPICOS JÁ EXISTENTES (NÃO REPETIR):
${existingTopicsList.slice(0, 20).join('\n')}

RETORNE APENAS JSON válido neste formato:
{
  "suggestions": [
    {
      "topic": "Título do artigo otimizado para GEO",
      "category": "Categoria (Impostos, Dicas, Legislação, Comparativos, Guias)",
      "search_query": "Query de pesquisa para buscar dados atualizados",
      "geo_potential": "alto",
      "reasoning": "Por que este tópico tem alto potencial GEO"
    }
  ]
}`
        }],
        search_recency_filter: 'month',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    const rawContent = data.choices[0]?.message?.content || '';

    let suggestions: TopicSuggestion[] = [];
    
    try {
      const cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      suggestions = parsed.suggestions || [];
    } catch {
      console.error('Failed to parse suggestions JSON');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to parse AI response',
          raw: rawContent.substring(0, 500)
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filtrar tópicos que já existem
    const filteredSuggestions = suggestions.filter(s => {
      const topicLower = s.topic.toLowerCase();
      return !existingTopicsList.some(existing => 
        existing.includes(topicLower) || topicLower.includes(existing)
      ) && !existingPostTitles.some(existing => 
        existing.includes(topicLower) || topicLower.includes(existing)
      );
    });

    console.log(`Generated ${suggestions.length} suggestions, ${filteredSuggestions.length} after filtering`);

    // Se auto_schedule estiver ativado, agendar os tópicos
    let scheduledCount = 0;
    if (autoSchedule && filteredSuggestions.length > 0) {
      const today = new Date();
      
      for (let i = 0; i < filteredSuggestions.length; i++) {
        const suggestion = filteredSuggestions[i];
        const scheduledDate = new Date(today);
        scheduledDate.setDate(today.getDate() + i + 1); // Agendar 1 por dia começando amanhã

        const { error: insertError } = await supabase
          .from('blog_topics')
          .insert({
            topic: suggestion.topic,
            category: suggestion.category,
            search_query: suggestion.search_query,
            scheduled_date: scheduledDate.toISOString(),
            status: 'pending'
          });

        if (!insertError) {
          scheduledCount++;
        } else {
          console.error('Error scheduling topic:', insertError);
        }
      }

      console.log(`Auto-scheduled ${scheduledCount} topics`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: filteredSuggestions,
        total_generated: suggestions.length,
        total_after_filter: filteredSuggestions.length,
        scheduled_count: scheduledCount,
        auto_scheduled: autoSchedule
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in suggest-geo-topics:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
