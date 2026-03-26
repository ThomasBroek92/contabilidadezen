import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5 // 5 requests per minute

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS }
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now }
  }
  
  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetIn: record.resetTime - now }
}

// Authentication helper - verify admin role or service role key
async function verifyAdminAuth(req: Request, supabaseUrl: string, supabaseServiceKey: string): Promise<{ success: boolean; error?: string; userId?: string; isServiceRole?: boolean }> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return { success: false, error: 'Missing authorization header' }
  }

  const token = authHeader.replace('Bearer ', '')
  
  // Check if this is a service role key (internal service-to-service call)
  if (token === supabaseServiceKey) {
    console.log('Service role key authentication - internal call')
    return { success: true, isServiceRole: true }
  }
  
  // Otherwise, verify as user token
  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: authHeader } }
  })

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
  if (authError || !user) {
    return { success: false, error: 'Invalid or expired token' }
  }

  const { data: userRoles } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single()

  if (!userRoles) {
    return { success: false, error: 'Admin access required' }
  }

  return { success: true, userId: user.id }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting publish-scheduled-posts function...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify admin authentication
    const authResult = await verifyAdminAuth(req, supabaseUrl, supabaseServiceKey)
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: authResult.error }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('Authenticated admin user:', authResult.userId)

    // Check rate limit (skip for service role calls)
    if (!authResult.isServiceRole) {
      const rateLimitId = authResult.userId || 'anonymous'
      const rateLimit = checkRateLimit(`publish-scheduled:${rateLimitId}`)
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
        )
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the database function to publish scheduled posts
    const { error: rpcError } = await supabase.rpc('publish_scheduled_posts')
    
    if (rpcError) {
      console.error('Error calling publish_scheduled_posts:', rpcError)
      throw rpcError
    }

    // Get count of posts that were just published for logging
    const { data: recentlyPublished, error: countError } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, slug, published_at, featured_image_url')
      .eq('status', 'published')
      .gte('published_at', new Date(Date.now() - 60000).toISOString()) // Published in last minute

    if (countError) {
      console.error('Error fetching recently published posts:', countError)
    } else {
      console.log(`Published ${recentlyPublished?.length || 0} scheduled posts`)
      if (recentlyPublished && recentlyPublished.length > 0) {
        recentlyPublished.forEach(post => {
          console.log(`- Published: ${post.title}`)
        })

        // Automatically publish to Google My Business
        try {
          console.log('Triggering Google My Business publication...')
          const gmbResponse = await fetch(`${supabaseUrl}/functions/v1/publish-to-gmb`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ 
              siteUrl: 'https://www.contabilidadezen.com.br'
            }),
          })
          
          if (gmbResponse.ok) {
            const gmbResult = await gmbResponse.json()
            console.log('GMB publication result:', gmbResult)
          } else {
            console.error('GMB publication failed:', await gmbResponse.text())
          }
        } catch (gmbError) {
          console.error('Error publishing to GMB:', gmbError)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Published ${recentlyPublished?.length || 0} scheduled posts`,
        published: recentlyPublished || []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in publish-scheduled-posts:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
