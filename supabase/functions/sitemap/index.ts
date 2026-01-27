import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.contabilidadezen.com.br";

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/servicos", priority: "0.9", changefreq: "monthly" },
  { url: "/sobre", priority: "0.8", changefreq: "monthly" },
  { url: "/contato", priority: "0.8", changefreq: "monthly" },
  { url: "/blog", priority: "0.9", changefreq: "daily" },
  { url: "/abrir-empresa", priority: "0.9", changefreq: "monthly" },
  { url: "/medicos", priority: "0.8", changefreq: "monthly" },
  { url: "/indique-e-ganhe", priority: "0.7", changefreq: "monthly" },
  // Segmentos - Landing pages por profissão
  { url: "/segmentos/contabilidade-para-medicos", priority: "0.9", changefreq: "monthly" },
  { url: "/segmentos/contabilidade-para-dentistas", priority: "0.9", changefreq: "monthly" },
  { url: "/segmentos/contabilidade-para-psicologos", priority: "0.9", changefreq: "monthly" },
  { url: "/segmentos/contabilidade-para-representantes-comerciais", priority: "0.9", changefreq: "monthly" },
  // Ferramentas e calculadoras
  { url: "/conteudo/calculadora-pj-clt", priority: "0.8", changefreq: "monthly" },
  { url: "/conteudo/comparativo-tributario", priority: "0.8", changefreq: "monthly" },
  { url: "/conteudo/gerador-rpa", priority: "0.8", changefreq: "monthly" },
  // Páginas legais
  { url: "/politica-de-privacidade", priority: "0.3", changefreq: "yearly" },
  { url: "/termos", priority: "0.3", changefreq: "yearly" },
];

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch published blog posts
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
    }

    const currentDate = new Date().toISOString().split("T")[0];

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    for (const page of staticPages) {
      sitemap += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add blog posts
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastmod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split("T")[0]
          : post.published_at 
            ? new Date(post.published_at).toISOString().split("T")[0]
            : currentDate;

        sitemap += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    sitemap += `</urlset>`;

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
