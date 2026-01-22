import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para gerar slug SEO-friendly
function generateSEOSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens no início/fim
    .substring(0, 80); // Limite para URL amigável
}

// Verifica se o slug tem timestamp (padrão antigo)
function hasTimestamp(slug: string): boolean {
  // Timestamps são números de 13+ dígitos no final do slug
  return /\-\d{13,}$/.test(slug);
}

// Remove timestamp do slug
function removeTimestamp(slug: string): string {
  return slug.replace(/\-\d{13,}$/, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar todos os posts com slugs contendo timestamp
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    if (!posts || posts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No posts found', updated: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: Array<{ id: string; oldSlug: string; newSlug: string; success: boolean }> = [];
    const usedSlugs = new Set<string>();

    // Primeiro, catalogar todos os slugs existentes
    posts.forEach(post => {
      if (!hasTimestamp(post.slug)) {
        usedSlugs.add(post.slug);
      }
    });

    for (const post of posts) {
      // Pular se não tem timestamp
      if (!hasTimestamp(post.slug)) {
        continue;
      }

      // Gerar novo slug baseado no título
      let baseSlug = generateSEOSlug(post.title);
      
      // Se o baseSlug já está em uso, adicionar sufixo numérico
      let newSlug = baseSlug;
      let counter = 2;
      while (usedSlugs.has(newSlug)) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Marcar como usado
      usedSlugs.add(newSlug);

      // Atualizar no banco
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ slug: newSlug })
        .eq('id', post.id);

      results.push({
        id: post.id,
        oldSlug: post.slug,
        newSlug,
        success: !updateError
      });

      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError);
      } else {
        console.log(`Updated: ${post.slug} -> ${newSlug}`);
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        message: `Optimized ${successCount} blog slugs for SEO`,
        updated: successCount,
        total: results.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in optimize-blog-slugs:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
