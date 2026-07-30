import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function cleanEnvValue(value: string | undefined): string {
  return value?.trim().replace(/^['"]|['"]$/g, '') ?? ''
}

export const supabaseUrl = cleanEnvValue(import.meta.env.VITE_SUPABASE_URL)
export const supabaseKey = cleanEnvValue(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const hasSupabaseUrl = Boolean(supabaseUrl)
export const hasSupabaseKey = Boolean(supabaseKey)
export const hasValidSupabaseUrl = (() => {
  if (!supabaseUrl) return false
  try {
    const url = new URL(supabaseUrl)
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co')
  } catch { return false }
})()
export const isSupabaseConfigured = hasValidSupabaseUrl && hasSupabaseKey

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

if (import.meta.env.DEV) {
  console.info('[Supabase configuration]', {
    mode: import.meta.env.MODE,
    hasSupabaseUrl,
    hasSupabaseKey,
    hasValidSupabaseUrl,
    isSupabaseConfigured,
    hostname: hasValidSupabaseUrl ? new URL(supabaseUrl).hostname : null,
  })
}
