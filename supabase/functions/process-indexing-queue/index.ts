import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IndexingQueueItem {
  id: string;
  url: string;
  action: string;
  status: string;
  blog_post_id: string | null;
  created_at: string;
  retry_count: number;
}

async function generateJWT(serviceAccountJson: string): Promise<string> {
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const claimB64 = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signatureInput = `${headerB64}.${claimB64}`;

  const pemContents = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(signatureInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${signatureInput}.${signatureB64}`;
}

async function getAccessToken(serviceAccountJson: string): Promise<string> {
  const jwt = await generateJWT(serviceAccountJson);
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

interface IndexingResponse {
  success: boolean;
  result?: unknown;
  error?: string;
  quotaExceeded?: boolean;
}

async function requestIndexing(accessToken: string, url: string, type: string = 'URL_UPDATED'): Promise<IndexingResponse> {
  try {
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        type: type
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || 'Unknown error';
      const isQuotaExceeded = 
        errorMessage.toLowerCase().includes('quota') || 
        errorMessage.toLowerCase().includes('rate limit') ||
        response.status === 429;
      
      return { 
        success: false, 
        error: errorMessage,
        quotaExceeded: isQuotaExceeded
      };
    }

    return { success: true, result: data };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let successCount = 0;
  let failCount = 0;
  let quotaExceeded = false;
  let errorMessage: string | null = null;

  try {
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');

    if (!serviceAccountJson) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured');
    }

    // Fetch pending items from queue (max 200 per batch due to Google quota)
    const { data: queueItems, error: fetchError } = await supabase
      .from('indexing_queue')
      .select('*')
      .eq('status', 'pending')
      .lt('retry_count', 3)
      .order('created_at', { ascending: true })
      .limit(200);

    if (fetchError) {
      throw new Error(`Failed to fetch queue: ${fetchError.message}`);
    }

    if (!queueItems || queueItems.length === 0) {
      console.log('No pending items in queue');
      
      // Still record stats even when queue is empty
      await supabase.from('indexing_stats').insert({
        total_processed: 0,
        success_count: 0,
        fail_count: 0,
        quota_exceeded: false,
        error_message: null
      });

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No pending items',
        processed: 0 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log(`Processing ${queueItems.length} items from queue`);

    // Get access token
    const accessToken = await getAccessToken(serviceAccountJson);

    // Process each item
    for (const item of queueItems as IndexingQueueItem[]) {
      const result = await requestIndexing(accessToken, item.url, item.action);
      
      if (result.quotaExceeded) {
        console.log(`⚠️ Quota exceeded! Stopping at ${successCount} success, ${failCount} failed`);
        quotaExceeded = true;
        errorMessage = 'Google Indexing API quota exceeded';
        break; // Stop processing - quota is exhausted
      }
      
      if (result.success) {
        // Update as processed
        await supabase
          .from('indexing_queue')
          .update({
            status: 'completed',
            processed_at: new Date().toISOString(),
            result: result.result
          })
          .eq('id', item.id);
        
        successCount++;
        console.log(`✓ Indexed: ${item.url}`);
      } else {
        // Increment retry count or mark as failed
        const newRetryCount = item.retry_count + 1;
        const newStatus = newRetryCount >= 3 ? 'failed' : 'pending';
        
        await supabase
          .from('indexing_queue')
          .update({
            status: newStatus,
            retry_count: newRetryCount,
            result: { error: result.error }
          })
          .eq('id', item.id);
        
        failCount++;
        console.log(`✗ Failed: ${item.url} - ${result.error}`);
      }

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Queue processing complete: ${successCount} success, ${failCount} failed, quota exceeded: ${quotaExceeded}`);

  } catch (error: unknown) {
    console.error('Error processing queue:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  // Record stats regardless of success/failure
  try {
    await supabase.from('indexing_stats').insert({
      total_processed: successCount + failCount,
      success_count: successCount,
      fail_count: failCount,
      quota_exceeded: quotaExceeded,
      error_message: errorMessage
    });
    console.log('Stats recorded successfully');
  } catch (statsError) {
    console.error('Failed to record stats:', statsError);
  }

  if (errorMessage && !quotaExceeded) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      successCount,
      failCount
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    processed: successCount + failCount,
    successCount,
    failCount,
    quotaExceeded
  }), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
});
