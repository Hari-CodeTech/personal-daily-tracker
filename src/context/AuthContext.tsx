import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { UserProfile } from '@/types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  isConfigured: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  enableDemoMode: () => void
  disableDemoMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER: User = {
  id: 'demo-user-id-001',
  app_metadata: {},
  user_metadata: { full_name: 'Tracker Demo User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const isConfigured = isSupabaseConfigured()
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('daily_tracker_demo_mode') === 'true'
  })

  useEffect(() => {
    if (!isConfigured) {
      if (isDemoMode) {
        setUser(DEMO_USER)
        setProfile({
          id: DEMO_USER.id,
          full_name: 'Demo Explorer',
          email: 'demo@tracker.local',
          timezone: 'Asia/Kolkata',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
      return
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isConfigured, isDemoMode])

  const fetchProfile = async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data && !error) {
        setProfile(data as UserProfile)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setProfile(null)
    setIsDemoMode(false)
    localStorage.removeItem('daily_tracker_demo_mode')
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error: error as Error | null }
  }

  const enableDemoMode = () => {
    setIsDemoMode(true)
    localStorage.setItem('daily_tracker_demo_mode', 'true')
    setUser(DEMO_USER)
    setProfile({
      id: DEMO_USER.id,
      full_name: 'Demo Explorer',
      email: 'demo@tracker.local',
      timezone: 'Asia/Kolkata',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  const disableDemoMode = () => {
    setIsDemoMode(false)
    localStorage.removeItem('daily_tracker_demo_mode')
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
        enableDemoMode,
        disableDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
