import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// We use the Service Role Key on the backend to bypass RLS since we verify the JWT manually.
// Alternatively, we could pass the user's JWT to Supabase to enforce RLS, but for a simple
// Express app, validating the JWT beforehand and using the admin client is a common pattern.
// To keep things simplest and leverage RLS properly: we'll use the anon key but set the Auth session
// per request. Or better yet: just use the service role and query with `user_id = req.user.id`.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
