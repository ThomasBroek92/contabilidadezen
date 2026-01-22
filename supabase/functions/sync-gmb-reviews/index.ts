import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rating map from Google API string to number
const ratingMap: Record<string, number> = {
  'ONE': 1,
  'TWO': 2,
  'THREE': 3,
  'FOUR': 4,
  'FIVE': 5
};

interface GoogleReview {
  name: string;
  reviewId: string;
  reviewer: {
    profilePhotoUrl?: string;
    displayName: string;
  };
  starRating: string;
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

interface GoogleReviewsResponse {
  reviews?: GoogleReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
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
    scope: 'https://www.googleapis.com/auth/business.manage',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };
  
  // Import crypto for signing
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
  
  // Parse PEM key
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
  
  // Exchange JWT for access token
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

async function fetchGMBReviews(
  accessToken: string,
  accountId: string,
  locationId: string
): Promise<GoogleReviewsResponse> {
  // Try the new Business Profile API first (mybusinessbusinessinformation.googleapis.com)
  // Then fallback to the legacy mybusiness.googleapis.com
  
  // New API format: accounts/{account}/locations/{location}/reviews
  const newApiUrl = `https://mybusinessreviews.googleapis.com/v1/accounts/${accountId}/locations/${locationId}/reviews`;
  const legacyUrl = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`;
  
  console.log(`Trying new API: ${newApiUrl}`);
  
  let response = await fetch(newApiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  // If new API fails, try legacy
  if (!response.ok) {
    console.log(`New API failed with ${response.status}, trying legacy API: ${legacyUrl}`);
    response = await fetch(legacyUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`GMB API error: ${response.status} - ${errorText}`);
    throw new Error(`GMB API error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting GMB reviews sync...');
    
    // Get environment variables
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    const accountId = Deno.env.get('GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID');
    const locationId = Deno.env.get('GOOGLE_BUSINESS_PROFILE_LOCATION_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!serviceAccountJson) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured');
    }
    if (!accountId) {
      throw new Error('GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID not configured');
    }
    if (!locationId) {
      throw new Error('GOOGLE_BUSINESS_PROFILE_LOCATION_ID not configured');
    }
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get access token
    console.log('Getting access token...');
    const accessToken = await getAccessToken(serviceAccountJson);
    console.log('Access token obtained');

    // Fetch reviews from GMB
    console.log('Fetching reviews from GMB API...');
    const reviewsData = await fetchGMBReviews(accessToken, accountId, locationId);
    console.log(`Received ${reviewsData.reviews?.length || 0} reviews`);

    let syncedCount = 0;
    let filteredCount = 0;

    // Process reviews
    if (reviewsData.reviews && reviewsData.reviews.length > 0) {
      for (const review of reviewsData.reviews) {
        const rating = ratingMap[review.starRating] || 0;
        
        // Only sync reviews with 4+ stars
        if (rating < 4) {
          filteredCount++;
          console.log(`Skipping review ${review.reviewId} with rating ${rating}`);
          continue;
        }

        const reviewData = {
          google_review_id: review.reviewId,
          reviewer_name: review.reviewer.displayName,
          reviewer_photo_url: review.reviewer.profilePhotoUrl || null,
          rating: rating,
          comment: review.comment || null,
          review_time: review.createTime,
          reply_comment: review.reviewReply?.comment || null,
          reply_time: review.reviewReply?.updateTime || null,
          synced_at: new Date().toISOString(),
        };

        // Upsert review
        const { error: upsertError } = await supabase
          .from('gmb_reviews')
          .upsert(reviewData, { 
            onConflict: 'google_review_id',
            ignoreDuplicates: false 
          });

        if (upsertError) {
          console.error(`Error upserting review ${review.reviewId}:`, upsertError);
        } else {
          syncedCount++;
          console.log(`Synced review ${review.reviewId}`);
        }
      }
    }

    // Update stats
    if (reviewsData.averageRating !== undefined && reviewsData.totalReviewCount !== undefined) {
      console.log(`Updating stats: avg=${reviewsData.averageRating}, total=${reviewsData.totalReviewCount}`);
      
      // Delete old stats and insert new
      await supabase.from('gmb_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { error: statsError } = await supabase
        .from('gmb_stats')
        .insert({
          average_rating: reviewsData.averageRating,
          total_reviews: reviewsData.totalReviewCount,
          synced_at: new Date().toISOString(),
        });

      if (statsError) {
        console.error('Error updating stats:', statsError);
      }
    }

    const result = {
      success: true,
      message: `Sincronização concluída`,
      stats: {
        totalFromGoogle: reviewsData.reviews?.length || 0,
        synced: syncedCount,
        filtered: filteredCount,
        averageRating: reviewsData.averageRating,
        totalReviews: reviewsData.totalReviewCount,
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
