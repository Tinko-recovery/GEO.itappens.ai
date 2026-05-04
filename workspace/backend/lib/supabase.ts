import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin Client
 * 
 * ⚠️ SECURITY: This file is SERVER-SIDE ONLY
 * 
 * - Uses SUPABASE_SERVICE_KEY (service role key)
 * - Should NEVER be imported by client components
 * - Only used in API routes and server-side functions
 * - Never expose SUPABASE_SERVICE_KEY to the client
 */

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in your environment.'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type { Database } from './database.types'
