import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emifvqwhylfdjiefboud.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log status for debugging (remove in production)
if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
  console.warn('Supabase Anon Key not configured - Larry will run in offline mode');
}

// Create client only if we have a valid key
export const supabase = supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here'
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null;

// Export a flag to check if Supabase is available
export const supabaseEnabled = !!supabase;