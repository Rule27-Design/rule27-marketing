import { createClient } from '@supabase/supabase-js'

// Use the actual Supabase URL
const supabaseUrl = 'https://emifvqwhylfdjiefboud.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

// Create client for public read-only access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})
