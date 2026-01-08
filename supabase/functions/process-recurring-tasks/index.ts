import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecurringTemplate {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  frequency: 'daily' | 'weekly' | 'monthly';
  day_of_week: number | null;
  day_of_month: number | null;
  time_of_day: string;
  is_active: boolean;
  next_run_at: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    console.log('Processing recurring tasks...');
    
    // Get all active templates that are due
    const now = new Date().toISOString();
    const { data: dueTemplates, error: fetchError } = await supabase
      .from('recurring_task_templates')
      .select('*')
      .eq('is_active', true)
      .lte('next_run_at', now);

    if (fetchError) {
      console.error('Error fetching templates:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${dueTemplates?.length || 0} templates due for execution`);

    const results = {
      processed: 0,
      created: 0,
      errors: [] as string[],
    };

    if (!dueTemplates || dueTemplates.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No templates due for execution',
        results 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    for (const template of dueTemplates as RecurringTemplate[]) {
      try {
        console.log(`Processing template: ${template.title} (${template.id})`);
        
        // Create the task instance
        const { error: insertError } = await supabase
          .from('tasks')
          .insert({
            title: template.title,
            description: template.description,
            priority: template.priority,
            assignee_id: template.assignee_id,
            status: 'todo',
            position: 0,
          });

        if (insertError) {
          console.error(`Error creating task for template ${template.id}:`, insertError);
          results.errors.push(`Template ${template.id}: ${insertError.message}`);
          continue;
        }

        results.created++;
        console.log(`Created task instance for template: ${template.title}`);

        // Update the template's last_run_at (next_run_at is calculated by trigger)
        const { error: updateError } = await supabase
          .from('recurring_task_templates')
          .update({ last_run_at: now })
          .eq('id', template.id);

        if (updateError) {
          console.error(`Error updating template ${template.id}:`, updateError);
          results.errors.push(`Template update ${template.id}: ${updateError.message}`);
        }

        results.processed++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error processing template ${template.id}:`, err);
        results.errors.push(`Template ${template.id}: ${errorMessage}`);
      }
    }

    console.log('Processing complete:', results);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed ${results.processed} templates, created ${results.created} tasks`,
      results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in process-recurring-tasks:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
