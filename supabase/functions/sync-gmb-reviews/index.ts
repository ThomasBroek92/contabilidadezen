import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaceReview {
  name?: string;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
  rating?: number;
  text?: {
    text?: string;
    languageCode?: string;
  };
  originalText?: {
    text?: string;
  };
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface PlaceDetailsResponse {
  reviews?: PlaceReview[];
  rating?: number;
  userRatingCount?: number;
  displayName?: {
    text?: string;
  };
}

// Verify admin authentication
async function verifyAdminAuth(req: Request, supabaseUrl: string, supabaseServiceKey: string): Promise<boolean> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.log('No authorization header provided');
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    console.log('Failed to get user from token:', userError?.message);
    return false;
  }
  
  // Check if user has admin role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();
    
  if (roleError) {
    console.log('Error checking admin role:', roleError.message);
    return false;
  }
  
  return !!roleData;
}

async function getAccessToken(serviceAccountJson: string): Promise<string> {
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: serviceAccount.private_key_id
  };
  
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };
  
  const encoder = new TextEncoder();
  
  function base64UrlEncode(data: string | Uint8Array): string {
    const bytes = typeof data === 'string' ? encoder.encode(data) : data;
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${headerB64}.${payloadB64}`;
  
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = serviceAccount.private_key
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signatureInput)
  );
  
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));
  const jwt = `${signatureInput}.${signatureB64}`;
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Token exchange failed: ${errorText}`);
  }
  
  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function fetchPlaceReviews(
  accessToken: string,
  placeId: string
): Promise<PlaceDetailsResponse> {
  // Use Places API (New) to get reviews
  // Note: placeId should be in format "places/ChIJ..." or just "ChIJ..."
  const cleanPlaceId = placeId.startsWith('places/') ? placeId : `places/${placeId}`;
  
  const url = `https://places.googleapis.com/v1/${cleanPlaceId}`;
  const fieldMask = 'reviews,rating,userRatingCount,displayName';
  
  console.log(`Fetching place details from: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': fieldMask,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Places API error: ${response.status} - ${errorText}`);
    throw new Error(`Places API error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting GMB reviews sync...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    // Verify admin authentication before proceeding
    const isAdmin = await verifyAdminAuth(req, supabaseUrl, supabaseServiceKey);
    if (!isAdmin) {
      console.log('Unauthorized access attempt to sync-gmb-reviews');
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Admin authentication verified');
    
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    // For Places API, we use the Place ID instead of account/location IDs
    // The locationId field will now store the Google Place ID (e.g., ChIJ...)
    const placeId = Deno.env.get('GOOGLE_BUSINESS_PROFILE_LOCATION_ID');

    if (!serviceAccountJson) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured');
    }
    if (!placeId) {
      throw new Error('GOOGLE_BUSINESS_PROFILE_LOCATION_ID not configured. Please set this to your Google Place ID (starts with ChIJ...)');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Getting access token...');
    const accessToken = await getAccessToken(serviceAccountJson);
    console.log('Access token obtained');

    console.log('Fetching reviews from Places API...');
    const placeData = await fetchPlaceReviews(accessToken, placeId);
    console.log(`Received ${placeData.reviews?.length || 0} reviews`);

    let syncedCount = 0;
    let filteredCount = 0;

    if (placeData.reviews && placeData.reviews.length > 0) {
      for (const review of placeData.reviews) {
        const rating = review.rating || 0;
        
        // Only sync reviews with 4+ stars
        if (rating < 4) {
          filteredCount++;
          console.log(`Skipping review with rating ${rating}`);
          continue;
        }

        // Generate a unique ID from the review content
        const reviewId = review.name?.split('/').pop() || 
                         `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const reviewData = {
          google_review_id: reviewId,
          reviewer_name: review.authorAttribution?.displayName || 'Usuário Google',
          reviewer_photo_url: review.authorAttribution?.photoUri || null,
          rating: rating,
          comment: review.text?.text || review.originalText?.text || null,
          review_time: review.publishTime || new Date().toISOString(),
          reply_comment: null, // Places API doesn't return reply in basic field mask
          reply_time: null,
          synced_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
          .from('gmb_reviews')
          .upsert(reviewData, { 
            onConflict: 'google_review_id',
            ignoreDuplicates: false 
          });

        if (upsertError) {
          console.error(`Error upserting review ${reviewId}:`, upsertError);
        } else {
          syncedCount++;
          console.log(`Synced review ${reviewId}`);
        }
      }
    }

    // Update stats
    if (placeData.rating !== undefined && placeData.userRatingCount !== undefined) {
      console.log(`Updating stats: avg=${placeData.rating}, total=${placeData.userRatingCount}`);
      
      await supabase.from('gmb_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { error: statsError } = await supabase
        .from('gmb_stats')
        .insert({
          average_rating: placeData.rating,
          total_reviews: placeData.userRatingCount,
          synced_at: new Date().toISOString(),
        });

      if (statsError) {
        console.error('Error updating stats:', statsError);
      }
    }

    const result = {
      success: true,
      message: `Sincronização concluída`,
      placeName: placeData.displayName?.text,
      stats: {
        totalFromGoogle: placeData.reviews?.length || 0,
        synced: syncedCount,
        filtered: filteredCount,
        averageRating: placeData.rating,
        totalReviews: placeData.userRatingCount,
      }
    };

    console.log('Sync completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error syncing GMB reviews:', errorMessage);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
