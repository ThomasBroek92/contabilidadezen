import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function verifyAdminAuth(req: Request, supabaseUrl: string, supabaseServiceKey: string) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return { success: false, error: 'Missing authorization header' };

  const token = authHeader.replace('Bearer ', '');
  if (token === supabaseServiceKey) return { success: true, isServiceRole: true };

  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
  if (authError || !user) return { success: false, error: 'Invalid or expired token' };

  const { data: userRoles } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single();

  if (!userRoles) return { success: false, error: 'Admin access required' };
  return { success: true, userId: user.id };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const auth = await verifyAdminAuth(req, supabaseUrl, supabaseServiceKey);
    if (!auth.success) {
      return new Response(JSON.stringify({ error: auth.error }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { url, sourceExpert, targetExpert, sourceCompany, targetCompany } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 1: Scrape with Firecrawl
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(JSON.stringify({ error: 'FIRECRAWL_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Scraping URL:', url);
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url.trim(),
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();
    if (!scrapeResponse.ok || !scrapeData.success) {
      console.error('Firecrawl error:', scrapeData);
      return new Response(JSON.stringify({ error: `Scraping failed: ${scrapeData.error || 'Unknown error'}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const originalContent = scrapeData.data?.markdown || scrapeData.markdown || '';
    const originalTitle = scrapeData.data?.metadata?.title || '';

    if (!originalContent || originalContent.length < 100) {
      return new Response(JSON.stringify({ error: 'Conteúdo insuficiente extraído da página' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Scraped ${originalContent.length} chars. Rewriting with AI...`);

    // Step 2: Rewrite with Lovable AI
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const entityMapping = [];
    if (sourceExpert && targetExpert) {
      entityMapping.push(`- Substitua toda menção a "${sourceExpert}" por "${targetExpert}"`);
    }
    if (sourceCompany && targetCompany) {
      entityMapping.push(`- Substitua toda menção a "${sourceCompany}" por "${targetCompany}"`);
    }

    const currentYear = new Date().getFullYear();

    const systemPrompt = `Você é um redator especialista em contabilidade e SEO no Brasil. Sua tarefa é REESCREVER artigos usando o conteúdo original apenas como INSPIRAÇÃO.

REGRAS OBRIGATÓRIAS:
1. Reescreva COMPLETAMENTE com palavras, frases e estrutura diferentes
2. Mantenha o mesmo TEMA e informações factuais, mas mude exemplos, analogias e abordagem
3. O texto final deve ser 100% original — não pode ser reconhecido como cópia
4. Escreva em PT-BR, tom profissional e acessível
5. Foque em contabilidade para profissionais PJ no Brasil
6. Use terminologia brasileira (Simples Nacional, Lucro Presumido, MEI, etc.)
7. O artigo deve ter entre 800 e 1200 palavras (NÃO ultrapasse 1200 palavras)
8. ATUALIZAÇÃO TEMPORAL: O ano atual é ${currentYear}. Substitua TODAS as referências a anos anteriores (2023, 2024, 2025 etc.) pelo ano corrente ${currentYear}. Dados, legislação e exemplos devem refletir o cenário atual de ${currentYear}.

${entityMapping.length > 0 ? `SUBSTITUIÇÕES DE ENTIDADES:\n${entityMapping.join('\n')}` : ''}

FORMATO DE RESPOSTA (JSON):
{
  "title": "Título SEO otimizado (max 60 chars)",
  "excerpt": "Resumo em 1-2 frases (max 160 chars)",
  "content": "Artigo em Markdown com H2, H3, listas. Entre 800-1200 palavras.",
  "meta_title": "Meta title SEO (max 60 chars)",
  "meta_description": "Meta description (max 155 chars)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3"],
  "category": "Categoria",
  "faq_schema": {"mainEntity": [{"question": "?", "answer": "Resposta"}]},
  "expert_quotes": [{"quote": "Citação", "author": "${targetExpert || 'Thomas Broek'}", "title": "Contador, CEO da ${targetCompany || 'Contabilidade Zen'}"}]
}

IMPORTANTE: Responda SOMENTE com JSON válido. Sem markdown code blocks. Sem texto antes ou depois do JSON.`;

    const userPrompt = `Reescreva este artigo como INSPIRAÇÃO. Não copie — crie conteúdo original sobre o mesmo tema. Mantenha entre 800-1200 palavras.

IMPORTANTE: Estamos em ${currentYear}. Atualize todas as referências temporais para o ano corrente.

TÍTULO ORIGINAL: ${originalTitle}

CONTEÚDO ORIGINAL:
${originalContent.substring(0, 8000)}

Responda APENAS com JSON válido.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        max_tokens: 16384,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Tente novamente em alguns minutos.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos no workspace.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: 'AI rewrite failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '';

    // Parse JSON from response with truncation repair
    let parsed;
    try {
      let jsonStr = rawContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      
      const jsonStart = jsonStr.indexOf('{');
      if (jsonStart === -1) throw new Error('No JSON object found');
      jsonStr = jsonStr.substring(jsonStart);
      
      // Check for truncation (unbalanced braces)
      const openBraces = (jsonStr.match(/{/g) || []).length;
      const closeBraces = (jsonStr.match(/}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        console.warn(`Truncated response detected (open: ${openBraces}, close: ${closeBraces}). Attempting repair...`);
        // Try to find the last complete field and close the JSON
        // Remove trailing incomplete string value
        jsonStr = jsonStr.replace(/,\s*"[^"]*":\s*"[^"]*$/s, '');
        jsonStr = jsonStr.replace(/,\s*"[^"]*":\s*\[[^\]]*$/s, '');
        jsonStr = jsonStr.replace(/,\s*"[^"]*":\s*{[^}]*$/s, '');
        // Close any remaining open structures
        const remaining = (jsonStr.match(/{/g) || []).length - (jsonStr.match(/}/g) || []).length;
        for (let i = 0; i < remaining; i++) jsonStr += '}';
      }
      
      // Fix common issues
      jsonStr = jsonStr
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/[\x00-\x1F\x7F]/g, (c: string) => c === '\n' || c === '\t' ? c : '');
      
      const jsonEnd = jsonStr.lastIndexOf('}');
      if (jsonEnd !== -1) jsonStr = jsonStr.substring(0, jsonEnd + 1);
      
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', rawContent.substring(0, 500));
      return new Response(JSON.stringify({ error: 'Falha ao processar resposta da IA. Tente novamente.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const result = {
      title: parsed.title || 'Sem título',
      slug: generateSlug(parsed.title || 'sem-titulo'),
      content: parsed.content || '',
      excerpt: parsed.excerpt || '',
      meta_title: parsed.meta_title || parsed.title || '',
      meta_description: parsed.meta_description || parsed.excerpt || '',
      meta_keywords: parsed.meta_keywords || [],
      category: parsed.category || 'Contabilidade',
      faq_schema: parsed.faq_schema || null,
      expert_quotes: parsed.expert_quotes || [],
      source_url: url,
    };

    console.log('Rewrite complete:', result.title);

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in copy-blog-content:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
