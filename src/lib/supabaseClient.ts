import { createBrowserClient } from '@supabase/ssr';

type SupabaseClient = ReturnType<typeof createBrowserClient>;

let _supabase: SupabaseClient | null = null;

/**
 * Lazily-initialise the Supabase browser client.
 * Safe to call at module-evaluation time — the real client is only
 * created when this function is first invoked (i.e. at runtime when
 * env vars are available).
 */
export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase Environment Variables');
  }

  _supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}
