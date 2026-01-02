import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string | null;
  featured_image_url: string | null;
}

interface GMBLocalPost {
  summary: string;
  callToAction?: {
    actionType: string;
    url: string;
  };
  topicType: string;
  media?: Array<{
    mediaFormat: string;
    sourceUrl: string;
  }>;
}

// Default logo URL - used for all GMB posts
const DEFAULT_LOGO_URL = 'https://contabilidadezen.com.br/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png';

// Get access token using service account
async function getAccessToken(): Promise<string> {
  const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (e) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', e);
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }

  if (!serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is missing required fields (private_key or client_email)');
  }
  
  // Create JWT for service account
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/business.manage',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  // Encode header and payload
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const signatureInput = `${headerB64}.${payloadB64}`;
  
  // Import the private key and sign
  const privateKeyPem = serviceAccount.private_key;
  const pemContents = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    console.error('Token exchange failed:', error);
    throw new Error(`Failed to get access token: ${error}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Create a post on Google My Business with image
async function createGMBPost(accessToken: string, post: BlogPost, siteUrl: string): Promise<any> {
  const accountId = Deno.env.get('GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID');
  const locationId = Deno.env.get('GOOGLE_BUSINESS_PROFILE_LOCATION_ID');
  
  if (!accountId || !locationId) {
    throw new Error('Google Business Profile Account ID or Location ID not configured');
  }

  // Create summary from excerpt or title (max 1500 chars for GMB)
  const summary = post.excerpt 
    ? `${post.title}\n\n${post.excerpt}`.substring(0, 1300)
    : post.title.substring(0, 1300);

  // Build the post URL
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Use featured image if available, otherwise use the company logo
  const imageUrl = post.featured_image_url || DEFAULT_LOGO_URL;

  const gmbPost: GMBLocalPost = {
    summary: `${summary}\n\n📖 Leia o artigo completo em nosso blog!`,
    callToAction: {
      actionType: 'LEARN_MORE',
      url: postUrl,
    },
    topicType: 'STANDARD',
    media: [
      {
        mediaFormat: 'PHOTO',
        sourceUrl: imageUrl,
      }
    ],
  };

  const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`;
  
  console.log(`Creating GMB post for: ${post.title}`);
  console.log(`GMB API URL: ${url}`);
  console.log(`Using image: ${imageUrl}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gmbPost),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('GMB API error:', error);
    throw new Error(`Failed to create GMB post: ${error}`);
  }

  const result = await response.json();
  console.log('GMB post created successfully:', result.name);
  return result;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting publish-to-gmb function...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify admin authentication
    const authResult = await verifyAdminAuth(req, supabaseUrl, supabaseServiceKey);
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
      const rateLimit = checkRateLimit(`publish-gmb:${rateLimitId}`);
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body for optional parameters
    let postId: string | null = null;
    let siteUrl = 'https://contabilidadezen.com.br'; // Default site URL
    
    try {
      const body = await req.json();
      postId = body.postId || null;
      siteUrl = body.siteUrl || siteUrl;
    } catch {
      // No body provided, will publish recent posts
    }

    let postsToPublish: BlogPost[] = [];

    if (postId) {
      // Publish specific post
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, slug, published_at, featured_image_url')
        .eq('id', postId)
        .eq('status', 'published')
        .single();

      if (error || !post) {
        throw new Error(`Post not found or not published: ${postId}`);
      }
      postsToPublish = [post];
    } else {
      // Find recently published posts that haven't been shared to GMB
      // We check for posts published in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, slug, published_at, featured_image_url')
        .eq('status', 'published')
        .gte('published_at', oneHourAgo)
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) {
        throw error;
      }
      postsToPublish = posts || [];
    }

    if (postsToPublish.length === 0) {
      console.log('No posts to publish to GMB');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No posts to publish',
          published: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Publish each post
    const results = [];
    for (const post of postsToPublish) {
      try {
        const result = await createGMBPost(accessToken, post, siteUrl);
        results.push({ 
          postId: post.id, 
          title: post.title, 
          success: true, 
          gmbPostName: result.name,
          imageUsed: post.featured_image_url || DEFAULT_LOGO_URL
        });
      } catch (error: any) {
        console.error(`Failed to publish post ${post.id}:`, error.message);
        results.push({ 
          postId: post.id, 
          title: post.title, 
          success: false, 
          error: error.message 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Published ${successCount}/${postsToPublish.length} posts to GMB`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Published ${successCount} posts to Google My Business`,
        published: successCount,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in publish-to-gmb:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
