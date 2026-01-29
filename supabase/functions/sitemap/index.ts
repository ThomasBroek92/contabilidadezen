import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.contabilidadezen.com.br";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for action parameter (for updating pages)
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const path = url.searchParams.get("path");

    // Handle update-page action
    if (action === "update-page" && path) {
      const { error } = await supabase
        .from("page_metadata")
        .update({ last_modified: new Date().toISOString() })
        .eq("path", path);

      if (error) {
        console.error("Error updating page:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update page", details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: `Updated lastmod for ${path}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle update-all action
    if (action === "update-all") {
      const { error } = await supabase
        .from("page_metadata")
        .update({ last_modified: new Date().toISOString() })
        .neq("path", "");

      if (error) {
        console.error("Error updating all pages:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update all pages", details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Updated lastmod for all pages" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch static pages from page_metadata
    const { data: staticPages, error: staticError } = await supabase
      .from("page_metadata")
      .select("path, last_modified, priority, changefreq")
      .order("priority", { ascending: false });

    if (staticError) {
      console.error("Error fetching page_metadata:", staticError);
    }

    // Fetch published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (blogError) {
      console.error("Error fetching blog posts:", blogError);
    }

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages from database
    if (staticPages && staticPages.length > 0) {
      for (const page of staticPages) {
        const lastmod = page.last_modified 
          ? new Date(page.last_modified).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        sitemap += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq || 'monthly'}</changefreq>
    <priority>${page.priority || '0.5'}</priority>
  </url>
`;
      }
    }

    // Add blog posts
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastmod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split("T")[0]
          : post.published_at 
            ? new Date(post.published_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

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

    console.log(`Generated sitemap with ${(staticPages?.length || 0) + (blogPosts?.length || 0)} URLs`);

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
