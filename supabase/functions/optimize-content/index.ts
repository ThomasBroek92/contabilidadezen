import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

interface OptimizationRequest {
  content: string;
  issues: { type: string; message: string }[];
  suggestions: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Supabase credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin authentication
    const authResult = await verifyAdminAuth(req, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log('Authenticated admin user:', authResult.userId);

    // Check rate limit (skip for service role calls)
    if (!authResult.isServiceRole) {
      const rateLimitId = authResult.userId || 'anonymous';
      const rateLimit = checkRateLimit(`optimize-content:${rateLimitId}`);
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({ 
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

    const { content, issues, suggestions }: OptimizationRequest = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Optimizing content with', issues.length, 'issues and', suggestions.length, 'suggestions');

    // Build optimization prompt based on issues and suggestions
    const issuesList = issues
      .filter(i => i.type !== 'success')
      .map(i => `- ${i.message}`)
      .join('\n');

    const suggestionsList = suggestions.map(s => `- ${s}`).join('\n');

    const systemPrompt = `Você é um especialista em GEO (Generative Engine Optimization) - otimização de conteúdo para ser citado por IAs como ChatGPT, Perplexity e Google AI.

Sua tarefa é reescrever e otimizar o conteúdo fornecido para melhorar a pontuação GEO, mantendo o significado e contexto original.

REGRAS DE OTIMIZAÇÃO:

1. **Answer-First**: Comece SEMPRE com a resposta principal nas primeiras 50 palavras. Nunca use frases como "Neste artigo vamos..." ou "Vamos explorar...".

2. **Estatísticas**: Adicione dados quantitativos verificáveis com porcentagens, valores e fontes.
   Exemplo: "Segundo a Receita Federal (2024), 85% dos médicos PJ economizam em média R$ 15.000/ano em impostos."

3. **Citações de Especialistas**: Inclua citações de profissionais reconhecidos.
   Formato: "De acordo com [Nome], [cargo]: '[citação]'."

4. **FAQ Structure**: Adicione uma seção de FAQ com 5-7 perguntas frequentes no final.
   Use formato:
   ## Perguntas Frequentes
   ### Pergunta aqui?
   Resposta direta em 40-60 palavras.

5. **Freshness Signals**: Adicione "Última atualização: [mês/ano]" no início ou final.

6. **Tamanho Ideal**: O conteúdo deve ter entre 800-1500 palavras.

7. **Links e Referências**: Mantenha ou sugira links para fontes autoritativas (gov.br, conselhos profissionais).

IMPORTANTE: Retorne APENAS o conteúdo otimizado em Markdown, sem comentários adicionais.`;

    const userPrompt = `PROBLEMAS IDENTIFICADOS:
${issuesList || 'Nenhum problema crítico'}

SUGESTÕES DE MELHORIA:
${suggestionsList || 'Nenhuma sugestão adicional'}

CONTEÚDO ORIGINAL PARA OTIMIZAR:
${content}

Por favor, reescreva este conteúdo aplicando todas as correções necessárias para maximizar o score GEO.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI gateway error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const optimizedContent = data.choices?.[0]?.message?.content || '';

    if (!optimizedContent) {
      return new Response(
        JSON.stringify({ error: 'No content generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Content optimized successfully, length:', optimizedContent.length);

    return new Response(
      JSON.stringify({ 
        optimizedContent,
        originalLength: content.length,
        newLength: optimizedContent.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in optimize-content function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
