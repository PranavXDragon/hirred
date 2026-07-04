'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from './ThemeContext'

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signOut: () => Promise.resolve(),
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const { setTheme, setAccent, setDensity } = useTheme()

  useEffect(() => {
    let mounted = true

    async function getUserSession() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        if (mounted) setUser(user)
        
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
          
        if (mounted && profileData) {
          setProfile(profileData)
          if (profileData.preferences) {
            if (profileData.preferences.theme) setTheme(profileData.preferences.theme);
            if (profileData.preferences.accentColor) setAccent(profileData.preferences.accentColor);
            if (profileData.preferences.density) setDensity(profileData.preferences.density);
          }
        }
      }
      
      if (mounted) setLoading(false)
    }

    getUserSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          if (mounted) setUser(session.user)
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
            
          if (mounted && profileData) {
            setProfile(profileData)
            if (profileData.preferences) {
              if (profileData.preferences.theme) setTheme(profileData.preferences.theme);
              if (profileData.preferences.accentColor) setAccent(profileData.preferences.accentColor);
              if (profileData.preferences.density) setDensity(profileData.preferences.density);
            }
          }
        } else {
          if (mounted) {
            setUser(null)
            setProfile(null)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
