import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

interface RecurringSchedule {
  id: string
  name: string
  topics_per_run: number
  categories: string[]
  day_of_week: number
  time_of_day: string
  auto_publish: boolean
  min_geo_score: number
  topic_templates: string[]
  is_active: boolean
  last_run_at: string | null
  next_run_at: string
}

interface GEOSettings {
  brand_name: string
  target_personas: string[]
}

// Variables for templates
const PROFESSIONS = ['médicos', 'dentistas', 'psicólogos', 'fisioterapeutas', 'nutricionistas']
const THEMES = [
  'tributação', 'impostos', 'abertura de empresa', 'CNPJ', 'MEI',
  'Simples Nacional', 'Lucro Presumido', 'contabilidade', 'IRPF',
  'pró-labore', 'distribuição de lucros', 'economia tributária'
]

function getCurrentMonth(): string {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return months[new Date().getMonth()]
}

function getCurrentYear(): string {
  return new Date().getFullYear().toString()
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function processTemplate(template: string): string {
  return template
    .replace(/\[PROFISSÃO\]/g, getRandomItem(PROFESSIONS))
    .replace(/\[ANO\]/g, getCurrentYear())
    .replace(/\[MÊS\]/g, getCurrentMonth())
    .replace(/\[TEMA\]/g, getRandomItem(THEMES))
}

// Generate topic suggestions using Perplexity
async function suggestTopics(
  categories: string[],
  personas: string[],
  count: number,
  apiKey: string
): Promise<string[]> {
  console.log(`Suggesting ${count} topics for categories: ${categories.join(', ')}`)
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{
          role: 'user',
          content: `Sugira ${count} tópicos de blog sobre contabilidade para ${personas.join(', ')} no Brasil.

Categorias permitidas: ${categories.join(', ')}

REQUISITOS:
- Tópicos devem ser atuais e relevantes para ${getCurrentYear()}
- Foco em questões tributárias, abertura de empresa, economia fiscal
- Cada tópico deve ser específico e acionável
- Incluir palavras-chave de busca

RETORNE APENAS JSON válido:
{
  "topics": ["Tópico 1", "Tópico 2", ...]
}`
        }],
        search_recency_filter: 'month',
      }),
    })

    if (!response.ok) {
      console.error('Perplexity API error:', response.status)
      return []
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(cleanContent)
      return parsed.topics?.slice(0, count) || []
    } catch {
      console.error('Failed to parse topics JSON')
      return []
    }
  } catch (error) {
    console.error('Error suggesting topics:', error)
    return []
  }
}

