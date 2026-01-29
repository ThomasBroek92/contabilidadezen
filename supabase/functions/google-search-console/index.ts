import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute

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

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Generate JWT for service account
async function generateJWT(credentials: ServiceAccountCredentials, scope: string): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: credentials.client_email,
    scope: scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const claimB64 = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signatureInput = `${headerB64}.${claimB64}`;

  // Import private key
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = credentials.private_key.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${signatureInput}.${signatureB64}`;
}

// Get access token from Google
async function getAccessToken(credentials: ServiceAccountCredentials, scope: string = "https://www.googleapis.com/auth/webmasters.readonly"): Promise<string> {
  const jwt = await generateJWT(credentials, scope);
  
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Request indexing for a URL
async function requestIndexing(accessToken: string, url: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url,
          type: "URL_UPDATED"
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`Indexing API error for ${url}: ${error}`);
      return { success: false, message: error };
    }

    const result = await response.json();
    console.log(`Indexing requested for ${url}:`, result);
    return { success: true, message: `Notificação enviada: ${result.urlNotificationMetadata?.latestUpdate?.notifyTime || 'OK'}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message };
  }
}

// Fetch search analytics data
async function fetchSearchAnalytics(accessToken: string, siteUrl: string, startDate: string, endDate: string) {
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 100
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Search Analytics API error: ${error}`);
  }

  return response.json();
}

// Inspect URL indexation status
async function inspectUrl(accessToken: string, siteUrl: string, inspectionUrl: string) {
  const response = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inspectionUrl,
        siteUrl
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`URL Inspection API error for ${inspectionUrl}: ${error}`);
    return null;
  }

  return response.json();
}

// Fetch sitemaps
async function fetchSitemaps(accessToken: string, siteUrl: string) {
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    console.error("Sitemaps API error:", await response.text());
    return { sitemap: [] };
  }

  return response.json();
}

// Submit sitemap to Google Search Console
async function submitSitemap(accessToken: string, siteUrl: string, sitemapUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`Sitemap submission error: ${error}`);
      return { success: false, message: error };
    }

    console.log(`Sitemap submitted successfully: ${sitemapUrl}`);
    return { success: true, message: `Sitemap submetido com sucesso: ${sitemapUrl}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message };
  }
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
      const rateLimit = checkRateLimit(`google-search-console:${rateLimitId}`);
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

    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    const siteUrl = Deno.env.get('GOOGLE_SEARCH_CONSOLE_SITE_URL');

    if (!serviceAccountJson || !siteUrl) {
      throw new Error('Missing required environment variables: GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SEARCH_CONSOLE_SITE_URL');
    }

    let credentials: ServiceAccountCredentials;
    try {
      credentials = JSON.parse(serviceAccountJson);
      console.log('Parsed credentials for:', credentials.client_email);
      
      if (!credentials.private_key) {
        throw new Error('private_key is missing from service account credentials');
      }
      if (!credentials.client_email) {
        throw new Error('client_email is missing from service account credentials');
      }
    } catch (parseError) {
      console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', parseError);
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON format. Ensure it is valid JSON.');
    }

    const accessToken = await getAccessToken(credentials);

    const { action, urls } = await req.json();

    if (action === 'analytics') {
      // Get search analytics for last 28 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const analyticsData = await fetchSearchAnalytics(accessToken, siteUrl, startDate, endDate);
      
      return new Response(JSON.stringify({
        success: true,
        data: analyticsData,
        siteUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'inspect' && urls && Array.isArray(urls)) {
      // Inspect multiple URLs
      const results = [];
      
      for (const url of urls.slice(0, 20)) { // Limit to 20 URLs per request
        const inspectionResult = await inspectUrl(accessToken, siteUrl, url);
        results.push({
          url,
          inspection: inspectionResult
        });
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      return new Response(JSON.stringify({
        success: true,
        data: results,
        siteUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'sitemaps') {
      const sitemaps = await fetchSitemaps(accessToken, siteUrl);
      
      return new Response(JSON.stringify({
        success: true,
        data: sitemaps,
        siteUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Submit sitemap to Google Search Console
    if (action === 'submit-sitemap') {
      // Need webmasters scope for sitemap submission
      const webmastersToken = await getAccessToken(credentials, "https://www.googleapis.com/auth/webmasters");
      
      const body = await req.json().catch(() => ({}));
      
      // For domain properties (sc-domain:...), the sitemap URL must be the actual HTTP URL
      // Domain properties don't have a URL prefix, so we need to construct the sitemap URL differently
      // IMPORTANT: Use https:// WITHOUT www to match verified domain
      let finalSitemapUrl: string;
      if (body.sitemapUrl) {
        finalSitemapUrl = body.sitemapUrl;
      } else if (siteUrl.startsWith('sc-domain:')) {
        // Extract domain from sc-domain: format and use https:// (no www)
        const domain = siteUrl.replace('sc-domain:', '');
        finalSitemapUrl = `https://${domain}/sitemap.xml`;
      } else {
        // URL-prefix property: use the site URL directly
        const cleanSiteUrl = siteUrl.replace(/\/$/, '');
        finalSitemapUrl = `${cleanSiteUrl}/sitemap.xml`;
      }
      
      const result = await submitSitemap(webmastersToken, siteUrl, finalSitemapUrl);
      
      return new Response(JSON.stringify({
        success: result.success,
        message: result.message,
        sitemapUrl: finalSitemapUrl,
        siteUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Bulk add URLs to indexing queue
    if (action === 'queue-all-pages') {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Static pages to index
      const staticPages = [
        "/",
        "/servicos",
        "/sobre",
        "/contato",
        "/blog",
        "/abrir-empresa",
        "/medicos",
        "/indique-e-ganhe",
        "/segmentos/contabilidade-para-medicos",
        "/segmentos/contabilidade-para-dentistas",
        "/segmentos/contabilidade-para-psicologos",
        "/segmentos/contabilidade-para-representantes-comerciais",
        "/conteudo/calculadora-pj-clt",
        "/conteudo/comparativo-tributario",
        "/conteudo/gerador-rpa",
        "/politica-de-privacidade",
        "/termos"
      ];

      // Fetch published blog posts
      const { data: blogPosts, error: blogError } = await supabase
        .from("blog_posts")
        .select("slug")
        .eq("status", "published");

      if (blogError) {
        console.error("Error fetching blog posts:", blogError);
      }

      // Build full URLs - handle domain property format (sc-domain:)
      // IMPORTANT: Use https:// WITHOUT www to match the domain verified in Google Search Console
      let baseUrl: string;
      if (siteUrl.startsWith('sc-domain:')) {
        // Extract domain from sc-domain: format and use https:// (no www)
        const domain = siteUrl.replace('sc-domain:', '');
        baseUrl = `https://${domain}`;
      } else {
        baseUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash
      }
      
      const allUrls: string[] = [];
      
      for (const page of staticPages) {
        allUrls.push(`${baseUrl}${page}`);
      }
      
      if (blogPosts) {
        for (const post of blogPosts) {
          allUrls.push(`${baseUrl}/blog/${post.slug}`);
        }
      }

      console.log(`Queueing ${allUrls.length} URLs for indexing`);

      // Add to indexing queue
      const queueItems = allUrls.map(url => ({
        url,
        action: "URL_UPDATED",
        status: "pending",
        retry_count: 0
      }));

      // Delete existing pending items to avoid duplicates
      await supabase
        .from("indexing_queue")
        .delete()
        .eq("status", "pending");

      // Insert new items
      const { error: insertError } = await supabase
        .from("indexing_queue")
        .insert(queueItems);

      if (insertError) {
        throw new Error(`Failed to queue URLs: ${insertError.message}`);
      }

      return new Response(JSON.stringify({
        success: true,
        message: `${allUrls.length} URLs adicionadas à fila de indexação`,
        urls: allUrls,
        siteUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Request indexing for URLs
    if (action === 'request-indexing' && urls && Array.isArray(urls)) {
      // Get token with indexing scope
      const indexingToken = await getAccessToken(credentials, "https://www.googleapis.com/auth/indexing");
      
      const results = [];
      let successCount = 0;
      let failCount = 0;
      
      for (const url of urls.slice(0, 100)) { // Limit to 100 URLs per request
        const result = await requestIndexing(indexingToken, url);
        results.push({
          url,
          ...result
        });
        if (result.success) successCount++;
        else failCount++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Indexing batch complete: ${successCount} success, ${failCount} failed`);
      
      return new Response(JSON.stringify({
        success: true,
        data: results,
        summary: { total: results.length, success: successCount, failed: failCount },
        siteUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Audit all pages - inspect and get detailed status
    if (action === 'audit') {
      interface PageAuditResult {
        url: string;
        indexed: boolean;
        indexStatus: string;
        crawledAs?: string;
        lastCrawlTime?: string | null;
        pageFetchState?: string;
        robotsTxtState?: string;
        indexingState?: string;
        mobileUsable?: boolean;
        mobileIssues?: unknown[];
        hasRichResults?: boolean;
        richResultsIssues?: unknown[];
        issues: { type: string; message: string }[];
        suggestions: string[];
        error?: string;
      }
      
      // Build base URL for audit - handle domain property format (sc-domain:)
      // IMPORTANT: Use https:// WITHOUT www to match verified domain
      let auditBaseUrl: string;
      if (siteUrl.startsWith('sc-domain:')) {
        const domain = siteUrl.replace('sc-domain:', '');
        auditBaseUrl = `https://${domain}`;
      } else {
        auditBaseUrl = siteUrl.replace(/\/$/, '');
      }
      
      // Get all URLs to audit from the request or use default pages
      const pagesToAudit = urls && Array.isArray(urls) ? urls : [
        auditBaseUrl,
        `${auditBaseUrl}/sobre`,
        `${auditBaseUrl}/servicos`,
        `${auditBaseUrl}/contato`,
        `${auditBaseUrl}/blog`,
      ];
      
      console.log(`Starting audit for ${pagesToAudit.length} URLs`);
      
      // Process URLs in parallel batches of 5 for speed
      const BATCH_SIZE = 5;
      const results: PageAuditResult[] = [];
      
      for (let i = 0; i < Math.min(pagesToAudit.length, 30); i += BATCH_SIZE) {
        const batch = pagesToAudit.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${i / BATCH_SIZE + 1}: ${batch.length} URLs`);
        
        const batchResults = await Promise.all(
          batch.map(async (url) => {
            try {
              const inspectionResult = await inspectUrl(accessToken, siteUrl, url);
              
              if (inspectionResult) {
                const indexStatus = inspectionResult.inspectionResult?.indexStatusResult;
                const mobileUsability = inspectionResult.inspectionResult?.mobileUsabilityResult;
                const richResults = inspectionResult.inspectionResult?.richResultsResult;
                
                return {
                  url,
                  indexed: indexStatus?.coverageState === 'Indexed',
                  indexStatus: indexStatus?.coverageState || 'Unknown',
                  crawledAs: indexStatus?.crawledAs || 'Unknown',
                  lastCrawlTime: indexStatus?.lastCrawlTime || null,
                  pageFetchState: indexStatus?.pageFetchState || 'Unknown',
                  robotsTxtState: indexStatus?.robotsTxtState || 'Unknown',
                  indexingState: indexStatus?.indexingState || 'Unknown',
                  mobileUsable: mobileUsability?.verdict === 'PASS',
                  mobileIssues: mobileUsability?.issues || [],
                  hasRichResults: richResults?.verdict === 'PASS',
                  richResultsIssues: richResults?.issues || [],
                  issues: [] as { type: string; message: string }[],
                  suggestions: [] as string[]
                };
              } else {
                return {
                  url,
                  indexed: false,
                  indexStatus: 'Error',
                  issues: [] as { type: string; message: string }[],
                  suggestions: [] as string[],
                  error: 'Failed to inspect URL'
                };
              }
            } catch (err) {
              console.error(`Error inspecting ${url}:`, err);
              return {
                url,
                indexed: false,
                indexStatus: 'Error',
                issues: [] as { type: string; message: string }[],
                suggestions: [] as string[],
                error: err instanceof Error ? err.message : 'Unknown error'
              };
            }
          })
        );
        
        results.push(...batchResults);
        
        // Small delay between batches to respect API limits
        if (i + BATCH_SIZE < pagesToAudit.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log(`Audit complete: ${results.length} URLs processed`);

      // Analyze issues and add suggestions
      for (const page of results) {
        if (!page.indexed) {
          page.issues.push({ type: 'error', message: `Página não indexada: ${page.indexStatus}` });
          page.suggestions.push('Solicitar indexação ao Google');
          
          // Add more specific suggestions based on status
          if (page.indexStatus === 'Discovered - currently not indexed') {
            page.suggestions.push('Verificar qualidade do conteúdo');
            page.suggestions.push('Adicionar links internos para esta página');
          } else if (page.indexStatus === 'Crawled - currently not indexed') {
            page.suggestions.push('Melhorar a qualidade e relevância do conteúdo');
            page.suggestions.push('Verificar se há conteúdo duplicado');
          } else if (page.indexStatus === 'Page with redirect') {
            page.suggestions.push('Atualizar links para a URL final');
          } else if (page.indexStatus === 'Not found (404)') {
            page.suggestions.push('Corrigir ou remover links para esta página');
          }
        }
        if (page.pageFetchState && page.pageFetchState !== 'SUCCESSFUL') {
          page.issues.push({ type: 'error', message: `Erro no fetch: ${page.pageFetchState}` });
          page.suggestions.push('Verificar se a página está acessível');
        }
        if (page.mobileUsable === false && page.mobileIssues && page.mobileIssues.length > 0) {
          page.issues.push({ type: 'warning', message: 'Problemas de usabilidade mobile' });
          page.suggestions.push('Corrigir problemas de responsividade');
        }
        if (page.robotsTxtState === 'DISALLOWED') {
          page.issues.push({ type: 'error', message: 'Bloqueado pelo robots.txt' });
          page.suggestions.push('Remover bloqueio no robots.txt');
        }
      }

      const indexed = results.filter(r => r.indexed).length;
      const notIndexed = results.filter(r => !r.indexed).length;
      const withIssues = results.filter(r => r.issues && r.issues.length > 0).length;

      return new Response(JSON.stringify({
        success: true,
        data: results,
        summary: {
          total: results.length,
          indexed,
          notIndexed,
          withIssues
        },
        siteUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Default: return all data
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const [analyticsData, sitemaps] = await Promise.all([
      fetchSearchAnalytics(accessToken, siteUrl, startDate, endDate),
      fetchSitemaps(accessToken, siteUrl)
    ]);

    return new Response(JSON.stringify({
      success: true,
      data: {
        analytics: analyticsData,
        sitemaps
      },
      siteUrl,
      dateRange: { startDate, endDate }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
