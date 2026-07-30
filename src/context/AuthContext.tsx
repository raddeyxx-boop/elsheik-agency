import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

type AuthValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User; profile: Profile }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthValue | null>(null)
const profileRequests = new Map<string, Promise<Profile | null>>()

async function readProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null
  const existing = profileRequests.get(userId)
  if (existing) return existing
  const request = Promise.resolve(supabase.from('profiles').select('id, email, full_name, role').eq('id', userId).single())
    .then(({ data, error }) => error ? null : data as Profile)
    .finally(() => profileRequests.delete(userId))
  profileRequests.set(userId, request)
  return request
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const activeProfileId = useRef<string | null>(null)

  const applySession = useCallback(async (next: Session | null) => {
    setSession(next)
    if (!next?.user) {
      activeProfileId.current = null
      setProfile(null)
      setLoading(false)
      return
    }
    if (activeProfileId.current !== next.user.id) {
      activeProfileId.current = next.user.id
      setProfile(await readProfile(next.user.id))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    let mounted = true
    supabase.auth.getSession().then(({ data }) => { if (mounted) void applySession(data.session) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (mounted) void applySession(next)
    })
    return () => { mounted = false; listener.subscription.unsubscribe() }
  }, [applySession])

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return null
    const next = await readProfile(session.user.id)
    activeProfileId.current = session.user.id
    setProfile(next)
    return next
  }, [session?.user])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('not_configured')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) throw error || new Error('auth_failed')
    const nextProfile = await readProfile(data.user.id)
    if (!nextProfile) { await supabase.auth.signOut(); throw new Error('profile_missing') }
    if (nextProfile.role !== 'admin') { await supabase.auth.signOut(); throw new Error('not_admin') }
    activeProfileId.current = data.user.id
    setSession(data.session)
    setProfile(nextProfile)
    return { user: data.user, profile: nextProfile }
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
    activeProfileId.current = null
    setSession(null)
    setProfile(null)
  }, [])

  const value = useMemo(() => ({
    session, user: session?.user ?? null, profile,
    isAdmin: profile?.role === 'admin', loading, signIn, signOut, refreshProfile,
  }), [session, profile, loading, signIn, signOut, refreshProfile])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
