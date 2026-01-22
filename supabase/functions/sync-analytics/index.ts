import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleCredentials {
  client_email: string;
  private_key: string;
}

interface GA4Response {
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
}

// Create JWT token for Google Service Account authentication
async function createJWT(credentials: GoogleCredentials): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    sub: credentials.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/analytics.readonly'
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const signInput = `${headerB64}.${payloadB64}`;
  
  // Import private key
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  let pemContents = credentials.private_key;
  pemContents = pemContents.replace(pemHeader, '').replace(pemFooter, '').replace(/\n/g, '');
  
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
    encoder.encode(signInput)
  );
  
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${signInput}.${signatureB64}`;
}

// Exchange JWT for access token
async function getAccessToken(credentials: GoogleCredentials): Promise<string> {
  const jwt = await createJWT(credentials);
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
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

// Fetch data from GA4 Data API
async function fetchGA4Data(
  accessToken: string, 
  propertyId: string, 
  dimensions: string[], 
  metrics: string[],
  dateRange: { startDate: string; endDate: string }
): Promise<GA4Response> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [dateRange],
        dimensions: dimensions.map(name => ({ name })),
        metrics: metrics.map(name => ({ name }))
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GA4 API error: ${error}`);
  }
  
  return response.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting analytics sync...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON')
    const propertyId = Deno.env.get('GA4_PROPERTY_ID')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const now = new Date().toISOString()
    
    let analyticsData: Record<string, unknown> = {}
    let isSimulated = true
    
    // Try to fetch real GA4 data if credentials are configured
    if (serviceAccountJson && propertyId) {
      try {
        console.log('Fetching real GA4 data...')
        const credentials: GoogleCredentials = JSON.parse(serviceAccountJson)
        const accessToken = await getAccessToken(credentials)
        
        const dateRange = { startDate: '30daysAgo', endDate: 'today' }
        const prevDateRange = { startDate: '60daysAgo', endDate: '31daysAgo' }
        
        // Fetch current period metrics
        const [
          overviewCurrent,
          overviewPrevious,
          topPagesData,
          countriesData,
          devicesData
        ] = await Promise.all([
          // Current period overview
          fetchGA4Data(accessToken, propertyId, [], 
            ['totalUsers', 'screenPageViews', 'bounceRate', 'averageSessionDuration'], 
            dateRange
          ),
          // Previous period for trend
          fetchGA4Data(accessToken, propertyId, [], 
            ['totalUsers', 'screenPageViews', 'bounceRate', 'averageSessionDuration'], 
            prevDateRange
          ),
          // Top pages
          fetchGA4Data(accessToken, propertyId, ['pagePath'], ['screenPageViews'], dateRange),
          // Countries
          fetchGA4Data(accessToken, propertyId, ['country'], ['totalUsers'], dateRange),
          // Devices
          fetchGA4Data(accessToken, propertyId, ['deviceCategory'], ['totalUsers'], dateRange)
        ])
        
        // Parse overview metrics
        const currentMetrics = overviewCurrent.rows?.[0]?.metricValues || []
        const previousMetrics = overviewPrevious.rows?.[0]?.metricValues || []
        
        const visitors = parseInt(currentMetrics[0]?.value || '0')
        const prevVisitors = parseInt(previousMetrics[0]?.value || '1')
        const visitorsTrend = Math.round(((visitors - prevVisitors) / prevVisitors) * 100)
        
        const pageviews = parseInt(currentMetrics[1]?.value || '0')
        const prevPageviews = parseInt(previousMetrics[1]?.value || '1')
        const pageviewsTrend = Math.round(((pageviews - prevPageviews) / prevPageviews) * 100)
        
        const bounceRate = parseFloat(currentMetrics[2]?.value || '0') * 100
        const prevBounceRate = parseFloat(previousMetrics[2]?.value || '0') * 100
        const bounceRateTrend = Math.round(bounceRate - prevBounceRate)
        
        const avgSessionSeconds = parseFloat(currentMetrics[3]?.value || '0')
        const minutes = Math.floor(avgSessionSeconds / 60)
        const seconds = Math.floor(avgSessionSeconds % 60)
        
        // Parse top pages
        const topPages = (topPagesData.rows || [])
          .slice(0, 5)
          .map(row => ({
            page: row.dimensionValues?.[0]?.value || '/',
            views: parseInt(row.metricValues?.[0]?.value || '0')
          }))
        
        // Parse countries with flags
        const countryFlags: Record<string, string> = {
          'Brazil': '🇧🇷',
          'Portugal': '🇵🇹',
          'United States': '🇺🇸',
          'Argentina': '🇦🇷',
          'Mexico': '🇲🇽',
          'Colombia': '🇨🇴',
          'Chile': '🇨🇱',
          'Spain': '🇪🇸',
          'Germany': '🇩🇪',
          'France': '🇫🇷',
          'United Kingdom': '🇬🇧',
          'Canada': '🇨🇦',
          'Japan': '🇯🇵',
          'Australia': '🇦🇺'
        }
        
        const countryTranslations: Record<string, string> = {
          'Brazil': 'Brasil',
          'Portugal': 'Portugal',
          'United States': 'Estados Unidos',
          'Argentina': 'Argentina',
          'Mexico': 'México',
          'Colombia': 'Colômbia',
          'Chile': 'Chile',
          'Spain': 'Espanha',
          'Germany': 'Alemanha',
          'France': 'França',
          'United Kingdom': 'Reino Unido',
          'Canada': 'Canadá',
          'Japan': 'Japão',
          'Australia': 'Austrália'
        }
        
        const topCountries = (countriesData.rows || [])
          .slice(0, 5)
          .map(row => {
            const countryEn = row.dimensionValues?.[0]?.value || 'Unknown'
            return {
              country: countryTranslations[countryEn] || countryEn,
              visitors: parseInt(row.metricValues?.[0]?.value || '0'),
              flag: countryFlags[countryEn] || '🌍'
            }
          })
        
        // Parse devices
        const devicesRaw = (devicesData.rows || []).reduce((acc, row) => {
          const device = row.dimensionValues?.[0]?.value?.toLowerCase() || 'desktop'
          const users = parseInt(row.metricValues?.[0]?.value || '0')
          acc[device] = users
          return acc
        }, {} as Record<string, number>)
        
        const totalDeviceUsers = Object.values(devicesRaw).reduce((a, b) => a + b, 0) || 1
        const devices = {
          desktop: Math.round((devicesRaw['desktop'] || 0) / totalDeviceUsers * 100),
          mobile: Math.round((devicesRaw['mobile'] || 0) / totalDeviceUsers * 100),
          tablet: Math.round((devicesRaw['tablet'] || 0) / totalDeviceUsers * 100)
        }
        
        analyticsData = {
          visitors: { total: visitors, trend: visitorsTrend },
          pageviews: { total: pageviews, trend: pageviewsTrend },
          avg_session: { seconds: avgSessionSeconds, formatted: `${minutes}:${String(seconds).padStart(2, '0')}` },
          bounce_rate: { rate: Math.round(bounceRate), trend: bounceRateTrend },
          top_pages: topPages,
          top_countries: topCountries,
          devices: devices,
          last_sync: { timestamp: now, status: 'success', source: 'ga4' }
        }
        
        isSimulated = false
        console.log('Successfully fetched real GA4 data')
        
      } catch (ga4Error) {
        console.error('Error fetching GA4 data, falling back to mock:', ga4Error)
        // Fall through to mock data below
      }
    }
    
    // Generate mock data if GA4 failed or not configured
    if (isSimulated) {
      console.log('Using simulated data (GA4 not configured or failed)')
      analyticsData = {
        visitors: {
          total: Math.floor(Math.random() * 500) + 100,
          trend: Math.floor(Math.random() * 20) - 5
        },
        pageviews: {
          total: Math.floor(Math.random() * 2000) + 500,
          trend: Math.floor(Math.random() * 15) - 3
        },
        avg_session: {
          seconds: Math.floor(Math.random() * 180) + 60,
          formatted: `${Math.floor((Math.random() * 180 + 60) / 60)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
        },
        bounce_rate: {
          rate: Math.floor(Math.random() * 30) + 35,
          trend: Math.floor(Math.random() * 10) - 5
        },
        top_pages: [
          { page: '/', views: Math.floor(Math.random() * 500) + 200 },
          { page: '/blog', views: Math.floor(Math.random() * 300) + 100 },
          { page: '/servicos', views: Math.floor(Math.random() * 200) + 50 },
          { page: '/contato', views: Math.floor(Math.random() * 150) + 30 },
          { page: '/sobre', views: Math.floor(Math.random() * 100) + 20 }
        ],
        top_countries: [
          { country: 'Brasil', visitors: Math.floor(Math.random() * 400) + 100, flag: '🇧🇷' },
          { country: 'Portugal', visitors: Math.floor(Math.random() * 50) + 10, flag: '🇵🇹' },
          { country: 'Estados Unidos', visitors: Math.floor(Math.random() * 30) + 5, flag: '🇺🇸' }
        ],
        devices: {
          desktop: Math.floor(Math.random() * 40) + 30,
          mobile: Math.floor(Math.random() * 50) + 40,
          tablet: Math.floor(Math.random() * 15) + 5
        },
        last_sync: {
          timestamp: now,
          status: 'success',
          source: 'simulated'
        }
      }
    }
    
    // Update each metric in the cache
    const updates = Object.entries(analyticsData).map(([metric_name, metric_value]) => 
      supabase
        .from('analytics_cache')
        .upsert({
          metric_name,
          metric_value,
          updated_at: now
        }, { onConflict: 'metric_name' })
    )
    
    await Promise.all(updates)
    
    console.log(`Analytics sync completed (source: ${isSimulated ? 'simulated' : 'ga4'})`)
    
    return new Response(
      JSON.stringify({ success: true, synced_at: now, source: isSimulated ? 'simulated' : 'ga4' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error syncing analytics:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