// Calculate next run date
function calculateNextRun(dayOfWeek: number, timeOfDay: string): Date {
  const now = new Date()
  const [hours, minutes] = timeOfDay.split(':').map(Number)
  
  // Start from tomorrow
  const next = new Date(now)
  next.setDate(next.getDate() + 1)
  next.setHours(hours, minutes, 0, 0)
  
  // Find the next occurrence of the day
  while (next.getDay() !== dayOfWeek) {
    next.setDate(next.getDate() + 1)
  }
  
  return next
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting execute-recurring-schedules function...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    
    if (!perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY not configured')
    }

    // Verify admin authentication
    const authResult = await verifyAdminAuth(req, supabaseUrl, supabaseServiceKey)
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: authResult.error }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('Authenticated admin user:', authResult.userId)
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get GEO settings
    const { data: geoSettings } = await supabase
      .from('geo_settings')
      .select('brand_name, target_personas')
      .limit(1)
      .single()
    
    const settings: GEOSettings = geoSettings || {
      brand_name: 'Contabilidade Zona Sul',
      target_personas: ['médicos', 'dentistas', 'psicólogos']
    }
    
    // Find schedules that are due to run
    const now = new Date().toISOString()
    
    const { data: dueSchedules, error: fetchError } = await supabase
      .from('recurring_schedules')
      .select('*')
      .eq('is_active', true)
      .lte('next_run_at', now)
    
    if (fetchError) {
      console.error('Error fetching schedules:', fetchError)
      throw fetchError
    }
    
    console.log(`Found ${dueSchedules?.length || 0} schedules due to run`)
    
    if (!dueSchedules || dueSchedules.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No schedules due to run',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const results: Array<{
      scheduleId: string
      scheduleName: string
      topicsGenerated: number
      postsCreated: number
      errors: string[]
    }> = []
    
    for (const schedule of dueSchedules as RecurringSchedule[]) {
      console.log(`Processing schedule: ${schedule.name}`)
      
      const scheduleResult = {
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        topicsGenerated: 0,
        postsCreated: 0,
        errors: [] as string[]
      }
      
      try {
        // Generate topics - either from templates or AI suggestions
        let topics: string[] = []
        
        if (schedule.topic_templates && schedule.topic_templates.length > 0) {
          // Use templates with variable substitution
          topics = schedule.topic_templates
            .slice(0, schedule.topics_per_run)
            .map(template => processTemplate(template))
        } else {
          // Use AI to suggest topics
          topics = await suggestTopics(
            schedule.categories,
            settings.target_personas,
            schedule.topics_per_run,
            perplexityApiKey
          )
        }
        
        scheduleResult.topicsGenerated = topics.length
        console.log(`Generated ${topics.length} topics for schedule ${schedule.name}`)
        
        // Create blog_topics entries and generate content
        for (let i = 0; i < topics.length; i++) {
          const topic = topics[i]
          const category = getRandomItem(schedule.categories)
          
          // Schedule posts with 1-day intervals
          const scheduledDate = new Date()
          scheduledDate.setDate(scheduledDate.getDate() + i + 1)
          
          try {
            // Insert topic into queue
            const { data: topicData, error: insertError } = await supabase
              .from('blog_topics')
              .insert({
                topic,
                category,
                scheduled_date: scheduledDate.toISOString(),
                status: 'pending'
              })
              .select('id')
              .single()
            
            if (insertError) {
              console.error(`Error inserting topic: ${topic}`, insertError)
              scheduleResult.errors.push(`Insert error: ${insertError.message}`)
              continue
            }
            
            // Trigger content generation
            const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-blog-content`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ topic_id: topicData.id })
            })
            
            if (generateResponse.ok) {
              const result = await generateResponse.json()
              if (result.successful > 0) {
                scheduleResult.postsCreated++
                console.log(`Successfully generated post for: ${topic}`)
              } else {
                scheduleResult.errors.push(`Generation failed for: ${topic}`)
              }
            } else {
              scheduleResult.errors.push(`API error for: ${topic}`)
            }
            
            // Delay between generations to avoid rate limits
            if (i < topics.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 3000))
            }
            
          } catch (genError) {
            console.error(`Error generating topic: ${topic}`, genError)
            scheduleResult.errors.push(`Error: ${genError}`)
          }
        }
        
        // Update schedule's last_run_at and next_run_at
        const nextRun = calculateNextRun(schedule.day_of_week, schedule.time_of_day)
        
        const { error: updateError } = await supabase
          .from('recurring_schedules')
          .update({
            last_run_at: now,
            next_run_at: nextRun.toISOString()
          })
          .eq('id', schedule.id)
        
        if (updateError) {
          console.error(`Error updating schedule: ${schedule.name}`, updateError)
          scheduleResult.errors.push(`Update error: ${updateError.message}`)
        } else {
          console.log(`Schedule ${schedule.name} next run: ${nextRun.toISOString()}`)
        }
        
      } catch (scheduleError) {
        console.error(`Error processing schedule: ${schedule.name}`, scheduleError)
        scheduleResult.errors.push(`Schedule error: ${scheduleError}`)
      }
      
      results.push(scheduleResult)
    }
    
    const totalPosts = results.reduce((sum, r) => sum + r.postsCreated, 0)
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
    
    console.log(`Completed processing. Posts created: ${totalPosts}, Errors: ${totalErrors}`)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${dueSchedules.length} schedules, created ${totalPosts} posts`,
        processed: dueSchedules.length,
        totalPostsCreated: totalPosts,
        totalErrors,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in execute-recurring-schedules:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})