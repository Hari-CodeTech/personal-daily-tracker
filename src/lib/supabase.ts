import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Checks whether valid Supabase credentials have been supplied in the environment.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false
  if (
    supabaseUrl.includes('your-project-id') ||
    supabaseAnonKey.includes('your-anon-key') ||
    supabaseUrl.trim() === '' ||
    supabaseAnonKey.trim() === ''
  ) {
    return false
  }
  return true
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
