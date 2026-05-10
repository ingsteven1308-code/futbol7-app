import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import cookieStorage from './cookieStorage'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database, 'public'>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: cookieStorage as any,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type SupabaseClient = typeof supabase
