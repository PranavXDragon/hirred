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
  signInWithOAuth: (provider) => Promise.resolve(),
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())
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
          // Sync OAuth metadata if missing
          const meta = user.user_metadata;
          const oauthName = meta?.full_name || meta?.name;
          const oauthAvatar = meta?.avatar_url || meta?.picture;
          
          let needsUpdate = false;
          let updates = {};
          
          if (!profileData.full_name && oauthName) {
            updates.full_name = oauthName;
            needsUpdate = true;
          }
          if (!profileData.profile_photo && oauthAvatar) {
            updates.profile_photo = oauthAvatar;
            needsUpdate = true;
          }

          if (needsUpdate) {
            await supabase.from('profiles').update(updates).eq('id', user.id);
            profileData.full_name = profileData.full_name || updates.full_name;
            profileData.profile_photo = profileData.profile_photo || updates.profile_photo;
          }

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
            // Sync OAuth metadata if missing
            const meta = session.user.user_metadata;
            const oauthName = meta?.full_name || meta?.name;
            const oauthAvatar = meta?.avatar_url || meta?.picture;
            
            let needsUpdate = false;
            let updates = {};
            
            if (!profileData.full_name && oauthName) {
              updates.full_name = oauthName;
              needsUpdate = true;
            }
            if (!profileData.profile_photo && oauthAvatar) {
              updates.profile_photo = oauthAvatar;
              needsUpdate = true;
            }

            if (needsUpdate) {
              await supabase.from('profiles').update(updates).eq('id', session.user.id);
              profileData.full_name = profileData.full_name || updates.full_name;
              profileData.profile_photo = profileData.profile_photo || updates.profile_photo;
            }

            setProfile(profileData)
            if (profileData.preferences) {
              if (profileData.preferences.theme) setTheme(profileData.preferences.theme);
              if (profileData.preferences.accentColor) setAccent(profileData.preferences.accentColor);
              if (profileData.preferences.density) setDensity(profileData.preferences.density);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null)
            setProfile(null)
            setTheme('light')
            setAccent('sky')
            setDensity('comfortable')
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

  const signInWithOAuth = async (provider, role = 'student') => {
    // Rely strictly on window location to prevent any env var trailing slash issues
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hirrd.tech';
    const callbackUrl = `${origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl
      }
    })
    if (error) {
      console.error('OAuth sign in error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, signInWithOAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
