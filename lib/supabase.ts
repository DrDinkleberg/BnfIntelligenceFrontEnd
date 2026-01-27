// Supabase client utility for server-side usage
// Creates client lazily to avoid build-time errors when env vars are not available

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Return null - API routes should use mock data
    // GCP integration will be added when backend is ready
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}
