import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile from the public.profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  let company = null;
  let mentor = null;
  
  if (profile?.role === 'employer') {
    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('employer_id', user.id)
      .maybeSingle()
    company = data;
  } else if (profile?.role === 'mentor') {
    const { data } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    mentor = data;
  }

  return <SettingsClient initialUser={profile} initialCompany={company} initialMentor={mentor} />
}
