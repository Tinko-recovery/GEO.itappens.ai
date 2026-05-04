import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client using service role key.
 * ⚠️ This file is ONLY imported by server-side code (API routes, Server Components).
 * NEVER import this in client components.
 */

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables. Check SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
