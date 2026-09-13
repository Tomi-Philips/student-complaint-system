import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables');
}

// createBrowserClient automatically handles cookies for session persistence
// so that the Middleware can see the user session.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
