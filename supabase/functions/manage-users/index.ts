import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(supabaseUrl, supabaseServiceRole)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { method, userData } = await req.json()
    
    if (method === 'GET') {
      console.log('Received request:', {
        action: 'get',
        userData: userData
      })

      const { userIds } = userData

      // Get users from auth.users
      const { data: users, error: getUsersError } = await supabase.auth.admin.listUsers()

      if (getUsersError) {
        console.error('Error getting users:', getUsersError)
        throw new Error('Error getting users')
      }

      // Filter users by requested IDs
      const filteredUsers = users.users.filter(user => userIds.includes(user.id))

      return new Response(JSON.stringify({ 
        users: filteredUsers.map(user => ({
          id: user.id,
          email: user.email
        }))
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'POST') {
      console.log('Received request:', {
        action: 'create',
        userData: {
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          role: userData.role
        },
        userId: undefined
      })

      // Validate role
      if (userData.role === 'superadmin') {
        throw new Error('Cannot create superadmin users through this interface')
      }
      
      // Create the user in auth.users
      const { data: authData, error: createUserError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.fullName,
          role: userData.role,
        },
      })

      if (createUserError) {
        console.error('Error creating user:', createUserError)
        throw new Error('Error creating user in auth system')
      }

      if (!authData.user) {
        throw new Error('No user data returned from auth system')
      }

      // Create the profile in public.profiles using the auth user's ID
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          user_id: authData.user.id,
          full_name: userData.fullName,
          role: userData.role,
          is_active: true,
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Cleanup: delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Error creating user profile')
      }

      return new Response(JSON.stringify({ 
        message: 'User created successfully',
        user: authData.user
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      })
    }

    if (method === 'DELETE') {
      console.log('Received request:', {
        action: 'delete',
        userData: null,
        userId: userData.userId
      })

      const { userId } = userData
      
      // Delete the user from auth.users (this will cascade to profiles due to FK)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

      if (deleteError) {
        console.error('Error deleting user:', deleteError)
        throw new Error('Error deleting user')
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'PATCH') {
      console.log('Received request:', {
        action: 'update',
        userData: userData.updates,
        userId: userData.userId
      })

      const { userId, updates } = userData

      // Update email in auth.users if provided
      if (updates.email) {
        const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
          userId,
          { email: updates.email }
        )

        if (updateAuthError) {
          console.error('Error updating user email:', updateAuthError)
          throw new Error('Error updating user email')
        }
      }

      // Update role in profiles if provided
      if (updates.role) {
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ role: updates.role })
          .eq('id', userId)

        if (updateProfileError) {
          console.error('Error updating profile role:', updateProfileError)
          throw new Error('Error updating user role')
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid method')
  } catch (error) {
    console.error('Error in manage-users function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})