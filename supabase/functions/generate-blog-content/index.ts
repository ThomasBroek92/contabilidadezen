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

serve(async (req) => {
  // Handle CORS preflight
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

    // Check if manual topic_id was provided
    const body = await req.json().catch(() => ({}));
    const manualTopicId = body?.topic_id;

    let query = supabase
      .from('blog_topics')
      .select('*')
      .eq('status', 'pending');

    if (manualTopicId) {
      // Manual generation for specific topic
      query = supabase
        .from('blog_topics')
        .select('*')
        .eq('id', manualTopicId)
        .in('status', ['pending', 'failed']);
    } else {
      // Automatic: only topics with scheduled_date <= now
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

    console.log(`Processing ${topics.length} topic(s)`);

    const results: Array<{ topicId: string; success: boolean; postId?: string; error?: string }> = [];

    for (const topic of topics as BlogTopic[]) {
      console.log(`Processing topic: ${topic.topic}`);

      // Update status to generating
      await supabase
        .from('blog_topics')
        .update({ status: 'generating', updated_at: new Date().toISOString() })
        .eq('id', topic.id);

      try {
        const searchQuery = topic.search_query || topic.topic;

        // Call Perplexity API with sonar-pro for deep research
        const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar-pro',
            messages: [
              {
                role: 'system',
                content: `Você é um especialista em contabilidade para profissionais de saúde no Brasil (médicos, dentistas, psicólogos). 
Escreva artigos de blog informativos, práticos e otimizados para SEO.
Use linguagem profissional mas acessível.
Sempre cite legislação brasileira relevante quando aplicável.
Estruture o conteúdo com headers H2 e H3 em Markdown.`
              },
              {
                role: 'user',
                content: `Escreva um artigo de blog completo sobre: "${searchQuery}"

IMPORTANTE: Retorne EXATAMENTE neste formato JSON (sem markdown code blocks):
{
  "title": "Título otimizado para SEO (máximo 60 caracteres)",
  "excerpt": "Resumo de 2-3 frases (máximo 160 caracteres)",
  "content": "Conteúdo completo em Markdown (1000-1500 palavras) com H2 e H3 headers, listas, exemplos práticos",
  "meta_description": "Meta description para SEO (máximo 160 caracteres)",
  "meta_keywords": ["palavra-chave1", "palavra-chave2", "palavra-chave3"]
}`
              }
            ],
            search_domain_filter: [
              'gov.br',
              'receita.fazenda.gov.br',
              'cfc.org.br',
              'contabeis.com.br',
              'planalto.gov.br'
            ],
            search_recency_filter: 'year',
          }),
        });

        if (!perplexityResponse.ok) {
          const errorText = await perplexityResponse.text();
          console.error('Perplexity API error:', perplexityResponse.status, errorText);
          throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
        }

        const perplexityData: PerplexityResponse = await perplexityResponse.json();
        const rawContent = perplexityData.choices[0]?.message?.content;

        if (!rawContent) {
          throw new Error('No content returned from Perplexity');
        }

        console.log('Raw Perplexity response:', rawContent.substring(0, 500));

        // Parse JSON response
        let parsedContent;
        try {
          // Remove markdown code blocks if present
          const cleanContent = rawContent
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          parsedContent = JSON.parse(cleanContent);
        } catch (parseError) {
          console.error('Failed to parse JSON, using fallback extraction');
          // Fallback: extract what we can
          parsedContent = {
            title: topic.topic,
            excerpt: rawContent.substring(0, 160),
            content: rawContent,
            meta_description: rawContent.substring(0, 160),
            meta_keywords: [topic.category.toLowerCase()]
          };
        }

        // Generate slug from title
        const slug = parsedContent.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 100);

        // Add citations if available
        let finalContent = parsedContent.content;
        if (perplexityData.citations && perplexityData.citations.length > 0) {
          finalContent += '\n\n---\n\n## Fontes\n\n';
          perplexityData.citations.forEach((citation, index) => {
            finalContent += `${index + 1}. ${citation}\n`;
          });
        }

        // Insert blog post as draft
        const { data: newPost, error: insertError } = await supabase
          .from('blog_posts')
          .insert({
            title: parsedContent.title,
            slug: `${slug}-${Date.now()}`,
            excerpt: parsedContent.excerpt,
            content: finalContent,
            category: topic.category,
            status: 'draft',
            meta_title: parsedContent.title,
            meta_description: parsedContent.meta_description,
            meta_keywords: parsedContent.meta_keywords,
            read_time_minutes: Math.ceil(finalContent.split(/\s+/).length / 200),
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Error inserting post:', insertError);
          throw insertError;
        }

        // Update topic status
        await supabase
          .from('blog_topics')
          .update({
            status: 'generated',
            generated_post_id: newPost.id,
            error_message: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', topic.id);

        console.log(`Successfully generated post ${newPost.id} for topic ${topic.id}`);
        results.push({ topicId: topic.id, success: true, postId: newPost.id });

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
    console.log(`Completed: ${successCount}/${results.length} topics processed successfully`);

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} topic(s)`,
        processed: results.length,
        successful: successCount,
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
