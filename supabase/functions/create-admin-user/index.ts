import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const email = 'gjmmxxv@gmail.com';
    const password = 'Zen@123';

    console.log(`Creating admin user: ${email}`);

    // Create user using admin API
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // Check if user already exists
      if (createError.message.includes('already been registered')) {
        console.log('User already exists, fetching user...');
        
        // Get user by email
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          throw listError;
        }
        
        const existingUser = users.find(u => u.email === email);
        
        if (!existingUser) {
          throw new Error('User exists but could not be found');
        }

        // Add admin role if not exists
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert({ 
            user_id: existingUser.id, 
            role: 'admin' 
          }, { 
            onConflict: 'user_id,role',
            ignoreDuplicates: true 
          });

        if (roleError && !roleError.message.includes('duplicate')) {
          console.error('Error adding role:', roleError);
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'User already exists. Admin role ensured.',
            userId: existingUser.id 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw createError;
    }

    console.log(`User created with ID: ${userData.user.id}`);

    // Add admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ 
        user_id: userData.user.id, 
        role: 'admin' 
      });

    if (roleError) {
      console.error('Error adding admin role:', roleError);
      throw roleError;
    }

    console.log('Admin role added successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        userId: userData.user.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
