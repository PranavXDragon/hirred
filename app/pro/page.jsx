import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import ProClient from './ProClient'

export default async function ProPage() {
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

  let profile = null;

  if (user) {
    // Fetch the user's profile from the public.profiles table
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      
    profile = data;
  }

  return <ProClient initialUser={profile} />
}
