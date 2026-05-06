import { createClient } from '@supabase/supabase-js'

type ApiKey = {
  name: string
  type: string
  api_key: string
}

let cachedServiceRoleKey: string | null = null

function getSupabaseProjectRef() {
  return process.env.SUPABASE_PROJECT_REF ?? 'madhnubzwfdtfbolyymj'
}

export function getSupabaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or VITE_SUPABASE_URL')
  }

  return url
}

export async function getServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY
  }

  if (cachedServiceRoleKey) {
    return cachedServiceRoleKey
  }

  const token = process.env.SUPABASE_ACCESS_TOKEN

  if (!token) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ACCESS_TOKEN')
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${getSupabaseProjectRef()}/api-keys`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error('Could not load Supabase project API keys')
  }

  const keys = (await response.json()) as ApiKey[]
  const serviceRole = keys.find((key) => key.name === 'service_role')

  if (!serviceRole?.api_key) {
    throw new Error('Supabase service_role key was not found')
  }

  cachedServiceRoleKey = serviceRole.api_key
  return cachedServiceRoleKey
}

export async function createSupabaseAdmin() {
  const key = await getServiceRoleKey()

  return createClient(getSupabaseUrl(), key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
