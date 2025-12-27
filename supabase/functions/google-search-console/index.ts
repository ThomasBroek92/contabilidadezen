import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    const siteUrl = Deno.env.get('GOOGLE_SEARCH_CONSOLE_SITE_URL');

    if (!serviceAccountJson || !siteUrl) {
      throw new Error('Missing required environment variables: GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SEARCH_CONSOLE_SITE_URL');
    }

    const credentials: ServiceAccountCredentials = JSON.parse(serviceAccountJson);
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
