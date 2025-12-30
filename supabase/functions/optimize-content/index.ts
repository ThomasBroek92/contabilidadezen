import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
