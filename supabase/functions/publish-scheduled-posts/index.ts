import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      .select('id, title')
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
