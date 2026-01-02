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
async function generateJWT(credentials: ServiceAccountCredentials): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
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
async function getAccessToken(credentials: ServiceAccountCredentials): Promise<string> {
  const jwt = await generateJWT(credentials);
  
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
