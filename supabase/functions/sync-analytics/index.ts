import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting analytics sync...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // For now, generate realistic mock data
    // In the future, this can be replaced with actual Google Analytics API calls
    const now = new Date().toISOString()
    
    const analyticsData = {
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
        status: 'success'
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
    
    console.log('Analytics sync completed successfully')
    
    return new Response(
      JSON.stringify({ success: true, synced_at: now }),
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
